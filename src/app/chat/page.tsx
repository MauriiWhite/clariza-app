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
      {/* Top bar glass */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto max-w-350 px-6 py-3 md:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
            <span className="font-serif font-medium">Clariza</span>
          </Link>
          <span className="text-xs text-ink-3 hidden sm:block">
            Modo demo · Caso 1 · María, jubilada · SUPEN
          </span>
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
