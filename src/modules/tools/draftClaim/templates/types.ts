// Input compartido por todos los templates de reclamo.

import type {
  Claimant,
  Respondent,
} from "@/modules/tools/draftClaim/types";

export interface TemplateInput {
  generatedAt: string; // ISO YYYY-MM-DD
  claimant: Claimant;
  respondent: Respondent;
  facts: string[];
  invokedRegulations: string[];
  petition: string;
}
