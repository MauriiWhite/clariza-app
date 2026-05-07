// Error boundary global de Next.js App Router.
// Captura errores en cualquier ruta y muestra una pantalla amigable
// en lugar de un white screen of death.

"use client";

import { useEffect } from "react";
import { Button } from "@/modules/core/design-system/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // En produccion mandar a Sentry/console — por ahora solo log.
    console.error("[Clariza error boundary]", error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-32 gap-8 text-center">
      <div className="flex flex-col items-center gap-4 max-w-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-clay/10 text-clay">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight">
          Algo se rompió de nuestro lado.
        </h1>

        <p className="text-base text-ink-2 leading-relaxed max-w-md">
          No te preocupes, tus datos están seguros. Prueba de nuevo o vuelve al
          inicio. Si el problema persiste, puedes reportarlo en GitHub.
        </p>

        {error.digest && (
          <p className="text-xs text-ink-3 font-mono">
            Código de error: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={reset} variant="primary" size="lg">
          Reintentar
        </Button>
        <Button href="/" variant="secondary" size="lg">
          Volver al inicio
        </Button>
      </div>
    </main>
  );
}
