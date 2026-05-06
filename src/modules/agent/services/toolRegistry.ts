// Registro central de tools disponibles para el agente Clariza.
//
// Cuando se construye una tool real (Paso 4+), se importa desde
// modules/tools/* y se agrega al array `registeredTools`. El runner
// consume este registry, no imports directos — asi mantenemos un
// unico punto de verdad sobre que tools estan activas.

import { echoTool } from "@/modules/agent/tools/echo";
import type { ToolMetadata } from "@/modules/agent/types";

// El SDK no expone un tipo publico generico para BetaRunnableTool,
// asi que tipamos como unknown[] y casteamos al pasarlo al SDK.
// Esto es seguro porque el unico consumidor es el runner.
type RegisteredTool = unknown;

/**
 * Tools activas en este turno del agente.
 *
 * Estado actual (Paso 3):
 *   - echoTool — dummy para validar el pipeline tool-use.
 *
 * Por venir (Paso 4+):
 *   - extractEvidenceTool — Vision sobre PDFs/imagenes.
 *   - searchRegulationTool — RAG sobre corpus chileno.
 *   - classifyJurisdictionTool — derivacion CMF/SERNAC/SUSESO/SUPEN/tribunales.
 *   - calculateDeadlinesTool — MCP server con plazos habiles.
 *   - draftClaimTool — generacion del reclamo formal.
 */
const registeredTools: RegisteredTool[] = [echoTool];

/**
 * Devuelve todas las tools registradas para que el runner las pase al SDK.
 */
export function getRegisteredTools(): RegisteredTool[] {
  return registeredTools;
}

/**
 * Devuelve metadata minima de cada tool. Util para debug, logs y la UI
 * cuando queramos mostrar "estas son las herramientas disponibles".
 */
export function getToolMetadata(): ToolMetadata[] {
  return registeredTools.map((tool) => {
    // betaZodTool retorna un objeto con name y description al nivel raiz.
    const t = tool as { name?: string; description?: string };
    return {
      name: t.name ?? "unknown",
      description: t.description ?? "",
    };
  });
}
