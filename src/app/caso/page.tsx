// /caso — entry point. Redirige automaticamente al paso correspondiente
// segun el estado del caso guardado en sessionStorage.
//
// Reglas:
//   - Si hay caso con contactedAt → /caso/cerrado (ya esta cerrado)
//   - Si hay caso sin contactedAt → /caso/accion (paso 2)
//   - Si no hay caso → mostrar empty state con CTA a /chat

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { loadCase } from "@/modules/case/services/caseStorage";
import { Button } from "@/modules/core/design-system/Button";

export default function CasoIndex() {
  const router = useRouter();

  useEffect(() => {
    const stored = loadCase();
    if (!stored) return; // mostramos empty state abajo
    if (stored.contactedAt) {
      router.replace("/caso/cerrado");
    } else {
      router.replace("/caso/accion");
    }
  }, [router]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 py-32 text-center">
      <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight max-w-2xl">
        No hay un caso activo todavía.
      </h1>
      <p className="text-ink-2 max-w-md leading-relaxed">
        Empieza una conversación con Clariza para que te ayude a armar tu
        reclamo paso a paso.
      </p>
      <Button href="/chat" variant="primary" size="lg">
        Empezar mi reclamo →
      </Button>
    </main>
  );
}
