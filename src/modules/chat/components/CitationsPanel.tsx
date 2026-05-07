// Panel de "Fuentes verificables" que aparece debajo del chat cuando el
// agente cita normativa. Cada cita es una card clickeable que abre la
// fuente oficial (BCN o regulador) en pestana nueva.
//
// Es la pieza anti-alucinacion mas visible del producto: el ciudadano (y
// el jurado) pueden verificar en 1 clic que la ley citada existe y dice
// lo que el agente afirma.

"use client";

import type { Citation, Relevance } from "@/modules/regulations/types";

interface CitationsPanelProps {
  citations: Citation[];
}

export function CitationsPanel({ citations }: CitationsPanelProps) {
  if (citations.length === 0) return null;

  return (
    <section
      className="mt-3 rounded-md border border-border bg-paper/60 backdrop-blur-sm"
      aria-label="Fuentes verificables"
    >
      <header className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <BookIcon />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-2">
          Fuentes verificables
        </h3>
        <span className="text-xs text-ink-3 ml-auto">
          {citations.length} {citations.length === 1 ? "cita" : "citas"}
        </span>
      </header>

      <ul className="divide-y divide-border">
        {citations.map((citation) => (
          <CitationCard
            key={`${citation.sourceId}::${citation.article ?? ""}`}
            citation={citation}
          />
        ))}
      </ul>
    </section>
  );
}

function CitationCard({ citation }: { citation: Citation }) {
  return (
    <li className="px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-sm font-medium text-ink">
              {citation.source}
            </span>
            {citation.article && (
              <>
                <span className="text-ink-3 text-xs">·</span>
                <span className="text-sm text-ink-2">{citation.article}</span>
              </>
            )}
            <RelevanceBadge relevance={citation.relevance} />
          </div>
          <p className="mt-1 text-sm leading-snug text-ink-2 line-clamp-2">
            {citation.plainLanguageSummary}
          </p>
        </div>

        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-clay border border-clay/30 hover:bg-clay/10 transition-colors whitespace-nowrap"
          aria-label={`Verificar ${citation.source} en fuente oficial (abre en pestaña nueva)`}
        >
          Ver fuente
          <ExternalLinkIcon />
        </a>
      </div>
    </li>
  );
}

function RelevanceBadge({ relevance }: { relevance: Relevance }) {
  // Color suave por nivel — alta destaca, baja se desvanece.
  const styles: Record<Relevance, string> = {
    alta: "bg-success/10 text-success border-success/20",
    media: "bg-clay/10 text-clay border-clay/20",
    baja: "bg-ink/5 text-ink-3 border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border ${styles[relevance]}`}
    >
      {relevance}
    </span>
  );
}

function BookIcon() {
  return (
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
      className="text-clay"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
