// Orquestador del builder de reclamos.
// Selecciona el template correcto segun el regulador y arma el ClaimDocument completo.

import type { Regulator } from "@/modules/tools/classifyJurisdiction/types";
import { renderCMFClaim } from "@/modules/tools/draftClaim/templates/cmf";
import { renderSernacClaim } from "@/modules/tools/draftClaim/templates/sernac";
import { renderSupenClaim } from "@/modules/tools/draftClaim/templates/supen";
import { renderSusesoClaim } from "@/modules/tools/draftClaim/templates/suseso";
import { renderTribunalesClaim } from "@/modules/tools/draftClaim/templates/tribunales";
import {
  generateClaimId,
} from "@/modules/tools/draftClaim/templates/common";
import type { TemplateInput } from "@/modules/tools/draftClaim/templates/types";
import type {
  ClaimDocument,
  Claimant,
  Respondent,
} from "@/modules/tools/draftClaim/types";

export interface BuildClaimInput {
  regulator: Regulator;
  claimant: Claimant;
  respondent: Respondent;
  facts: string[];
  invokedRegulations: string[];
  petition: string;
  /** Override opcional de la fecha. Default: hoy. */
  generatedAt?: string;
}

const TEMPLATES_BY_REGULATOR: Record<Regulator, (i: TemplateInput) => string> = {
  CMF: renderCMFClaim,
  SERNAC: renderSernacClaim,
  SUPEN: renderSupenClaim,
  SUSESO: renderSusesoClaim,
  TRIBUNALES: renderTribunalesClaim,
};

/** Construye un ClaimDocument completo a partir del input estructurado. */
export function buildClaimDocument(input: BuildClaimInput): ClaimDocument {
  const generatedAt = input.generatedAt ?? new Date().toISOString().slice(0, 10);
  const id = generateClaimId(input.regulator, generatedAt);

  const templateInput: TemplateInput = {
    generatedAt,
    claimant: input.claimant,
    respondent: input.respondent,
    facts: input.facts,
    invokedRegulations: input.invokedRegulations,
    petition: input.petition,
  };

  const renderTemplate = TEMPLATES_BY_REGULATOR[input.regulator];
  const documentMarkdown = renderTemplate(templateInput);

  return {
    id,
    regulator: input.regulator,
    generatedAt,
    claimant: input.claimant,
    respondent: input.respondent,
    facts: input.facts,
    invokedRegulations: input.invokedRegulations,
    petition: input.petition,
    documentMarkdown,
  };
}
