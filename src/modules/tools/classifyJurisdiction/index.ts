// Tool classifyJurisdiction — decide a que regulador corresponde el caso.
//
// Es la tool MAS DIFERENCIADORA del producto: ningun otro equipo del Lab
// hace derivacion multi-regulador (CMF/SERNAC/SUSESO/SUPEN/tribunales).
//
// Implementacion v0: motor basado en reglas explicitas (cero LLM aqui).
// Esto da:
//   - Decision deterministica → no alucinacion.
//   - Latencia ~0ms → respuesta instantanea en el agent loop.
//   - Auditable → cada regla esta documentada.
//
// Si el caso es ambiguo (ninguna regla aplica), devolvemos diagnostico
// `incompleto` con la lista de datos que faltan. El agente entonces le
// pregunta al ciudadano y vuelve a llamar la tool con info refinada.

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { classifyByRules } from "@/modules/tools/classifyJurisdiction/rules";

export const classifyJurisdictionTool = betaZodTool({
  name: "classifyJurisdiction",
  description:
    "Determina el regulador competente para el caso del ciudadano (CMF, SERNAC, SUSESO, SUPEN o tribunales) y si el caso es procedente para reclamo formal. USA esta tool DESPUES de extraer los hechos basicos del caso (entidad + producto + problema). Si la tool devuelve procedure='incompleto', pregunta al ciudadano por los datos faltantes y vuelve a llamarla.",
  inputSchema: z.object({
    entity: z
      .string()
      .min(2)
      .describe(
        "Entidad involucrada en el caso. Ej: 'AFP Habitat', 'Banco BICE', 'Hites', 'app PayDay'.",
      ),
    product: z
      .string()
      .min(2)
      .describe(
        "Producto o servicio financiero. Ej: 'cuenta obligatoria', 'tarjeta de credito', 'credito de consumo retail', 'cuenta digital'.",
      ),
    issue: z
      .string()
      .min(3)
      .describe(
        "Problema concreto del ciudadano en una frase. Ej: 'cobro indebido de comision', 'tarjeta clonada', 'clausula abusiva', 'fintech no autorizada'.",
      ),
    case_summary: z
      .string()
      .optional()
      .describe(
        "Contexto adicional del caso en lenguaje natural si lo tenes.",
      ),
  }),
  run: async ({ entity, product, issue, case_summary }) => {
    const diagnosis = classifyByRules({
      entity,
      product,
      issue,
      caseSummary: case_summary,
    });
    return JSON.stringify(diagnosis);
  },
});
