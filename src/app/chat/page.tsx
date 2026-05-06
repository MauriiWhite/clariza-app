// Pagina principal del flujo conversacional.
// Layout split: Chat (izquierda) + Consola del agente (derecha).
// Cuando el agente termina, aparecen DiagnosisCard + TimelineDeadlines +
// ReclamoPreview con datos derivados del stream real (o del mock canonico
// como fallback). Componentes de Mauricio integrados al flujo.

"use client";

import Link from "next/link";
import { Chat } from "@/modules/chat/components/Chat";
import { useChat } from "@/modules/chat/hooks/useChat";
import { ReclamoPreview } from "@/modules/claim/components/ReclamoPreview";
import { Console } from "@/modules/console/components/Console";
import { DiagnosisCard } from "@/modules/diagnosis/components/DiagnosisCard";
import { TimelineDeadlines } from "@/modules/diagnosis/components/TimelineDeadlines";

export default function ChatPage() {
  const { events, isStreaming, startTurn, diagnosis, schedule, claim } =
    useChat();

  // Mostramos los resultados solo cuando el turno termino.
  const showResults = !isStreaming && events.length > 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar glass con boton volver explicito + brand */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto max-w-350 px-6 py-3 md:px-8 flex items-center justify-between gap-4">
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

          <span className="text-xs text-ink-3 hidden md:block text-right">
            {diagnosis
              ? `${diagnosis.primaryRegulator} · ${diagnosis.procedure}`
              : "Tu reclamo, paso a paso"}
          </span>
          <span className="text-xs text-ink-3 md:hidden">
            {diagnosis ? diagnosis.primaryRegulator : "Reclamo"}
          </span>
        </div>
      </header>

      {/* Split: chat 60% / consola 40% en desktop, stack en mobile.
          Altura fija a una pantalla, scroll interno. */}
      <div className="flex-1 mx-auto max-w-350 w-full px-6 py-6 md:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:h-[calc(100vh-7rem)] lg:max-h-190">
          <Chat events={events} isStreaming={isStreaming} onSend={startTurn} />
          <Console events={events} />
        </div>

        {/* Resultados derivados del stream — diseño de Mauricio. */}
        {showResults && (diagnosis || schedule) && (
          <section
            aria-label="Resultados del análisis"
            className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-in fade-in duration-500"
          >
            {diagnosis && <DiagnosisCard diagnosis={diagnosis} />}
            {schedule && <TimelineDeadlines schedule={schedule} />}
          </section>
        )}

        {showResults && claim && (
          <section
            aria-label="Reclamo formal"
            className="animate-in fade-in duration-500"
          >
            <ReclamoPreview
              claim={claim}
              onDownload={() =>
                alert(`Descarga del reclamo ${claim.id} (demo).`)
              }
            />
          </section>
        )}
      </div>
    </div>
  );
}
