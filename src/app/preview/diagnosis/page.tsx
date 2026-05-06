"use client";

import React, { useState } from "react";
import { DiagnosisCard } from "@/modules/diagnosis/components/DiagnosisCard";
import { TimelineDeadlines } from "@/modules/diagnosis/components/TimelineDeadlines";
import { ReclamoPreview } from "@/modules/claim/components/ReclamoPreview";
import { mockDiagnoses, mockSchedules } from "@/modules/diagnosis/utils/mocks";
import { mockClaims } from "@/modules/claim/utils/mocks";

export default function DiagnosisPreviewPage() {
  const [selectedCase, setSelectedCase] = useState("caso1");

  const diagnosis = mockDiagnoses[selectedCase];
  const schedule = mockSchedules[selectedCase];
  const claim = mockClaims[selectedCase]; // Podría ser undefined para los casos 3 y 4 en el mock actual

  return (
    <div className="min-h-screen bg-cream p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="font-serif text-[48px] font-medium leading-tight text-ink">Preview: Módulos Output (Mauricio)</h1>
          <p className="mt-4 text-[18px] text-ink-2 max-w-2xl leading-relaxed">Verificando los componentes visuales de Diagnosis y Claim con los tokens y el sistema de diseño de Clariza.</p>
        </header>

        {/* Selector de Casos */}
        <div className="mb-12 rounded-md bg-paper p-5 shadow-sm border border-border">
          <label htmlFor="case-selector" className="block text-[14px] font-medium text-ink-2 mb-2">
            Seleccionar Caso Demo:
          </label>
          <select
            id="case-selector"
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            className="block w-full rounded-md border border-border-strong bg-cream py-3 pl-3 pr-10 text-[16px] text-ink focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
          >
            <option value="caso1">Caso 1 (SUPEN) - Jubilado invisible</option>
            <option value="caso2">Caso 2 (SERNAC) - Emprendedora a ciegas</option>
            <option value="caso3">Caso 3 (CMF) - Víctima del fraude (Diagnosis only)</option>
            <option value="caso4">Caso 4 (CMF + PDI) - Universitaria estafada (Diagnosis only)</option>
          </select>
        </div>

        {/* Renderizado de Componentes del Módulo */}
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DiagnosisCard diagnosis={diagnosis} />
            <TimelineDeadlines schedule={schedule} />
          </div>
          
          {claim ? (
            <ReclamoPreview 
              claim={claim} 
              onDownload={() => alert(`Simulando descarga de PDF para el caso: ${claim.id}`)} 
            />
          ) : (
            <div className="rounded-md border border-dashed border-border-strong bg-cream p-12 text-center text-[16px] text-ink-3">
              Mocks de Reclamo (PDF) no implementados aún para este caso.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
