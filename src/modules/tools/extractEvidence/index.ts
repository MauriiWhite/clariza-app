// Tool extractEvidence — lee archivos del ciudadano con Claude Vision.
//
// El archivo NO viene como input de la tool (los archivos son grandes y no
// caben bien en argumentos JSON de tool-use). Viene via CLOSURE: la tool
// se construye con un FileAttachment opcional y, al ser invocada por el
// agente, hace una llamada interna a Claude Vision con el contenido del
// archivo + un prompt de extraccion estructurada.
//
// PROVIDER ROUTING:
//   - Si ANTHROPIC_API_KEY existe → Anthropic SDK directo (Haiku 4.5 Vision).
//   - Si solo OPENROUTER_API_KEY → OpenAI SDK con baseURL OpenRouter,
//     usando anthropic/claude-haiku-4.5 con formato image_url estilo OpenAI.
//   - Si ninguna → devuelve hasAttachment: false, el flujo sigue solo con
//     el relato textual.

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { getAnthropicClient, MODELS } from "@/modules/agent/lib/client";
import {
  getOpenRouterClient,
  OPENROUTER_MODELS,
} from "@/modules/agent/lib/openRouterClient";
import type {
  Evidence,
  FileAttachment,
} from "@/modules/tools/extractEvidence/types";

const EXTRACTION_PROMPT = `Eres un asistente que extrae datos estructurados de documentos financieros chilenos. Lee el documento adjunto y devolve los datos en JSON. NUNCA inventes datos: si un campo no se ve claro, marcalo como null.

Devuelve SOLO el JSON, sin texto adicional ni markdown:

{
  "entity": "nombre de la institucion (banco, AFP, retail, fintech) o null",
  "product": "tipo de producto financiero (cuenta, tarjeta, credito, pension, etc.) o null",
  "chargeAmount": numero entero en pesos chilenos o null,
  "chargeFrequency": "mensual" | "unica" | "anual" | "desconocida" | null,
  "dateOfFact": "YYYY-MM-DD" o null,
  "summary": "una o dos frases describiendo lo que ves",
  "evidenceQuality": "alta" | "media" | "baja"
}`;

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** True si el media type es soportado por la API de Vision. */
function isSupportedMediaType(mediaType: string): boolean {
  return SUPPORTED_IMAGE_TYPES.has(mediaType) || mediaType === "application/pdf";
}

/** Default cuando no hay archivo o no se pudo procesar. */
function emptyEvidence(reason: string): Evidence {
  return {
    hasAttachment: false,
    entity: null,
    product: null,
    chargeAmount: null,
    chargeFrequency: null,
    dateOfFact: null,
    summary: reason,
    evidenceQuality: "baja",
  };
}

/** Parsea el JSON que devuelve Claude (puede venir con texto extra). */
function parseEvidenceJson(
  rawText: string,
  fileType: "image" | "pdf",
): Evidence {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const parsed = JSON.parse(jsonStr) as Partial<Evidence>;

    return {
      hasAttachment: true,
      entity: parsed.entity ?? null,
      product: parsed.product ?? null,
      chargeAmount:
        typeof parsed.chargeAmount === "number" ? parsed.chargeAmount : null,
      chargeFrequency: parsed.chargeFrequency ?? null,
      dateOfFact: parsed.dateOfFact ?? null,
      summary: parsed.summary ?? "Documento procesado.",
      evidenceQuality: parsed.evidenceQuality ?? "media",
      fileType,
    };
  } catch {
    return {
      ...emptyEvidence("Documento procesado parcialmente, JSON invalido."),
      summary: rawText.slice(0, 200),
    };
  }
}

// ---------------------------------------------------------------------------
// PATH 1: Anthropic SDK directo
// ---------------------------------------------------------------------------

