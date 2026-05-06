// API route SSE para ejecutar un turno del agente Clariza.
//
// POST /api/agent — body: { userMessage: string }
// Response: text/event-stream con eventos del agente (ConsoleEvent JSON)
//
// Comportamiento:
//   - Si ANTHROPIC_API_KEY esta configurada → ejecuta el agente real
//     (runAgent → toolRunner SDK → tools reales).
//   - Si NO esta → fallback al mock para que la demo no se rompa.
//     Util mientras esperamos la key del Lab o para iterar UI sin gastar
//     creditos de la API.

import { runAgent } from "@/modules/agent/services/runner";
import type { ConsoleEvent } from "@/modules/agent/types";
import { getAgentStream } from "@/modules/chat/services/mockAgentStream";

// Forzamos runtime Node porque el SDK de Anthropic usa Node APIs.
// Edge runtime no soporta el SDK completo.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AgentRequestBody {
  userMessage?: unknown;
}

export async function POST(req: Request) {
  const body: AgentRequestBody = await req.json().catch(() => ({}));
  const userMessage =
    typeof body.userMessage === "string" ? body.userMessage.trim() : "";

  if (!userMessage) {
    return new Response(
      JSON.stringify({ error: "userMessage requerido" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const useRealAgent = !!process.env.ANTHROPIC_API_KEY;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: ConsoleEvent) => {
        const payload = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      try {
        if (useRealAgent) {
          // Camino real: runAgent emite user + tool_call/result + assistant.
          await runAgent({ userMessage, onEvent: send });
        } else {
          // Camino mock: simulamos flujo del Caso 1 — Maria/SUPEN.
          // Emitimos user con el mensaje real del ciudadano, luego
          // un assistant que avisa que estamos en demo, y despues el
          // stream del Caso 1 completo.
          send({ type: "user", text: userMessage });
          send({
            type: "assistant",
            text: "Modo demo: no hay API key configurada todavía, te reproduzco el Caso 1 (María, jubilada con cobro indebido en su AFP) para que veas el flujo.",
          });
          for await (const event of getAgentStream()) {
            // Saltamos el user del mock (ya emitimos uno arriba con el mensaje real).
            if (event.type === "user") continue;
            send(event);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Hint para proxies/CDN que no buffereen SSE.
      "X-Accel-Buffering": "no",
    },
  });
}
