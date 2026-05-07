// Componente principal del chat conversacional.
// Disenado para gente con urgencia: empty state con accesos rapidos,
// input prominente, opcion de adjuntar documento (foto, cartola, contrato).

"use client";

import { useEffect, useRef, useState } from "react";
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
  error?: string | null;
  onSend: (message: string, file?: File | null) => void;
  onRetry?: () => void;
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

const TEXTAREA_MIN_PX = 48;
const TEXTAREA_MAX_PX = 180;

export function Chat({
  events,
  isStreaming,
  error,
  onSend,
  onRetry,
  citations = [],
}: ChatProps) {
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [identity, setIdentity] = useState<Identity>(EMPTY_IDENTITY);
  const [lastSent, setLastSent] = useState<{
    message: string;
    file: File | null;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filtramos solo los eventos que se muestran en el hilo conversacional.
  const messages = events.filter(
    (e) => e.type === "user" || e.type === "assistant",
  );

  // Auto-resize del textarea — crece con el contenido hasta TEXTAREA_MAX_PX,
  // luego scroll interno. Evita que el chat consuma toda la pantalla.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const next = Math.min(Math.max(ta.scrollHeight, TEXTAREA_MIN_PX), TEXTAREA_MAX_PX);
    ta.style.height = `${next}px`;
  }, [draft]);

  const submit = () => {
    const trimmed = draft.trim();
    // Permitimos enviar con texto O solo con archivo (caso: subir foto sin texto).
    if ((!trimmed && !file) || isStreaming) return;
    const message =
      trimmed ||
      (file ? `Te adjunto este documento (${file.name}) para que lo revises.` : "");
    setLastSent({ message, file });
    onSend(message, file);
    setDraft("");
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  // Enter envía, Shift+Enter agrega salto de línea — convención de chats modernos.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleQuickStart = (text: string) => {
    if (isStreaming) return;
    setLastSent({ message: text, file: null });
    onSend(text, null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }
    if (lastSent) {
      onSend(lastSent.message, lastSent.file);
    }
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex flex-col h-full min-h-0 glass rounded-lg shadow-[0_8px_32px_rgba(26,31,46,0.04)] overflow-hidden">
      {/* Hilo de mensajes — scroll interno cuando crece. min-h-0 critico
          para que flex-1 + overflow funcione dentro del padre flex. */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-3">
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
          <div
            className="flex items-center gap-2 text-sm text-ink-3"
            role="status"
            aria-live="polite"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-clay animate-pulse" />
            Clariza está pensando…
          </div>
        )}

        {/* Banner de error con retry — solo cuando no esta streameando y hay
            error del ultimo turno. No reemplaza al hilo, lo complementa. */}
        {!isStreaming && error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-md border border-error/40 bg-error/5 p-4"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-error/15 text-error text-xs font-bold shrink-0">
                !
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">
                  Algo se cortó del lado del servidor.
                </p>
                <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
            {(lastSent || onRetry) && (
              <button
                type="button"
                onClick={handleRetry}
                className="self-start inline-flex items-center gap-2 rounded-md border border-error/40 bg-paper px-3 py-1.5 text-xs font-semibold text-ink hover:bg-cream transition-colors"
              >
                ↻ Reintentar
              </button>
            )}
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

        <div className="flex gap-2 items-end">
          {/* Textarea principal — autoexpansivo. Enter envía, Shift+Enter
              salto de línea. Permite que el ciudadano escriba contexto largo. */}
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cuéntame qué te pasó… (Enter para enviar, Shift+Enter para nueva línea)"
            disabled={isStreaming}
            rows={1}
            enterKeyHint="send"
            autoComplete="off"
            className="flex-1 px-4 py-3 rounded-md border border-border bg-paper focus:outline-none focus:border-clay disabled:bg-black/2 disabled:cursor-not-allowed resize-none leading-relaxed"
            style={{ minHeight: TEXTAREA_MIN_PX, maxHeight: TEXTAREA_MAX_PX }}
            aria-label="Mensaje para Clariza"
          />

          {/* Adjuntar archivo — boton secundario con icono clip */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming}
            className="inline-flex items-center justify-center w-12 h-12 shrink-0 rounded-md border border-border-strong bg-paper hover:bg-cream text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="h-12"
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
