// Mock dinamico del agente para desarrollo + fallback cuando no hay API key.
//
// Mapea keywords del mensaje del ciudadano a uno de los 4 casos de CASES.md
// y reproduce su flujo. Asi el demo muestra casos distintos segun lo que
// escribe el usuario, en vez de siempre el Caso 1.
//
// Mapeo:
//   - AFP, pension, jubilad      → caso1 (Maria · SUPEN)
//   - retail, hites, ripley, CAE → caso2 (Camila · SERNAC)
//   - tarjeta, fraude, clonad    → caso3 (Patricio · CMF)
//   - fintech, app, payday       → caso4 (Javiera · CMF + Tribunales)
//
// Outputs en shapes CANONICAS (RegulatoryDiagnosis, DeadlineSchedule,
// ClaimDocument) reusando los mocks tipados de cada modulo.

import type { ConsoleEvent } from "@/modules/agent/types";
import { mockClaims } from "@/modules/claim/utils/mocks";
import {
  mockDiagnoses,
  mockSchedules,
} from "@/modules/diagnosis/utils/mocks";

type CaseId = "caso1" | "caso2" | "caso3" | "caso4";

interface CaseMatcher {
  id: CaseId;
  patterns: RegExp[];
}

const CASE_MATCHERS: CaseMatcher[] = [
  {
    id: "caso4",
    patterns: [
      /fintech/i,
      /\bapp\b/i,
      /payday/i,
      /no autorizad/i,
      /no aparec/i,
      /redes sociales/i,
    ],
  },
  {
    id: "caso3",
    patterns: [
      /tarjeta/i,
      /clonad/i,
      /fraude/i,
      /banco.*devolver/i,
      /bice|santander|estado|chile|bci|itau/i,
      /movimiento.*no reconozc/i,
    ],
  },
  {
    id: "caso2",
    patterns: [
      /retail/i,
      /hites|ripley|paris|falabella|tienda/i,
      /credito de consumo/i,
      /cae diferente/i,
      /cae 38/i,
      /cuota.*alta/i,
      /clausula abusiv/i,
    ],
  },
  {
    id: "caso1",
    patterns: [
      /afp/i,
      /pension/i,
      /jubilad/i,
      /habitat|provida|cuprum|capital|modelo|planvital/i,
      /comision adicional/i,
    ],
  },
];

/** Detecta a que caso del CASES.md mapea el mensaje del ciudadano. */
function detectCase(userMessage: string): CaseId {
  for (const matcher of CASE_MATCHERS) {
    if (matcher.patterns.some((p) => p.test(userMessage))) {
      return matcher.id;
    }
  }
  return "caso1";
}

/** Datos de cada caso para construir el stream dinamicamente. */
const CASE_DATA: Record<
  CaseId,
  {
    persona: string;
    extractEvidence: Record<string, unknown>;
    searchQuery: string;
    citations: Array<{
      sourceId: string;
      source: string;
      article?: string;
      relevance: string;
      url: string;
    }>;
    classifyInput: { entity: string; product: string; issue: string };
    deadlineInput: { regulator: string; case_type: string; fact_date: string };
    finalAssistant: string;
    closingAssistant: string;
  }
