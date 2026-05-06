import React from "react";
import { DeadlineSchedule } from "../types";

interface TimelineDeadlinesProps {
  schedule: DeadlineSchedule;
}

export function TimelineDeadlines({ schedule }: TimelineDeadlinesProps) {
  if (schedule.plazo_total_dias_habiles === null || schedule.dias_restantes === null) {
    return (
      <div className="rounded-md border border-border bg-paper p-6 shadow-sm">
        <h2 className="font-serif text-[24px] font-medium leading-tight text-ink">Plazos Hábiles</h2>
        <p className="mt-2 text-[16px] text-ink-2">Este caso no tiene un plazo legal estricto definido, pero se recomienda actuar a la brevedad.</p>
      </div>
    );
  }

  // Calculamos el porcentaje de tiempo transcurrido
  const progressPercentage = Math.min(
    100, 
    (schedule.dias_transcurridos / schedule.plazo_total_dias_habiles) * 100
  );

  // Determinamos el color de la barra según la urgencia
  let progressColor = "bg-success";
  if (progressPercentage > 75) progressColor = "bg-error";
  else if (progressPercentage > 50) progressColor = "bg-warning";

  return (
    <div className="rounded-md border border-border bg-paper p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-[24px] font-medium leading-tight text-ink">Plazo Legal para Reclamar</h2>
          <p className="text-[16px] text-ink-2 mt-1">Calculado en días hábiles</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-serif text-[48px] font-medium leading-none text-ink">{schedule.dias_restantes}</p>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-3 mt-1">Días Restantes</p>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="mt-6 relative">
        <div className="flex justify-between text-[12px] font-medium text-ink-3 mb-2">
          <span>Día 0</span>
          <span>Día {schedule.plazo_total_dias_habiles}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full ${progressColor} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[12px] text-ink-3">
          <span>Han pasado {schedule.dias_transcurridos} días</span>
          {schedule.fecha_limite && (
            <span className="font-medium text-ink">Vence: {new Date(schedule.fecha_limite).toLocaleDateString('es-CL')}</span>
          )}
        </div>
      </div>

      {/* Lista de hitos (opcional) */}
      {schedule.hitos && schedule.hitos.length > 0 && (
        <div className="mt-8 border-t border-border/50 pt-6">
          <h3 className="text-[14px] font-semibold uppercase tracking-wider text-ink-3 mb-4">Hitos Críticos del Caso</h3>
          <ul className="space-y-4">
            {schedule.hitos.map((hito, idx) => (
              <li key={idx} className="flex items-start">
                <span className={`mt-1.5 mr-3 flex h-2.5 w-2.5 shrink-0 rounded-full ${hito.critico ? 'bg-error' : 'bg-border-strong'}`} />
                <div className="flex-1">
                  <p className={`text-[14px] font-medium leading-tight ${hito.critico ? 'text-error' : 'text-ink-2'}`}>
                    {hito.accion}
                  </p>
                  <p className="text-[12px] text-ink-3 mt-1">
                    {new Date(hito.fecha).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
