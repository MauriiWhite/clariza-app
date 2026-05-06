# Clariza — Workflow del equipo

Cómo trabajamos los 3 sin pisarnos durante las 48h del Lab.

> Documento operativo. Ver [SPEC.md](SPEC.md) para qué construimos y por qué.

---

## 1. Ramas git

```
main             ← estable, deploy a Vercel para demo
 └─ dev          ← integración, donde mergeamos cambios verdes
     ├─ dev-exequiel  ← agente + datos (Exequiel)
     └─ dev-mauricio  ← UI + backend + deploy (Mauricio)
```

**Sebastián** trabaja en `dev` directo (sus cambios son docs, no rompen build).

### Ciclo personal

```bash
# Cada 2-3 horas, antes de seguir trabajando:
git fetch
git rebase origin/dev    # traés lo de los demás

# Cuando un hito está verde:
git push origin dev-tuya
gh pr create --base dev --head dev-tuya --title "feat: lo que hiciste"
# o mergeás a dev directo si nadie revisa
```

**Cierre día 6 (~22:00):** merge `dev` → `main` → deploy Vercel → demo lista.

---

## 2. Estructura modular del repo

Adoptamos el patrón de **feature folders / modular monolith**. Cada módulo es autocontenido (components, hooks, services, lib, utils) y tiene un único dueño. Trabajamos en paralelo, integramos al final.

**Reparto:** Exequiel toma el **flujo principal** (landing + recorrido del usuario al entrar) y todo lo del agente. Mauricio toma los **encargos específicos** (componentes que entregan output del agente: diagnóstico, reclamo PDF, recordatorios).

```
src/
├── app/                    ← Next.js routing + landing + API routes  [Exequiel]
└── modules/
    ├── core/               ← design system + UI primitives           [Exequiel]
    │   ├── components/
    │   ├── design-system/
    │   ├── hooks/
    │   ├── lib/            (supabase client compartido)
    │   └── utils/
    ├── agent/              ← orquestación del agente Claude          [Exequiel]
    │   ├── lib/            (cliente Anthropic + IDs de modelos)
    │   ├── prompts/        (system prompt y plantillas)
    │   ├── services/       (runner, eventEmitter, toolRegistry)
    │   ├── tools/          (tools utilitarias: echo, helpers)
    │   └── types/          (ConsoleEvent, RunAgentResult)
    ├── tools/              ← las 5 tools reales del producto         [Exequiel]
    │   ├── extractEvidence/
    │   ├── searchRegulation/
    │   ├── classifyJurisdiction/
    │   ├── calculateDeadlines/
    │   └── draftClaim/
    ├── regulations/        ← corpus regulatorio + RAG                [Exequiel]
    │   ├── services/       (ingest, search)
    │   ├── lib/            (BCN API, embeddings)
    │   ├── data/           (corpus markdown, fallback)
    │   └── utils/
    ├── chat/               ← UI conversacional principal             [Exequiel]
    │   ├── components/     (Chat, MessageList, FileUpload)
    │   ├── hooks/          (useChat, useStream)
    │   ├── services/       (cliente SSE)
    │   └── states/
    ├── console/            ← consola con tool calls visibles         [Exequiel]
    │   ├── components/     (Console, ToolCallBlock, ToolResultBlock)
    │   └── hooks/
    ├── diagnosis/          ← cards de diagnóstico + timeline         [Mauricio]
    │   ├── components/     (DiagnosisCard, TimelineDeadlines)
    │   └── hooks/
    ├── claim/              ← reclamo formal + PDF                    [Mauricio]
    │   ├── components/     (ReclamoPreview, DownloadButton)
    │   ├── services/       (PDFGenerator)
    │   └── templates/      (formato por regulador)
    └── reminders/          ← email + cron + persistencia casos       [Mauricio]
        ├── services/       (email, cron, casesRepo)
        ├── lib/            (Resend, supabase queries)
        └── schema/         (cases table SQL)
```

### Tabla de owners por módulo

