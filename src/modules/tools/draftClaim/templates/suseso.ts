// Template de reclamo formal a SUSESO (Superintendencia de Seguridad Social).
// Usado para casos de salud previsional, isapres, mutualidades, licencias médicas.

import {
  formatChileanDate,
  LEGAL_NOTICE,
  renderClaimantBlock,
  renderFactsList,
  renderRegulationsList,
  renderRespondentBlock,
} from "@/modules/tools/draftClaim/templates/common";
import type { TemplateInput } from "@/modules/tools/draftClaim/templates/types";

export function renderSusesoClaim(input: TemplateInput): string {
  return `# Reclamo formal — Superintendencia de Seguridad Social (SUSESO)

**Fecha:** ${formatChileanDate(input.generatedAt)}
${renderClaimantBlock(input.claimant)}

${renderRespondentBlock(input.respondent)}

## I. Hechos

${renderFactsList(input.facts)}

## II. Normativa invocada

${renderRegulationsList(input.invokedRegulations)}

## III. Petición concreta

${input.petition}

## IV. Canal SUSESO

Este reclamo se presenta ante la **Superintendencia de Seguridad Social**, organismo competente en salud previsional y seguridad social.

${LEGAL_NOTICE}`;
}
