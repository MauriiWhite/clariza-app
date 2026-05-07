// Storage de caso entre /chat y /caso usando sessionStorage.
//
// Cuando el ciudadano termina el flujo en /chat, guardamos diagnosis +
// schedule + claim en sessionStorage y navegamos a /caso. Alli el
// stepper los lee y muestra paso a paso.
//
// sessionStorage en vez de localStorage: el caso vive solo durante la
// pestaña abierta. Cuando el ciudadano cierra el browser, se borra.
// Esto refuerza la promesa de privacidad ("tus datos quedan local").

"use client";

import type {
  DeadlineSchedule,
  RegulatoryDiagnosis,
} from "@/modules/diagnosis/types";
import type { ClaimDocument } from "@/modules/tools/draftClaim/types";

const STORAGE_KEY = "clariza:case:current";

export interface StoredCase {
  /** Cuando se cerro el flujo del chat (ISO). */
  createdAt: string;
  diagnosis: RegulatoryDiagnosis | null;
  schedule: DeadlineSchedule | null;
  claim: ClaimDocument | null;
  /** Pasos del wizard que ya completo el ciudadano. */
  completedSteps: number[];
  /** Si el ciudadano marco que ya presento el reclamo. */
  contactedAt: string | null;
}

export function saveCase(
  partial: Pick<StoredCase, "diagnosis" | "schedule" | "claim">,
): void {
  if (typeof window === "undefined") return;
  const stored: StoredCase = {
    createdAt: new Date().toISOString(),
    diagnosis: partial.diagnosis,
    schedule: partial.schedule,
    claim: partial.claim,
    completedSteps: [],
    contactedAt: null,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // sessionStorage puede estar bloqueado en modo privado — ignoramos.
  }
}

export function loadCase(): StoredCase | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCase;
  } catch {
    return null;
  }
}

export function updateCase(patch: Partial<StoredCase>): StoredCase | null {
  const current = loadCase();
  if (!current) return null;
  const next = { ...current, ...patch };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearCase(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
