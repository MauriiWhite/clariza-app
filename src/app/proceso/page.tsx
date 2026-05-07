// Pagina /proceso — evidencia visual de como se construyo Clariza
// con Claude Code en el Impact Lab. Sirve como prueba para el
// entregable tecnico (uso de herramientas Anthropic) y como caso
// de estudio publico.

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/modules/core/design-system/Button";

const SCREENSHOTS = [
  {
    src: "/proceso/build-conversation.png",
    alt: "Conversación con Claude Code construyendo el módulo del agente",
    caption:
      "Conversación con Claude Code agregando memoria multi-turn al runner del agente. Cada decisión técnica fue validada en diálogo con Claude antes de commitear.",
  },
];

const STATS = [
  { num: "60+", label: "commits durante el Lab" },
  { num: "6", label: "tools del agente" },
  { num: "10+", label: "archivos por módulo" },
  { num: "2", label: "APIs públicas chilenas" },
];

export default function ProcesoPage() {
  return (
    <main className="flex-1">
      {/* Top bar glass — mismo patron que el resto */}
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
            Probar el agente
          </Button>
        </div>
      </header>

      {/* Hero editorial */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:px-12 md:pt-24">
        <div className="flex flex-col gap-6 max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-ink-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
            Cómo se construyó
          </p>
          <h1 className="font-serif text-[40px] md:text-[64px] font-medium leading-[1] tracking-[-0.02em]">
            Construido con <span className="text-clay">Claude Code</span> en 48
            horas.
          </h1>
          <p className="text-lg leading-relaxed text-ink-2 max-w-2xl">
            Clariza fue desarrollada durante el Claude Impact Lab Chile 2026.
            Toda la arquitectura del agente, las 6 herramientas y la UI fueron
            diseñadas en diálogo continuo con Claude — no como autocomplete,
            sino como pair programmer.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 pb-16 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 p-6 rounded-lg bg-paper border border-border"
            >
              <span className="font-serif text-clay text-4xl font-medium leading-none">
                {s.num}
              </span>
              <span className="text-sm text-ink-2 leading-relaxed">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-12 space-y-12">
        <h2 className="font-serif text-3xl md:text-[40px] font-medium tracking-tight">
          Diálogo con Claude
        </h2>

        {SCREENSHOTS.map((shot, idx) => (
          <figure
            key={idx}
            className="rounded-lg overflow-hidden border border-border bg-paper shadow-[0_8px_32px_rgba(26,31,46,0.08)]"
          >
            <div className="relative aspect-[16/12] bg-cream">
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
                className="object-contain"
                priority={idx === 0}
              />
            </div>
            <figcaption className="px-6 py-5 border-t border-border">
              <p className="text-base text-ink-2 leading-relaxed">
                {shot.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Stack */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-12">
        <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight mb-8">
          Stack y herramientas Anthropic usadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Agent SDK", "toolRunner del SDK orquesta las 6 tools en loop"],
            ["Files API", "Vision sobre PDFs e imágenes en extractEvidence"],
            ["Prompt Caching", "system prompt cacheado por turnos"],
            ["Citations", "PDFs con referencias literales activadas"],
            ["Claude Sonnet 4.5", "modelo principal para razonamiento"],
            ["Claude Haiku 4.5", "Vision en extractEvidence"],
          ].map(([name, desc]) => (
            <div
              key={name as string}
              className="rounded-lg bg-paper border border-border p-5"
            >
              <div className="font-serif text-lg font-medium text-ink mb-1">
                {name}
              </div>
              <div className="text-sm text-ink-2 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-32 md:px-12">
        <div className="flex flex-col items-center text-center gap-6 pt-12 border-t border-border">
          <p className="font-serif text-2xl md:text-3xl font-medium tracking-tight max-w-2xl leading-tight">
            Misma forma de construir el producto, mismo cuidado con la persona
            que lo usa.
          </p>
          <Button href="/chat" variant="primary" size="lg">
            Probar Clariza →
          </Button>
        </div>
      </section>
    </main>
  );
}
