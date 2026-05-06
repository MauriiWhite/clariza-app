// Template de reclamo formal a SUPEN (Superintendencia de Pensiones).
// Usado para casos de AFP, multifondos, comisiones de pensiones.

import {
  formatChileanDate,
  LEGAL_NOTICE,
  renderClaimantBlock,
  renderFactsList,
  renderRegulationsList,
  renderRespondentBlock,
} from "@/modules/tools/draftClaim/templates/common";
import type { TemplateInput } from "@/modules/tools/draftClaim/templates/types";

export function renderSupenClaim(input: TemplateInput): string {
  return `# Reclamo formal — Superintendencia de Pensiones (SUPEN)

**Fecha:** ${formatChileanDate(input.generatedAt)}
${renderClaimantBlock(input.claimant)}

${renderRespondentBlock(input.respondent)}

## I. Hechos

${renderFactsList(input.facts)}

## II. Normativa previsional invocada

${renderRegulationsList(input.invokedRegulations)}

## III. Petición concreta

${input.petition}

## IV. Canal SUPEN

Este reclamo se dirige a la **Superintendencia de Pensiones**, ente fiscalizador exclusivo de las Administradoras de Fondos de Pensiones.

${LEGAL_NOTICE}`;
}
