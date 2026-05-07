"use client";

import React from "react";
import { ReclamoPreview } from "@/modules/claim/components/ReclamoPreview";
import { mockClaims } from "@/modules/claim/utils/mocks";
import { PDFGenerator } from "@/modules/claim/services/PDFGenerator";

export default function ClaimPreviewPage() {
  const claim = mockClaims.caso1;

  const handleDownload = () => {
    PDFGenerator.downloadPDF(claim);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Preview: Reclamo + PDF</h1>
      <ReclamoPreview claim={claim} onDownload={handleDownload} />
    </div>
  );
}
