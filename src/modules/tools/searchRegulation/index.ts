// Tool searchRegulation — primera tool real del agente Clariza.
//
// Permite a Claude consultar el corpus regulatorio chileno (Ley 19.496,
// Ley 20.555, Ley 21.234, Ley 21.521, Ley 21.680, Ley 21.398, DL 3.500,
// Circular SUPEN) y obtener citas verificables con link a la fuente oficial.
//
// La salida de esta tool es la UNICA fuente de verdad regulatoria que el
// agente puede usar en su respuesta — no debe inventar normativa fuera de
// lo que devuelve esta tool. Esto es lo que hace cumplir el sub-check A6
// (sin alucinaciones) de la rubrica del Lab.

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { searchCorpus } from "@/modules/regulations/services/search";

const RegulatorySourceEnum = z.enum([
  "DL_3500",
  "LEY_19496",
  "LEY_20555",
  "LEY_21398",
  "LEY_21234",
  "LEY_21521",
  "LEY_21680",
  "CIRCULAR_SUPEN_1998",
]);

export const searchRegulationTool = betaZodTool({
  name: "searchRegulation",
  description:
    "Busca normativa chilena vigente que aplique al caso del ciudadano. Devuelve citas con link a la fuente oficial (BCN o CMF). USA esta tool ANTES de afirmar cualquier articulo, ley o circular: solo puedes citar normativa que esta tool devuelva en este turno. Cubre: DL 3.500 (AFP), Ley 19.496 (consumidor), Ley 20.555 (SERNAC Financiero), Ley 21.398 (Pro Consumidor), Ley 21.234 (fraudes con tarjetas), Ley 21.521 (Fintec), Ley 21.680 (REDEC) y circulares SUPEN.",
  inputSchema: z.object({
    query: z
      .string()
      .min(3)
      .describe(
        "Consulta en lenguaje natural sobre el caso. Ej: 'comision adicional AFP cobro no autorizado', 'tarjeta clonada banco devolucion', 'clausula abusiva credito retail'.",
      ),
    sources: z
      .array(RegulatorySourceEnum)
      .optional()
      .describe(
        "Filtra por fuentes especificas. Si no se especifica, busca en todo el corpus.",
      ),
    max_results: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("Maximo de citas a devolver. Default 5."),
  }),
  run: async ({ query, sources, max_results }) => {
    const citations = searchCorpus(query, {
      sources,
      maxResults: max_results,
    });

    if (citations.length === 0) {
      return JSON.stringify({
        citations: [],
        note: "No se encontro normativa relevante en el corpus para esa consulta. Reformula con keywords mas especificos (entidad, producto, problema).",
      });
    }

    return JSON.stringify({ citations });
  },
});
