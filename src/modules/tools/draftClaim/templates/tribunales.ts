// Template de denuncia formal en sede penal / Tribunales.
// Usado para casos con dolo o estafa (ej: fintech no autorizada que se quedó con la plata).

import {
  formatChileanDate,
  LEGAL_NOTICE,
  renderClaimantBlock,
  renderFactsList,
  renderRegulationsList,
  renderRespondentBlock,
} from "@/modules/tools/draftClaim/templates/common";
import type { TemplateInput } from "@/modules/tools/draftClaim/templates/types";

export function renderTribunalesClaim(input: TemplateInput): string {
  return `# Denuncia formal — Ministerio Público / Tribunales

**Fecha:** ${formatChileanDate(input.generatedAt)}
${renderClaimantBlock(input.claimant)}

${renderRespondentBlock(input.respondent)}

## I. Hechos

${renderFactsList(input.facts)}

## II. Tipificación legal invocada

${renderRegulationsList(input.invokedRegulations)}

## III. Petición concreta

${input.petition}

## IV. Canal de presentación

Esta denuncia puede presentarse ante:
- **Brigada del Cibercrimen de la PDI** (para delitos informáticos y estafas digitales).
- **Ministerio Público / Fiscalía local** mediante denuncia directa.

Se recomienda acompañar la denuncia administrativa paralela ante la CMF si la entidad reclamada no está autorizada.

${LEGAL_NOTICE}`;
}
