// Cliente de feriados oficiales chilenos.
//
// Fuente primaria: API publica gratuita Nager.Date (sin auth, sin rate-limit
// agresivo, sin necesidad de API key). Devuelve feriados por anio + pais.
//
// Fuente fallback: lista hardcoded de feriados chilenos 2025-2027 sacada
// del sitio oficial www.feriadoschilenos.cl. Se usa si Nager falla o si
// el calculo se hace offline durante demo en Espacio Riesco.

const NAGER_API_BASE = "https://date.nager.at/api/v3/PublicHolidays";

/** Feriados oficiales chilenos hardcoded (fallback offline).
 *  Cubre 2025-2027. Si Clariza vive mas alla deberiamos extender o
 *  resolver siempre via API. */
const FALLBACK_HOLIDAYS_CL: string[] = [
  // 2025
  "2025-01-01",
  "2025-04-18",
  "2025-04-19",
  "2025-05-01",
  "2025-05-21",
  "2025-06-20",
  "2025-06-29",
  "2025-07-16",
  "2025-08-15",
  "2025-09-18",
  "2025-09-19",
  "2025-10-12",
  "2025-10-31",
  "2025-11-01",
  "2025-11-16",
  "2025-12-08",
  "2025-12-14",
  "2025-12-25",
  // 2026
  "2026-01-01",
  "2026-04-03",
  "2026-04-04",
  "2026-05-01",
  "2026-05-21",
  "2026-06-21",
  "2026-06-29",
  "2026-07-16",
  "2026-08-15",
  "2026-09-18",
  "2026-09-19",
  "2026-10-12",
  "2026-10-31",
  "2026-11-01",
  "2026-12-08",
  "2026-12-25",
  // 2027
  "2027-01-01",
  "2027-03-26",
  "2027-03-27",
  "2027-05-01",
  "2027-05-21",
  "2027-06-21",
  "2027-06-29",
  "2027-07-16",
  "2027-08-15",
  "2027-09-18",
  "2027-09-19",
  "2027-10-12",
  "2027-10-31",
  "2027-11-01",
  "2027-12-08",
  "2027-12-25",
];

interface NagerHoliday {
  date: string; // ISO YYYY-MM-DD
  localName: string;
  name: string;
  countryCode: string;
}

/** Cache en memoria por anio para no pegarle a la API en cada calculo. */
const holidayCache = new Map<number, string[]>();

/**
 * Devuelve la lista de feriados oficiales chilenos para un anio dado, en formato ISO.
 * Usa cache + Nager.Date + fallback hardcoded en cascada.
 */
export async function getChileanHolidays(year: number): Promise<string[]> {
  const cached = holidayCache.get(year);
  if (cached) return cached;

  try {
    const url = `${NAGER_API_BASE}/${year}/CL`;
    const res = await fetch(url, {
      // Nota: en Next.js server este fetch es cache-aware.
      // 24h es razonable para feriados (no cambian).
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) {
      throw new Error(`Nager API respondio ${res.status}`);
    }

    const data = (await res.json()) as NagerHoliday[];
    const holidays = data.map((h) => h.date);
    holidayCache.set(year, holidays);
    return holidays;
  } catch (err) {
    // Fallback: filtramos hardcoded por anio.
    console.warn(
      `[holidays] Nager fallo, usando fallback hardcoded para ${year}:`,
      err instanceof Error ? err.message : err,
    );
    const fallback = FALLBACK_HOLIDAYS_CL.filter((d) =>
      d.startsWith(`${year}-`),
    );
    holidayCache.set(year, fallback);
    return fallback;
  }
}

/**
 * Devuelve feriados de los anios cubiertos por un rango de fechas.
 * Util cuando un plazo cruza fin de año.
 */
export async function getHolidaysForDateRange(
  startISO: string,
  endISO: string,
): Promise<string[]> {
  const startYear = Number(startISO.slice(0, 4));
  const endYear = Number(endISO.slice(0, 4));
  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) years.push(y);

  const all = await Promise.all(years.map(getChileanHolidays));
  return all.flat();
}
