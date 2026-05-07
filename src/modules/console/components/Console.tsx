// Consola lateral que muestra los tool calls del agente en vivo.
// Esta es la vista clave para sub-check B3 de la rubrica del Lab
// (>=3 mensajes visibles durante la demo).

"use client";

import { useEffect, useRef } from "react";
import type { ConsoleEvent } from "@/modules/agent/types";

interface ConsoleProps {
  events: ConsoleEvent[];
}

export function Console({ events }: ConsoleProps) {
  // Filtramos solo eventos relevantes para la consola tecnica.
  // user y assistant van en el chat, no aca.
  const consoleEvents = events.filter(
    (e) => e.type === "tool_call" || e.type === "tool_result" || e.type === "error",
  );

  // Auto-scroll al ultimo evento cada vez que llega uno nuevo.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleEvents.length]);

  return (
    <aside className="flex flex-col h-full glass-dark text-white rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(15,19,32,0.12)]">
      <header className="px-4 py-3 border-b border-white/10 flex items-center gap-2 backdrop-blur-md">
        <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
        <h2 className="text-sm font-semibold tracking-wide uppercase">
          Consola del agente
        </h2>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[13px] scroll-smooth"
      >
        {consoleEvents.length === 0 ? (
          <p className="text-white/40 text-center py-8 font-sans">
            Acá vas a ver al agente trabajando paso a paso.
          </p>
        ) : (
          consoleEvents.map((event, idx) => (
            <ConsoleBlock key={idx} event={event} />
          ))
        )}
      </div>
    </aside>
  );
}

function ConsoleBlock({ event }: { event: ConsoleEvent }) {
  if (event.type === "tool_call") {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#fbbf24]">
          <span>🔧</span>
          <span className="font-semibold">{event.name}</span>
        </div>
        <pre className="pl-6 text-white/90 whitespace-pre-wrap wrap-break-word text-[12px]">
          {JSON.stringify(event.input, null, 2)}
        </pre>
      </div>
    );
  }

  if (event.type === "tool_result") {
    return (
      <div className="space-y-1 pl-6 border-l border-[#10b981]/40">
        <div className="flex items-center gap-2 text-[#10b981]">
          <span>✓</span>
          <span className="font-semibold">{event.name}</span>
        </div>
        <pre className="text-white/90 whitespace-pre-wrap wrap-break-word text-[12px]">
          {JSON.stringify(event.output, null, 2)}
        </pre>
      </div>
    );
  }

  if (event.type === "error") {
    return (
      <div className="text-[#f87171]">
        <span className="font-semibold">❌ Error: </span>
        {event.message}
      </div>
    );
  }

  return null;
}
