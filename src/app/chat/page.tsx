// Pagina principal del flujo conversacional.
// Layout:
//  - Desktop: split chat (3/5) + consola (2/5) lado a lado
//  - Mobile: tabs Chat / Consola (toggleable) — la consola es el wow moment
//    del agente trabajando, no se puede perder en mobile

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { saveCase } from "@/modules/case/services/caseStorage";
import { Chat } from "@/modules/chat/components/Chat";
import { useChat } from "@/modules/chat/hooks/useChat";
import { Console } from "@/modules/console/components/Console";
import { Button } from "@/modules/core/design-system/Button";

export default function ChatPage() {
  const router = useRouter();
  const {
    events,
    isStreaming,
    error,
    startTurn,
    diagnosis,
    schedule,
    claim,
    citations,
  } = useChat();

  const showResults = !isStreaming && (diagnosis || schedule);
  const [mobileTab, setMobileTab] = useState<"chat" | "console">("chat");

  // Auto-cambiar a tab Consola en mobile cuando empieza el stream — para que
  // el ciudadano vea al agente trabajando. Vuelve a Chat al terminar.
  const lastStreamingRef = useRef(false);
  useEffect(() => {
    if (isStreaming && !lastStreamingRef.current) {
      // Empezo a streamear: solo cambiamos en mobile (no afecta desktop).
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setMobileTab("console");
      }
    } else if (!isStreaming && lastStreamingRef.current) {
      // Termino el stream: vuelve a chat para ver la respuesta final.
      setMobileTab("chat");
    }
    lastStreamingRef.current = isStreaming;
  }, [isStreaming]);

  // Guarda snapshot del caso en sessionStorage para /caso.
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
    // Navegamos directo al paso 2 — /caso es solo un router.
    router.push("/caso/accion");
  };

  // Cuenta de tool calls visibles para el badge del tab consola.
  const toolCount = events.filter(
    (e) => e.type === "tool_call" || e.type === "tool_result",
  ).length;

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar glass — compacto en mobile (2 columnas: Volver + Brand) */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 flex items-center justify-between gap-3">
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
            <span className="hidden sm:inline">Volver</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
            <span className="font-serif text-base font-medium tracking-tight">
              Clariza
            </span>
          </div>

          <span className="text-xs text-ink-3 hidden md:block text-right shrink-0">
            {diagnosis
              ? `${diagnosis.primaryRegulator} · ${diagnosis.procedure}`
              : "Tu reclamo"}
          </span>
          {/* Spacer en mobile para mantener brand centrado */}
          <span className="md:hidden w-15" aria-hidden />
        </div>
      </header>

      {/* Tabs solo en mobile */}
      <div className="lg:hidden border-b border-border bg-paper/40">
        <div className="mx-auto max-w-7xl px-4 flex">
          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
              mobileTab === "chat"
                ? "border-clay text-ink"
                : "border-transparent text-ink-3"
            }`}
            aria-pressed={mobileTab === "chat"}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("console")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              mobileTab === "console"
                ? "border-clay text-ink"
                : "border-transparent text-ink-3"
            }`}
            aria-pressed={mobileTab === "console"}
          >
            Consola
            {toolCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-clay text-cream text-[10px] font-bold">
                {toolCount}
              </span>
            )}
            {isStreaming && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Layout principal.
          La pieza clave: cada wrapper del grid tiene `overflow-hidden` y
          `h-full`. Sin esto, el contenido del Chat/Console rompe el alto
          del row del grid y se desborda en la pantalla. */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-4 py-4 md:px-6 md:py-5 flex flex-col gap-4 overflow-hidden">
        <div
          className={`grid gap-4 lg:grid-cols-[3fr_2fr] overflow-hidden ${
            showResults
              ? "h-[60vh] lg:h-[calc(100vh-20rem)] lg:max-h-[520px]"
              : "h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] lg:max-h-[640px]"
          }`}
        >
          <div
            className={`h-full overflow-hidden ${
              mobileTab === "chat" ? "" : "hidden lg:block"
            }`}
          >
            <Chat
              events={events}
              isStreaming={isStreaming}
              error={error}
              onSend={startTurn}
              citations={citations}
            />
          </div>
          <div
            className={`h-full overflow-hidden ${
              mobileTab === "console" ? "" : "hidden lg:block"
            }`}
          >
            <Console events={events} />
          </div>
        </div>

        {/* CTA "Siguiente paso" — solido + mini-progreso visual de los 3 pasos
            para que el ciudadano vea CLARO que el caso continua a una
            siguiente pantalla. */}
        {showResults && (
          <section
            aria-label="Resultados disponibles"
            className="animate-in fade-in duration-500"
          >
            <div className="rounded-lg bg-paper border-2 border-ink p-4 md:p-5 shadow-[0_12px_40px_rgba(26,31,46,0.18)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col gap-3 max-w-xl">
                  {/* Mini stepper inline */}
                  <div
                    className="flex items-center gap-1.5"
                    aria-label="Progreso del caso"
                  >
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success text-white text-[11px] font-bold"
                      aria-label="Paso 1 completado"
                    >
                      ✓
                    </span>
                    <span className="w-4 h-px bg-success" aria-hidden />
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-clay text-white text-[11px] font-bold animate-pulse"
                      aria-label="Paso 2 siguiente"
                    >
                      2
                    </span>
                    <span className="w-4 h-px bg-border" aria-hidden />
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cream border border-border text-[11px] font-medium text-ink-3"
                      aria-label="Paso 3 pendiente"
                    >
                      3
                    </span>
                    <span className="ml-2 text-xs text-ink-3 font-medium">
                      Chat → Acción → Cerrado
                    </span>
                  </div>

                  <h2 className="font-serif text-lg md:text-xl font-medium leading-tight text-ink">
                    {diagnosis
                      ? `Va a ${diagnosis.primaryRegulator}. Continuemos.`
                      : "Vamos a presentar tu reclamo."}
                  </h2>
                </div>

                <Button
                  onClick={handleVerCaso}
                  variant="primary"
                  size="lg"
                  className="shrink-0 whitespace-nowrap"
                >
                  Continuar al paso 2 →
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
