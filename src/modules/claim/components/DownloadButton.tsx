// DownloadButton — diseno visual original de Mauricio.
// Boton de descarga del PDF, parametrizado por regulador destino.

import React from "react";
import type { Regulator } from "@/modules/tools/classifyJurisdiction/types";

interface DownloadButtonProps {
  documentId: string;
  regulator: Regulator;
  onClick: () => void;
}

export function DownloadButton({
  documentId,
  regulator,
  onClick,
}: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      id={`download-btn-${documentId}`}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-clay px-6 py-3 text-[16px] font-medium text-white shadow-sm transition-colors hover:bg-clay-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <svg
        className="h-5 w-5"
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Descargar PDF para {regulator}
    </button>
  );
}
