// Hook que maneja el estado de un turno del chat.
// En esta version v0 consume el mockAgentStream — cuando este el endpoint
// /api/agent real, se reemplaza la fuente sin cambiar la API publica.

"use client";

import { useCallback, useState } from "react";
import type { ConsoleEvent } from "@/modules/agent/types";
import { getAgentStream } from "@/modules/chat/services/mockAgentStream";

interface UseChatState {
  events: ConsoleEvent[];
  isStreaming: boolean;
  error: string | null;
}

export function useChat() {
  const [state, setState] = useState<UseChatState>({
    events: [],
    isStreaming: false,
    error: null,
  });

  // Inicia un turno con el mensaje del usuario y opcionalmente un archivo.
  // En produccion esto va a llamar al endpoint SSE real con fetch + FormData.
  const startTurn = useCallback(async (
    _userMessage: string,
    _file?: File | null,
  ) => {
    // Por ahora ignoramos el userMessage y el archivo — el mock siempre reproduce Caso 1.
    void _userMessage;
    void _file;
    setState({ events: [], isStreaming: true, error: null });

    try {
      for await (const event of getAgentStream()) {
        setState((prev) => ({
          ...prev,
          events: [...prev.events, event],
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setState((prev) => ({ ...prev, error: message }));
    } finally {
      setState((prev) => ({ ...prev, isStreaming: false }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ events: [], isStreaming: false, error: null });
  }, []);

  return {
    events: state.events,
    isStreaming: state.isStreaming,
    error: state.error,
    startTurn,
    reset,
  };
}