| Módulo | Owner | Foco |
|---|---|---|
| `app/` | **Exequiel** | Landing, layout, routing, API routes |
| `modules/core/` | **Exequiel** | Design system para todo el resto |
| `modules/agent/` | **Exequiel** | Runner + prompts + types (base agéntica) |
| `modules/tools/` | **Exequiel** | Las 5 tools reales del agente |
| `modules/regulations/` | **Exequiel** | Corpus regulatorio + RAG |
| `modules/chat/` | **Exequiel** | UI conversacional — flujo principal del usuario |
| `modules/console/` | **Exequiel** | Consola tool calls — clave para M3 (35% rúbrica) |
| `modules/diagnosis/` | **Mauricio** | Encargo específico: cards de output del agente |
| `modules/claim/` | **Mauricio** | Encargo específico: reclamo formal + generador PDF |
| `modules/reminders/` | **Mauricio** | Encargo específico: persistencia casos + cron email |

### Zonas compartidas (avisar antes de tocar)

| Archivo | Quién más toca |
|---|---|
| `package.json` · `.env.example` | avisar por WhatsApp |
| `README.md` · `SPEC.md` · `DIAGRAMS.md` · `WORKFLOW.md` · `CASES.md` | secciones distintas |
| `tsconfig.json` · `next.config.ts` · `eslint.config.mjs` | raramente — coordinar |
| `_briefing/` | Sebastián (gitignored) |
| Pitch · ficha cívica · guion video | Sebastián (Exequiel revisa técnica) |

### Carga aproximada

- **Exequiel** — 7 módulos (`app`, `core`, `agent`, `tools`, `regulations`, `chat`, `console`) — flujo principal + cerebro + UI conversacional.
- **Mauricio** — 3 módulos (`diagnosis`, `claim`, `reminders`) — entregables específicos que reciben output del agente y lo materializan (card, PDF, email).
- **Sebastián** — 0 módulos de código, dueño de docs (CASES, ficha, pitch, video) y QA contra la app real.

**Lógica del reparto:** Exequiel tiene visión integrada del flujo (landing → chat → consola → output) y construye la base. Mauricio se enfoca en piezas específicas que pueden desarrollarse con vibecoding contra contratos claros (recibe `RegulatoryDiagnosis`, `ClaimDocument`, `ReminderSchedule` y los renderiza). Esto permite que ambos avancen en paralelo sin pisarse.

**Regla de oro:** si tocás algo fuera de tu zona, avisás antes y mergeás chico inmediatamente.

---

## 3. Reparto por feature y componente

### F1 — Corpus regulatorio (RAG)

| ID | Componente | Owner | Estado |
|---|---|---|---|
| F1.1 | Scraping/descarga RAN, NCG 502, NCG 514, leyes 19.496, 20.555, 21.398, 21.234, 21.521, 21.680 | Exequiel | ⏳ |
| F1.2 | Chunking semántico por artículo + embeddings (OpenAI text-embedding-3-small) | Exequiel | ⏳ |
| F1.3 | Schema `regulations` en Supabase + extension pgvector | Mauricio (schema), Exequiel (populate) | ⏳ |
| F1.4 | Carga de circulares CMF en Files API beta (citations nativas) | Exequiel | ⏳ |
| F1.5 | Validación: cada cita devuelta corresponde al texto real | Sebastián | ⏳ |

### F2 — Agente con 5 tools

| ID | Componente | Owner | Estado |
|---|---|---|---|
| F2.1 | `extractEvidence` — Claude Vision sobre PDFs/imágenes | Exequiel | ⏳ |
| F2.2 | `searchRegulation` — RAG pgvector + Files API citations | Exequiel | ⏳ |
| F2.3 | `classifyJurisdiction` — deriva CMF/SERNAC/SUSESO/SUPEN/tribunales | Exequiel | ⏳ |
| F2.4 | `calculateDeadlines` — MCP server propio con feriados oficiales | Exequiel | ⏳ |
| F2.5 | `draftClaim` — genera reclamo formal con citas | Exequiel | ⏳ |
| F2.6 | System prompt v1 + anti-hallucination validator | Exequiel | ⏳ |
| F2.7 | Agent runner con `toolRunner` del SDK + emisión de eventos | Exequiel | ✅ (Paso 2) |
| F2.8 | QA de cada tool con los 4 casos de CASES.md | Sebastián | ⏳ |

