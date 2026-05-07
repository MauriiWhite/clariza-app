// Pagina /caso — wizard paso a paso del caso del ciudadano.
//
// Despues del chat, /chat redirige aca con los datos en sessionStorage.
// El wizard muestra:
//   1. Diagnostico — quien es el regulador y por que
//   2. Plazos — cuanto tiempo y los hitos criticos
//   3. Reclamo — el documento formal listo para descargar
//   4. Contactar — instrucciones para presentarlo + boton "Ya lo presente"
//   5. Caso cerrado — confirmacion + opcion recordatorios + volver inicio

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReclamoPreview } from "@/modules/claim/components/ReclamoPreview";
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
  { id: 1, label: "Diagnóstico" },
  { id: 2, label: "Plazos" },
  { id: 3, label: "Tu reclamo" },
  { id: 4, label: "Listo para copiar" },
  { id: 5, label: "Contactar" },
  { id: 6, label: "Cerrar caso" },
];

export default function CasoPage() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredCase | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  // Hydration safe — leer sessionStorage solo en cliente.
  useEffect(() => {
    const data = loadCase();
    setStored(data);
    setHydrated(true);
    if (data && data.completedSteps.length > 0) {
      const next = Math.max(...data.completedSteps) + 1;
      if (next <= STEPS.length) setCurrentStep(next);
    }
  }, []);

  const completeStep = (step: number) => {
    setStored((prev) => {
      if (!prev) return prev;
      const completedSteps = Array.from(
        new Set([...prev.completedSteps, step]),
      ).sort();
      const next = { ...prev, completedSteps };
      updateCase({ completedSteps });
      return next;
    });
  };

  const goNext = () => {
    completeStep(currentStep);
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const markContacted = () => {
    setStored((prev) => {
      if (!prev) return prev;
      const contactedAt = new Date().toISOString();
      const completedSteps = Array.from(
        new Set([...prev.completedSteps, 5]),
      ).sort();
      const next = { ...prev, contactedAt, completedSteps };
      updateCase({ contactedAt, completedSteps });
      return next;
    });
    setCurrentStep(6);
  };

  const handleNewCase = () => {
    clearCase();
    router.push("/chat");
  };

  // Loading state
  if (!hydrated) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-ink-3">Cargando tu caso...</p>
      </main>
    );
  }

  // No hay caso guardado
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
            Volver al chat
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

      {/* Stepper visual */}
      <div className="sticky top-14 z-40">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={stored.completedSteps}
        />
      </div>

      {/* Contenido del paso actual */}
      <div className="flex-1 mx-auto max-w-4xl w-full px-6 md:px-12 py-10 md:py-14">
        {currentStep === 1 && stored.diagnosis && (
          <StepLayout
            eyebrow="Paso 1 de 6"
            title="Esto fue lo que encontré sobre tu caso."
            body="Acá tenés el diagnóstico: a qué regulador corresponde, por qué, y la normativa que aplica."
            onNext={goNext}
            nextLabel="Ver mis plazos →"
          >
            <DiagnosisCard diagnosis={stored.diagnosis} />
          </StepLayout>
        )}

        {currentStep === 2 && stored.schedule && (
          <StepLayout
            eyebrow="Paso 2 de 6"
            title="Cuánto tiempo tenés para reclamar."
            body="Estos son los días hábiles que te quedan. Importante: si te pasás del plazo, perdés el derecho a reclamar formalmente."
            onPrev={goPrev}
            onNext={goNext}
            nextLabel={
              stored.claim ? "Ver mi reclamo →" : "Continuar →"
            }
          >
            <TimelineDeadlines schedule={stored.schedule} />
          </StepLayout>
        )}

        {currentStep === 3 && (
          <StepLayout
            eyebrow="Paso 3 de 6"
            title="Tu reclamo formal."
            body="Está listo para presentar. Acá ves el documento completo en formato PDF — descargalo si el portal del regulador acepta archivos adjuntos."
            onPrev={goPrev}
            onNext={goNext}
            nextLabel="Preparar para copiar →"
          >
            {stored.claim ? (
              <ReclamoPreview
                claim={stored.claim}
                onDownload={() =>
                  alert(
                    `Descarga del reclamo ${stored.claim?.id} (demo). En producción descargaría el PDF.`,
                  )
                }
              />
            ) : (
              <div className="rounded-lg border border-dashed border-border-strong bg-paper/50 p-10 text-center">
                <p className="font-serif text-xl text-ink mb-2">
                  Reclamo en preparación
                </p>
                <p className="text-sm text-ink-3 max-w-md mx-auto">
                  Volvé al chat y pedile a Clariza que arme el reclamo formal.
                </p>
                <div className="mt-6">
                  <Button href="/chat" variant="primary" size="md">
                    Volver al chat
                  </Button>
                </div>
              </div>
            )}
          </StepLayout>
        )}

        {currentStep === 4 && (
          <StepLayout
            eyebrow="Paso 4 de 6"
            title="Listo para copiar al formulario."
            body="Muchos portales no aceptan PDF y piden los datos en un formulario online. Acá los tenés separados — copiá cada campo con un toque y pegalo donde corresponda."
            onPrev={goPrev}
            onNext={goNext}
            nextLabel="¿Cómo contactar? →"
          >
            {stored.claim ? (
              <CopyReadyStep claim={stored.claim} />
            ) : (
              <div className="rounded-lg border border-dashed border-border-strong bg-paper/50 p-10 text-center">
                <p className="text-ink-3">
                  Necesitamos primero generar el reclamo formal. Volvé al chat.
                </p>
              </div>
            )}
          </StepLayout>
        )}

        {currentStep === 5 && stored.diagnosis && (
          <StepLayout
            eyebrow="Paso 5 de 6"
            title="Cómo presentar tu reclamo."
            body="Estos son los pasos concretos. Cuando lo hayas presentado, marcalo abajo y pasamos al cierre del caso."
            onPrev={goPrev}
          >
            <ContactStep
              diagnosis={stored.diagnosis}
              onContacted={markContacted}
            />
          </StepLayout>
        )}

        {currentStep === 6 && (
          <StepLayout
            eyebrow="Paso 6 de 6"
            title="Caso registrado. Ahora te toca esperar respuesta."
            body=""
          >
            <ClosedCaseCard
              stored={stored}
              onNewCase={handleNewCase}
            />
          </StepLayout>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------

interface StepLayoutProps {
  eyebrow: string;
  title: string;
  body?: string;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  nextLabel?: string;
}

function StepLayout({
  eyebrow,
  title,
  body,
  children,
  onPrev,
  onNext,
  nextLabel = "Continuar →",
}: StepLayoutProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight">
          {title}
        </h1>
        {body && (
          <p className="text-base text-ink-2 leading-relaxed max-w-2xl">
            {body}
          </p>
        )}
      </div>

      <div>{children}</div>

      <div className="flex items-center justify-between pt-6 border-t border-border">
        {onPrev ? (
          <Button onClick={onPrev} variant="ghost" size="md">
            ← Atrás
          </Button>
        ) : (
          <span />
        )}
        {onNext ? (
          <Button onClick={onNext} variant="primary" size="md">
            {nextLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard puede estar bloqueado en HTTP — fallback minimo.
      // Seleccionamos el texto en un textarea temporal.
      const ta = document.createElement("textarea");
      ta.value = text;
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
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copiar ${label}`}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors ${
        copied
          ? "bg-success/10 border-success/40 text-success"
          : "bg-paper border-border-strong text-ink hover:border-clay hover:text-clay"
      }`}
    >
      {copied ? "✓ Copiado" : "Copiar"}
    </button>
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
  return (
    <div className="rounded-lg border border-border bg-paper p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          {label}
        </p>
        <CopyButton text={value} label={label} />
      </div>
      {multiline ? (
        <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
          {value}
        </p>
      ) : (
        <p className="text-base text-ink">{value}</p>
      )}
    </div>
  );
}

function CopyReadyStep({
  claim,
}: {
  claim: NonNullable<StoredCase["claim"]>;
}) {
  const factsText = claim.facts
    .map((f, i) => `${i + 1}. ${f}`)
    .join("\n");
  const regsText = claim.invokedRegulations
    .map((r) => `- ${r}`)
    .join("\n");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <CopyField
          label="Reclamante"
          value={claim.claimant.fullName}
        />
        {claim.claimant.rut && (
          <CopyField label="RUT" value={claim.claimant.rut} />
        )}
        {claim.claimant.email && (
          <CopyField label="Email" value={claim.claimant.email} />
        )}
        <CopyField
          label="Entidad reclamada"
          value={claim.respondent.entity}
        />
        <CopyField
          label="Hechos del caso"
          value={factsText}
          multiline
        />
        <CopyField
          label="Normativa invocada"
          value={regsText}
          multiline
        />
        <CopyField
          label="Petición concreta"
          value={claim.petition}
          multiline
        />
      </div>

      <div className="rounded-lg border border-clay/30 bg-clay/5 p-5 mt-2">
        <p className="text-sm text-ink leading-relaxed">
          <strong>Tip:</strong> abrí el portal del regulador en otra
          pestaña y volvé acá para ir copiando campo por campo. Tus datos
          quedan en este dispositivo, no se envían a ningún lado hasta que
          vos los pegues en el portal oficial.
        </p>
      </div>
    </div>
  );
}

function ContactStep({
  diagnosis,
  onContacted,
}: {
  diagnosis: NonNullable<StoredCase["diagnosis"]>;
  onContacted: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg bg-paper border border-border p-6 md:p-8 flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-1">
            Canal oficial
          </p>
          <h3 className="font-serif text-2xl font-medium text-ink">
            {diagnosis.officialChannel.name}
          </h3>
        </div>

        <ol className="flex flex-col gap-4 text-base text-ink-2 leading-relaxed">
          <li className="flex gap-3">
            <span className="font-semibold text-clay shrink-0">1.</span>
            <span>
              Descargá el PDF de tu reclamo (paso anterior) o copiá su
              contenido.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-clay shrink-0">2.</span>
            <span>
              Entrá al portal oficial de{" "}
              <strong>{diagnosis.primaryRegulator}</strong> y subí el reclamo
              en la sección correspondiente.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-clay shrink-0">3.</span>
            <span>
              Guardá el comprobante o número de seguimiento que te de el
              portal.
            </span>
          </li>
          {diagnosis.notes && (
            <li className="flex gap-3 italic text-ink-3">
              <span aria-hidden className="text-clay shrink-0">·</span>
              <span>{diagnosis.notes}</span>
            </li>
          )}
        </ol>

        <a
          href={diagnosis.officialChannel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 self-start rounded-md bg-clay text-white px-6 py-3 font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Abrir portal {diagnosis.primaryRegulator}
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
      </div>

      <div className="rounded-lg border border-border bg-cream/50 p-6 md:p-8 flex flex-col items-center text-center gap-4">
        <p className="font-serif text-xl font-medium text-ink">
          ¿Ya presentaste tu reclamo?
        </p>
        <p className="text-sm text-ink-2 max-w-md leading-relaxed">
          Cuando lo hayas subido al portal de {diagnosis.primaryRegulator},
          marcalo acá y cerramos el caso.
        </p>
        <Button onClick={onContacted} variant="primary" size="lg">
          ✓ Ya lo presenté
        </Button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------

function ClosedCaseCard({
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
    <div className="flex flex-col gap-8">
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
            tienen que responderte en plazos definidos. Si no lo hacen,
            podés escalarlo.
          </p>
        )}
      </div>

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
