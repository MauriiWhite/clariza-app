import { RegulatoryDiagnosis, DeadlineSchedule } from "../types";

export const mockDiagnoses: Record<string, RegulatoryDiagnosis> = {
  caso1: {
    ente_competente: "SUPEN",
    procedencia: "procedente",
    gravedad: "media",
    canal_oficial: "https://www.spensiones.cl/apps/reclamos/reclamoWeb.php",
    plazo_legal_dias: 20,
    motivo_derivacion: "El reclamo trata sobre una comisión adicional no informada en una liquidación de pensión (modalidad retiro programado), regulado por el DL 3.500 Art. 29. La Superintendencia de Pensiones es el ente fiscalizador competente.",
  },
  caso2: {
    ente_competente: "SERNAC",
    procedencia: "procedente",
    gravedad: "alta",
    canal_oficial: "https://www.sernac.cl/portal/617/w3-propertyvalue-63004.html",
    plazo_legal_dias: 30,
    motivo_derivacion: "Posible vulneración a la Ley 19.496 y Ley 21.398 (Pro Consumidor) por información poco clara en crédito de retail y diferencias en la CAE. El SERNAC Financiero es el canal adecuado para la restitución y recálculo.",
  },
  caso3: {
    ente_competente: "CMF",
    procedencia: "procedente",
    gravedad: "alta",
    canal_oficial: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-28042.html",
    plazo_legal_dias: 90,
    motivo_derivacion: "Infracción a la Ley 21.234 (Fraudes con tarjetas). El banco emisor debe devolver los montos no reconocidos salvo que pruebe dolo o culpa grave. La CMF fiscaliza este procedimiento.",
  },
  caso4: {
    ente_competente: "CMF + PDI",
    procedencia: "mixto",
    gravedad: "alta",
    canal_oficial: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-28042.html",
    plazo_legal_dias: 30,
    motivo_derivacion: "La entidad 'PayDay' no está registrada en la CMF (Ley 21.521 Fintec). Se debe generar una alerta administrativa a la CMF y, dado que hay indicios de estafa (Art. 467 CP), una denuncia penal ante la PDI.",
  },
};

export const mockSchedules: Record<string, DeadlineSchedule> = {
  caso1: {
    plazo_total_dias_habiles: 20,
    dias_transcurridos: 2,
    dias_restantes: 18,
    fecha_limite: "2026-05-30",
    hitos: [
      { fecha: "2026-05-02", accion: "Fecha del cobro indebido", critico: false },
      { fecha: "2026-05-23", accion: "Recordatorio 7 días", critico: false },
      { fecha: "2026-05-27", accion: "Recordatorio 3 días", critico: true },
      { fecha: "2026-05-29", accion: "Último día hábil recomendado", critico: true },
    ],
    feriados_considerados: ["2026-05-21"],
  },
  caso2: {
    plazo_total_dias_habiles: 30,
    dias_transcurridos: 20,
    dias_restantes: 10,
    fecha_limite: "2026-06-17",
    hitos: [
      { fecha: "2026-05-06", accion: "Fecha de inicio del caso", critico: false },
      { fecha: "2026-06-06", accion: "Recordatorio 7 días", critico: false },
      { fecha: "2026-06-16", accion: "Último día hábil recomendado", critico: true },
    ],
    feriados_considerados: ["2026-05-21"],
  },
  caso3: {
    plazo_total_dias_habiles: 90, // En realidad 90 días corridos según ley 21.234
    dias_transcurridos: 75,
    dias_restantes: 15,
    fecha_limite: "2026-05-21",
    hitos: [
      { fecha: "2026-02-20", accion: "Fecha de la transacción fraudulenta", critico: false },
      { fecha: "2026-05-14", accion: "Recordatorio 7 días", critico: true },
      { fecha: "2026-05-20", accion: "Último día hábil recomendado", critico: true },
    ],
    feriados_considerados: ["2026-03-29", "2026-05-01"],
  },
  caso4: {
    plazo_total_dias_habiles: 30,
    dias_transcurridos: 5,
    dias_restantes: 25,
    fecha_limite: "2026-06-10",
    hitos: [
      { fecha: "2026-05-01", accion: "Fecha del problema", critico: false },
      { fecha: "2026-06-03", accion: "Recordatorio 7 días", critico: false },
    ],
    feriados_considerados: ["2026-05-21"],
  },
};