> = {
  caso1: {
    persona: "María",
    extractEvidence: {
      entity: "AFP Habitat",
      product: "Cuenta obligatoria",
      chargeAmount: 14200,
      chargeFrequency: "mensual",
      chargeStart: "2026-01",
      evidenceQuality: "alta",
    },
    searchQuery: "comision adicional AFP cobro no autorizado",
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
    classifyInput: {
      entity: "AFP Habitat",
      product: "Cuenta obligatoria",
      issue: "Cobro no autorizado",
    },
    deadlineInput: {
      regulator: "SUPEN",
      case_type: "cobro indebido AFP",
      fact_date: "2026-05-02",
    },
    finalAssistant:
      "Tu caso es competencia de la Superintendencia de Pensiones (SUPEN), no de la CMF. Tenés 18 días hábiles para reclamar formalmente.\n\nLas AFP solo pueden cobrar comisión por administrar tu cuenta. Si no te explicaron este cobro adicional, podés exigir devolución bajo el DL 3.500 Art. 29.\n\nDejame armarte el reclamo formal.",
    closingAssistant:
      "Listo. El reclamo formal está abajo, dirigido a SUPEN, citando DL 3.500 Art. 29 y la Circular SUPEN 1.998. Cuando lo descargues podés presentarlo en el portal oficial.",
  },
  caso2: {
    persona: "Camila",
    extractEvidence: {
      entity: "Hites",
      product: "Crédito de consumo retail",
      chargeAmount: 1500000,
      chargeFrequency: "unica",
      evidenceQuality: "alta",
    },
    searchQuery: "credito retail CAE diferente clausula abusiva",
    citations: [
      {
        sourceId: "LEY_19496",
        source: "Ley 19.496",
        article: "Art. 17",
        relevance: "alta",
        url: "https://www.bcn.cl/leychile/navegar?idNorma=61438",
      },
      {
        sourceId: "LEY_20555",
        source: "Ley 20.555",
        article: "Art. 17 B",
        relevance: "alta",
        url: "https://www.bcn.cl/leychile/navegar?idNorma=1024266",
      },
    ],
    classifyInput: {
      entity: "Hites",
      product: "Credito de consumo",
      issue: "CAE distinta a la pactada",
    },
    deadlineInput: {
      regulator: "SERNAC",
      case_type: "clausula abusiva credito retail",
      fact_date: "2026-04-15",
    },
    finalAssistant:
      "Tu caso es competencia de SERNAC Financiero. La Ley 20.555 obliga al proveedor a informar el CAE real antes de firmar; si te dijeron 28% verbalmente y el contrato dice 38%, podés exigir recálculo.",
    closingAssistant:
      "Listo, el reclamo formal va a SERNAC pidiendo recálculo de la deuda al CAE pactado y devolución de cobros excedentes.",
  },
  caso3: {
    persona: "Patricio",
    extractEvidence: {
      entity: "Banco BICE",
      product: "Tarjeta de crédito",
      chargeAmount: 480000,
      chargeFrequency: "unica",
      evidenceQuality: "alta",
    },
    searchQuery: "fraude tarjeta clonada banco devolucion",
    citations: [
      {
        sourceId: "LEY_21234",
        source: "Ley 21.234",
        article: "Art. 5",
        relevance: "alta",
        url: "https://www.bcn.cl/leychile/navegar?idNorma=1147562",
      },
    ],
    classifyInput: {
      entity: "Banco BICE",
      product: "Tarjeta de credito",
      issue: "Tarjeta clonada con transacciones desconocidas",
    },
    deadlineInput: {
      regulator: "CMF",
      case_type: "fraude tarjeta clonada",
      fact_date: "2026-02-20",
    },
    finalAssistant:
      "Tu caso es competencia de la CMF. Bajo la Ley 21.234, el banco emisor debe restituir los $480.000 salvo que pruebe dolo o culpa grave tuya. Que la transacción tuviera 3DSecure no exime al banco.\n\nTenés 90 días corridos desde que tomaste conocimiento del cargo. Vamos a presentarlo formalmente.",
    closingAssistant:
      "El reclamo formal va a CMF, citando Ley 21.234 Art. 5, pidiendo restitución completa de los fondos.",
  },
  caso4: {
    persona: "Javiera",
    extractEvidence: {
      entity: "PayDay",
      product: "Cuenta digital",
      chargeAmount: 320000,
      chargeFrequency: "unica",
      evidenceQuality: "media",
    },
    searchQuery: "fintech no autorizada CMF registro estafa",
    citations: [
      {
        sourceId: "LEY_21521",
        source: "Ley 21.521",
        article: "Art. 5",
        relevance: "alta",
        url: "https://www.bcn.cl/leychile/navegar?idNorma=1187323",
      },
    ],
    classifyInput: {
      entity: "PayDay (app no autorizada)",
      product: "Cuenta digital",
      issue: "Fintech no aparece en registro CMF, posible estafa",
    },
    deadlineInput: {
      regulator: "CMF",
      case_type: "fintech no autorizada estafa",
      fact_date: "2026-04-20",
    },
    finalAssistant:
      "Esto es grave. La empresa 'PayDay' NO está en el registro oficial de la CMF — opera ilegalmente bajo la Ley 21.521 Fintec. Hay dos vías paralelas:\n\n1. Alerta administrativa a la CMF para que la sancione.\n2. Denuncia penal a la PDI Cibercrimen por estafa (Art. 467 CP).\n\nLa probabilidad de recuperar fondos es baja, pero conviene denunciar para evitar que sigan operando.",
    closingAssistant:
      "Te dejo la alerta CMF lista. Para la denuncia penal recomiendo asistir directamente a la PDI Brigada del Cibercrimen.",
  },
};

