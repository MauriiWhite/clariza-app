// Paso 2 — Acción.
// Toda la info para presentar el reclamo: diagnostico + plazos + reclamo +
// como contactar al regulador. Boton al final para marcar como presentado
// y avanzar al paso 3.

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CaseShell } from "@/modules/case/components/CaseShell";
import {
  loadCase,
  type StoredCase,
  updateCase,
} from "@/modules/case/services/caseStorage";
import { Button } from "@/modules/core/design-system/Button";
import { DiagnosisCard } from "@/modules/diagnosis/components/DiagnosisCard";
import { TimelineDeadlines } from "@/modules/diagnosis/components/TimelineDeadlines";

export default function AccionPage() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredCase | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => {
    const data = loadCase();
    setStored(data);
    setHydrated(true);
  }, []);

  const markContacted = () => {
    const contactedAt = new Date().toISOString();
    updateCase({
      contactedAt,
      completedSteps: Array.from(
        new Set([...(stored?.completedSteps ?? []), 2]),
      ),
    });
    router.push("/caso/cerrado");
  };

  if (!hydrated) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-ink-3">Cargando tu caso...</p>
      </main>
    );
  }

  if (!stored || (!stored.diagnosis && !stored.schedule)) {
    return <NoActiveCase />;
  }

  return (
    <CaseShell currentStep={2} completedSteps={[1]}>
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-clay">
            Paso 2 de 3 · Acción
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight">
            Aquí tienes todo para presentar tu reclamo.
          </h1>
          <p className="text-base text-ink-2 leading-relaxed max-w-2xl">
            Diagnóstico, plazos y el reclamo listo. Cuando lo presentes en el
            portal del regulador, márcalo abajo y cerramos el caso.
          </p>
        </header>

        {/* Cards de diagnostico + plazos */}
        {stored.diagnosis && stored.schedule && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DiagnosisCard diagnosis={stored.diagnosis} />
            <TimelineDeadlines schedule={stored.schedule} />
          </div>
        )}
        {stored.diagnosis && !stored.schedule && (
          <DiagnosisCard diagnosis={stored.diagnosis} />
        )}

        {/* Reclamo formal */}
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
              Si el portal acepta archivos, descarga el PDF. Si pide los datos
              en un formulario online, expande "Listo para copiar" abajo.
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
                onClick={() => setShowCopy((v) => !v)}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border-strong bg-paper px-5 py-3 text-sm font-semibold text-ink hover:border-clay hover:text-clay transition-colors"
              >
                {showCopy ? "Ocultar" : "Listo para copiar"} ↓
              </button>
            </div>

            {showCopy && <CopyFields claim={stored.claim} />}
          </section>
        )}

        {/* Como contactar — accion principal */}
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
                  Abre el portal oficial de{" "}
                  <strong>{stored.diagnosis.primaryRegulator}</strong>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-clay shrink-0">2.</span>
                <span>
                  Sube el PDF o pega los datos del reclamo en su formulario.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-clay shrink-0">3.</span>
                <span>Guarda el comprobante o número de seguimiento.</span>
              </li>
              {stored.diagnosis.notes && (
                <li className="flex gap-3 italic text-ink-3 pt-1">
                  <span aria-hidden className="text-clay shrink-0">·</span>
                  <span>{stored.diagnosis.notes}</span>
                </li>
              )}
            </ol>

            <a
              href={stored.diagnosis.officialChannel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 self-start rounded-md bg-clay text-white px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
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
          </section>
        )}

        {/* CTA siguiente paso — sticky bottom solido (no glass) */}
        <div className="sticky bottom-4 z-30 mt-4">
          <div className="rounded-lg bg-paper border-2 border-ink p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_12px_40px_rgba(26,31,46,0.18)]">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-clay">
                ¿Ya presentaste el reclamo?
              </p>
              <p className="font-serif text-base md:text-lg font-medium text-ink leading-tight">
                Marcalo como presentado para cerrar el caso.
              </p>
            </div>
            <Button
              onClick={markContacted}
              variant="primary"
              size="lg"
              className="shrink-0 whitespace-nowrap"
            >
              ✓ Ya lo presenté →
            </Button>
          </div>
        </div>
      </div>
    </CaseShell>
  );
}

// ---------------------------------------------------------------------------

function NoActiveCase() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 py-32 text-center">
      <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight max-w-2xl">
        No hay un caso activo todavía.
      </h1>
      <p className="text-ink-2 max-w-md leading-relaxed">
        Empieza una conversación con Clariza para que te ayude a preparar tu
        reclamo paso a paso.
      </p>
      <Button href="/chat" variant="primary" size="lg">
        Empezar mi reclamo →
      </Button>
    </main>
  );
}

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
