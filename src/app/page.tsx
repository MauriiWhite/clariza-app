// Landing page de Clariza.
// Inspirada en el lenguaje visual publico de Anthropic/Claude:
// cream calido, serif editorial en H1, ritmo generoso, acento clay terracota.

import { Button } from "@/modules/core/design-system/Button";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero editorial */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-36">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-2 h-2 rounded-full bg-clay"
              aria-hidden
            />
            <p className="text-sm font-medium tracking-wide uppercase text-ink-3">
              Asistente de reclamos financieros · Chile
            </p>
          </div>

          <h1 className="font-serif text-[44px] md:text-[72px] lg:text-[88px] font-medium leading-[0.98] tracking-[-0.02em] max-w-5xl">
            No pierdas tu reclamo por no saber a quién decirle.
          </h1>

          <p className="text-lg md:text-xl leading-relaxed text-ink-2 max-w-2xl">
            Clariza traduce tu problema, lo deriva al regulador correcto
            (CMF · SERNAC · SUSESO · SUPEN · tribunales) y te avisa antes de que
            se venza el plazo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button href="/chat" variant="primary" size="lg">
              Probar con mi caso
            </Button>
            <Button href="#como-funciona" variant="secondary" size="lg">
              Ver cómo funciona
            </Button>
          </div>

          <p className="text-sm text-ink-3 pt-12 max-w-2xl leading-relaxed">
            Construido con normativa real publicada por CMF, SERNAC y BCN ·
            Sin abogados · Sin login para empezar
          </p>
        </div>
      </section>

      {/* Como funciona — tres pasos en cards editoriales */}
      <section
        id="como-funciona"
        className="mx-auto max-w-6xl px-6 pb-32 md:px-12"
      >
        <h2 className="font-serif text-3xl md:text-[40px] font-medium tracking-tight mb-12">
          Cómo funciona
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              title: "Contás tu caso",
              body: "Describís lo que te pasó en lenguaje natural y adjuntás documentos (cartola, contrato, mensajes).",
            },
            {
              n: "02",
              title: "Clariza analiza",
              body: "Cruza tu caso con la normativa vigente, identifica al regulador competente y calcula los plazos hábiles que tenés.",
            },
            {
              n: "03",
              title: "Reclamo listo",
              body: "Recibís el reclamo formal en PDF y, si querés, te avisamos por email antes de que se venza el plazo.",
            },
          ].map((step) => (
            <li
              key={step.n}
              className="rounded-lg bg-paper border border-border p-8"
            >
              <span className="font-serif text-xl text-clay">{step.n}</span>
              <h3 className="font-serif text-xl font-medium mt-4">
                {step.title}
              </h3>
              <p className="text-base text-ink-2 mt-3 leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