async function extractViaAnthropic(
  attachment: FileAttachment,
  contextHint?: string,
): Promise<Evidence> {
  const client = getAnthropicClient();
  const fileType: "image" | "pdf" =
    attachment.mediaType === "application/pdf" ? "pdf" : "image";

  const visionContent =
    attachment.mediaType === "application/pdf"
      ? {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: attachment.base64,
          },
          citations: { enabled: true },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: attachment.mediaType as
              | "image/jpeg"
              | "image/png"
              | "image/webp"
              | "image/gif",
            data: attachment.base64,
          },
        };

  const response = await client.messages.create({
    model: MODELS.fast,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          visionContent,
          {
            type: "text",
            text: contextHint
              ? `${EXTRACTION_PROMPT}\n\nContexto del usuario: ${contextHint}`
              : EXTRACTION_PROMPT,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const rawText = textBlock && "text" in textBlock ? textBlock.text : "{}";
  return parseEvidenceJson(rawText, fileType);
}

// ---------------------------------------------------------------------------
// PATH 2: OpenAI SDK contra OpenRouter (formato OpenAI multimodal)
// ---------------------------------------------------------------------------

async function extractViaOpenRouter(
  attachment: FileAttachment,
  contextHint?: string,
): Promise<Evidence> {
  // OpenRouter solo soporta image_url para Vision en formato OpenAI.
  // Los PDFs requieren un endpoint distinto que muchos modelos no soportan.
  if (attachment.mediaType === "application/pdf") {
    // En vez de devolver "vacio", devolvemos un evidence con guia clara.
    // El agente la usa para responderle al ciudadano que mande imagen.
    return {
      hasAttachment: true,
      entity: null,
      product: null,
      chargeAmount: null,
      chargeFrequency: null,
      dateOfFact: null,
      summary:
        `Recibí un PDF (${attachment.filename ?? "documento"}) pero por ahora solo puedo leer imágenes. Decile al ciudadano que abra el PDF y mande una captura de pantalla (Win+Shift+S o Cmd+Shift+4) de la página relevante.`,
      evidenceQuality: "baja",
      fileType: "pdf",
    };
  }

  const client = getOpenRouterClient();
  const dataUrl = `data:${attachment.mediaType};base64,${attachment.base64}`;

  const response = await client.chat.completions.create({
    model: OPENROUTER_MODELS.fast,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: dataUrl } },
          {
            type: "text",
            text: contextHint
              ? `${EXTRACTION_PROMPT}\n\nContexto del usuario: ${contextHint}`
              : EXTRACTION_PROMPT,
          },
        ],
      },
    ],
  });

  const rawText = response.choices[0]?.message?.content ?? "{}";
  return parseEvidenceJson(
    typeof rawText === "string" ? rawText : "{}",
    "image",
  );
}

/**
 * Crea la tool extractEvidence con closure sobre el archivo adjunto.
 * Detecta automaticamente que provider usar segun env vars.
 */
export function createExtractEvidenceTool(
  attachment: FileAttachment | null,
) {
  return betaZodTool({
    name: "extractEvidence",
    description:
      "Lee el archivo adjunto del ciudadano (foto del contrato, cartola, screenshot, PDF) y extrae datos estructurados (entidad, producto, monto, fecha). USA esta tool COMO PRIMER PASO si el ciudadano adjunto un archivo. Si no hay archivo, la tool devuelve hasAttachment: false y el flujo sigue solo con el relato textual.",
    inputSchema: z.object({
      contextHint: z
        .string()
        .optional()
        .describe(
          "Pista del usuario sobre que esperas encontrar. Ej: 'cartola de pension', 'contrato de credito'.",
        ),
    }),
    run: async ({ contextHint }) => {
      if (!attachment) {
        return JSON.stringify(emptyEvidence("No hay archivo adjunto."));
      }

      if (!isSupportedMediaType(attachment.mediaType)) {
        return JSON.stringify(
          emptyEvidence(
            `Tipo de archivo no soportado por Vision: ${attachment.mediaType}. Usa JPG, PNG, WEBP, GIF o PDF.`,
          ),
        );
      }

      // Routing por env var disponible.
      const useAnthropic = !!process.env.ANTHROPIC_API_KEY;
      const useOpenRouter =
        !useAnthropic && !!process.env.OPENROUTER_API_KEY;

      if (!useAnthropic && !useOpenRouter) {
        return JSON.stringify(
          emptyEvidence(
            "No hay API key configurada para Vision. Configura ANTHROPIC_API_KEY u OPENROUTER_API_KEY.",
          ),
        );
      }

      try {
        const evidence = useAnthropic
          ? await extractViaAnthropic(attachment, contextHint)
          : await extractViaOpenRouter(attachment, contextHint);
        return JSON.stringify(evidence);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return JSON.stringify(
          emptyEvidence(`Fallo el procesamiento Vision: ${message}`),
        );
      }
    },
  });
}
