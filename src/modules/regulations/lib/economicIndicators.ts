// Cliente de indicadores economicos chilenos.
//
// Fuente: API publica gratuita mindicador.cl (sin auth, sin rate limit
// agresivo). Devuelve UF, dolar, euro, IPC, IVP del dia actual.
//
// Cache 6h en memoria — los indicadores cambian a lo sumo una vez al dia
// (UF cambia mensualmente, USD diariamente).

const MINDICADOR_API = "https://mindicador.cl/api";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas

interface MindicadorIndicator {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  fecha: string;
  valor: number;
}

interface MindicadorResponse {
  version: string;
  fecha: string;
  uf: MindicadorIndicator;
  dolar: MindicadorIndicator;
  euro: MindicadorIndicator;
  ipc: MindicadorIndicator;
  utm?: MindicadorIndicator;
  ivp?: MindicadorIndicator;
}

export interface EconomicIndicators {
  /** Fecha de los indicadores en ISO. */
  date: string;
  /** Pesos por una UF. */
  uf: number;
  /** Pesos por una UTM. */
  utm: number | null;
  /** Pesos por un dolar observado. */
  dolar: number;
  /** Pesos por un euro. */
  euro: number;
  /** IPC del mes anterior (%). */
  ipc: number;
}

interface CacheEntry {
  data: EconomicIndicators;
  expiresAt: number;
}

let cache: CacheEntry | null = null;

/** Fallback hardcoded si la API esta caida. Aproximaciones de mayo 2026. */
const FALLBACK: EconomicIndicators = {
  date: new Date().toISOString().slice(0, 10),
  uf: 40200,
  utm: 67429,
  dolar: 905,
  euro: 1059,
  ipc: 0.4,
};

/**
 * Devuelve los indicadores del dia actual.
 * Usa cache 6h y fallback hardcoded si la API falla.
 */
export async function getEconomicIndicators(): Promise<EconomicIndicators> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }

  try {
    const res = await fetch(MINDICADOR_API, {
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) {
      throw new Error(`mindicador respondio ${res.status}`);
    }
    const data = (await res.json()) as MindicadorResponse;

    const indicators: EconomicIndicators = {
      date: data.fecha,
      uf: data.uf?.valor ?? FALLBACK.uf,
      // mindicador raiz no incluye UTM — hay endpoint separado.
      // Para no doblar requests, intentamos pero caemos a fallback si no esta.
      utm: data.utm?.valor ?? null,
      dolar: data.dolar?.valor ?? FALLBACK.dolar,
      euro: data.euro?.valor ?? FALLBACK.euro,
      ipc: data.ipc?.valor ?? FALLBACK.ipc,
    };

    cache = {
      data: indicators,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
    return indicators;
  } catch (err) {
    console.warn(
      "[economicIndicators] mindicador.cl fallo, usando fallback:",
      err instanceof Error ? err.message : err,
    );
    return FALLBACK;
  }
}

/** Convierte un monto en pesos a UF, USD y EUR. */
export function convertAmount(amountPesos: number, indicators: EconomicIndicators) {
  return {
    pesos: amountPesos,
    uf: Number((amountPesos / indicators.uf).toFixed(2)),
    dolar: Number((amountPesos / indicators.dolar).toFixed(2)),
    euro: Number((amountPesos / indicators.euro).toFixed(2)),
  };
}

/** Devuelve una interpretacion ciudadana del monto convertido a UF. */
export function interpretAmount(amountPesos: number, ufValue: number): string {
  const uf = amountPesos / ufValue;
  if (uf < 0.1) return "monto pequeño (menos de 0.1 UF)";
  if (uf < 0.5) return "menos de media UF";
  if (uf < 1) return "menos de una UF mensual";
  if (uf < 5) return `aproximadamente ${uf.toFixed(1)} UF`;
  if (uf < 50) return `unos ${Math.round(uf)} UF — monto considerable`;
  return `${Math.round(uf)} UF — monto significativo, conviene actuar pronto`;
}
