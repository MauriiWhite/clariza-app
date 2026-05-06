// Bridge entre nuestras betaZodTools (formato Anthropic) y el formato OpenAI.
//
// El betaZodTool del SDK Anthropic ya expone el JSON Schema como
// `input_schema` (snake_case) — no hace falta convertirlo de Zod.
// Solo lo reenvasamos al formato OpenAI function-calling.

import type { ChatCompletionTool } from "openai/resources/chat/completions";

/** Forma minima que tiene una betaZodTool una vez instanciada por el SDK. */
interface RawZodTool {
  name: string;
  description: string;
  /** JSON Schema ya convertido por el SDK Anthropic. */
  input_schema: Record<string, unknown>;
  run: (input: unknown) => Promise<string> | string;
}

/** True si el objeto se ve como una betaZodTool del SDK. */
function isRawZodTool(tool: unknown): tool is RawZodTool {
  return (
    typeof tool === "object" &&
    tool !== null &&
    "name" in tool &&
    "description" in tool &&
    "input_schema" in tool &&
    "run" in tool &&
    typeof (tool as { run: unknown }).run === "function"
  );
}

/** Limpia el JSON Schema para que sea aceptable como `parameters` de OpenAI. */
function cleanSchemaForOpenAI(
  schema: Record<string, unknown>,
): Record<string, unknown> {
  const clean = { ...schema };
  // OpenAI no acepta $schema en parameters.
  delete clean.$schema;
  return clean;
}

/** Convierte una betaZodTool al formato function-calling de OpenAI. */
export function toOpenAITool(tool: unknown): ChatCompletionTool {
  if (!isRawZodTool(tool)) {
    throw new Error(
      "Tool no tiene la forma esperada (name/description/input_schema/run)",
    );
  }

  const parameters = cleanSchemaForOpenAI(tool.input_schema);

  const result: ChatCompletionTool = {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: parameters as Record<string, unknown>,
    },
  } as ChatCompletionTool;
  return result;
}

/** Mapa nombre → run para invocar tools desde el loop OpenAI. */
export function buildToolRunnerMap(
  tools: unknown[],
): Map<string, (input: unknown) => Promise<string> | string> {
  const map = new Map<string, (input: unknown) => Promise<string> | string>();
  for (const tool of tools) {
    if (isRawZodTool(tool)) {
      map.set(tool.name, tool.run);
    }
  }
  return map;
}
