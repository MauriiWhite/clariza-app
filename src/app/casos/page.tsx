// Pagina /casos — galeria publica de los 4 casos demo.
// Misma identidad visual que el landing (cream, serif, glass, clay).
// Sirve como prueba social del producto y guion para la demo del Lab.
//
// Para sandbox de desarrollo aislado de los componentes ver /preview/diagnosis.

"use client";

import Link from "next/link";
import { useState } from "react";
import { ReclamoPreview } from "@/modules/claim/components/ReclamoPreview";
import { mockClaims } from "@/modules/claim/utils/mocks";
import { Button } from "@/modules/core/design-system/Button";
import { DiagnosisCard } from "@/modules/diagnosis/components/DiagnosisCard";
import { TimelineDeadlines } from "@/modules/diagnosis/components/TimelineDeadlines";
import {
  mockDiagnoses,
  mockSchedules,
} from "@/modules/diagnosis/utils/mocks";

interface CaseMeta {
  id: string;
  persona: string;
  shortLabel: string;
  age: number;
  city: string;
  problem: string;
  emoji: string;
}

const CASES: CaseMeta[] = [
  {
    id: "caso1",
    persona: "María Rojas",
    shortLabel: "Jubilada · AFP",
    age: 67,
    city: "Maipú",
    problem: "Mi AFP me descuenta $14.200 hace 3 meses, no entiendo por qué.",
    emoji: "👵",
  },
  {
    id: "caso2",
    persona: "Camila Soto",
    shortLabel: "Emprendedora · Retail",
    age: 34,
    city: "Renca",
    problem:
      "Firmé un crédito en Hites y me cobran una CAE distinta a la pactada.",
    emoji: "👩‍💼",
  },
  {
    id: "caso3",
    persona: "Patricio Núñez",
    shortLabel: "Contador · Banco",
    age: 58,
    city: "La Florida",
    problem:
      "Me clonaron la tarjeta y mi banco no quiere devolverme los $480.000.",
    emoji: "💳",
  },
  {
    id: "caso4",
    persona: "Javiera Mella",
    shortLabel: "Estudiante · Fintech",
    age: 22,
    city: "Concepción",
    problem:
      "Transferí $320.000 a una app que decía dar rentabilidad y ahora no me responde.",
    emoji: "🎓",
  },
];

export default function CasosPage() {
  const [selectedId, setSelectedId] = useState<string>("caso1");

  const meta = CASES.find((c) => c.id === selectedId)!;
  const diagnosis = mockDiagnoses[selectedId];
  const schedule = mockSchedules[selectedId];
  const claim = mockClaims[selectedId]; // Solo casos 1 y 2 tienen claim mock por ahora.

  return (
    <main className="flex-1">
      {/* Top bar glass — mismo patron que landing y /chat */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto max-w-6xl px-6 md:px-12 h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-strong bg-paper/80 hover:bg-paper text-sm font-medium text-ink transition-colors"
            aria-label="Volver al inicio"
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

          <Button href="/chat" variant="primary" size="md">
            Probar mi caso
          </Button>
        </div>
      </header>

      {/* Hero editorial */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:px-12 md:pt-24">
        <div className="flex flex-col gap-6 max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-ink-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
            Casos de ejemplo
          </p>
          <h1 className="font-serif text-[40px] md:text-[64px] font-medium leading-[1] tracking-[-0.02em]">
            Cuatro personas. Cuatro reguladores. <span className="text-clay">Un solo flujo.</span>
          </h1>
          <p className="text-lg leading-relaxed text-ink-2 max-w-2xl">
            Estos son casos reales que Clariza puede resolver. Toca uno para
            ver el diagnóstico, los plazos hábiles y el reclamo formal listo
            para enviar.
          </p>
        </div>
      </section>

      {/* Selector de casos — pills clay */}
      <section className="mx-auto max-w-6xl px-6 pb-8 md:px-12">
        <div
          role="tablist"
          aria-label="Casos de ejemplo"
          className="flex flex-wrap gap-3"
        >
          {CASES.map((c) => {
            const isActive = c.id === selectedId;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedId(c.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md border transition-colors text-sm md:text-base ${
                  isActive
                    ? "bg-ink text-cream border-ink"
                    : "bg-paper text-ink border-border hover:border-clay"
                }`}
              >
                <span aria-hidden className="text-lg leading-none">
                  {c.emoji}
                </span>
                <span className="font-medium">{c.persona}</span>
                <span
                  className={`hidden sm:inline text-xs ${isActive ? "text-cream/70" : "text-ink-3"}`}
                >
                  · {c.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Caso seleccionado: relato + cards */}
      <section className="mx-auto max-w-6xl px-6 pb-12 md:px-12 space-y-8">
        {/* Relato del afectado */}
        <div className="rounded-lg glass p-6 md:p-8 shadow-[0_8px_32px_rgba(26,31,46,0.04)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-2">
            {meta.persona} · {meta.age} años · {meta.city}
          </p>
          <p className="font-serif text-2xl md:text-[28px] leading-snug text-ink">
            “{meta.problem}”
          </p>
        </div>

        {/* Diagnosis + Timeline (componentes de Mauricio) */}
        <div
          key={selectedId}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300"
        >
          <DiagnosisCard diagnosis={diagnosis} />
          <TimelineDeadlines schedule={schedule} />
        </div>

        {/* Reclamo formal (cuando hay mock disponible) */}
        {claim ? (
          <div
            key={`${selectedId}-claim`}
            className="animate-in fade-in duration-300"
          >
            <ReclamoPreview
              claim={claim}
              onDownload={() =>
                alert(`Descarga del reclamo ${claim.id} (demo).`)
              }
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border-strong bg-paper/50 p-10 text-center">
            <p className="font-serif text-xl text-ink mb-2">
              Reclamo formal
            </p>
            <p className="text-sm text-ink-3 max-w-md mx-auto">
              El borrador para este caso se genera al final del flujo
              completo. Probalo con tu propio caso para verlo en acción.
            </p>
          </div>
        )}
      </section>

      {/* CTA final — invitar a usar la app */}
      <section className="mx-auto max-w-6xl px-6 pb-32 md:px-12">
        <div className="flex flex-col items-center text-center gap-6 pt-12 border-t border-border">
          <p className="font-serif text-2xl md:text-3xl font-medium tracking-tight max-w-2xl leading-tight">
            Tu caso seguramente no es igual a estos. Pero el flujo es el mismo.
          </p>
          <Button href="/chat" variant="primary" size="lg">
            Empezar mi reclamo →
          </Button>
        </div>
      </section>
    </main>
  );
}
