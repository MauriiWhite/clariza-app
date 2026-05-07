// Pagina /caso — wizard de 2 pasos consolidados.
//
// Flujo total del ciudadano (3 pasos visibles en el stepper):
//   1. Chat (vivido en /chat)
//   2. Acción → toda la info para presentar el reclamo en una vista
//   3. Cerrado → confirmación cuando el ciudadano marcó como presentado

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Stepper } from "@/modules/case/components/Stepper";
import {
  clearCase,
  loadCase,
  type StoredCase,
  updateCase,
} from "@/modules/case/services/caseStorage";
import { Button } from "@/modules/core/design-system/Button";
import { DiagnosisCard } from "@/modules/diagnosis/components/DiagnosisCard";
import { TimelineDeadlines } from "@/modules/diagnosis/components/TimelineDeadlines";

const STEPS = [
  { id: 1, label: "Chat" },
  { id: 2, label: "Acción" },
  { id: 3, label: "Cerrado" },
];

export default function CasoPage() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredCase | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadCase();
    setStored(data);
    setHydrated(true);
  }, []);

  // Estado actual del flujo total: si contactedAt existe → paso 3, sino paso 2.
  const currentStep = stored?.contactedAt ? 3 : 2;
  const completedSteps = stored?.contactedAt ? [1, 2] : [1];

  const markContacted = () => {
    setStored((prev) => {
      if (!prev) return prev;
      const contactedAt = new Date().toISOString();
      const next = {
        ...prev,
        contactedAt,
        completedSteps: Array.from(new Set([...prev.completedSteps, 2])),
      };
      updateCase({
        contactedAt,
        completedSteps: next.completedSteps,
      });
      return next;
    });
  };

  const handleNewCase = () => {
    clearCase();
    router.push("/chat");
  };

  // Loading
  if (!hydrated) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-ink-3">Cargando tu caso...</p>
      </main>
    );
  }

  // Sin caso guardado
  if (!stored || (!stored.diagnosis && !stored.schedule)) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 py-32 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight max-w-2xl">
          No hay un caso activo todavía.
        </h1>
        <p className="text-ink-2 max-w-md leading-relaxed">
          Empezá una conversación con Clariza para que te ayude a armar tu
          reclamo paso a paso.
        </p>
        <Button href="/chat" variant="primary" size="lg">
          Empezar mi reclamo →
        </Button>
      </main>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar glass */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto max-w-4xl px-6 md:px-12 h-14 flex items-center justify-between gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-strong bg-paper/80 hover:bg-paper text-sm font-medium text-ink transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Volver
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
            <span className="font-serif text-base font-medium tracking-tight">
              Clariza
            </span>
          </div>

          <span className="text-xs text-ink-3 hidden md:block">
            Paso {currentStep} de {STEPS.length}
          </span>
        </div>
      </header>

      {/* Stepper visible 3 pasos del flujo total */}
      <div className="sticky top-14 z-40">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Contenido del paso actual */}
      <div className="flex-1 mx-auto max-w-4xl w-full px-6 md:px-12 py-8 md:py-12">
        {currentStep === 2 && (
          <ActionStep stored={stored} onContacted={markContacted} />
        )}

        {currentStep === 3 && (
          <ClosedStep stored={stored} onNewCase={handleNewCase} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ActionStep({
  stored,
  onContacted,
}: {
  stored: StoredCase;
  onContacted: () => void;
}) {
  const [showCopyFields, setShowCopyFields] = useState(false);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Paso 2 de 3 · Acción
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight">
          Acá tenés todo para presentar tu reclamo.
        </h1>
        <p className="text-base text-ink-2 leading-relaxed max-w-2xl">
          Diagnóstico, plazos y el reclamo listo. Cuando lo presentes en el
          portal del regulador, marcalo abajo y cerramos el caso.
        </p>
      </header>

      {/* Cards de diagnostico + plazos lado a lado en desktop */}
      {stored.diagnosis && stored.schedule && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DiagnosisCard diagnosis={stored.diagnosis} />
          <TimelineDeadlines schedule={stored.schedule} />
        </div>
      )}
      {stored.diagnosis && !stored.schedule && (
        <DiagnosisCard diagnosis={stored.diagnosis} />
      )}

      {/* Reclamo formal: 2 opciones — descargar PDF o copiar campos */}
      {stored.claim && (
        <section
          aria-label="Tu reclamo formal"
          className="rounded-lg bg-paper border border-border p-6 md:p-8 flex flex-col gap-5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-1">
              Tu reclamo formal
            </p>
            <h2 className="font-serif text-2xl font-medium text-ink">
              Listo para presentar
            </h2>
          </div>

          <p className="text-sm text-ink-2 leading-relaxed">
            Si el portal del regulador acepta archivos, descargá el PDF.
            Si pide los datos en un formulario online, expandí "Listo para
            copiar" y copiá campo por campo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() =>
                alert(`Descarga del reclamo ${stored.claim?.id} (demo).`)
              }
              className="inline-flex items-center justify-center gap-2 rounded-md bg-ink text-cream px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar PDF
            </button>
            <button
              type="button"
              onClick={() => setShowCopyFields((v) => !v)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border-strong bg-paper px-5 py-3 text-sm font-semibold text-ink hover:border-clay hover:text-clay transition-colors"
            >
              {showCopyFields ? "Ocultar" : "Listo para copiar"} ↓
            </button>
          </div>

          {showCopyFields && <CopyFields claim={stored.claim} />}
        </section>
      )}

      {/* Acción principal: contactar al regulador */}
      {stored.diagnosis && (
        <section
          aria-label="Contactar al regulador"
          className="rounded-lg border border-clay/40 bg-clay/5 p-6 md:p-8 flex flex-col gap-5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-clay mb-1">
              Cómo contactar
            </p>
            <h2 className="font-serif text-2xl font-medium text-ink">
              {stored.diagnosis.officialChannel.name}
            </h2>
          </div>

          <ol className="flex flex-col gap-3 text-sm text-ink-2 leading-relaxed">
            <li className="flex gap-3">
              <span className="font-semibold text-clay shrink-0">1.</span>
              <span>
                Abrí el portal oficial de{" "}
                <strong>{stored.diagnosis.primaryRegulator}</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-clay shrink-0">2.</span>
              <span>
                Subí el PDF o pegá los datos del reclamo en su formulario.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-clay shrink-0">3.</span>
              <span>Guardá el comprobante o número de seguimiento.</span>
            </li>
            {stored.diagnosis.notes && (
              <li className="flex gap-3 italic text-ink-3 pt-1">
                <span aria-hidden className="text-clay shrink-0">·</span>
                <span>{stored.diagnosis.notes}</span>
              </li>
            )}
          </ol>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={stored.diagnosis.officialChannel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-clay text-white px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Abrir portal {stored.diagnosis.primaryRegulator}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
            <Button onClick={onContacted} variant="primary" size="md">
              ✓ Ya lo presenté
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function CopyFields({
  claim,
}: {
  claim: NonNullable<StoredCase["claim"]>;
}) {
  const factsText = claim.facts.map((f, i) => `${i + 1}. ${f}`).join("\n");
  const regsText = claim.invokedRegulations.map((r) => `- ${r}`).join("\n");

  return (
    <div className="flex flex-col gap-3 pt-3 border-t border-border">
      <CopyField label="Reclamante" value={claim.claimant.fullName} />
      {claim.claimant.rut && (
        <CopyField label="RUT" value={claim.claimant.rut} />
      )}
      {claim.claimant.email && (
        <CopyField label="Email" value={claim.claimant.email} />
      )}
      <CopyField label="Entidad reclamada" value={claim.respondent.entity} />
      <CopyField label="Hechos" value={factsText} multiline />
      <CopyField label="Normativa invocada" value={regsText} multiline />
      <CopyField label="Petición concreta" value={claim.petition} multiline />
    </div>
  );
}

function CopyField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-md border border-border bg-cream/40 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          {label}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copiar ${label}`}
          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
            copied
              ? "bg-success/10 border-success/40 text-success"
              : "bg-paper border-border-strong text-ink hover:border-clay hover:text-clay"
          }`}
        >
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>
      {multiline ? (
        <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
          {value}
        </p>
      ) : (
        <p className="text-sm text-ink">{value}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function ClosedStep({
  stored,
  onNewCase,
}: {
  stored: StoredCase;
  onNewCase: () => void;
}) {
  const formattedDate = stored.contactedAt
    ? new Date(stored.contactedAt).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Paso 3 de 3 · Cerrado
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight">
          Caso registrado. Ahora a esperar respuesta.
        </h1>
      </header>

      {/* Card de confirmacion */}
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
          {formattedDate && (
            <p className="text-sm text-ink-3">
              Marcado como presentado el {formattedDate}
            </p>
          )}
        </div>

        {stored.diagnosis && (
          <p className="text-base text-ink-2 max-w-md leading-relaxed">
            Tu caso quedó en manos de{" "}
            <strong>{stored.diagnosis.primaryRegulator}</strong>. Por ley
            tienen plazos para responderte. Si no lo hacen, podés escalarlo.
          </p>
        )}
      </div>

      {/* Recordatorios opcionales */}
      <div className="rounded-lg border border-border bg-cream/50 p-6 md:p-8">
        <p className="font-serif text-lg font-medium text-ink mb-2">
          ¿Querés que te avisemos antes de que se venza el plazo?
        </p>
        <p className="text-sm text-ink-2 leading-relaxed mb-4">
          Si activás recordatorios por email te mandamos avisos a 7, 3 y 1
          día del vencimiento legal del regulador.
        </p>
        <Link
          href="/preview/reminders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-clay hover:underline"
        >
          Activar recordatorios
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Acciones de cierre */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
        <Button onClick={onNewCase} variant="primary" size="lg">
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
  );
}
