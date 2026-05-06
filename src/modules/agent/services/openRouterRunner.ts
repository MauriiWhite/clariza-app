// Runner del agente vs OpenRouter (OpenAI-compatible).
//
// Implementa el loop tool-use manualmente porque OpenAI SDK no tiene un
// helper como `toolRunner` de Anthropic. El loop es:
//   1. Mandar messages + tools al chat completions endpoint
//   2. Si la respuesta tiene tool_calls, ejecutar cada uno
//   3. Agregar el resultado como mensaje role:"tool" y volver al paso 1
//   4. Si la respuesta es solo content (sin tool_calls), terminar y devolverla
//
// Emite los mismos ConsoleEvent que el runner de Anthropic asi la UI no
// tiene que saber cual provider esta corriendo abajo.

import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import {
  getOpenRouterClient,
  OPENROUTER_MODELS,
} from "@/modules/agent/lib/openRouterClient";
import { CLARIZA_SYSTEM_PROMPT } from "@/modules/agent/prompts/system";
import { ConsoleEventEmitter } from "@/modules/agent/services/eventEmitter";
import { getRegisteredTools } from "@/modules/agent/services/toolRegistry";
import {
  buildToolRunnerMap,
  toOpenAITool,
} from "@/modules/agent/services/toolBridge";
import type {
  ConsoleEvent,
  RunAgentOptions,
  RunAgentResult,
} from "@/modules/agent/types";

const MAX_ITERATIONS = 10;

export async function runAgentViaOpenRouter(
  options: RunAgentOptions,
): Promise<RunAgentResult> {
  const { userMessage, attachment, onEvent } = options;
  const client = getOpenRouterClient();
  const emitter = new ConsoleEventEmitter(onEvent);

  emitter.emit({ type: "user", text: userMessage });

  const registeredTools = getRegisteredTools({
    attachment: attachment ?? null,
  });
  const openAITools: ChatCompletionTool[] = registeredTools.map(toOpenAITool);
  const toolRunnerMap = buildToolRunnerMap(registeredTools);

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: CLARIZA_SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];

  let finalText = "";

  try {
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const response = await client.chat.completions.create({
        model: OPENROUTER_MODELS.primary,
        messages,
        tools: openAITools,
        tool_choice: "auto",
        max_tokens: 2048,
      });

      const message = response.choices[0]?.message;
      if (!message) {
        throw new Error("OpenRouter respondio sin choices");
      }

      // Texto intermedio o final.
      if (message.content && message.content.trim().length > 0) {
        emitter.emit({ type: "assistant", text: message.content.trim() });
      }

      // Si no hay tool_calls, este es el turno final.
      if (!message.tool_calls || message.tool_calls.length === 0) {
        finalText = message.content?.trim() ?? "";
        break;
      }

      // Agregamos la respuesta del assistant a messages.
      messages.push(message);

      // Ejecutamos cada tool_call y agregamos su resultado.
      for (const toolCall of message.tool_calls) {
        if (toolCall.type !== "function") continue;
        const { name, arguments: argsJson } = toolCall.function;
        let parsedArgs: unknown = {};
        try {
          parsedArgs = JSON.parse(argsJson || "{}");
        } catch {
          parsedArgs = {};
        }

        emitter.emit({ type: "tool_call", name, input: parsedArgs });

        const runFn = toolRunnerMap.get(name);
        let resultStr = "";
        if (!runFn) {
          resultStr = JSON.stringify({
            error: `Tool '${name}' no esta registrada en el runner.`,
          });
        } else {
          try {
            resultStr = await Promise.resolve(runFn(parsedArgs));
          } catch (err) {
            resultStr = JSON.stringify({
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }

        // Parseamos para emitir como objeto (la UI prefiere objeto a string).
        let parsedOutput: unknown = resultStr;
        try {
          parsedOutput = JSON.parse(resultStr);
        } catch {
          /* dejar como string si no es JSON */
        }
        emitter.emit({ type: "tool_result", name, output: parsedOutput });

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: resultStr,
        });
      }
    }

    if (!finalText) {
      finalText =
        "Llegué al límite de iteraciones sin una respuesta final. Probemos de nuevo con más contexto.";
    }

    return { finalText, events: [...emitter.getEvents()] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    emitter.emit({ type: "error", message });
    throw err;
  }
}

export type { ConsoleEvent };
