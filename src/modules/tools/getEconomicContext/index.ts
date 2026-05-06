// Tool getEconomicContext — indicadores economicos chilenos del dia.
//
// Fuente: API publica gratuita mindicador.cl (sin auth).
//
// Util para que el agente contextualice montos al ciudadano:
//   - "$14.200 mensuales" → "menos de media UF mensual"
//   - "$480.000" → "11.9 UF — monto considerable"
//   - "$320.000" → "$354 USD aproximadamente"
//
// Los chilenos entienden mejor en UF y referencia USD que en pesos planos
// para sumas grandes.

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import {
  convertAmount,
  getEconomicIndicators,
  interpretAmount,
} from "@/modules/regulations/lib/economicIndicators";

export const getEconomicContextTool = betaZodTool({
  name: "getEconomicContext",
  description:
    "Obtiene indicadores economicos chilenos del dia (UF, UTM, USD, EUR, IPC) desde la API publica mindicador.cl. USA esta tool cuando el caso involucre un monto en pesos significativo, para que tu respuesta al ciudadano contextualice el monto en UF y le ayude a dimensionar el problema. Si pasas convert_amount con un numero, te devuelvo tambien la conversion + una interpretacion ciudadana.",
  inputSchema: z.object({
    convert_amount: z
      .number()
      .positive()
      .optional()
      .describe(
        "Monto en pesos chilenos a convertir y contextualizar. Ej: 14200 para el caso de Maria.",
      ),
  }),
  run: async ({ convert_amount }) => {
    const indicators = await getEconomicIndicators();
    if (typeof convert_amount === "number") {
      const conversion = convertAmount(convert_amount, indicators);
      const interpretation = interpretAmount(convert_amount, indicators.uf);
      return JSON.stringify({
        indicators,
        conversion,
        interpretation,
      });
    }
    return JSON.stringify({ indicators });
  },
});
