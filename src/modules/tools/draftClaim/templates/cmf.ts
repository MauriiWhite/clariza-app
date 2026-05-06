// Template de reclamo formal a la CMF.
// Usado para casos de banca, fraude tarjetas, fintec, valores, seguros.

import {
  formatChileanDate,
  LEGAL_NOTICE,
  renderClaimantBlock,
  renderFactsList,
  renderRegulationsList,
  renderRespondentBlock,
} from "@/modules/tools/draftClaim/templates/common";
import type { TemplateInput } from "@/modules/tools/draftClaim/templates/types";

export function renderCMFClaim(input: TemplateInput): string {
  return `# Reclamo formal — Comisión para el Mercado Financiero (CMF)

**Fecha:** ${formatChileanDate(input.generatedAt)}
${renderClaimantBlock(input.claimant)}

${renderRespondentBlock(input.respondent)}

## I. Hechos

${renderFactsList(input.facts)}

## II. Normativa invocada

${renderRegulationsList(input.invokedRegulations)}

## III. Petición concreta

${input.petition}

## IV. Canal y plazo

Este reclamo se presenta ante la **Comisión para el Mercado Financiero (CMF)**, organismo competente para la supervisión de la entidad reclamada.

${LEGAL_NOTICE}`;
}
