// Tipos publicos del modulo draftClaim.
//
// Es CONTRATO entre Exequiel (la tool emite estos tipos) y Mauricio
// (los consume en ReclamoPreview y DownloadButton). Field names en ingles
// segun convencion del proyecto.

import type { Regulator } from "@/modules/tools/classifyJurisdiction/types";

/** Identificacion del ciudadano que presenta el reclamo. */
export interface Claimant {
  fullName: string;
  /** RUT chileno opcional. Sin formato fijo aun (puede llegar con o sin puntos). */
  rut?: string;
  /** Email opcional para recordatorios y notificaciones. */
  email?: string;
}

/** Identificacion de la entidad reclamada (banco, AFP, retail, fintech). */
export interface Respondent {
  /** Nombre comercial de la entidad. */
  entity: string;
  /** RUT empresa si lo conocemos (opcional). */
  rut?: string;
}

/** Documento de reclamo formal listo para presentar al regulador. */
export interface ClaimDocument {
  /** ID estable del documento (para seguimiento y descarga). */
  id: string;
  /** Regulador destino del reclamo. */
  regulator: Regulator;
  /** Fecha de generacion del documento ISO (YYYY-MM-DD). */
  generatedAt: string;
  /** Datos del reclamante. */
  claimant: Claimant;
  /** Datos de la entidad reclamada. */
  respondent: Respondent;
  /** Lista de hechos numerados que sustentan el reclamo. */
  facts: string[];
  /** Citas normativas invocadas (texto corto, ej: "Ley 19.496 Art. 17"). */
  invokedRegulations: string[];
  /** Peticion concreta del reclamante en una frase. */
  petition: string;
  /** Cuerpo completo del documento en markdown — listo para preview o conversion a PDF. */
  documentMarkdown: string;
}
