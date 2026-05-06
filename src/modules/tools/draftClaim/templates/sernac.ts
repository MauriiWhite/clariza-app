// Template de reclamo formal al SERNAC.
// Usado para casos de consumidor general, retail, crédito de consumo, cláusulas abusivas.

import {
  formatChileanDate,
  LEGAL_NOTICE,
  renderClaimantBlock,
  renderFactsList,
  renderRegulationsList,
  renderRespondentBlock,
} from "@/modules/tools/draftClaim/templates/common";
import type { TemplateInput } from "@/modules/tools/draftClaim/templates/types";

export function renderSernacClaim(input: TemplateInput): string {
  return `# Reclamo formal — Servicio Nacional del Consumidor (SERNAC)

**Fecha:** ${formatChileanDate(input.generatedAt)}
${renderClaimantBlock(input.claimant)}

${renderRespondentBlock(input.respondent)}

## I. Hechos

${renderFactsList(input.facts)}

## II. Normativa de protección al consumidor invocada

${renderRegulationsList(input.invokedRegulations)}

## III. Petición concreta

${input.petition}

## IV. Canal SERNAC

Este reclamo se presenta a través del portal SERNAC para la mediación y eventual sanción a la empresa proveedora.

${LEGAL_NOTICE}`;
}
