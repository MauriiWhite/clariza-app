// Tipos publicos del modulo extractEvidence.

/** Archivo adjunto del ciudadano (foto del contrato, cartola, screenshot, PDF). */
export interface FileAttachment {
  /** Contenido del archivo en base64 sin prefijo data: */
  base64: string;
  /** MIME type. Soportados: image/jpeg, image/png, image/webp, image/gif, application/pdf */
  mediaType: string;
  /** Nombre original del archivo. Solo para mostrarlo en consola. */
  filename?: string;
}

/** Datos estructurados extraidos del documento por Claude Vision. */
export interface Evidence {
  /** True si habia archivo adjunto y se pudo procesar. */
  hasAttachment: boolean;
  /** Institucion identificada (banco, AFP, retail, fintech). null si no se ve claro. */
  entity: string | null;
  /** Tipo de producto financiero. null si no aplica. */
  product: string | null;
  /** Monto detectado en pesos chilenos. null si no hay monto. */
  chargeAmount: number | null;
  /** Frecuencia del cargo detectado. */
  chargeFrequency: "mensual" | "unica" | "anual" | "desconocida" | null;
  /** Fecha del hecho en ISO YYYY-MM-DD. null si no se ve claro. */
  dateOfFact: string | null;
  /** Resumen del documento en 1-2 frases. */
  summary: string;
  /** Calidad de la evidencia: alta = todo legible · baja = solo se ve en parte. */
  evidenceQuality: "alta" | "media" | "baja";
  /** Tipo de archivo procesado. */
  fileType?: "image" | "pdf";
}