### F3 — Frontend UI (PWA)

| ID | Componente | Owner | Estado |
|---|---|---|---|
| F3.1 | Landing + layout principal con hook | Exequiel | ⏳ |
| F3.2 | `chat/components/Chat.tsx` — input texto + adjuntar archivo | Exequiel | ⏳ |
| F3.3 | `console/components/Console.tsx` — tool calls visibles en vivo | Exequiel | ⏳ |
| F3.4 | `diagnosis/components/TimelineDeadlines.tsx` — plazos hábiles | Mauricio | ⏳ |
| F3.5 | `claim/components/ReclamoPreview.tsx` — preview + descarga PDF | Mauricio | ⏳ |
| F3.6 | PWA manifest + responsive móvil-first + accesibilidad alta | Exequiel | ⏳ |
| F3.7 | Estado vacío + estados de carga + error states | Exequiel (chat/console) · Mauricio (diagnosis/claim) | ⏳ |

### F4 — Backend & API

| ID | Componente | Owner | Estado |
|---|---|---|---|
| F4.1 | Route handler `/api/agent` con streaming SSE | Exequiel | ⏳ |
| F4.2 | Route handler `/api/upload` para archivos al Files API | Exequiel | ⏳ |
| F4.3 | PDF generator con `@react-pdf/renderer` | Mauricio | ⏳ |
| F4.4 | Persistencia de casos en Supabase (tabla `cases`) | Mauricio | ⏳ |
| F4.5 | Cron de recordatorios email con Resend (alertas 7/3/1 días) | Mauricio | ⏳ |
| F4.6 | Magic link auth con Supabase (solo para activar recordatorios) | Mauricio | ⏳ |

### F5 — Demo, narrativa y entregables

| ID | Componente | Owner | Estado |
|---|---|---|---|
| F5.1 | 4 casos curados con normativa validada (en CASES.md) | Sebastián | ✅ |
| F5.2 | Ficha cívica oficial (deadline 7-may 10:00) | Sebastián | ⏳ |
| F5.3 | Guion del video demo 3-5 min | Sebastián | ⏳ |
| F5.4 | Grabar video demo | Mauricio + Exequiel filman, Sebastián narra | ⏳ |
| F5.5 | Screenshot consola + system prompt para entregable técnico | Exequiel | ⏳ |
| F5.6 | Pitch script 3+2 min Q&A | Sebastián | ⏳ |
| F5.7 | Video MP4 backup del flujo completo (plan B si falla red) | Sebastián | ⏳ |

### F6 — Infraestructura

| ID | Componente | Owner | Estado |
|---|---|---|---|
| F6.1 | Deploy a Vercel + variables de entorno producción | Exequiel | ⏳ |
| F6.2 | Setup local de cada uno con `.env.local` | Cada uno | ⏳ |
| F6.3 | Smoke test verde antes de cada PR a `dev` | Owner del PR | ✅ infra |
| F6.4 | Modo offline / fallback con casos pre-grabados | Mauricio + Sebastián | ⏳ |

### Resumen de carga por persona

| Persona | Componentes | Foco |
|---|---|---|
| **Exequiel** | F1.1, F1.2, F1.4, F2.1–F2.7, F3.1–F3.3, F3.6, F4.1, F4.2, F5.5, F6.1 | Flujo principal + cerebro + UI conversacional |
| **Mauricio** | F1.3, F3.4, F3.5, F4.3–F4.6, F6.4 | Encargos específicos: diagnosis, claim, reminders |
| **Sebastián** | F1.5, F2.8, F5.1–F5.4, F5.6–F5.7, F6.4 | Narrativa, validación, pitch |

---

## 4. Desarrollo independiente por módulos (clave del ritmo)

**Principio:** cada uno avanza en su módulo sin esperar a los otros. Trabajamos contra **contratos** (interfaces, tipos, schemas), no contra implementaciones reales. Al final, cuando todos los módulos están verdes, encajamos.

