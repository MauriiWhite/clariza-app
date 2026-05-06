// Componente principal del chat conversacional.
// Muestra mensajes user + assistant. Las llamadas a tools (tool_call /
// tool_result) las renderiza la consola lateral, no este componente.

"use client";

import { useState } from "react";
import type { ConsoleEvent } from "@/modules/agent/types";
import { Button } from "@/modules/core/design-system/Button";

interface ChatProps {
  events: ConsoleEvent[];
  isStreaming: boolean;
  onSend: (message: string) => void;
}

export function Chat({ events, isStreaming, onSend }: ChatProps) {
  const [draft, setDraft] = useState("");

  // Filtramos solo los eventos que se muestran en el hilo conversacional.
  const messages = events.filter(
    (e) => e.type === "user" || e.type === "assistant",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-full bg-paper rounded-lg border border-border">
      {/* Hilo de mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !isStreaming ? (
          <div className="text-center text-ink-3 py-12">
            <p className="text-base mb-2">Contame qué te pasó.</p>
            <p className="text-sm">
              Para esta demo podés enviar cualquier mensaje y verás el caso de
              María (jubilada con cobro indebido en su AFP).
            </p>
          </div>
        ) : null}

        {messages.map((event, idx) => (
          <Message key={idx} event={event} />
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-ink-3">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-soft animate-pulse" />
            Clariza está pensando...
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border p-4 flex gap-3"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribí lo que te pasó..."
          disabled={isStreaming}
          className="flex-1 px-4 py-3 rounded-md border border-border focus:outline-none focus:border-clay disabled:bg-black/2 disabled:cursor-not-allowed"
          aria-label="Mensaje para Clariza"
        />
        <Button type="submit" disabled={isStreaming || draft.trim().length === 0}>
          Enviar
        </Button>
      </form>
    </div>
  );
}

function Message({ event }: { event: ConsoleEvent }) {
  if (event.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-ink text-cream px-4 py-3 rounded-lg rounded-tr-sm">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {event.text}
          </p>
        </div>
      </div>
    );
  }

  if (event.type === "assistant") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] bg-cream text-ink px-4 py-3 rounded-lg rounded-tl-sm border border-border">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {event.text}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
