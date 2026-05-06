// Tool draftClaim — genera el reclamo formal en markdown listo para enviar.
//
// Quinta y ultima tool del agente. Cierra el flujo end-to-end:
//   1. extractEvidence (vision, pendiente)
//   2. searchRegulation (corpus normativo)  → citas reales
//   3. classifyJurisdiction (rules)         → regulador correcto
//   4. calculateDeadlines (Nager + reglas)  → plazos habiles
//   5. draftClaim (templates)               → documento formal listo
//
// Recibe los datos estructurados ya armados por el agente y selecciona el
// template correspondiente al regulador. Cada regulador tiene formato propio
// (CMF, SERNAC, SUPEN, SUSESO, TRIBUNALES).

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { buildClaimDocument } from "@/modules/tools/draftClaim/services/builder";

const RegulatorEnum = z.enum([
  "CMF",
  "SERNAC",
  "SUPEN",
  "SUSESO",
  "TRIBUNALES",
]);

const ClaimantSchema = z.object({
  fullName: z.string().min(1),
  rut: z.string().optional(),
  email: z.string().email().optional(),
});

const RespondentSchema = z.object({
  entity: z.string().min(1),
  rut: z.string().optional(),
});

export const draftClaimTool = betaZodTool({
  name: "draftClaim",
  description:
    "Genera el reclamo formal en formato markdown listo para presentar al regulador. USA esta tool al final del flujo, despues de tener: classifyJurisdiction (regulator), searchRegulation (citas) y los hechos consolidados. Selecciona automaticamente el template correcto segun el regulador. Si el reclamante no proporciono nombre/RUT completo, igual genera el documento con placeholders y se lo avisas en tu respuesta.",
  inputSchema: z.object({
    regulator: RegulatorEnum.describe(
      "Regulador destino del reclamo, devuelto por classifyJurisdiction.",
    ),
    claimant: ClaimantSchema.describe(
      "Datos del ciudadano que presenta el reclamo. fullName es obligatorio (puede ser placeholder si no se conoce).",
    ),
    respondent: RespondentSchema.describe(
      "Datos de la entidad reclamada (banco, AFP, retail, fintech).",
    ),
    facts: z
      .array(z.string().min(5))
      .min(1)
      .describe(
        "Hechos numerados que sustentan el reclamo. Cada elemento es una frase concreta.",
      ),
    invoked_regulations: z
      .array(z.string().min(3))
      .min(1)
      .describe(
        "Citas normativas que respaldan el reclamo. Solo usar las devueltas por searchRegulation.",
      ),
    petition: z
      .string()
      .min(10)
      .describe(
        "Que pide concretamente el reclamante en una frase: restitucion, recalculo, cese de cobro, etc.",
      ),
  }),
  run: async ({
    regulator,
    claimant,
    respondent,
    facts,
    invoked_regulations,
    petition,
  }) => {
    const document = buildClaimDocument({
      regulator,
      claimant,
      respondent,
      facts,
      invokedRegulations: invoked_regulations,
      petition,
    });
    return JSON.stringify(document);
  },
});
