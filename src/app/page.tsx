// Landing page de Clariza — minimalista, urgente, vanguardista.
// Para gente con prisa: una sola decision visible (Empezar), mensaje
// directo, glassmorphism estrategico, ritmo respirado.

import Link from "next/link";
import { Footer } from "@/modules/core/components/Footer";
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
            Reclama tu plata.
            <br />
            <span className="text-clay">En 5 minutos.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed text-ink-2 max-w-2xl">
            Cuéntanos qué te pasó. Clariza encuentra al regulador correcto,
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

          {/* Microcopy bajo el CTA — explica que pasa al apretar y baja la
              fricción ("¿me va a pedir mi RUT? ¿cuánto tarda?"). */}
          <p className="text-sm text-ink-2 max-w-xl leading-relaxed">
            Una conversación de 3 a 5 minutos. Sin login, sin descargar nada.
            Tus datos quedan en tu dispositivo.
          </p>

          <p className="text-xs text-ink-3 pt-2 max-w-xl leading-relaxed">
            Normativa real de CMF, SERNAC y BCN
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
              title: "Cuentas",
              body: "Tu problema en lenguaje natural. Subes cartola, contrato o foto.",
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
            Tu plazo corre desde el día uno. Empieza ahora.
          </p>
          <Button href="/chat" variant="primary" size="lg">
            Empezar mi reclamo →
          </Button>
        </div>
      </section>

      {/* Marco legal y privacidad — pie editorial sobrio */}
      <section
        id="legal"
        className="border-t border-border bg-paper/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Marco legal */}
          <div className="flex flex-col gap-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-ink-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
              Marco legal
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
              Cada cita está respaldada por ley vigente.
            </h2>
            <p className="text-base text-ink-2 leading-relaxed">
              Clariza solo cita normativa que tiene URL verificable a la
              Biblioteca del Congreso Nacional o a la CMF. Si no la tiene a
              mano, lo dice — nunca inventa.
            </p>
            {/* Lista plegada por defecto — para no abrumar al ciudadano que
                quiere arrancar. Auditable en un click si hace falta. */}
            <details className="group pt-2">
              <summary className="cursor-pointer list-none inline-flex items-center gap-2 text-sm font-semibold text-clay hover:underline">
                <span>Ver las 9 leyes que cita Clariza</span>
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
                  className="transition-transform group-open:rotate-180"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <ul className="text-sm text-ink-2 leading-relaxed space-y-1.5 mt-3">
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=1187323"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  Ley 21.521 — Fintec (Open Finance, registro CMF)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=61438"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  Ley 19.496 — Derechos del consumidor (base SERNAC)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=1024266"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  Ley 20.555 — SERNAC Financiero (CAE, cargos)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=1170464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  Ley 21.398 — Pro Consumidor (certificados de deuda 5 días)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=1147562"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  Ley 21.234 — Fraudes con tarjetas (responsabilidad emisor)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=7147"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  DL 3.500 — Pensiones (comisiones AFP)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=1209293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  Ley 21.680 — REDEC (Registro Consolidado de Deudas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=1177743"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  Ley 21.459 — Delitos informáticos (fraude digital)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=1202434"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clay hover:underline"
                >
                  Ley 21.663 — Marco de Ciberseguridad (ANCI)
                </a>
              </li>
              </ul>
            </details>
          </div>

          {/* Privacidad */}
          <div className="flex flex-col gap-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-ink-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
              Privacidad
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
              Tus datos son tuyos. Punto.
            </h2>
            <p className="text-base text-ink-2 leading-relaxed">
              Clariza fue diseñada con <em>privacy by design</em>. Cumplimos
              con la Ley 19.628 vigente y estamos preparados para la nueva
              Ley 21.719 que entra en vigor en diciembre de 2026.
            </p>
            <ul className="text-sm text-ink-2 leading-relaxed space-y-2 pt-2">
              <li className="flex gap-3">
                <span aria-hidden className="text-clay">·</span>
                <span>
                  Tus datos personales y los de tu reclamo quedan en tu
                  dispositivo hasta que tú toques un botón explícito de
                  enviar.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-clay">·</span>
                <span>
                  No vendemos ni compartimos tu información con terceros, ni
                  con la entidad reclamada ni con el regulador, sin tu
                  consentimiento expreso.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-clay">·</span>
                <span>
                  Solo guardamos lo mínimo necesario para enviarte
                  recordatorios — y solo si tú los activas con tu email.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-clay">·</span>
                <span>
                  Puedes ejercer tus derechos ARCO (acceso, rectificación,
                  cancelación, oposición) en cualquier momento.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-clay">·</span>
                <span>
                  Código abierto auditable en{" "}
                  <a
                    href="https://github.com/MauriiWhite/clariza-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-clay hover:underline"
                  >
                    GitHub
                  </a>
                  .
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pie de la sección */}
        <div className="mx-auto max-w-6xl px-6 pb-12 md:px-12">
          <p className="text-xs text-ink-3 leading-relaxed border-t border-border pt-8 max-w-3xl">
            Clariza es un asistente de orientación. No constituye asesoría
            legal definitiva ni reemplaza la consulta con un abogado en
            casos complejos. Construido durante el Claude Impact Lab Chile
            2026 por el equipo Cruzaders.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
