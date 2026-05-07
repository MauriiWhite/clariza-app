// Footer global — links de navegacion + brand al pie de las paginas.
// Solo aparece en paginas que lo importen explicitamente (no en /chat para
// no quitar espacio vertical, donde el bottom es input + CTA).

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-paper/40 mt-12">
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2 text-ink-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
          <span className="font-serif font-medium text-ink">Clariza</span>
          <span className="text-ink-3">— Cruzaders 2026</span>
        </div>

        <nav aria-label="Navegacion del pie">
          <ul className="flex items-center gap-5 text-ink-2">
            <li>
              <Link href="/casos" className="hover:text-clay transition-colors">
                Casos
              </Link>
            </li>
            <li>
              <Link
                href="/proceso"
                className="hover:text-clay transition-colors"
              >
                Cómo se construyó
              </Link>
            </li>
            <li>
              <Link href="/#legal" className="hover:text-clay transition-colors">
                Legal
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/MauriiWhite/clariza-app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-clay transition-colors"
              >
                GitHub ↗
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
