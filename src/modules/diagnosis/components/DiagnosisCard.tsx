// DiagnosisCard — diseno visual original de Mauricio.
// Renderiza el RegulatoryDiagnosis canonico (campos en ingles).
// Casos mixtos (CMF + PDI / TRIBUNALES) se detectan por secondaryRegulators.

import React from "react";
import type { RegulatoryDiagnosis } from "@/modules/diagnosis/types";

interface DiagnosisCardProps {
  diagnosis?: RegulatoryDiagnosis | null;
  isLoading?: boolean;
}

const severityStyles: Record<RegulatoryDiagnosis["severity"], string> = {
  alta: "bg-error/10 text-error border-error/20",
  media: "bg-warning/10 text-warning border-warning/20",
  baja: "bg-success/10 text-success border-success/20",
};

const procedureStyles: Record<string, string> = {
  procedente: "text-success",
  improcedente: "text-error",
  incompleto: "text-warning",
  mixto: "text-accent-soft",
};

/** Computa la etiqueta visual del regulador combinado.
 *  Ej: SUPEN solo, "CMF + Tribunales" si hay secondary. */
function buildRegulatorLabel(d: RegulatoryDiagnosis): string {
  if (!d.secondaryRegulators || d.secondaryRegulators.length === 0) {
    return d.primaryRegulator;
  }
  const secondaryLabels = d.secondaryRegulators.map((r) =>
    r === "TRIBUNALES" ? "Tribunales / PDI" : r,
  );
  return `${d.primaryRegulator} + ${secondaryLabels.join(" + ")}`;
}

/** Si hay secundarios, etiquetamos visualmente como "mixto". */
function buildProcedureLabel(d: RegulatoryDiagnosis): string {
  if (d.secondaryRegulators && d.secondaryRegulators.length > 0) {
    return "mixto";
  }
  return d.procedure;
}

export function DiagnosisCard({ diagnosis, isLoading }: DiagnosisCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-paper p-6 shadow-sm animate-pulse">
        <div className="h-8 bg-cream w-1/3 mb-2 rounded"></div>
        <div className="h-4 bg-cream w-1/4 mb-6 rounded"></div>
        <div className="h-32 bg-cream rounded-md mb-6"></div>
        <div className="h-12 bg-cream w-48 rounded-md"></div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="rounded-md border border-dashed border-border bg-paper p-8 text-center shadow-sm">
        <svg className="mx-auto h-12 w-12 text-ink-3 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="font-serif text-lg font-medium text-ink mb-2">Sin diagnóstico</h3>
        <p className="text-ink-2 max-w-sm mx-auto">
          Describe tu caso en el chat para que Clariza analice la normativa aplicable y determine el ente competente.
        </p>
      </div>
    );
  }

  const regulatorLabel = buildRegulatorLabel(diagnosis);
  const procedureLabel = buildProcedureLabel(diagnosis);

  return (
    <div className="rounded-md border border-border bg-paper p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif text-[24px] font-medium leading-tight text-ink">
            Diagnóstico Legal
          </h2>
          <p className="mt-1 text-[16px] text-ink-2">
            Basado en la normativa vigente chilena
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded border px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-wide ${severityStyles[diagnosis.severity]}`}
          >
            Prioridad {diagnosis.severity}
          </span>
          <span
            className={`inline-flex items-center rounded px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-wide ${procedureStyles[procedureLabel] ?? "text-ink-2"} bg-cream`}
          >
            {procedureLabel}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-md bg-cream p-5 border border-border/50">
        <h3 className="text-[14px] font-semibold uppercase tracking-wider text-ink-3">
          Ente Competente
        </h3>
        <p className="mt-1 font-serif text-[32px] font-medium text-ink">
          {regulatorLabel}
        </p>

        <div className="mt-5">
          <h3 className="text-[14px] font-semibold uppercase tracking-wider text-ink-3">
            Motivo y Normativa
          </h3>
          <p className="mt-2 text-[16px] leading-normal text-ink-2">
            {diagnosis.reasoning}
          </p>
          {diagnosis.notes && (
            <p className="mt-3 text-[14px] leading-normal text-ink-3 italic">
              {diagnosis.notes}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={diagnosis.officialChannel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-clay px-6 py-3 text-[16px] font-medium text-white transition-colors hover:bg-clay-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          {diagnosis.officialChannel.name}
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