### 4.1 Contratos definidos

Estos son los puntos de contacto entre módulos. Si cambian, se avisa antes en WhatsApp del equipo.

| Contrato | Definido en | Lo respeta |
|---|---|---|
| `ConsoleEvent` (tool_call, tool_result, assistant) | `src/modules/agent/types/index.ts` | UI consola (Exequiel) |
| `RunAgentResult` (output final del agente) | `src/modules/agent/types/index.ts` | API route + UI (Exequiel) |
| Schema de cada tool (input zod + output) | `src/modules/tools/*/index.ts` | Frontend cuando renderiza resultados |
| Endpoint `/api/agent` — POST con streaming SSE | `src/app/api/agent/route.ts` (Exequiel) | Chat (Exequiel), smoke test (Exequiel) |
| `RegulatoryDiagnosis` — output de `classifyJurisdiction` | `src/modules/tools/classifyJurisdiction/types.ts` (Exequiel) | `modules/diagnosis` (Mauricio) |
| `DeadlineSchedule` — output de `calculateDeadlines` | `src/modules/tools/calculateDeadlines/types.ts` (Exequiel) | `modules/diagnosis/components/TimelineDeadlines` (Mauricio) |
| `ClaimDocument` — output de `draftClaim` | `src/modules/tools/draftClaim/types.ts` (Exequiel) | `modules/claim` (Mauricio) — preview + PDF |
| Tabla `cases` en Supabase | `src/modules/reminders/schema/cases.sql` (Mauricio) | Cron de recordatorios (Mauricio), persistencia (Mauricio) |
| Schema de `regulation_chunks` en pgvector | `src/modules/regulations/data/schema.sql` (Exequiel) | Tool searchRegulation (Exequiel) |

### 4.2 Mocks que cada uno mantiene para no bloquearse

| Persona | Lo que mockea (porque depende del otro) | Para qué |
|---|---|---|
| **Exequiel** | Corpus mock en `data/corpus/fallback.ts` con 3-4 chunks de cada ley | Desarrollar tools antes de tener pgvector cargada |
| **Exequiel** | Smoke CLI (`npm run smoke:agent`) | Validar agente sin UI |
| **Mauricio** | `mockDiagnosis()`, `mockDeadlineSchedule()`, `mockClaimDocument()` con datos basados en CASES.md | Desarrollar diagnosis/claim/reminders sin esperar a las tools reales |
| **Sebastián** | Agente real vía CLI → screenshots | Validar normativa sin depender de UI |

### 4.3 Cómo verificás tu módulo sin los otros

- **Exequiel**: `npm run smoke:agent` y `npm run dev` ambos verdes — agente, landing, chat, consola levantando.
- **Mauricio**: sus 3 módulos renderizando con mocks (diagnosis card, claim PDF, reminder form) — accesibles desde una ruta `/preview` que él mismo crea para ver sin depender del flujo principal.
- **Sebastián**: leyendo CASES.md y verificando contra normativa real publicada en BCN/CMF.

Cada módulo es **demo-able solo**. Si solo está mi parte, tengo que poder mostrarlo funcionando con stubs de las otras.

### 4.4 Hitos de integración (cuándo unimos)

| Hito | Cuándo | Qué se une |
|---|---|---|
| **Integración 1 — UI ↔ Agente real** | Día 6, ~18:30 | UI consume el endpoint `/api/agent` real en vez del mock |
| **Integración 2 — Agente ↔ Corpus real** | Día 6, ~19:00 | tool searchRegulation deja de usar fallback y consume pgvector |
| **Integración 3 — PDF ↔ draftClaim real** | Día 6, ~20:00 | PDF generator recibe output real de la tool |
| **Integración 4 — Email recordatorios** | Día 6, ~21:00 | Cron Resend dispara contra casos guardados reales |
| **Integración 5 — Deploy E2E** | Día 6, ~22:30 | Merge `dev` → `main` → Vercel produce con todo real |

Cada hito tiene 30 min de buffer para fixes. Si un módulo no está listo, el hito se posterga, **no se merge a medias**.

