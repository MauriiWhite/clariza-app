import React from "react";
import { ClaimDocument } from "../../tools/draftClaim/types";
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
          <h2 className="font-serif text-[24px] font-medium text-ink leading-tight">Borrador de Reclamo</h2>
          <p className="mt-1 text-[14px] text-ink-2">Documento estructurado según requerimientos de {claim.regulador}</p>
        </div>
        <div className="flex-shrink-0">
          <DownloadButton documentId={claim.id} regulador={claim.regulador} onClick={onDownload} />
        </div>
      </div>

      <div className="p-6 bg-paper overflow-auto">
        <div className="max-w-none">
          {/* Aquí renderizamos el markdown de forma sencilla para el preview. 
              En una versión real podríamos usar react-markdown, pero por simplicidad 
              para el componente aislado lo separamos por saltos de línea. */}
          <div className="bg-paper border border-border shadow-sm p-8 rounded-md text-[16px] text-ink leading-[1.6] font-serif whitespace-pre-wrap">
            {claim.documento_markdown}
          </div>
        </div>
        
        <div className="mt-8 border-t border-border/50 pt-6">
          <h3 className="text-[14px] font-semibold uppercase tracking-wider text-ink-3 mb-5">Resumen Estructurado</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-[14px] font-medium text-ink-3">Identificación</dt>
              <dd className="mt-1 text-[16px] font-medium text-ink">{claim.identificacion_reclamante.nombre}</dd>
            </div>
            <div>
              <dt className="text-[14px] font-medium text-ink-3">Entidad Reclamada</dt>
              <dd className="mt-1 text-[16px] font-medium text-ink">{claim.identificacion_reclamado.entidad}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[14px] font-medium text-ink-3">Normativa Invocada</dt>
              <dd className="mt-2 text-[16px] text-ink-2">
                <ul className="list-disc pl-5 space-y-1">
                  {claim.normativa_invocada.map((norma, idx) => (
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
