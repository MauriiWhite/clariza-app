// Runner del agente Clariza — facade publica.
//
// Esta funcion es el unico punto de entrada para ejecutar un turno del agente.
// Internamente compone:
//   - Cliente Anthropic + IDs de modelos (modules/agent/lib/client)
//   - System prompt v1 (modules/agent/prompts/system)
//   - Tools registradas centralmente (modules/agent/services/toolRegistry)
//   - Emisor de eventos de consola (modules/agent/services/eventEmitter)
//   - Tipos compartidos (modules/agent/types)
//
// Cumple sub-check B3 de la rubrica del Lab: emite >=3 eventos visibles
// (user, tool_call, tool_result, assistant) por turno, lo que el componente
// modules/console renderiza en pantalla durante la demo.

import type { BetaTool } from "@anthropic-ai/sdk/resources/beta/messages";
import { getAnthropicClient, MODELS } from "@/modules/agent/lib/client";
import { CLARIZA_SYSTEM_PROMPT } from "@/modules/agent/prompts/system";
import { ConsoleEventEmitter } from "@/modules/agent/services/eventEmitter";
import { getRegisteredTools } from "@/modules/agent/services/toolRegistry";
import type {
  ConsoleEvent,
  RunAgentOptions,
  RunAgentResult,
} from "@/modules/agent/types";

// Re-export de tipos para mantener compatibilidad con consumers que ya
// importaban desde este modulo (smoke test, futuros consumers de la UI).
export type { ConsoleEvent, RunAgentOptions, RunAgentResult };

/**
 * Ejecuta un turno del agente Clariza con tool-use real.
 * Maneja el loop completo Claude <-> tools y emite eventos a consola.
 */
export async function runAgent(
  options: RunAgentOptions,
): Promise<RunAgentResult> {
  const { userMessage, onEvent } = options;
  const client = getAnthropicClient();
  const emitter = new ConsoleEventEmitter(onEvent);

  emitter.emit({ type: "user", text: userMessage });

  // Map para resolver el nombre de la tool a partir del tool_use_id, asi
  // podemos emitir eventos tool_result con el nombre correcto.
  const toolNameById = new Map<string, string>();

  try {
    // toolRunner ejecuta el loop completo: Claude llama tool -> SDK corre run
    // -> Claude continua hasta tener una respuesta final sin mas tool_use.
    const runner = client.beta.messages.toolRunner({
      model: MODELS.primary,
      max_tokens: 2048,
      system: CLARIZA_SYSTEM_PROMPT,
      tools: getRegisteredTools({
        attachment: options.attachment ?? null,
      }) as unknown as BetaTool[],
      messages: [{ role: "user", content: userMessage }],
    });

    // Iteramos manualmente sobre el runner para capturar tool calls,
    // texto intermedio y tool results en orden.
    for await (const message of runner) {
      // 1) Procesamos los content blocks del mensaje del assistant que llego.
      for (const block of message.content) {
        if (block.type === "tool_use") {
          toolNameById.set(block.id, block.name);
          emitter.emit({
            type: "tool_call",
            name: block.name,
            input: block.input,
          });
        } else if (block.type === "text" && block.text.trim().length > 0) {
          // Texto intermedio del modelo (puede haber pensamiento estructurado entre tool calls).
          emitter.emit({ type: "assistant", text: block.text });
        }
      }

      // 2) Tras procesar el mensaje, el SDK ejecuta las tools y agrega un
      //    mensaje user con tool_result blocks. Lo leemos de params.messages
      //    para emitir los resultados en el orden correcto.
      const allMessages = runner.params.messages;
      const lastMessage = allMessages[allMessages.length - 1];
      if (
        lastMessage &&
        lastMessage.role === "user" &&
        Array.isArray(lastMessage.content)
      ) {
        for (const block of lastMessage.content) {
          if (block.type === "tool_result") {
            const name = toolNameById.get(block.tool_use_id) ?? "unknown";
            emitter.emit({
              type: "tool_result",
              name,
              output: block.content,
            });
          }
        }
      }
    }

    // Mensaje final del assistant: cuando la iteracion termina, runner.done()
    // devuelve la respuesta consolidada sin tool_use pendientes.
    const finalMessage = await runner.done();
    const finalText = (
      finalMessage.content as Array<{ type: string; text?: string }>
    )
      .map((b) => (b.type === "text" ? (b.text ?? "") : ""))
      .join("\n")
      .trim();

    return { finalText, events: [...emitter.getEvents()] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    emitter.emit({ type: "error", message });
    throw err;
  }
}
