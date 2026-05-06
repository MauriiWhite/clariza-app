// Cliente singleton de Anthropic para todo el proyecto.
// La API key se lee de ANTHROPIC_API_KEY (entregada por el Lab al inicio del evento).
// IMPORTANTE: este modulo NUNCA debe importarse desde codigo cliente.
// Solo Server Components, Route Handlers, Server Actions, scripts CLI y MCP servers.

import Anthropic from "@anthropic-ai/sdk";

let cachedClient: Anthropic | null = null;

/**
 * Devuelve el cliente Anthropic compartido.
 * Lanza error si la API key no esta configurada en el entorno.
 */
export function getAnthropicClient(): Anthropic {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY no esta definida. Copia .env.example a .env.local y completa la key.",
    );
  }

  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}

// Modelos disponibles del Lab (abril 2026).
// Los IDs son aliases — no agregar sufijos de fecha.
export const MODELS = {
  // Default para produccion: tool-use + costo razonable + 1M de contexto.
  primary: "claude-sonnet-4-6",
  // Razonamiento profundo — solo cuando el caso lo amerita (clasificacion compleja).
  reasoning: "claude-opus-4-7",
  // Clasificacion rapida y validaciones — minimo costo.
  fast: "claude-haiku-4-5",
} as const;

export type ClaudeModel = (typeof MODELS)[keyof typeof MODELS];
