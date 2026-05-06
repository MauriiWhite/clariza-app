// Runner del agente Clariza.
// Usa el toolRunner del SDK para que el loop tool-use lo maneje Anthropic
// (Claude llama tool -> ejecutamos run() -> le devolvemos resultado -> sigue).
//
// Ademas registra cada tool call y resultado en una "consola" interna que
// despues sera el componente visible en pantalla (cumple sub-check B3 de la
// rubrica del Lab: >=3 mensajes visibles en la ventana durante la demo).

import type { BetaTool } from "@anthropic-ai/sdk/resources/beta/messages";
import { getAnthropicClient, MODELS } from "@/lib/anthropic/client";
import { CLARIZA_SYSTEM_PROMPT } from "@/agent/prompts/system";
import { echoTool } from "@/agent/tools/echo";

// Eventos que el runner emite para que UI / scripts los muestren en consola.
export type ConsoleEvent =
  | { type: "user"; text: string }
  | { type: "tool_call"; name: string; input: unknown }
  | { type: "tool_result"; name: string; output: unknown }
  | { type: "assistant"; text: string }
  | { type: "error"; message: string };

export interface RunAgentOptions {
  // Mensaje del ciudadano.
  userMessage: string;
  // Callback opcional para streamear eventos a la consola visible.
  onEvent?: (event: ConsoleEvent) => void;
}

export interface RunAgentResult {
  // Respuesta final que se muestra al ciudadano.
  finalText: string;
  // Lista completa de eventos del turno (util para tests y para el componente consola).
  events: ConsoleEvent[];
}

/**
 * Ejecuta un turno del agente Clariza con tool-use real.
 * En esta version v0 solo expone la tool dummy `echo` para validar el pipeline.
 */
export async function runAgent(
  options: RunAgentOptions,
): Promise<RunAgentResult> {
  const { userMessage, onEvent } = options;
  const client = getAnthropicClient();
  const events: ConsoleEvent[] = [];

  // Helper que registra y emite eventos en simultaneo.
  const log = (event: ConsoleEvent) => {
    events.push(event);
    onEvent?.(event);
  };

  log({ type: "user", text: userMessage });

  // Tools disponibles en este turno.
  // En el Paso 3 reemplazamos echoTool por las 5 reales (extract, search, classify, deadlines, draft).
  const tools = [echoTool];

  // Map para resolver el nombre de la tool a partir del tool_use_id, asi
  // podemos emitir eventos tool_result con el nombre correcto.
  const toolNameById = new Map<string, string>();

  try {
    // toolRunner ejecuta el loop completo: Claude llama tool -> SDK corre run -> Claude continua
    // hasta tener una respuesta final sin mas tool_use blocks.
    const runner = client.beta.messages.toolRunner({
      model: MODELS.primary,
      max_tokens: 2048,
      system: CLARIZA_SYSTEM_PROMPT,
      tools: tools as unknown as BetaTool[],
      messages: [{ role: "user", content: userMessage }],
    });

    // Iteramos manualmente sobre el runner para capturar cada tool call,
    // texto intermedio y tool result.
    for await (const message of runner) {
      // 1) Procesamos los content blocks del mensaje del assistant que acaba de llegar.
      for (const block of message.content) {
        if (block.type === "tool_use") {
          toolNameById.set(block.id, block.name);
          log({ type: "tool_call", name: block.name, input: block.input });
        } else if (block.type === "text" && block.text.trim().length > 0) {
          // Texto intermedio del modelo (puede haber pensamiento estructurado entre tool calls).
          log({ type: "assistant", text: block.text });
        }
      }

      // 2) Tras procesar el mensaje, el SDK ejecuta las tools y agrega un mensaje
      //    user con tool_result blocks. Lo leemos de params.messages para emitir
      //    los resultados en el orden correcto.
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
            log({ type: "tool_result", name, output: block.content });
          }
        }
      }
    }

    // Mensaje final del assistant: cuando la iteracion termina, runner.done()
    // devuelve la respuesta consolidada sin tool_use pendientes.
    const finalMessage = await runner.done();
    const finalText = finalMessage.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();

    return { finalText, events };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log({ type: "error", message });
    throw err;
  }
}
