// Tipos compartidos del agente Clariza.
// Cualquier modulo que consuma el agente (UI, scripts, tests) importa desde aqui.
// Mauricio: usalo desde modules/console y modules/chat para tipar el SSE.

/**
 * Eventos que el agente emite durante un turno.
 * Se renderizan en la consola visible (cumple sub-check B3 de la rubrica del Lab).
 */
export type ConsoleEvent =
  | { type: "user"; text: string }
  | { type: "tool_call"; name: string; input: unknown }
  | { type: "tool_result"; name: string; output: unknown }
  | { type: "assistant"; text: string }
  | { type: "error"; message: string };

/** Archivo adjunto opcional que el ciudadano sube con su mensaje.
 *  El base64 va a la tool extractEvidence via closure cuando se construye
 *  el toolRegistry para este turno. */
export interface AgentAttachment {
  base64: string;
  mediaType: string;
  filename?: string;
}

/**
 * Opciones para ejecutar un turno del agente.
 */
export interface RunAgentOptions {
  // Mensaje del ciudadano en lenguaje natural.
  userMessage: string;
  // Archivo adjunto opcional (foto, PDF, screenshot).
  attachment?: AgentAttachment | null;
  // Callback opcional para streamear eventos a la consola visible.
  onEvent?: (event: ConsoleEvent) => void;
}

/**
 * Resultado de un turno completo del agente.
 */
export interface RunAgentResult {
  // Respuesta final consolidada que se muestra al ciudadano.
  finalText: string;
  // Lista completa de eventos del turno (util para tests, replays y la consola).
  events: ConsoleEvent[];
}

/**
 * Metadata minima de una tool registrada en el agente.
 * Util para listados y debug. La implementacion real vive en cada tool.
 */
export interface ToolMetadata {
  name: string;
  description: string;
}
