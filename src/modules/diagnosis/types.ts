export interface RegulatoryDiagnosis {
  ente_competente: "CMF" | "SERNAC" | "SUSESO" | "SUPEN" | "TRIBUNALES" | "CMF + PDI";
  procedencia: "procedente" | "improcedente" | "incompleto" | "mixto";
  gravedad: "alta" | "media" | "baja";
  canal_oficial: string;
  plazo_legal_dias: number;
  motivo_derivacion: string;
}

export interface DeadlineSchedule {
  plazo_total_dias_habiles: number | null; // null para casos sin plazo legal definido
  dias_transcurridos: number;
  dias_restantes: number | null;
  fecha_limite: string | null; // ISO string (YYYY-MM-DD)
  hitos: Array<{
    fecha: string; // ISO string
    accion: string;
    critico: boolean;
  }>;
  feriados_considerados: string[];
}
