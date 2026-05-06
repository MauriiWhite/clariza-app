// ReclamoPreview — diseno visual original de Mauricio.
// Renderiza el ClaimDocument canonico (campos en ingles).

import React from "react";
import type { ClaimDocument } from "@/modules/tools/draftClaim/types";
import { DownloadButton } from "./DownloadButton";

interface ReclamoPreviewProps {
  claim: ClaimDocument;
  onDownload: () => void;
}

export function ReclamoPreview({ claim, onDownload }: ReclamoPreviewProps) {
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
