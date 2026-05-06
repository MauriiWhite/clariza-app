// Registro central de tools disponibles para el agente Clariza.
//
// Cuando se construye una tool real (Paso 4+), se importa desde
// modules/tools/* y se agrega al array `registeredTools`. El runner
// consume este registry, no imports directos — asi mantenemos un
// unico punto de verdad sobre que tools estan activas.

import { echoTool } from "@/modules/agent/tools/echo";
import { calculateDeadlinesTool } from "@/modules/tools/calculateDeadlines";
import { classifyJurisdictionTool } from "@/modules/tools/classifyJurisdiction";
import { draftClaimTool } from "@/modules/tools/draftClaim";
import { createExtractEvidenceTool } from "@/modules/tools/extractEvidence";
import type { FileAttachment } from "@/modules/tools/extractEvidence/types";
import { getEconomicContextTool } from "@/modules/tools/getEconomicContext";
import { searchRegulationTool } from "@/modules/tools/searchRegulation";
import type { ToolMetadata } from "@/modules/agent/types";

// El SDK no expone un tipo publico generico para BetaRunnableTool,
// asi que tipamos como unknown[] y casteamos al pasarlo al SDK.
// Esto es seguro porque el unico consumidor es el runner.
type RegisteredTool = unknown;

/**
 * Tools activas en este turno del agente.
 *
 * Estado actual (Paso 11) — 5 tools reales + dummy:
 *   - echoTool — dummy. Lo dejamos para tests del runner.
 *   - searchRegulationTool — busqueda sobre corpus regulatorio chileno (8 fuentes).
 *   - classifyJurisdictionTool — derivacion CMF/SERNAC/SUSESO/SUPEN/tribunales.
 *   - calculateDeadlinesTool — plazos habiles con feriados oficiales (Nager API).
 *   - draftClaimTool — generacion del reclamo formal con templates por regulador.
 *   - extractEvidenceTool — Vision sobre PDFs/imagenes (factory por turno).
 */
const STATIC_TOOLS: RegisteredTool[] = [
  echoTool,
  searchRegulationTool,
  classifyJurisdictionTool,
  calculateDeadlinesTool,
  draftClaimTool,
  getEconomicContextTool,
];

interface ToolContext {
  attachment?: FileAttachment | null;
}

/**
 * Devuelve todas las tools disponibles para este turno, incluyendo la
 * tool factory extractEvidence si hay archivo adjunto. Si no hay,
 * extractEvidence igual se incluye y devuelve hasAttachment: false al
 * ser invocada — asi el agente puede aprenderlo sin que el contrato cambie.
 */
export function getRegisteredTools(
  context: ToolContext = {},
): RegisteredTool[] {
  return [
    ...STATIC_TOOLS,
    createExtractEvidenceTool(context.attachment ?? null),
  ];
}

/**
 * Devuelve metadata minima de cada tool. Util para debug, logs y la UI
 * cuando queramos mostrar "estas son las herramientas disponibles".
 */
export function getToolMetadata(): ToolMetadata[] {
  // No instanciamos extractEvidence aca — solo contamos las estaticas
  // y agregamos extractEvidence manualmente.
  const metadata: ToolMetadata[] = STATIC_TOOLS.map((tool) => {
    const t = tool as { name?: string; description?: string };
    return {
      name: t.name ?? "unknown",
      description: t.description ?? "",
    };
  });
  metadata.push({
    name: "extractEvidence",
    description: "Lee archivos del ciudadano con Vision (foto, PDF).",
  });
  return metadata;
}
