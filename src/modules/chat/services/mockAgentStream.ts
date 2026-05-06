// Mock del agente para desarrollar UI sin depender del backend real.
// Reproduce el Caso 1 — Maria Rojas (jubilada · AFP comision adicional · SUPEN)
// tal como esta documentado en CASES.md.
//
// Importante: emite los outputs de tool_result en las shapes CANONICAS
// (RegulatoryDiagnosis, DeadlineSchedule, ClaimDocument) para que
// extractArtifacts.ts pueda derivarlos identico que del agente real.

import type { ConsoleEvent } from "@/modules/agent/types";
import { mockClaims } from "@/modules/claim/utils/mocks";
import {
  mockDiagnoses,
  mockSchedules,
} from "@/modules/diagnosis/utils/mocks";

interface MockEvent {
  delayMs: number;
  event: ConsoleEvent;
}

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
            sourceId: "DL_3500",
            source: "DL 3.500",
            article: "Art. 29",
            relevance: "alta",
            url: "https://www.bcn.cl/leychile/navegar?idNorma=7147",
          },
          {
            sourceId: "CIRCULAR_SUPEN_1998",
            source: "Circular SUPEN",
            article: "N° 1.998",
            relevance: "media",
            url: "https://www.spensiones.cl/portal/institucional/594/w3-channel.html",
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
      // Shape canonica: RegulatoryDiagnosis
      output: mockDiagnoses.caso1,
    },
  },
  {
    delayMs: 600,
    event: {
      type: "tool_call",
      name: "calculateDeadlines",
      input: {
        regulator: "SUPEN",
        case_type: "cobro indebido AFP",
        fact_date: "2026-05-02",
      },
    },
  },
  {
    delayMs: 900,
    event: {
      type: "tool_result",
      name: "calculateDeadlines",
      // Shape canonica: DeadlineSchedule
      output: mockSchedules.caso1,
    },
  },
  {
    delayMs: 1200,
    event: {
      type: "assistant",
      text: "Tu caso es competencia de la Superintendencia de Pensiones (SUPEN), no de la CMF. Tenés 18 días hábiles para reclamar formalmente — el plazo vence el 30 de mayo de 2026.\n\nLas AFP solo pueden cobrar comisión por administrar tu cuenta. Si no te explicaron este cobro adicional, podés exigir devolución bajo el DL 3.500 Art. 29.\n\nDejame armarte el reclamo formal.",
    },
  },
  {
    delayMs: 700,
    event: {
      type: "tool_call",
      name: "draftClaim",
      input: {
        regulator: "SUPEN",
        claimant: { fullName: "María Rojas" },
        respondent: { entity: "AFP Habitat" },
      },
    },
  },
  {
    delayMs: 1000,
    event: {
      type: "tool_result",
      name: "draftClaim",
      // Shape canonica: ClaimDocument
      output: mockClaims.caso1,
    },
  },
  {
    delayMs: 800,
    event: {
      type: "assistant",
      text: "Listo. El reclamo formal está abajo, dirigido a SUPEN, citando DL 3.500 Art. 29 y la Circular SUPEN 1.998. Cuando lo descargues podés presentarlo en el portal oficial.",
    },
  },
];

/**
 * Devuelve un AsyncGenerator de eventos del agente, simulando el stream real.
 * Llama callback opcional onEvent en cada emision.
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
