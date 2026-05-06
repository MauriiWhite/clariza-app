import React from "react";
import { RegulatoryDiagnosis } from "../types";

interface DiagnosisCardProps {
  diagnosis: RegulatoryDiagnosis;
}

export function DiagnosisCard({ diagnosis }: DiagnosisCardProps) {
  // Status colors mapped to our civic tokens
  const severityStyles = {
    alta: "bg-error/10 text-error border-error/20",
    media: "bg-warning/10 text-warning border-warning/20",
    baja: "bg-success/10 text-success border-success/20",
  };

  const procedenciaStyles = {
    procedente: "text-success",
    improcedente: "text-error",
    incompleto: "text-warning",
    mixto: "text-accent-soft",
  };

  return (
    <div className="rounded-md border border-border bg-paper p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif text-[24px] font-medium leading-tight text-ink">Diagnóstico Legal</h2>
          <p className="mt-1 text-[16px] text-ink-2">Basado en la normativa vigente chilena</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center rounded border px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-wide ${severityStyles[diagnosis.gravedad]}`}>
            Prioridad {diagnosis.gravedad}
          </span>
          <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-wide ${procedenciaStyles[diagnosis.procedencia]} bg-cream`}>
            {diagnosis.procedencia}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-md bg-cream p-5 border border-border/50">
        <h3 className="text-[14px] font-semibold uppercase tracking-wider text-ink-3">Ente Competente</h3>
        <p className="mt-1 font-serif text-[32px] font-medium text-ink">{diagnosis.ente_competente}</p>
        
        <div className="mt-5">
          <h3 className="text-[14px] font-semibold uppercase tracking-wider text-ink-3">Motivo y Normativa</h3>
          <p className="mt-2 text-[16px] leading-[1.5] text-ink-2">
            {diagnosis.motivo_derivacion}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a 
          href={diagnosis.canal_oficial} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-clay px-6 py-3 text-[16px] font-medium text-white transition-colors hover:bg-clay-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          Ver canal oficial del regulador
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
