// Mocks de RegulatoryDiagnosis y DeadlineSchedule para los 4 casos de CASES.md.
// Sirven para desarrollar UI sin necesidad de las tools reales corriendo.
// Fuente unica de tipos: @/modules/diagnosis/types (re-export de canonicos).

import type {
  DeadlineSchedule,
  RegulatoryDiagnosis,
} from "@/modules/diagnosis/types";

export const mockDiagnoses: Record<string, RegulatoryDiagnosis> = {
  caso1: {
    primaryRegulator: "SUPEN",
    procedure: "procedente",
    severity: "media",
    reasoning:
      "El reclamo trata sobre una comisión adicional no informada en una liquidación de pensión (modalidad retiro programado), regulado por el DL 3.500 Art. 29. La Superintendencia de Pensiones es el ente fiscalizador competente.",
    officialChannel: {
      name: "Portal de Reclamos SUPEN",
      url: "https://www.spensiones.cl/apps/reclamos/reclamoWeb.php",
    },
  },
  caso2: {
    primaryRegulator: "SERNAC",
    procedure: "procedente",
    severity: "alta",
    reasoning:
      "Posible vulneración a la Ley 19.496 y Ley 21.398 (Pro Consumidor) por información poco clara en crédito de retail y diferencias en la CAE. El SERNAC Financiero es el canal adecuado para la restitución y recálculo.",
    officialChannel: {
      name: "Portal de Reclamos SERNAC",
      url: "https://www.sernac.cl/portal/617/w3-propertyvalue-63004.html",
    },
  },
  caso3: {
    primaryRegulator: "CMF",
    procedure: "procedente",
    severity: "alta",
    reasoning:
      "Infracción a la Ley 21.234 (Fraudes con tarjetas). El banco emisor debe devolver los montos no reconocidos salvo que pruebe dolo o culpa grave. La CMF fiscaliza este procedimiento.",
    officialChannel: {
      name: "Portal de Reclamos CMF",
      url: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-28042.html",
    },
    notes:
      "Importante: tenes 90 dias corridos desde que tomaste conocimiento del cargo desconocido para reclamar bajo Ley 21.234.",
  },
  caso4: {
    primaryRegulator: "CMF",
    secondaryRegulators: ["TRIBUNALES"],
    procedure: "procedente",
    severity: "alta",
    reasoning:
      "La entidad 'PayDay' no está registrada en la CMF (Ley 21.521 Fintec). Se debe generar una alerta administrativa a la CMF y, dado que hay indicios de estafa (Art. 467 CP), una denuncia penal ante la PDI.",
    officialChannel: {
      name: "Alerta a la CMF + Denuncia PDI Cibercrimen",
      url: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43545.html",
    },
    notes:
      "La probabilidad de recuperar fondos en estafas a fintechs no autorizadas es baja. Aun asi conviene denunciar para evitar que sigan operando.",
  },
};

export const mockSchedules: Record<string, DeadlineSchedule> = {
  caso1: {
    totalBusinessDays: 20,
    elapsedBusinessDays: 2,
    remainingBusinessDays: 18,
    deadlineDate: "2026-05-30",
    milestones: [
      { date: "2026-05-02", action: "Fecha del cobro indebido", critical: false },
      { date: "2026-05-23", action: "Recordatorio 7 días", critical: false },
      { date: "2026-05-27", action: "Recordatorio 3 días", critical: true },
      { date: "2026-05-29", action: "Último día hábil recomendado", critical: true },
    ],
    holidaysConsidered: ["2026-05-21"],
  },
  caso2: {
    totalBusinessDays: 30,
    elapsedBusinessDays: 20,
    remainingBusinessDays: 10,
    deadlineDate: "2026-06-17",
    milestones: [
      { date: "2026-05-06", action: "Fecha de inicio del caso", critical: false },
      { date: "2026-06-06", action: "Recordatorio 7 días", critical: false },
      { date: "2026-06-16", action: "Último día hábil recomendado", critical: true },
    ],
    holidaysConsidered: ["2026-05-21"],
  },
  caso3: {
    totalBusinessDays: 90, // Realmente 90 dias corridos en Ley 21.234, simplificado para demo.
    elapsedBusinessDays: 75,
    remainingBusinessDays: 15,
    deadlineDate: "2026-05-21",
    milestones: [
      { date: "2026-02-20", action: "Fecha de la transacción fraudulenta", critical: false },
      { date: "2026-05-14", action: "Recordatorio 7 días", critical: true },
      { date: "2026-05-20", action: "Último día hábil recomendado", critical: true },
    ],
    holidaysConsidered: ["2026-03-29", "2026-05-01"],
  },
  caso4: {
    totalBusinessDays: 30,
    elapsedBusinessDays: 5,
    remainingBusinessDays: 25,
    deadlineDate: "2026-06-10",
    milestones: [
      { date: "2026-05-01", action: "Fecha del problema", critical: false },
      { date: "2026-06-03", action: "Recordatorio 7 días", critical: false },
    ],
    holidaysConsidered: ["2026-05-21"],
  },
};
