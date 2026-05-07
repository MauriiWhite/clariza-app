import React from "react";
import { pdf } from "@react-pdf/renderer";
import type { ClaimDocument } from "@/modules/tools/draftClaim/types";
import { BaseTemplate } from "../templates/BaseTemplate";

export class PDFGenerator {
  /**
   * Obtiene el nombre oficial completo del regulador.
   */
  private static getRegulatorFullName(regulator: string): string {
    const map: Record<string, string> = {
      CMF: "COMISIÓN PARA EL MERCADO FINANCIERO (CMF)",
      SERNAC: "SERVICIO NACIONAL DEL CONSUMIDOR (SERNAC)",
      SUSESO: "SUPERINTENDENCIA DE SEGURIDAD SOCIAL (SUSESO)",
      SUPEN: "SUPERINTENDENCIA DE PENSIONES (SUPEN)",
      TRIBUNALES: "JUZGADO DE POLICÍA LOCAL / TRIBUNALES ORDINARIOS",
    };
    return map[regulator] || regulator;
  }

  /**
   * Genera el Blob del PDF a partir del ClaimDocument.
   */
  public static async generatePDF(claim: ClaimDocument): Promise<Blob> {
    const regulatorFullName = this.getRegulatorFullName(claim.regulator);
    
    // Aquí podríamos usar un template específico por regulador, pero por simplicidad
    // usamos el BaseTemplate inyectando el nombre correcto.
    const document = <BaseTemplate claim={claim} regulatorFullName={regulatorFullName} />;
    
    const pdfStream = await pdf(document).toBlob();
    return pdfStream;
  }

  /**
   * Genera y descarga automáticamente el PDF en el navegador.
   */
  public static async downloadPDF(claim: ClaimDocument, filename?: string): Promise<void> {
    const blob = await this.generatePDF(claim);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `reclamo-${claim.regulator.toLowerCase()}-${claim.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
