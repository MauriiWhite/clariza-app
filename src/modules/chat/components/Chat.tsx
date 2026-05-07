// Componente principal del chat conversacional.
// Disenado para gente con urgencia: empty state con accesos rapidos,
// input prominente, opcion de adjuntar documento (foto, cartola, contrato).

"use client";

import { useRef, useState } from "react";
import type { ConsoleEvent } from "@/modules/agent/types";
import { CitationsPanel } from "@/modules/chat/components/CitationsPanel";
import {
  EMPTY_IDENTITY,
  IdentityCard,
  type Identity,
} from "@/modules/chat/components/IdentityCard";
import { Button } from "@/modules/core/design-system/Button";
import type { Citation } from "@/modules/regulations/types";

interface ChatProps {
  events: ConsoleEvent[];
  isStreaming: boolean;
  onSend: (message: string, file?: File | null) => void;
  citations?: Citation[];
}

// Sugerencias rapidas — tap para arrancar sin tener que pensar la frase.
// Mapeadas a los casos del CASES.md.
const QUICK_STARTS = [
  "Mi AFP me cobra de más y no entiendo por qué",
  "Me clonaron la tarjeta y el banco no devuelve la plata",
  "Firmé un crédito en retail y la cuota es más alta de lo pactado",
  "Le mandé plata a una app y ahora no me responden",
];

export function Chat({
  events,
  isStreaming,
  onSend,
  citations = [],
}: ChatProps) {
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [identity, setIdentity] = useState<Identity>(EMPTY_IDENTITY);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtramos solo los eventos que se muestran en el hilo conversacional.
  const messages = events.filter(
    (e) => e.type === "user" || e.type === "assistant",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    // Permitimos enviar con texto O solo con archivo (caso: subir foto sin texto).
    if ((!trimmed && !file) || isStreaming) return;
    const message =
      trimmed ||
      (file ? `Te adjunto este documento (${file.name}) para que lo revises.` : "");
    onSend(message, file);
    setDraft("");
    setFile(null);
  };

  const handleQuickStart = (text: string) => {
    if (isStreaming) return;
    onSend(text, null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex flex-col h-full glass rounded-lg shadow-[0_8px_32px_rgba(26,31,46,0.04)]">
      {/* Hilo de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        {isEmpty ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="font-serif text-xl md:text-2xl font-medium leading-tight tracking-tight">
                ¿Qué te pasó?
              </h2>
              <p className="text-sm leading-relaxed text-ink-2">
                Cuéntanos en una frase. O toca uno de los casos comunes:
              </p>
            </div>

            {/* Quick starts — tap para arrancar */}
            <div className="flex flex-col gap-1.5">
              {QUICK_STARTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuickStart(q)}
                  disabled={isStreaming}
                  className="text-left px-3 py-2.5 rounded-md bg-paper/70 hover:bg-paper border border-border hover:border-clay text-sm text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-clay mr-2">→</span>
                  {q}
                </button>
              ))}
            </div>

            <p className="text-xs text-ink-3">
              También puedes adjuntar foto del contrato, cartola o un mensaje
              que recibiste.
            </p>

            {/* Identity inline opcional. No bloquea — la gente con prisa la salta. */}
            <IdentityCard identity={identity} onChange={setIdentity} />
          </div>
        ) : null}

        {messages.map((event, idx) => (
          <Message key={idx} event={event} />
        ))}

        {/* Fuentes verificables consultadas en este turno — solo aparece
            cuando hay citas Y el agente termino (asi no aparece a medias
            durante el stream). */}
        {!isStreaming && citations.length > 0 && (
          <CitationsPanel citations={citations} />
        )}

        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-ink-3">
            <span className="inline-block w-2 h-2 rounded-full bg-clay animate-pulse" />
            Clariza está pensando…
          </div>
        )}
      </div>

      {/* Input + adjuntar */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border p-3 md:p-4 space-y-2"
      >
        {/* Archivo seleccionado — chip con opcion de quitar */}
        {file && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-cream border border-border-strong text-sm">
            <PaperclipIcon />
            <span className="flex-1 truncate text-ink-2">{file.name}</span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-ink-3 hover:text-error"
              aria-label="Quitar archivo"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-2 items-stretch">
          {/* Input principal */}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Contame qué te pasó…"
            disabled={isStreaming}
            className="flex-1 px-4 py-3 rounded-md border border-border bg-paper focus:outline-none focus:border-clay disabled:bg-black/2 disabled:cursor-not-allowed"
            aria-label="Mensaje para Clariza"
          />

          {/* Adjuntar archivo — boton secundario con icono clip */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming}
            className="inline-flex items-center justify-center w-12 rounded-md border border-border-strong bg-paper hover:bg-cream text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Adjuntar documento"
            title="Adjuntar documento (foto, PDF o imagen)"
          >
            <PaperclipIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.heic,.heif"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden
          />

          <Button
            type="submit"
            disabled={isStreaming || (!draft.trim() && !file)}
          >
            Enviar
          </Button>
        </div>
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
        <div className="max-w-[85%] bg-paper text-ink px-4 py-3 rounded-lg rounded-tl-sm border border-border">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {event.text}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// Icono clip — inline SVG para no agregar dep de iconos.
function PaperclipIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.58 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
