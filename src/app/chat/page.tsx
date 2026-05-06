// Pagina principal del flujo conversacional.
// Layout split: Chat (izquierda) + Consola del agente (derecha).
// Top bar glass + console glass-dark — minimalista vanguardista.

"use client";

import Link from "next/link";
import { Chat } from "@/modules/chat/components/Chat";
import { useChat } from "@/modules/chat/hooks/useChat";
import { Console } from "@/modules/console/components/Console";

export default function ChatPage() {
  const { events, isStreaming, startTurn } = useChat();

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar glass con boton volver explicito + brand */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto max-w-350 px-6 py-3 md:px-8 flex items-center justify-between gap-4">
          {/* Back button — pill clara con flecha */}
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

          {/* Brand al centro */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
            <span className="font-serif text-base font-medium tracking-tight">
              Clariza
            </span>
          </div>

          {/* Estado demo a la derecha */}
          <span className="text-xs text-ink-3 hidden md:block text-right">
            Demo · Caso 1 · María · SUPEN
          </span>
          <span className="text-xs text-ink-3 md:hidden">Demo</span>
        </div>
      </header>

      {/* Split: chat 60% / consola 40% en desktop, stack en mobile */}
      <div className="flex-1 mx-auto max-w-350 w-full px-6 py-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 h-full min-h-[calc(100vh-7rem)]">
          <Chat events={events} isStreaming={isStreaming} onSend={startTurn} />
          <Console events={events} />
        </div>
      </div>
    </div>
  );
}
