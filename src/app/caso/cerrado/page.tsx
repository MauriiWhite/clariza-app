// Paso 3 — Cerrado.
// Confirmacion de que el ciudadano presento el reclamo + opcion de
// recordatorios + volver al inicio o empezar otro reclamo.

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CaseShell } from "@/modules/case/components/CaseShell";
import {
  clearCase,
  loadCase,
  type StoredCase,
} from "@/modules/case/services/caseStorage";
import { Button } from "@/modules/core/design-system/Button";
import { ReminderForm } from "@/modules/reminders/components/ReminderForm";

const ES_CL_DATE: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

export default function CerradoPage() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredCase | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadCase();
    setStored(data);
    setHydrated(true);
  }, []);

  const handleNewCase = () => {
    clearCase();
    router.push("/chat");
  };

  if (!hydrated) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-ink-3">Cargando tu caso...</p>
      </main>
    );
  }

  if (!stored) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 py-32 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
          No hay un caso para cerrar.
        </h1>
        <Button href="/chat" variant="primary" size="lg">
          Empezar un reclamo →
        </Button>
      </main>
    );
  }

  const formattedContactedDate = stored.contactedAt
    ? new Date(stored.contactedAt).toLocaleDateString("es-CL", ES_CL_DATE)
    : null;

  // Fecha legal de vencimiento del regulador (si la tenemos del schedule).
  // Eso es CUANDO la respuesta deberia llegar — la usamos para proyectar al
  // futuro, no dejar al ciudadano sin saber que esperar.
  const formattedDeadline = stored.schedule?.deadlineDate
    ? new Date(stored.schedule.deadlineDate).toLocaleDateString(
        "es-CL",
        ES_CL_DATE,
      )
    : null;

  // Fecha sugerida de seguimiento — 7 dias antes del vencimiento legal,
  // alineada con el primer recordatorio que mandariamos por email.
  const followupDate =
    stored.schedule?.deadlineDate &&
    (() => {
      const deadline = new Date(stored.schedule.deadlineDate);
      const followup = new Date(deadline);
      followup.setDate(followup.getDate() - 7);
      return followup.toLocaleDateString("es-CL", ES_CL_DATE);
    })();

  return (
    <CaseShell currentStep={3} completedSteps={[1, 2]}>
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-clay">
            Paso 3 de 3 · Cerrado
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight">
            Caso registrado. Ahora a esperar respuesta.
          </h1>
        </header>

        {/* Card confirmacion */}
        <div className="rounded-lg bg-paper border border-border p-8 md:p-10 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-serif text-2xl md:text-3xl font-medium text-ink">
              ¡Listo, tu reclamo está presentado!
            </p>
            {formattedContactedDate && (
              <p className="text-sm text-ink-3">
                Marcado como presentado el {formattedContactedDate}
              </p>
            )}
          </div>

          {stored.diagnosis && (
            <p className="text-base text-ink-2 max-w-md leading-relaxed">
              Tu caso quedó en manos de{" "}
              <strong>{stored.diagnosis.primaryRegulator}</strong>. Por ley
              tienen plazos para responderte. Si no lo hacen, puedes escalarlo.
            </p>
          )}
        </div>

        {/* Linea de tiempo proyectada — fechas concretas para que el
            ciudadano sepa QUE esperar y CUANDO. Solo cuando hay schedule. */}
        {(formattedDeadline || followupDate) && (
          <div className="rounded-lg border border-clay/30 bg-clay/5 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-clay mb-3">
              Próximas fechas
            </p>
            <div className="flex flex-col gap-3 text-sm">
              {followupDate && (
                <div className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-clay mt-2 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink">{followupDate}</p>
                    <p className="text-ink-2 leading-relaxed">
                      Si no hay respuesta a 7 días del vencimiento, te
                      sugerimos hacer seguimiento al regulador.
                    </p>
                  </div>
                </div>
              )}
              {formattedDeadline && (
                <div className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-error mt-2 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink">
                      {formattedDeadline}
                    </p>
                    <p className="text-ink-2 leading-relaxed">
                      Vencimiento legal del plazo para que{" "}
                      {stored.diagnosis?.primaryRegulator ?? "el regulador"} te
                      responda. Pasada esa fecha sin respuesta, puedes
                      escalar.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recordatorios — ReminderForm inline (antes era link a /preview).
            La feature en si esta detras de Supabase Auth via magic link. */}
        <div className="rounded-lg border border-border bg-cream/50 p-6 md:p-8">
          <p className="font-serif text-lg font-medium text-ink mb-2">
            ¿Quieres que te avisemos antes de que se venza el plazo?
          </p>
          <p className="text-sm text-ink-2 leading-relaxed mb-5">
            Si activas recordatorios por email te mandamos avisos a 7, 3 y 1
            día del vencimiento legal del regulador.
          </p>
          <ReminderForm />
        </div>

        {/* Acciones de cierre */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Button onClick={handleNewCase} variant="primary" size="lg">
            Empezar otro reclamo
          </Button>
          <Link
            href="/"
            className="text-sm font-medium text-ink-2 hover:text-ink"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </CaseShell>
  );
}
