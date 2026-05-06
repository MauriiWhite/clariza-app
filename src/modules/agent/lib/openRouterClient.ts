// Cliente OpenAI apuntado a OpenRouter.
// Se usa cuando OPENROUTER_API_KEY esta definida y ANTHROPIC_API_KEY no.
//
// OpenRouter expone una API compatible con OpenAI Chat Completions y rutea
// internamente a distintos providers (Anthropic, OpenAI, Google, etc).
// Nosotros le pedimos modelos Claude para mantener calidad de razonamiento
// y compatibilidad con tool-use estilo Claude.

import OpenAI from "openai";

let cached: OpenAI | null = null;

export function getOpenRouterClient(): OpenAI {
  if (cached) return cached;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY no esta definida. Copia .env.example a .env.local.",
    );
  }

  cached = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      // OpenRouter recomienda incluir estos headers para tracking interno
      // y para liberar mejores limites en algunos modelos.
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL ?? "https://clariza.cl",
      // HTTP headers deben ser ASCII puro — sin tildes ni em-dashes.
      "X-Title": "Clariza - Asistente de reclamos financieros",
    },
  });
  return cached;
}

/** Modelos OpenRouter equivalentes a los IDs de Anthropic. */
export const OPENROUTER_MODELS = {
  // Default — equivalente a claude-sonnet-4-6 de la API directa.
  primary: "anthropic/claude-sonnet-4.5",
  // Razonamiento profundo — equivalente a opus.
  reasoning: "anthropic/claude-opus-4.1",
  // Rapido y barato — para extractEvidence Vision y validaciones.
  fast: "anthropic/claude-haiku-4.5",
} as const;

export type OpenRouterModel =
  (typeof OPENROUTER_MODELS)[keyof typeof OPENROUTER_MODELS];
