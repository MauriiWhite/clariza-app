# Clariza

> **Asistente IA que recibe tu problema financiero, lo cruza con la normativa chilena vigente, decide a qué regulador corresponde (CMF, SERNAC, SUSESO, SUPEN o tribunales) y te entrega un reclamo formal listo para presentar.**

🌐 **Demo en vivo:** [clariza-app.netlify.app](https://clariza-app.netlify.app)
📄 **Pitch deck:** [entregables/pitch-deck/clariza-pitch-deck.pdf](entregables/pitch-deck/clariza-pitch-deck.pdf)

Construido para el **Claude Impact Lab Chile 2026** · Línea 01 — Inclusión Financiera · Equipo Cruzaders.

---

## El problema

Miles de chilenos pierden su derecho a restitución económica porque el **lenguaje legal es una barrera** y los **plazos regulatorios son invisibles** para el ciudadano común. En 2023 la CMF recibió más de 28.000 reclamos contra instituciones financieras — la mayoría llega mal dirigida, fuera de plazo o mal redactada.

Clariza democratiza la justicia financiera.

## Cómo funciona — flujo en 3 pasos

El producto guía al ciudadano por un wizard de tres pantallas. La conversación es solo la primera.

### Paso 1 · Chat (`/chat`)
Describe tu caso en lenguaje natural. Podés adjuntar foto del contrato, cartola, mensaje o screenshot. El agente cruza los hechos con la normativa vigente (Ley 19.496, 20.555, 21.234, 21.398, 21.521, 21.680, DL 3.500 y circulares) y consume 6 tools en vivo:

- `extractEvidence` — Vision sobre PDFs e imágenes (compresión client-side automática)
- `searchRegulation` — RAG sobre el corpus regulatorio chileno (8 fuentes)
- `classifyJurisdiction` — decide CMF / SERNAC / SUSESO / SUPEN / tribunales
- `calculateDeadlines` — días hábiles + feriados oficiales chilenos (Nager API)
- `getEconomicContext` — UF, USD, IPC del día (mindicador.cl)
- `draftClaim` — produce el documento formal según canal destino

Todas las llamadas a tools son visibles en una consola dark a la derecha (en mobile, tab adyacente con badge contador).

### Paso 2 · Acción (`/caso/accion`)
Diagnóstico + plazos + reclamo formal. Botón "Imprimir / Guardar PDF" genera el documento en formato carta usando `window.print()` + `@media print` — sin backend, funciona offline. Sidebar lateral pegajoso (desktop) o CTA flotante (mobile) para marcar "Ya lo presenté".

### Paso 3 · Cerrado (`/caso/cerrado`)
Confirmación + card "Próximas fechas" con vencimiento legal proyectado y fecha sugerida de seguimiento (7 días antes). Activación de recordatorios por email (avisos a 7, 3 y 1 día) vía magic link de Supabase, sin password.

## Diferenciadores

1. **Derivación inteligente entre 5 reguladores** — único agente que enruta entre CMF, SERNAC, SUSESO, SUPEN y tribunales. Otros equipos cubren un canal.
2. **Plazos hábiles vivos** — feriados oficiales chilenos vía API pública. La pieza invisible que hace que la gente pierda reclamos.
3. **Anti-alucinación regulatoria** — cada cita tiene URL verificable a BCN o CMF. Si una tool no la devolvió en este turno, el agente no la dice. El `CitationsPanel` muestra al ciudadano las leyes consultadas.
4. **Seguimiento persistente** — recordatorios automáticos por email a 7, 3 y 1 día del vencimiento. Magic link sin password.

## Stack

- **Claude Sonnet 4.6** + **Haiku 4.5** (Vision) con tool-use + prompt caching del corpus regulatorio
- **Anthropic SDK** o **OpenAI SDK contra OpenRouter** (provider routing automático según env vars)
- **Next.js 16** (App Router) + **React 19** + **TypeScript** estricto
- **Tailwind v4** con tokens de diseño Anthropic-inspired (cream/ink/clay)
- **Supabase** + magic link auth (recordatorios por email)
- **APIs públicas chilenas:** Nager.Date (feriados), mindicador.cl (UF/USD/IPC), BCN (leyes)
- **Netlify** para deploy con SSE streaming

## Setup local

Requisitos: Node 20+ y npm.

```bash
# 1) Instalar dependencias
npm install

# 2) Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con UNA de estas opciones:
#   ANTHROPIC_API_KEY=sk-ant-...    (preferida — Anthropic SDK directo)
#   OPENROUTER_API_KEY=sk-or-v1-... (alternativa — OpenAI SDK contra OpenRouter)
# Si no hay key, la app cae a un mock dinámico que reproduce 4 casos demo
# distintos según las keywords del mensaje del ciudadano.

# 3) Variables opcionales para recordatorios:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4) Levantar dev server
npm run dev
```

Abrir http://localhost:3000.

### Generar el pitch deck en PDF

```bash
node scripts/generate-pdf.mjs
```

Usa puppeteer-core contra el Chrome instalado del sistema. PDF resultante: `entregables/pitch-deck/clariza-pitch-deck.pdf`.

## Convenciones de código

- **Identificadores en inglés** (variables, funciones, tipos, archivos).
- **Comentarios en español** — la voz del codebase es chilena.
- **Strings de UI en español Chile, tuteo** ("tú tienes", "puedes", "cuéntame"). Nunca voseo argentino, nunca "usted".
- **Estructura modular** — features en `src/modules/<feature>/{components,services,types}`. Nada de barrel exports compartidos entre features.
- **Sin barrels innecesarios.** Cada archivo importa directo de su origen.

## Documentos del proyecto

| Archivo | Para qué |
|---|---|
| [SPEC.md](SPEC.md) | Detalle técnico, plan 48h y rúbrica del Lab |
| [DIAGRAMS.md](DIAGRAMS.md) | Flujos del producto, agent loop, arquitectura |
| [CASES.md](CASES.md) | 4 casos de uso reales (1 por perfil oficial) |
| [WORKFLOW.md](WORKFLOW.md) | Coordinación del equipo (zonas, contratos, hitos) |
| [AGENTS.md](AGENTS.md) | Notas para Claude Code agents que tocan este repo |
| [design/DESIGN-SYSTEM.md](design/DESIGN-SYSTEM.md) | Tokens, fuentes y componentes (operacional) |
| [design/DESIGN-SKILL.md](design/DESIGN-SKILL.md) | Principios visuales (conceptual) |
| [entregables/](entregables/) | Material para el submit del Lab (ficha, técnico, pitch, slides, demo) |

## Estado

✅ **Live** en https://clariza-app.netlify.app desde el 6 de mayo de 2026.

Funciona con cualquiera de los dos providers de Claude (Anthropic directo u OpenRouter), o con mock dinámico si no hay key configurada. Compatible con desktop y mobile, accesible (WCAG AA en focus visible y reduced motion), persistencia local en `sessionStorage`.

## Equipo

**Cruzaders** — primer Impact Lab de Anthropic en LATAM (Santiago de Chile, mayo 2026).

- Exequiel Alvarado · AI Builder
- Mauricio Blanco · Vibecoder
- Sebastián Fuentes · Comercial / Producto

## Licencia

Por definir tras el evento. Repositorio público en [github.com/MauriiWhite/clariza-app](https://github.com/MauriiWhite/clariza-app).
