// Motor de reglas para clasificacion regulatoria.
//
// Filosofia: reglas explicitas y deterministas. Cero LLM en este paso —
// reduce alucinacion, hace la decision auditable y rapida.
//
// Las reglas se evaluan en ORDEN. La primera que matchea gana.
// Por eso van de mas especificas (fintech no autorizada, fraude tarjeta)
// a mas generales (consumidor general → SERNAC).

import type {
  RegulatoryDiagnosis,
  Severity,
} from "@/modules/tools/classifyJurisdiction/types";

export interface ClassifyInput {
  entity: string; // Ej: "AFP Habitat", "Banco BICE", "Hites", "PayDay"
  product: string; // Ej: "cuenta obligatoria", "tarjeta de credito"
  issue: string; // Ej: "cobro indebido", "tarjeta clonada", "fintech no autorizada"
  caseSummary?: string; // Contexto adicional libre
}

/** Normaliza para matching: lowercase + sin acentos. */
function n(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** Devuelve true si alguno de los patterns matchea el texto normalizado. */
function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

interface Rule {
  id: string;
  /** Si la regla aplica al input. Recibe campos ya normalizados. */
  applies: (n: { entity: string; product: string; issue: string; all: string }) => boolean;
  /** Diagnostico que se devuelve si la regla aplica. */
  diagnose: (input: ClassifyInput) => RegulatoryDiagnosis;
}

const RULES: Rule[] = [
  // ---------------------------------------------------------------
  // R1 — Fintech NO autorizada (estafa) → CMF (alerta) + TRIBUNALES (penal)
  // ---------------------------------------------------------------
  {
    id: "fintech_no_autorizada",
    applies: ({ all, issue }) =>
      matchesAny(all, [
        /no aparece en el registro/,
        /fintech ilegal/,
        /no autorizad/,
        /no esta registrada/,
        /no figura en cmf/,
      ]) ||
      matchesAny(issue, [/estafa.*app/, /fraude.*fintech/, /perdida total/]),
    diagnose: () => ({
      primaryRegulator: "CMF",
      secondaryRegulators: ["TRIBUNALES"],
      procedure: "procedente",
      severity: "alta",
      reasoning:
        "La entidad no aparece en el Registro de Prestadores Fintec de la CMF. Esto es probable estafa. Hay dos vias paralelas: alerta administrativa a CMF (para que la sancione) y denuncia penal por estafa (para intentar recuperar tu plata).",
      officialChannel: {
        name: "Alerta a la CMF + Denuncia PDI Cibercrimen",
        url: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43545.html",
      },
      notes:
        "La probabilidad de recuperar fondos en estafas a fintechs no autorizadas es baja. Aun asi conviene denunciar para evitar que sigan operando y para sumar al expediente penal.",
    }),
  },

  // ---------------------------------------------------------------
  // R2 — AFP / Pensiones → SUPEN
  // ---------------------------------------------------------------
  {
    id: "afp_supen",
    applies: ({ entity, product, all }) =>
      matchesAny(entity, [
        /afp/,
        /administradora.*pension/,
        /habitat|provida|cuprum|capital|modelo|planvital|uno/,
      ]) ||
      matchesAny(product, [
        /pension/,
        /cuenta obligatoria/,
        /cuenta voluntaria/,
        /apv/,
        /retiro programado/,
      ]) ||
      matchesAny(all, [/cobro afp/, /comision afp/, /comision adicional/]),
    diagnose: () => ({
      primaryRegulator: "SUPEN",
      procedure: "procedente",
      severity: "media",
      reasoning:
        "Tu caso involucra a una AFP. Las AFP son fiscalizadas por la Superintendencia de Pensiones (SUPEN), no por la CMF ni SERNAC. SUPEN puede ordenar restitucion y sancionar.",
      officialChannel: {
        name: "Portal de Reclamos SUPEN",
        url: "https://www.spensiones.cl/portal/orientacion/580/w3-channel.html",
      },
    }),
  },

  // ---------------------------------------------------------------
  // R3 — Salud previsional / Isapre / Mutualidad → SUSESO
  // ---------------------------------------------------------------
  {
    id: "salud_suseso",
    applies: ({ entity, product, all }) =>
      matchesAny(entity, [/isapre|colmena|cruz blanca|banmedica|nueva masvida|fonasa/]) ||
      matchesAny(product, [/plan de salud|salud previsional|licencia medica/]) ||
      matchesAny(all, [/licencia medica|subsidio incapacidad|isapre/]),
    diagnose: () => ({
      primaryRegulator: "SUSESO",
      procedure: "procedente",
      severity: "media",
      reasoning:
        "Tu caso involucra salud previsional o seguridad social. La Superintendencia de Seguridad Social (SUSESO) revisa estos casos, no SERNAC ni CMF.",
      officialChannel: {
        name: "Portal de Reclamos SUSESO",
        url: "https://www.suseso.cl/606/w3-channel.html",
      },
    }),
  },

  // ---------------------------------------------------------------
  // R4 — Fraude con tarjeta → CMF (Ley 21.234)
  // ---------------------------------------------------------------
  {
    id: "fraude_tarjeta_cmf",
    applies: ({ entity, all }) =>
      matchesAny(entity, [/banco/]) &&
      matchesAny(all, [
        /clonad/,
        /tarjeta robada/,
        /transaccion desconocida/,
        /movimiento que no reconozco/,
        /fraude/,
        /phishing/,
        /vishing/,
        /cargo no autorizado/,
      ]),
    diagnose: () => ({
      primaryRegulator: "CMF",
      procedure: "procedente",
      severity: "alta",
      reasoning:
        "Tu banco es fiscalizado por la CMF. Bajo la Ley 21.234, el emisor de la tarjeta debe restituir los fondos en operaciones desconocidas, salvo que pruebe dolo o culpa grave tuya. Que la transaccion tuviera 3DSecure no exime al banco.",
      officialChannel: {
        name: "Portal de Reclamos CMF",
        url: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43589.html",
      },
      notes:
        "Importante: tienes 90 dias corridos desde que tomaste conocimiento del cargo desconocido para reclamar bajo Ley 21.234.",
    }),
  },

  // ---------------------------------------------------------------
  // R5 — Banco con cobro indebido o clausula abusiva → CMF
  // ---------------------------------------------------------------
  {
    id: "banco_cmf",
    applies: ({ entity }) => matchesAny(entity, [/banco|bice|santander|estado|chile|bci|itau|scotiabank|security|bbva|falabella$/]),
    diagnose: () => ({
      primaryRegulator: "CMF",
      procedure: "procedente",
      severity: "media",
      reasoning:
        "Los bancos son fiscalizados por la CMF. Tu caso entra en su competencia.",
      officialChannel: {
        name: "Portal de Reclamos CMF",
        url: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43589.html",
      },
    }),
  },

  // ---------------------------------------------------------------
  // R6 — Retail / Crédito de consumo → SERNAC
  // ---------------------------------------------------------------
  {
    id: "retail_sernac",
    applies: ({ entity, product, all }) =>
      matchesAny(entity, [
        /hites|ripley|paris|falabella|abcdin|tricot|corona|johnson|la polar/,
      ]) ||
      matchesAny(product, [
        /credito de consumo retail|credito retail|cmr|cencosud/,
      ]) ||
      matchesAny(all, [
        /clausula abusiva/,
        /publicidad enganos/,
        /letra chica/,
        /cae diferente/,
      ]),
    diagnose: () => ({
      primaryRegulator: "SERNAC",
      procedure: "procedente",
      severity: "media",
      reasoning:
        "El retail financiero (casas comerciales y sus tarjetas) lo fiscaliza SERNAC bajo la Ley 19.496 y la Ley 20.555 de SERNAC Financiero. Tienen que informar el CAE real y no incluir clausulas abusivas.",
      officialChannel: {
        name: "Portal de Reclamos SERNAC",
        url: "https://www.sernac.cl/portal/619/w3-propertyvalue-7993.html",
      },
    }),
  },

  // ---------------------------------------------------------------
  // R7 — Improcedente: rechazo de credito sin causal abusiva
  // ---------------------------------------------------------------
  {
    id: "rechazo_credito_improcedente",
    applies: ({ all }) =>
      matchesAny(all, [
        /me rechazaron el credito/,
        /no me dieron el credito/,
        /negaron prestamo/,
      ]) &&
      !matchesAny(all, [/discrimin|abuso|sin explicacion/]),
    diagnose: () => ({
      primaryRegulator: "SERNAC",
      procedure: "improcedente",
      severity: "baja",
      reasoning:
        "Las instituciones financieras tienen libertad de evaluar el riesgo del solicitante (Ley 18.010). El rechazo per se no es reclamable, salvo que haya discriminacion arbitraria o falta total de explicacion. Lo que SI puedes hacer es pedir formalmente las razones del rechazo y, si no las dan, entonces si reclamar.",
      officialChannel: {
        name: "SERNAC — Consulta orientacion",
        url: "https://www.sernac.cl",
      },
    }),
  },
];

/** Catch-all si ninguna regla matchea: caso incompleto, pedir mas info. */
const FALLBACK_DIAGNOSIS = (severity: Severity = "baja"): RegulatoryDiagnosis => ({
  primaryRegulator: "SERNAC",
  procedure: "incompleto",
  severity,
  reasoning:
    "No tengo datos suficientes para identificar al regulador competente con certeza. Necesito saber: que entidad esta involucrada (banco, AFP, retail, fintech), que producto (cuenta, tarjeta, pension, credito) y que problema concreto.",
  officialChannel: {
    name: "Portal de Reclamos SERNAC",
    url: "https://www.sernac.cl",
  },
  missingData: ["entidad especifica", "tipo de producto financiero", "problema concreto"],
});

/**
 * Aplica las reglas en orden y devuelve el primer match.
 * Si ninguna regla aplica, devuelve diagnostico incompleto pidiendo mas datos.
 */
export function classifyByRules(input: ClassifyInput): RegulatoryDiagnosis {
  const normalized = {
    entity: n(input.entity),
    product: n(input.product),
    issue: n(input.issue),
    all: n(`${input.entity} ${input.product} ${input.issue} ${input.caseSummary ?? ""}`),
  };

  for (const rule of RULES) {
    if (rule.applies(normalized)) {
      return rule.diagnose(input);
    }
  }

  return FALLBACK_DIAGNOSIS();
}
