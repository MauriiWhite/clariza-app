// Landing page de Clariza — minimalista, urgente, vanguardista.
// Para gente con prisa: una sola decision visible (Empezar), mensaje
// directo, glassmorphism estrategico, ritmo respirado.

import Link from "next/link";
import { Button } from "@/modules/core/design-system/Button";

export default function Home() {
  return (
    <main className="flex-1 relative">
      {/* Top bar glass — flota sobre el contenido cuando el usuario scrollea */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto max-w-6xl px-6 md:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-clay" />
            <span className="font-serif text-base font-medium tracking-tight">
              Clariza
            </span>
          </div>
          <Button href="/chat" variant="primary" size="md">
            Empezar
          </Button>
        </div>
      </header>

      {/* Hero — una sola decision */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:px-12 md:pt-32 md:pb-24">
        <div className="flex flex-col gap-8 max-w-4xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-ink-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
            Reclamos financieros · Chile
          </p>

          <h1 className="font-serif text-[44px] md:text-[80px] lg:text-[104px] font-medium leading-[0.95] tracking-[-0.025em]">
            Reclamá tu plata.
            <br />
            <span className="text-clay">En 5 minutos.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed text-ink-2 max-w-2xl">
            Contanos qué te pasó. Clariza encuentra al regulador correcto,
            calcula tu plazo y arma el reclamo formal — sin abogados.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button href="/chat" variant="primary" size="lg">
              Empezar ahora →
            </Button>
            <Button href="#como" variant="ghost" size="lg">
              Cómo funciona
            </Button>
          </div>

          <p className="text-sm text-ink-3 pt-8 max-w-xl leading-relaxed">
            Normativa real de CMF, SERNAC y BCN · Sin login · Sin app que
            descargar
          </p>
        </div>
      </section>

      {/* Como funciona — 3 pasos en linea, minimal */}
      <section
        id="como"
        className="mx-auto max-w-6xl px-6 pb-32 md:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              n: "01",
              title: "Contás",
              body: "Tu problema en lenguaje natural. Subís cartola, contrato o foto.",
            },
            {
              n: "02",
              title: "Clariza analiza",
              body: "Cruza con normativa real, identifica al regulador y calcula tus días hábiles.",
            },
            {
              n: "03",
              title: "Reclamo listo",
              body: "PDF formal descargable. Te avisamos antes de que se venza.",
            },
          ].map((step) => (
            <div key={step.n} className="flex flex-col gap-3">
              <span className="font-serif text-clay text-3xl font-medium">
                {step.n}
              </span>
              <h3 className="font-serif text-xl font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="text-base text-ink-2 leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Links discretos a casos + proceso */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6">
          <Link
            href="/casos"
            className="inline-flex items-center gap-2 text-sm font-medium text-clay hover:underline"
          >
            Ver casos de ejemplo
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/proceso"
            className="inline-flex items-center gap-2 text-sm font-medium text-clay hover:underline"
          >
            Cómo se construyó
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* CTA final, single */}
        <div className="mt-24 flex flex-col items-center text-center gap-6">
          <p className="font-serif text-2xl md:text-3xl font-medium tracking-tight max-w-2xl leading-tight">
            Tu plazo corre desde el día uno. Empezá ahora.
          </p>
          <Button href="/chat" variant="primary" size="lg">
            Empezar mi reclamo →
          </Button>
        </div>
      </section>
    </main>
  );
}
