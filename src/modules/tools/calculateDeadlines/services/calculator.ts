// Calculadora de dias habiles chilenos.
//
// Reglas:
//   - Sabado y domingo NO cuentan como dia habil.
//   - Feriados oficiales chilenos NO cuentan.
//   - El primer dia habil despues del hecho cuenta como dia 1.
//
// Las fechas se manejan en ISO (YYYY-MM-DD) sin tiempo, asumiendo zona Chile (UTC-4/-3).
// No usamos timezone manipulations: tratamos cada fecha como un dia natural.

/** Crea un Date a partir de un ISO YYYY-MM-DD interpretandolo como medianoche local. */
function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Formatea un Date a ISO YYYY-MM-DD usando los componentes locales. */
function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** True si el ISO cae en sabado o domingo. */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/** True si el ISO esta en la lista de feriados. */
function isHoliday(iso: string, holidays: Set<string>): boolean {
  return holidays.has(iso);
}

/** True si la fecha es dia habil (no fin de semana ni feriado). */
export function isBusinessDay(iso: string, holidays: Set<string>): boolean {
  const d = parseISODate(iso);
  if (isWeekend(d)) return false;
  return !isHoliday(iso, holidays);
}

/** Suma N dias habiles a una fecha base. Devuelve el ISO resultante. */
export function addBusinessDays(
  startISO: string,
  businessDaysToAdd: number,
  holidays: Set<string>,
): string {
  let date = parseISODate(startISO);
  let added = 0;

  while (added < businessDaysToAdd) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const iso = formatISODate(date);
    if (isBusinessDay(iso, holidays)) {
      added++;
    }
  }

  return formatISODate(date);
}

/** Cuenta cuantos dias habiles transcurrieron entre dos fechas (exclusivo del start, inclusivo del end). */
export function countBusinessDaysBetween(
  startISO: string,
  endISO: string,
  holidays: Set<string>,
): number {
  let date = parseISODate(startISO);
  const end = parseISODate(endISO);
  let count = 0;

  while (date < end) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const iso = formatISODate(date);
    if (isBusinessDay(iso, holidays)) {
      count++;
    }
  }

  return count;
}

/** Hoy como ISO YYYY-MM-DD usando zona local del servidor.
 *  En Vercel los servers son UTC, asi que convertimos a Chile (UTC-4 estandar). */
export function todayISO(): string {
  // Para hackathon mantenemos simple: usamos la fecha local del servidor
  // donde corra. En produccion deberiamos forzar zona America/Santiago.
  return formatISODate(new Date());
}
