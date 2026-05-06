// Pagina principal del flujo conversacional.
// Layout split: Chat (izquierda) + Consola del agente (derecha).
// Esta pantalla es la que vamos a mostrar durante la demo del Lab.

"use client";

import Link from "next/link";
import { Chat } from "@/modules/chat/components/Chat";
import { useChat } from "@/modules/chat/hooks/useChat";
import { Console } from "@/modules/console/components/Console";

export default function ChatPage() {
  const { events, isStreaming, startTurn } = useChat();

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar minimal con back link */}
      <header className="border-b border-border bg-cream">
        <div className="mx-auto max-w-350 px-6 py-3 md:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold hover:opacity-70"
          >
            ← Clariza
          </Link>
          <span className="text-xs text-ink-3">
            Modo demo · datos del Caso 1 (María, jubilada)
          </span>
        </div>
      </header>

      {/* Split: chat 60% / consola 40% en desktop, stack en mobile */}
      <div className="flex-1 mx-auto max-w-350 w-full px-6 py-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 h-full min-h-[70vh]">
          <Chat events={events} isStreaming={isStreaming} onSend={startTurn} />
          <Console events={events} />
        </div>
      </div>
    </div>
  );
}
