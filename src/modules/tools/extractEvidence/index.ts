// Tool extractEvidence — lee archivos del ciudadano con Claude Vision.
//
// El archivo NO viene como input de la tool (los archivos son grandes y no
// caben bien en argumentos JSON de tool-use). Viene via CLOSURE: la tool
// se construye con un FileAttachment opcional y, al ser invocada por el
// agente, hace una llamada interna a Claude Vision con el contenido del
// archivo + un prompt de extraccion estructurada.
//
// Si el ciudadano no adjunto archivo, la tool devuelve hasAttachment: false
// y el agente sigue el flujo solo con el relato textual.
//
// Modelo elegido: Claude Haiku 4.5 — Vision-capable, rapido y barato.
// Para casos demo es mas que suficiente.

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { getAnthropicClient, MODELS } from "@/modules/agent/lib/client";
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

/** Construye el content block multimodal segun tipo de archivo.
 *  Para PDF activamos `citations: { enabled: true }` para que Claude
 *  devuelva referencias literales al documento — primer linea anti-alucinacion. */
function buildVisionContent(attachment: FileAttachment) {
  if (attachment.mediaType === "application/pdf") {
    return {
      type: "document" as const,
      source: {
        type: "base64" as const,
        media_type: "application/pdf" as const,
        data: attachment.base64,
      },
      citations: { enabled: true },
    };
  }
  return {
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

/**
 * Crea la tool extractEvidence con closure sobre el archivo adjunto.
 * Si attachment es null, la tool devuelve sin procesar.
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

      try {
        const client = getAnthropicClient();
        const visionContent = buildVisionContent(attachment);
        const fileType: "image" | "pdf" =
          attachment.mediaType === "application/pdf" ? "pdf" : "image";

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
        const rawText =
          textBlock && "text" in textBlock ? textBlock.text : "{}";

        // Extrae el primer JSON valido del output (puede venir con texto extra).
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : "{}";

        const parsed = JSON.parse(jsonStr) as Partial<Evidence>;

        const evidence: Evidence = {
          hasAttachment: true,
          entity: parsed.entity ?? null,
          product: parsed.product ?? null,
          chargeAmount:
            typeof parsed.chargeAmount === "number"
              ? parsed.chargeAmount
              : null,
          chargeFrequency: parsed.chargeFrequency ?? null,
          dateOfFact: parsed.dateOfFact ?? null,
          summary: parsed.summary ?? "Documento procesado.",
          evidenceQuality: parsed.evidenceQuality ?? "media",
          fileType,
        };

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
