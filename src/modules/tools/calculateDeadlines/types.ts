// Tipos publicos del modulo calculateDeadlines.
//
// Es CONTRATO entre Exequiel (la tool emite estos tipos) y Mauricio
// (los consume en TimelineDeadlines). Se exportan canonicos en ingles.

/** Un hito intermedio dentro del plazo legal — aviso, recordatorio o limite. */
export interface DeadlineMilestone {
  /** Fecha del hito en formato ISO (YYYY-MM-DD). */
  date: string;
  /** Que pasa en esta fecha en lenguaje ciudadano. */
  action: string;
  /** True si este hito es critico — afecta el color y el tamaño en la UI. */
  critical: boolean;
}

/** Cronograma completo de plazos habiles del caso del ciudadano.
 *  Lo emite calculateDeadlines (tool) y lo consume TimelineDeadlines (UI). */
export interface DeadlineSchedule {
  /** Plazo total en dias habiles segun la normativa. null si el caso no tiene plazo legal estricto. */
  totalBusinessDays: number | null;
  /** Dias habiles transcurridos desde el hecho que dispara el plazo. */
  elapsedBusinessDays: number;
  /** Dias habiles que quedan. null si no hay plazo legal. */
  remainingBusinessDays: number | null;
  /** Fecha limite ISO (YYYY-MM-DD). null si no hay plazo. */
  deadlineDate: string | null;
  /** Hitos intermedios (recordatorios, dias criticos). Vacio si no aplica. */
  milestones: DeadlineMilestone[];
  /** Feriados oficiales considerados en el calculo. ISO dates. */
  holidaysConsidered: string[];
}
