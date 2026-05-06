// Helpers para extraer artefactos canonicos del stream de eventos del agente.
//
// Cuando el agente termina, el stream de ConsoleEvent contiene varios
// tool_result con outputs en formatos distintos:
//   - mockAgentStream → output es un objeto directo (ya parseado).
//   - Agente real     → output es lo que la SDK devuelve para tool_result,
//                        que puede ser string (JSON stringificado por la tool)
//                        o array de content blocks con texto.
//
// Estos helpers normalizan ambos casos y exponen los artefactos tipados
// que las cards de Mauricio (DiagnosisCard, TimelineDeadlines, ReclamoPreview)
// consumen sin importar el origen del stream.

import type { ConsoleEvent } from "@/modules/agent/types";
import type {
  DeadlineSchedule,
  RegulatoryDiagnosis,
} from "@/modules/diagnosis/types";
import type { ClaimDocument } from "@/modules/tools/draftClaim/types";

/** Devuelve el ultimo tool_result con un nombre dado, o null si no hay. */
export function findLastToolResult(
  events: readonly ConsoleEvent[],
  toolName: string,
): Extract<ConsoleEvent, { type: "tool_result" }> | null {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e.type === "tool_result" && e.name === toolName) {
      return e;
    }
  }
  return null;
}

/** Convierte el output de un tool_result a un objeto tipado.
 *  Maneja: objeto directo, string JSON, array de content blocks de la SDK. */
export function parseToolOutput<T>(output: unknown): T | null {
  if (output == null) return null;

  if (typeof output === "string") {
    try {
      return JSON.parse(output) as T;
    } catch {
      return null;
    }
  }

  if (Array.isArray(output)) {
    // SDK Anthropic devuelve content blocks. Buscamos el primer text block parseable.
    for (const block of output) {
      if (
        block &&
        typeof block === "object" &&
        "type" in block &&
        (block as { type: unknown }).type === "text" &&
        "text" in block &&
        typeof (block as { text: unknown }).text === "string"
      ) {
        try {
          return JSON.parse((block as { text: string }).text) as T;
        } catch {
          // sigue al siguiente block.
        }
      }
    }
    return null;
  }

  if (typeof output === "object") {
    return output as T;
  }

  return null;
}

/** Diagnostico regulatorio: ultimo result de classifyJurisdiction. */
export function extractDiagnosis(
  events: readonly ConsoleEvent[],
): RegulatoryDiagnosis | null {
  const ev = findLastToolResult(events, "classifyJurisdiction");
  if (!ev) return null;
  return parseToolOutput<RegulatoryDiagnosis>(ev.output);
}

/** Cronograma de plazos: ultimo result de calculateDeadlines. */
export function extractSchedule(
  events: readonly ConsoleEvent[],
): DeadlineSchedule | null {
  const ev = findLastToolResult(events, "calculateDeadlines");
  if (!ev) return null;
  return parseToolOutput<DeadlineSchedule>(ev.output);
}

/** Documento de reclamo: ultimo result de draftClaim. */
export function extractClaim(
  events: readonly ConsoleEvent[],
): ClaimDocument | null {
  const ev = findLastToolResult(events, "draftClaim");
  if (!ev) return null;
  return parseToolOutput<ClaimDocument>(ev.output);
}
