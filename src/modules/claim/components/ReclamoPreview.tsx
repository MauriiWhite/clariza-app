// ReclamoPreview — diseno visual original de Mauricio.
// Renderiza el ClaimDocument canonico (campos en ingles).

import React from "react";
import type { ClaimDocument } from "@/modules/tools/draftClaim/types";
import { DownloadButton } from "./DownloadButton";

interface ReclamoPreviewProps {
  claim?: ClaimDocument | null;
  isLoading?: boolean;
  onDownload: () => void;
}

export function ReclamoPreview({ claim, isLoading, onDownload }: ReclamoPreviewProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-paper shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
        <div className="bg-cream border-b border-border/50 px-6 py-5">
          <div className="h-8 bg-border w-1/3 mb-2 rounded"></div>
          <div className="h-4 bg-border w-1/4 rounded"></div>
        </div>
        <div className="p-6">
          <div className="h-64 bg-cream rounded-md mb-8"></div>
          <div className="h-8 bg-cream w-1/4 mb-4 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-cream rounded"></div>
            <div className="h-12 bg-cream rounded"></div>
            <div className="col-span-2 h-24 bg-cream rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="rounded-md border border-dashed border-border bg-paper p-8 text-center shadow-sm h-full flex flex-col items-center justify-center min-h-[300px]">
        <svg className="h-12 w-12 text-ink-3 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="font-serif text-lg font-medium text-ink mb-2">Sin reclamo generado</h3>
        <p className="text-ink-2 max-w-sm">
          Aún no se ha redactado un reclamo formal. Conversa con Clariza para que genere el borrador.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-paper shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-cream border-b border-border/50 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-[24px] font-medium text-ink leading-tight">
            Borrador de Reclamo
          </h2>
          <p className="mt-1 text-[14px] text-ink-2">
            Documento estructurado según requerimientos de {claim.regulator}
          </p>
        </div>
        <div className="shrink-0">
          <DownloadButton
            documentId={claim.id}
            regulator={claim.regulator}
            onClick={onDownload}
          />
        </div>
      </div>

      <div className="p-6 bg-paper overflow-auto">
        <div className="max-w-none">
          {/* Render simple del markdown como texto preformateado.
              En produccion: react-markdown con sanitize. */}
          <div className="bg-paper border border-border shadow-sm p-8 rounded-md text-[16px] text-ink leading-[1.6] font-serif whitespace-pre-wrap">
            {claim.documentMarkdown}
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6">
          <h3 className="text-[14px] font-semibold uppercase tracking-wider text-ink-3 mb-5">
            Resumen Estructurado
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-[14px] font-medium text-ink-3">
                Identificación
              </dt>
              <dd className="mt-1 text-[16px] font-medium text-ink">
                {claim.claimant.fullName}
              </dd>
            </div>
            <div>
              <dt className="text-[14px] font-medium text-ink-3">
                Entidad Reclamada
              </dt>
              <dd className="mt-1 text-[16px] font-medium text-ink">
                {claim.respondent.entity}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[14px] font-medium text-ink-3">
                Normativa Invocada
              </dt>
              <dd className="mt-2 text-[16px] text-ink-2">
                <ul className="list-disc pl-5 space-y-1">
                  {claim.invokedRegulations.map((norma, idx) => (
                    <li key={idx}>{norma}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