---

## 5. Manejo de errores — 3 capas

### Capa A — Errores en código (mientras desarrollás)
- Antes de cada commit: `npx tsc --noEmit` debe pasar limpio.
- Antes de cada PR a `dev`: `npm run smoke:agent` y `npm run dev` ambos verdes.
- Si rompiste algo de otro: revertís tu commit local y avisás. **No** "arreglas" código de otro sin avisar.

### Capa B — Errores en runtime (en producto)
- Cada tool envuelta en try/catch que devuelve `{ error: "mensaje legible" }` en vez de tirar.
- Si **Anthropic falla**: fallback a casos pre-grabados (Sebastián mantiene 3 MP4 de respaldo).
- Si **Supabase falla**: fallback a corpus mockeado en memoria (`data/corpus/fallback.ts`).
- Si **Vision falla** con un PDF feo: pedirle al usuario que pegue el texto manualmente.
- Regla en system prompt: si confianza baja → "no estoy segura, te recomiendo verificar con CMF".

### Capa C — Errores de demo (día 7 en vivo)
- Backup MP4 del flujo completo grabado el día 6 noche.
- Backup local (`npm run dev` en laptop de Mauricio) por si Vercel se cae.
- 3 casos pre-validados que sabemos que funcionan al 100% — son los que se demuestran en vivo.

---

## 6. Plan hora-por-hora (referencia rápida)

### Día 6 — miércoles 6 mayo

| Hora | Exequiel | Mauricio | Sebastián |
|---|---|---|---|
| 11:00 | Bienvenida — todos | | |
| 11:30 | Mesa con reguladores — todos | | |
| 12:30–15:30 | F3.1 landing + F1.1 corpus + F1.2 embeddings + F6.1 deploy Vercel | F3.4 timeline + F3.5 reclamo preview con mocks (`/preview`) | F5.1 refinar casos + F5.2 draft ficha |
| 15:30–18:30 | F3.2 chat + F3.3 consola + F4.1 SSE + F2.1 + F2.2 + F2.6 | F4.3 PDF generator + F1.3 schema cases | F1.5 + F2.8 validación normativa |
| 18:30–20:00 | F2.3 + F2.4 + F2.5 (classify + deadlines MCP + draft) | F4.4 persistencia cases + F4.5 cron email Resend | Mentor 15min Clay (sandbox + MCP propio) |
| 20:00 | Cierre día 1 oficial | | |
| 20:00–23:30 | Integración E2E (chat ↔ agente real) | Integración (diagnosis/claim/reminders ↔ output real) | F5.4 grabar video backup |
| 23:30 | Merge `dev` → `main` + deploy productivo | | F5.7 subir backup a Drive |

### Día 7 — jueves 7 mayo

| Hora | Exequiel | Mauricio | Sebastián |
|---|---|---|---|
| 09:00 | Check-in todos | | |
| 09:30 | Mentoría refinamiento — todos | | |
| **10:00** | (apoyo) | (apoyo) | **F5.2 ficha cívica submit** |
| 10:00–14:00 | F5.5 screenshot + system prompt final | F5.4 pulir UI + grabar video | F5.3 guion finalizado + ensayar |
| 14:00–16:30 | (apoyo técnico al pitch) | (apoyo técnico al pitch) | F5.6 ensayos 3+2 min |
| **17:00** | **Submit técnico** | (sube el deliverable) | |
| Tarde | Q&A técnico (si pasamos Top 6) | Q&A técnico | **Pitch en vivo** |

---

## 7. Sincronización del equipo

- **Standups verbales cada 3 horas en sede** — 5 min: qué hice, qué sigo, qué bloqueo.
- **WhatsApp del equipo** — solo para alertas de "voy a tocar X" o "rompí algo, dame 5 min".
- **Bendi (búho del Lab)** — dudas del Lab, no decisiones técnicas internas.
- **Convención de código** — identificadores en inglés, comentarios en español.

---

*Doc vivo. Si una asignación cambia, se edita el dueño aquí y se mergea a `dev`.*
