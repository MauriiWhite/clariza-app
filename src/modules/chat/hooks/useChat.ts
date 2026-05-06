// Hook que maneja el estado de un turno del chat conversacional.
//
// Consume el endpoint /api/agent via SSE. El endpoint internamente decide
// si ejecuta el agente real (si hay ANTHROPIC_API_KEY) o el mock (si no).
//
// Si el endpoint falla por completo (ej: 500, offline), el hook cae a un
// segundo nivel de fallback: el mock local. Asi la demo nunca se queda
// muda en frente del jurado.

"use client";

import { useCallback, useMemo, useState } from "react";
import {
  extractClaim,
  extractDiagnosis,
  extractSchedule,
} from "@/modules/agent/services/extractArtifacts";
import type { ConsoleEvent } from "@/modules/agent/types";
import { getAgentStream } from "@/modules/chat/services/mockAgentStream";

interface UseChatState {
  events: ConsoleEvent[];
  isStreaming: boolean;
  error: string | null;
}

const INITIAL_STATE: UseChatState = {
  events: [],
  isStreaming: false,
  error: null,
};

export function useChat() {
  const [state, setState] = useState<UseChatState>(INITIAL_STATE);

  /** Empuja un evento al historial de la UI. */
  const appendEvent = useCallback((event: ConsoleEvent) => {
    setState((prev) => ({ ...prev, events: [...prev.events, event] }));
  }, []);

  /** Inicia un turno: llama a /api/agent y consume el stream SSE.
   *  Si hay archivo, lo manda como multipart/form-data para que la tool
   *  extractEvidence lo procese con Claude Vision.
   *  Importante: NO borra eventos previos — el historial se acumula en
   *  pantalla turno a turno, asi el ciudadano ve la conversacion completa. */
  const startTurn = useCallback(
    async (userMessage: string, file?: File | null) => {
      // Preservamos events; solo seteamos streaming + limpiamos error.
      setState((prev) => ({ ...prev, isStreaming: true, error: null }));

      try {
        // Cuando hay archivo, multipart. Cuando no, JSON simple (mas liviano).
        let res: Response;
        if (file) {
          const formData = new FormData();
          formData.append("userMessage", userMessage);
          formData.append("file", file);
          res = await fetch("/api/agent", {
            method: "POST",
            body: formData,
          });
        } else {
          res = await fetch("/api/agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMessage }),
          });
        }

        if (!res.ok || !res.body) {
          throw new Error(`API respondió HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Eventos SSE separados por doble salto de linea.
          const messages = buffer.split("\n\n");
          buffer = messages.pop() ?? "";

          for (const message of messages) {
            const line = message.trim();
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (!json) continue;
            try {
              const event = JSON.parse(json) as ConsoleEvent;
              appendEvent(event);
            } catch {
              // SSE malformado, lo ignoramos.
            }
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(
          "[useChat] /api/agent fallo, cayendo al mock local:",
          message,
        );

        // Fallback total: mock local. Limpiamos events y reproducimos.
        setState({ events: [], isStreaming: true, error: null });
        try {
          appendEvent({ type: "user", text: userMessage });
          appendEvent({
            type: "assistant",
            text: "Conexión con el servidor falló. Te muestro un caso de ejemplo desde el cliente.",
          });
          for await (const event of getAgentStream(userMessage)) {
            if (event.type === "user") continue;
            appendEvent(event);
          }
        } catch (mockErr) {
          setState((prev) => ({
            ...prev,
            error: mockErr instanceof Error ? mockErr.message : String(mockErr),
          }));
        }
      } finally {
        setState((prev) => ({ ...prev, isStreaming: false }));
      }
    },
    [appendEvent],
  );

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  // Artefactos derivados del stream — leidos del ultimo tool_result de cada
  // tool relevante. Mauricio's cards consumen estos sin importar si el stream
  // viene del agente real o del mock.
  const diagnosis = useMemo(
    () => extractDiagnosis(state.events),
    [state.events],
  );
  const schedule = useMemo(
    () => extractSchedule(state.events),
    [state.events],
  );
  const claim = useMemo(() => extractClaim(state.events), [state.events]);

  return {
    events: state.events,
    isStreaming: state.isStreaming,
    error: state.error,
    startTurn,
    reset,
    diagnosis,
    schedule,
    claim,
  };
}
