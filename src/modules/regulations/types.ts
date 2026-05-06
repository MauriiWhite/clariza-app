// Tipos compartidos del modulo regulations.
// Cualquier consumer de citas (tool searchRegulation, UI de diagnosis,
// PDF de reclamo) los importa desde aqui.

/** Identifica una de las fuentes regulatorias chilenas que cubre Clariza. */
export type RegulatorySourceId =
  | "DL_3500"
  | "LEY_19496"
  | "LEY_20555"
  | "LEY_21398"
  | "LEY_21234"
  | "LEY_21521"
  | "LEY_21680"
  | "CIRCULAR_SUPEN_1998";

/** Cuanto matchea esta cita con la consulta. Se calcula en el servicio de busqueda. */
export type Relevance = "alta" | "media" | "baja";

/** Una cita normativa devuelta por searchRegulation.
 *  Contiene texto + atribucion clara a fuente oficial publica. */
export interface Citation {
  /** Identificador estable de la fuente (para filtros y agrupacion). */
  sourceId: RegulatorySourceId;
  /** Nombre legible de la fuente. Ej: "Ley 19.496", "DL 3.500", "Circular SUPEN 1.998". */
  source: string;
  /** Articulo o seccion. Opcional para circulares sin articulado claro. Ej: "Art. 17", "Art. 17 B". */
  article?: string;
  /** Texto del chunk normativo. SIEMPRE basado en el texto oficial publicado en BCN/CMF. */
  text: string;
  /** Resumen ciudadano del chunk en lenguaje claro (1-2 frases). */
  plainLanguageSummary: string;
  /** URL oficial donde el ciudadano puede verificar el texto (BCN para leyes, CMF para circulares). */
  url: string;
  /** Relevancia respecto a la query, calculada por el servicio de busqueda. */
  relevance: Relevance;
}

/** Un chunk indexado del corpus, antes de pasar por searchRegulation. */
export interface RegulationChunk extends Omit<Citation, "relevance"> {
  /** Keywords que disparan match con la query. Lowercase + sin acentos. */
  keywords: string[];
}
