// Plazos legales por regulador y tipo de caso.
//
// Estos valores son los plazos administrativos tipicos publicados por cada
// organismo. Cuando hay variaciones (ej: Ley 21.234 usa dias corridos no
// habiles), lo dejamos documentado en la nota.
//
// Fuente:
//   - CMF: portal de reclamos institucionales.
//   - SERNAC: ley 19.496 + 20.555.
//   - SUPEN: ley DL 3.500.
//   - SUSESO: ley 16.744 + reglamento.

import type { Regulator } from "@/modules/tools/classifyJurisdiction/types";

export interface DeadlineConfig {
  /** Plazo legal en dias habiles. null si no hay plazo administrativo estricto. */
  businessDays: number | null;
  /** Nota legal (ej: la base normativa o caveats). */
  note: string;
}

/** Plazos por defecto por regulador. Cubren el caso general. */
const DEFAULT_BY_REGULATOR: Record<Regulator, DeadlineConfig> = {
  CMF: {
    businessDays: 30,
    note: "Plazo administrativo tipico para reclamos en banca, fintec, valores y seguros.",
  },
  SERNAC: {
    businessDays: 30,
    note: "Plazo general bajo Ley 19.496 y SERNAC Financiero (Ley 20.555).",
  },
  SUPEN: {
    businessDays: 18,
    note: "Plazo tipico para reclamos contra AFP por cobros no informados.",
  },
  SUSESO: {
    businessDays: 15,
    note: "Plazo para reclamos en salud previsional y mutualidades.",
  },
  TRIBUNALES: {
    businessDays: null,
    note: "Casos judicializados o denuncias penales no tienen plazo administrativo. La accion penal por estafa prescribe en 5 anios (art. 94 CP). Igual conviene actuar a la brevedad.",
  },
};

/** Plazos especiales para tipos de caso especificos.
 *  Si matchea uno de estos, override del default por regulador. */
const SPECIAL_CASES: Array<{
  regulator: Regulator;
  caseTypeMatcher: RegExp;
  config: DeadlineConfig;
}> = [
  {
    regulator: "CMF",
    caseTypeMatcher: /fraude|tarjeta clonad|operacion desconocid/i,
    config: {
      businessDays: 90,
      // Nota: Ley 21.234 usa 90 DIAS CORRIDOS, no habiles. Para simplificar
      // mostramos 90 como referencia. En produccion deberiamos manejar
      // dias corridos como tipo separado.
      note: "Ley 21.234 — fraudes con tarjetas. El plazo legal es de 90 dias corridos desde el conocimiento del cargo desconocido (no dias habiles).",
    },
  },
  {
    regulator: "SERNAC",
    caseTypeMatcher: /certificado de deuda/i,
    config: {
      businessDays: 5,
      note: "Ley 21.398 art. 17 D — el proveedor debe entregar certificado de deuda en 5 dias habiles.",
    },
  },
];

/** Devuelve la configuracion de plazo para un caso. */
export function getDeadlineConfig(
  regulator: Regulator,
  caseType: string,
): DeadlineConfig {
  for (const special of SPECIAL_CASES) {
    if (
      special.regulator === regulator &&
      special.caseTypeMatcher.test(caseType)
    ) {
      return special.config;
    }
  }
  return DEFAULT_BY_REGULATOR[regulator];
}
