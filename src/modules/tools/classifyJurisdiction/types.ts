// Tipos publicos del modulo classifyJurisdiction.
//
// Estos tipos son CONTRATO entre Exequiel (los emite) y Mauricio (los consume
// en modules/diagnosis para renderizar la card). Si alguno cambia, se avisa
// en WhatsApp del equipo antes.

/** Los 5 destinos posibles para un reclamo financiero ciudadano. */
export type Regulator =
  | "CMF" // Comision para el Mercado Financiero — bancos, fintec, seguros, valores
  | "SERNAC" // Servicio Nacional del Consumidor — derechos consumidor
  | "SUSESO" // Superintendencia de Seguridad Social — salud previsional, mutualidades
  | "SUPEN" // Superintendencia de Pensiones — AFP, multifondos
  | "TRIBUNALES"; // Tribunales — casos judicializados, delitos, estafas

/** Resultado de la clasificacion: si el caso aplica para reclamo formal y a quien. */
export type Procedure =
  | "procedente" // El caso califica para reclamo formal en el ente competente
  | "improcedente" // El caso no califica (ej: la institucion actuo dentro de sus facultades)
  | "incompleto"; // Faltan datos para clasificar — el agente debe pedirlos

/** Que tan urgente o sensible es el caso. */
export type Severity = "alta" | "media" | "baja";

/** Canal oficial donde el ciudadano debe presentar el reclamo. */
export interface OfficialChannel {
  name: string; // Ej: "Portal de Reclamos CMF"
  url: string; // URL oficial del canal
}

/** Diagnostico regulatorio completo de un caso del ciudadano.
 *  Lo emite la tool classifyJurisdiction y lo consume:
 *  - El agente para construir su respuesta al ciudadano.
 *  - modules/diagnosis (Mauricio) para renderizar la DiagnosisCard.
 *  - draftClaim (Exequiel) para armar el reclamo formal en el formato correcto.
 */
export interface RegulatoryDiagnosis {
  /** Regulador competente principal — donde va el reclamo. */
  primaryRegulator: Regulator;
  /** Reguladores adicionales relevantes (ej: caso mixto administrativo + penal). */
  secondaryRegulators?: Regulator[];
  /** Si el caso califica para reclamo formal o no. */
  procedure: Procedure;
  /** Gravedad del caso — afecta urgencia y prioridad. */
  severity: Severity;
  /** Explicacion en lenguaje ciudadano de por que va a este regulador. */
  reasoning: string;
  /** Canal oficial donde presentar el reclamo. */
  officialChannel: OfficialChannel;
  /** Notas adicionales: ej "tambien hay que denunciar a PDI por estafa". */
  notes?: string;
  /** Si procedure es "incompleto", que datos falta saber. */
  missingData?: string[];
}
