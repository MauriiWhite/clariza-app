// Pagina principal del flujo conversacional.
// Layout split: Chat (izquierda) + Consola del agente (derecha).
// Cuando el agente termina y hay diagnostico, mostramos un CTA grande
// "Ver mi caso paso a paso →" que guarda los datos en sessionStorage
// y navega a /caso (wizard de 5 pasos).

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { saveCase } from "@/modules/case/services/caseStorage";
import { Chat } from "@/modules/chat/components/Chat";
import { useChat } from "@/modules/chat/hooks/useChat";
import { Console } from "@/modules/console/components/Console";
import { Button } from "@/modules/core/design-system/Button";

export default function ChatPage() {
  const router = useRouter();
  const { events, isStreaming, startTurn, diagnosis, schedule, claim } =
    useChat();

  const showResults = !isStreaming && (diagnosis || schedule);

  // Guarda el snapshot del caso en sessionStorage cuando aparecen resultados,
  // para que /caso pueda leerlo cuando el ciudadano apriete "Ver mi caso".
  // Ref para evitar re-saves innecesarios.
  const lastSavedRef = useRef<string>("");
  useEffect(() => {
    if (!showResults) return;
    const snapshot = JSON.stringify({ diagnosis, schedule, claim });
    if (snapshot === lastSavedRef.current) return;
    saveCase({ diagnosis, schedule, claim });
    lastSavedRef.current = snapshot;
  }, [showResults, diagnosis, schedule, claim]);

  const handleVerCaso = () => {
    saveCase({ diagnosis, schedule, claim });
    router.push("/caso");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar glass con boton volver explicito + brand */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto max-w-7xl px-6 py-3 md:px-8 flex items-center justify-between gap-4">
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

      {/* Split: chat + consola — alturas mas compactas para no sentir vacio */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-4 py-4 md:px-6 md:py-5 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 lg:h-[calc(100vh-6rem)] lg:max-h-160">
          <Chat events={events} isStreaming={isStreaming} onSend={startTurn} />
          <Console events={events} />
        </div>

        {/* Cuando hay resultados: un solo CTA grande para ir al wizard.
            Reemplaza las cards apiladas (que ahora viven en /caso). */}
        {showResults && (
          <section
            aria-label="Resultados disponibles"
            className="animate-in fade-in duration-500"
          >
            <div className="rounded-lg bg-paper border border-border p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-[0_8px_32px_rgba(26,31,46,0.06)]">
              <div className="flex flex-col gap-2 max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-clay">
                  Tu caso está listo
                </p>
                <h2 className="font-serif text-2xl md:text-[28px] font-medium leading-tight">
                  {diagnosis
                    ? `Va a ${diagnosis.primaryRegulator}. Vamos paso a paso para presentarlo.`
                    : "Vamos paso a paso para presentar tu reclamo."}
                </h2>
                <p className="text-sm text-ink-2 leading-relaxed">
                  En 5 pasos te guiamos: diagnóstico, plazos, reclamo formal,
                  cómo contactar al regulador y cierre del caso.
                </p>
              </div>
              <Button
                onClick={handleVerCaso}
                variant="primary"
                size="lg"
                className="shrink-0"
              >
                Ver mi caso →
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
