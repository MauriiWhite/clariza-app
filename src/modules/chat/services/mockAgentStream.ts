// Mock del agente para desarrollar UI sin depender del backend real.
// Reproduce el Caso 1 — Maria Rojas (jubilada · AFP comision adicional · SUPEN)
// tal como esta documentado en CASES.md.
//
// Cuando el endpoint /api/agent este listo, lo reemplazamos por un cliente SSE
// real. La firma de getAgentStream() se mantiene para que la UI no cambie.

import type { ConsoleEvent } from "@/modules/agent/types";

interface MockEvent {
  delayMs: number;
  event: ConsoleEvent;
}

// Eventos del Caso 1 con timing aproximado al de la demo.
// Cada delayMs es desde el evento anterior, no acumulado.
const CASO_MARIA: MockEvent[] = [
  {
    delayMs: 0,
    event: {
      type: "user",
      text: "Mi AFP me descuenta 14.200 hace 3 meses, no entiendo por qué.",
    },
  },
  {
    delayMs: 600,
    event: {
      type: "assistant",
      text: "Voy a revisar el descuento que mencionas. Empiezo por extraer los datos del caso.",
    },
  },
  {
    delayMs: 700,
    event: {
      type: "tool_call",
      name: "extractEvidence",
      input: { source: "liquidacion-pension.pdf" },
    },
  },
  {
    delayMs: 900,
    event: {
      type: "tool_result",
      name: "extractEvidence",
      output: {
        entity: "AFP Habitat",
        product: "Cuenta obligatoria",
        chargeAmount: 14200,
        chargeFrequency: "mensual",
        chargeStart: "2026-01",
        evidenceQuality: "alta",
      },
    },
  },
  {
    delayMs: 600,
    event: {
      type: "tool_call",
      name: "searchRegulation",
      input: { query: "comision adicional AFP cobro no autorizado" },
    },
  },
  {
    delayMs: 1100,
    event: {
      type: "tool_result",
      name: "searchRegulation",
      output: {
        citations: [
          {
            source: "DL 3.500",
            article: "Art. 29",
            relevance: "alta",
          },
          {
            source: "Circular SUPEN 1.998",
            relevance: "media",
          },
        ],
      },
    },
  },
  {
    delayMs: 600,
    event: {
      type: "tool_call",
      name: "classifyJurisdiction",
      input: {
        entity: "AFP Habitat",
        product: "Cuenta obligatoria",
        issue: "Cobro no autorizado",
      },
    },
  },
  {
    delayMs: 800,
    event: {
      type: "tool_result",
      name: "classifyJurisdiction",
      output: {
        regulator: "SUPEN",
        applicable: "procedente",
        severity: "media",
        reason:
          "AFP Habitat es una administradora de fondos de pensiones, fiscalizada por la Superintendencia de Pensiones (SUPEN), no por CMF.",
      },
    },
  },
  {
    delayMs: 600,
    event: {
      type: "tool_call",
      name: "calculateDeadlines",
      input: {
        regulator: "SUPEN",
        caseType: "cobro-indebido",
        firstChargeDate: "2026-01-15",
      },
    },
  },
  {
    delayMs: 900,
    event: {
      type: "tool_result",
      name: "calculateDeadlines",
      output: {
        totalBusinessDays: 18,
        elapsedBusinessDays: 0,
        remainingBusinessDays: 18,
        deadlineDate: "2026-05-30",
        criticalMilestones: ["7 dias antes", "3 dias antes", "1 dia antes"],
      },
    },
  },
  {
    delayMs: 1500,
    event: {
      type: "assistant",
      text: "Tu caso es competencia de la Superintendencia de Pensiones (SUPEN), no de la CMF. Tenés 18 días hábiles para reclamar formalmente — el plazo vence el 30 de mayo de 2026.\n\nLas AFP solo pueden cobrar comisión por administrar tu cuenta. Si no te explicaron este cobro adicional, podés exigir devolución bajo el DL 3.500 Art. 29.\n\nCuando quieras, te genero el reclamo formal listo para enviar.",
    },
  },
];

/**
 * Devuelve un AsyncIterable de eventos del agente, simulando el stream real.
 * Llama callback opcional onEvent en cada emision (ergonomia tipo runner).
 */
export async function* getAgentStream(
  onEvent?: (event: ConsoleEvent) => void,
): AsyncGenerator<ConsoleEvent> {
  for (const { delayMs, event } of CASO_MARIA) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    onEvent?.(event);
    yield event;
  }
}
