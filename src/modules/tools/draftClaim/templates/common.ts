// Helpers compartidos entre templates de reclamo.

import type {
  Claimant,
  Respondent,
} from "@/modules/tools/draftClaim/types";

/** Formatea fecha ISO YYYY-MM-DD a "6 de mayo de 2026". */
export function formatChileanDate(iso: string): string {
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${months[(m ?? 1) - 1]} de ${y}`;
}

/** ID de documento estable basado en regulador y timestamp. */
export function generateClaimId(regulator: string, generatedAt: string): string {
  const datePart = generatedAt.replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `CLM-${regulator}-${datePart}-${random}`;
}

/** Renderiza identificacion del reclamante con fallback si faltan datos. */
export function renderClaimantBlock(c: Claimant): string {
  const lines = [`**Reclamante:** ${c.fullName || "[Nombre del reclamante]"}`];
  if (c.rut) lines.push(`**RUT:** ${c.rut}`);
  if (c.email) lines.push(`**Contacto:** ${c.email}`);
  return lines.join("  \n");
}

/** Renderiza identificacion de la entidad reclamada. */
export function renderRespondentBlock(r: Respondent): string {
  const lines = [`**Entidad reclamada:** ${r.entity}`];
  if (r.rut) lines.push(`**RUT entidad:** ${r.rut}`);
  return lines.join("  \n");
}

/** Renderiza una lista numerada de hechos. */
export function renderFactsList(facts: string[]): string {
  return facts.map((f, i) => `${i + 1}. ${f}`).join("\n");
}

/** Renderiza la lista de normativa invocada como bullets en negrita. */
export function renderRegulationsList(regulations: string[]): string {
  return regulations.map((r) => `- **${r}**`).join("\n");
}

/** Aviso legal estandar al pie del documento — recordatorio de revision humana. */
export const LEGAL_NOTICE = `
---

> **Nota:** Este documento fue generado por Clariza como borrador asistido. Antes de presentarlo formalmente, revisá que los datos personales y los hechos sean exactos. Clariza no constituye asesoría legal definitiva.
`.trim();
