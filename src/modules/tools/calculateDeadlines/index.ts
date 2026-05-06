// Tool calculateDeadlines — calcula plazos habiles del caso del ciudadano.
//
// Cuarto pilar del diferenciador: monitor de plazos habiles + hitos para
// recordatorios. Sin esto el ciudadano pierde casos por no saber cuanto
// tiempo le queda.
//
// Implementacion:
//   - Plazo legal por regulador + caso → deadlines-config.ts
//   - Feriados oficiales chilenos → API publica Nager.Date + fallback hardcoded
//   - Calculadora dias habiles → calculator.ts
//   - Schedule completo con hitos → schedule.ts
//
// La tool es asincrona porque consulta la API de feriados (con cache 24h).

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { buildDeadlineSchedule } from "@/modules/tools/calculateDeadlines/services/schedule";

const RegulatorEnum = z.enum([
  "CMF",
  "SERNAC",
  "SUPEN",
  "SUSESO",
  "TRIBUNALES",
]);

export const calculateDeadlinesTool = betaZodTool({
  name: "calculateDeadlines",
  description:
    "Calcula los plazos habiles que tiene el ciudadano para presentar su reclamo. Usa feriados oficiales chilenos (API publica Nager.Date) y los plazos legales tipicos por regulador. USA esta tool DESPUES de classifyJurisdiction, pasandole el regulator que devolvio + tipo de caso + fecha del hecho. Si TRIBUNALES sin plazo, devuelve null en los campos de tiempo.",
  inputSchema: z.object({
    regulator: RegulatorEnum.describe(
      "Regulador competente, devuelto por classifyJurisdiction.",
    ),
    case_type: z
      .string()
      .min(3)
      .describe(
        "Tipo de caso en lenguaje natural. Ej: 'cobro indebido AFP', 'fraude tarjeta clonada', 'clausula abusiva', 'certificado de deuda'.",
      ),
    fact_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe(
        "Fecha del hecho que dispara el plazo en ISO YYYY-MM-DD. Si no se pasa, se asume hoy.",
      ),
  }),
  run: async ({ regulator, case_type, fact_date }) => {
    const schedule = await buildDeadlineSchedule({
      regulator,
      caseType: case_type,
      factDate: fact_date,
    });
    return JSON.stringify(schedule);
  },
});
