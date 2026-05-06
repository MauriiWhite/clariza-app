// Constructor del DeadlineSchedule completo.
//
// Combina:
//   - Plazo legal (deadlines-config) para el regulador y caso.
//   - Feriados oficiales (holidays.ts).
//   - Calculadora de dias habiles (calculator.ts).
//
// Genera tambien hitos intermedios para los recordatorios:
// 7 / 3 / 1 dias antes del vencimiento.

import type {
  DeadlineMilestone,
  DeadlineSchedule,
} from "@/modules/tools/calculateDeadlines/types";
import type { Regulator } from "@/modules/tools/classifyJurisdiction/types";
import { getHolidaysForDateRange } from "@/modules/regulations/lib/holidays";
import {
  addBusinessDays,
  countBusinessDaysBetween,
  todayISO,
} from "@/modules/tools/calculateDeadlines/services/calculator";
import { getDeadlineConfig } from "@/modules/tools/calculateDeadlines/services/deadlines-config";

interface BuildScheduleInput {
  regulator: Regulator;
  caseType: string;
  /** Fecha del hecho que dispara el plazo (ISO YYYY-MM-DD). Default: hoy. */
  factDate?: string;
}

export async function buildDeadlineSchedule(
  input: BuildScheduleInput,
): Promise<DeadlineSchedule> {
  const factDate = input.factDate ?? todayISO();
  const config = getDeadlineConfig(input.regulator, input.caseType);

  // Caso sin plazo administrativo (TRIBUNALES sin tipificacion concreta).
  if (config.businessDays === null) {
    return {
      totalBusinessDays: null,
      elapsedBusinessDays: 0,
      remainingBusinessDays: null,
      deadlineDate: null,
      milestones: [
        {
          date: factDate,
          action: "Fecha del hecho",
          critical: false,
        },
      ],
      holidaysConsidered: [],
    };
  }

  // Estimamos rango aproximado para pedir feriados (factDate +/- 1 anio).
  const factYear = Number(factDate.slice(0, 4));
  const rangeStart = `${factYear}-01-01`;
  const rangeEnd = `${factYear + 1}-12-31`;
  const holidaysList = await getHolidaysForDateRange(rangeStart, rangeEnd);
  const holidaysSet = new Set(holidaysList);

  const totalBusinessDays = config.businessDays;
  const deadlineDate = addBusinessDays(factDate, totalBusinessDays, holidaysSet);

  const today = todayISO();
  const elapsedBusinessDays = today >= factDate
    ? countBusinessDaysBetween(factDate, today, holidaysSet)
    : 0;
  const remainingBusinessDays = Math.max(
    0,
    totalBusinessDays - elapsedBusinessDays,
  );

  // Hitos: fecha del hecho, recordatorios 7/3/1 dias antes (criticos los ultimos),
  // y dia limite.
  const milestones: DeadlineMilestone[] = [
    {
      date: factDate,
      action: "Fecha del hecho",
      critical: false,
    },
  ];

  for (const daysBefore of [7, 3, 1]) {
    if (totalBusinessDays > daysBefore) {
      const reminderDate = addBusinessDays(
        factDate,
        totalBusinessDays - daysBefore,
        holidaysSet,
      );
      milestones.push({
        date: reminderDate,
        action: `Recordatorio ${daysBefore} ${daysBefore === 1 ? "día" : "días"} antes del vencimiento`,
        critical: daysBefore <= 3,
      });
    }
  }

  milestones.push({
    date: deadlineDate,
    action: "Último día hábil para presentar el reclamo",
    critical: true,
  });

  // Filtramos solo los feriados que cayeron en el rango factDate -> deadlineDate
  // para que el output liste exactamente lo que afecto este caso.
  const holidaysConsidered = holidaysList.filter(
    (d) => d > factDate && d <= deadlineDate,
  );

  return {
    totalBusinessDays,
    elapsedBusinessDays,
    remainingBusinessDays,
    deadlineDate,
    milestones,
    holidaysConsidered,
  };
}