interface MockEvent {
  delayMs: number;
  event: ConsoleEvent;
}

/** Construye los eventos del flujo para un caso dado. */
function buildEventsForCase(caseId: CaseId): MockEvent[] {
  const data = CASE_DATA[caseId];
  const diagnosis = mockDiagnoses[caseId];
  const schedule = mockSchedules[caseId];
  const claim = mockClaims[caseId]; // puede ser undefined para caso3 / caso4

  const events: MockEvent[] = [
    {
      delayMs: 600,
      event: {
        type: "assistant",
        text: `Voy a revisar tu caso. Primero extraigo los datos clave.`,
      },
    },
    {
      delayMs: 700,
      event: {
        type: "tool_call",
        name: "extractEvidence",
        input: { contextHint: "documento del ciudadano" },
      },
    },
    {
      delayMs: 900,
      event: {
        type: "tool_result",
        name: "extractEvidence",
        output: data.extractEvidence,
      },
    },
    {
      delayMs: 600,
      event: {
        type: "tool_call",
        name: "searchRegulation",
        input: { query: data.searchQuery },
      },
    },
    {
      delayMs: 1100,
      event: {
        type: "tool_result",
        name: "searchRegulation",
        output: { citations: data.citations },
      },
    },
    {
      delayMs: 600,
      event: {
        type: "tool_call",
        name: "classifyJurisdiction",
        input: data.classifyInput,
      },
    },
    {
      delayMs: 800,
      event: {
        type: "tool_result",
        name: "classifyJurisdiction",
        output: diagnosis,
      },
    },
    {
      delayMs: 600,
      event: {
        type: "tool_call",
        name: "calculateDeadlines",
        input: data.deadlineInput,
      },
    },
    {
      delayMs: 900,
      event: {
        type: "tool_result",
        name: "calculateDeadlines",
        output: schedule,
      },
    },
    {
      delayMs: 1200,
      event: {
        type: "assistant",
        text: data.finalAssistant,
      },
    },
  ];

  // Si hay claim mock, agregamos draftClaim al final.
  if (claim) {
    events.push(
      {
        delayMs: 700,
        event: {
          type: "tool_call",
          name: "draftClaim",
          input: {
            regulator: diagnosis.primaryRegulator,
            claimant: { fullName: data.persona },
            respondent: { entity: data.classifyInput.entity },
          },
        },
      },
      {
        delayMs: 1000,
        event: {
          type: "tool_result",
          name: "draftClaim",
          output: claim,
        },
      },
      {
        delayMs: 800,
        event: {
          type: "assistant",
          text: data.closingAssistant,
        },
      },
    );
  }

  return events;
}

/**
 * Devuelve un AsyncGenerator de eventos del agente, simulando el stream real.
 * El caso se elige segun keywords del mensaje del ciudadano.
 *
 * @param userMessage Mensaje del ciudadano (default: vacio = caso1)
 * @param onEvent Callback opcional al emitir cada evento
 */
export async function* getAgentStream(
  userMessage = "",
  onEvent?: (event: ConsoleEvent) => void,
): AsyncGenerator<ConsoleEvent> {
  const caseId = detectCase(userMessage);
  const events = buildEventsForCase(caseId);

  for (const { delayMs, event } of events) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    onEvent?.(event);
    yield event;
  }
}
