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

## 2. Zonas de propiedad (evita merge conflicts)

| Zona | Owner | Quién más toca |
|---|---|---|
| `src/agent/**` | **Exequiel** | nadie |
| `src/lib/anthropic/**` · `src/lib/regulators/**` | **Exequiel** | nadie |
| `data/corpus/**` · `scripts/**` | **Exequiel** | nadie |
| `src/app/**` | **Mauricio** | nadie |
| `src/components/**` | **Mauricio** | nadie |
| `src/lib/supabase/**` · `src/lib/mcp/**` (envoltura) | **Mauricio** | nadie |
| `CASES.md` · sección impacto del SPEC · `_briefing/` | **Sebastián** | nadie |
| Pitch · ficha cívica · guion video | **Sebastián** | Exequiel revisa técnica |
| `package.json` · `.env.example` | **compartido** | avisar por WhatsApp antes de tocar |
| `README.md` · `SPEC.md` · `DIAGRAMS.md` · `WORKFLOW.md` | **compartido** | secciones distintas |

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
| F3.1 | Layout principal + landing con hook | Mauricio | ⏳ |
| F3.2 | `components/chat/Chat.tsx` — input texto + adjuntar archivo | Mauricio | ⏳ |
| F3.3 | `components/console/Console.tsx` — tool calls visibles en vivo | Mauricio | ⏳ |
| F3.4 | `components/timeline/Timeline.tsx` — plazos hábiles + barra | Mauricio | ⏳ |
| F3.5 | `components/reclamo/ReclamoPreview.tsx` — preview + descarga PDF | Mauricio | ⏳ |
| F3.6 | PWA manifest + responsive móvil-first + accesibilidad alta | Mauricio | ⏳ |
| F3.7 | Estado vacío + estados de carga + error states | Mauricio | ⏳ |

### F4 — Backend & API

| ID | Componente | Owner | Estado |
|---|---|---|---|
| F4.1 | Route handler `/api/agent` con streaming SSE | Mauricio | ⏳ |
| F4.2 | Route handler `/api/upload` para archivos al Files API | Mauricio | ⏳ |
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
| F6.1 | Deploy a Vercel + variables de entorno producción | Mauricio | ⏳ |
| F6.2 | Setup local de cada uno con `.env.local` | Cada uno | ⏳ |
| F6.3 | Smoke test verde antes de cada PR a `dev` | Owner del PR | ✅ infra |
| F6.4 | Modo offline / fallback con casos pre-grabados | Mauricio + Sebastián | ⏳ |

### Resumen de carga por persona

| Persona | Componentes | Foco |
|---|---|---|
| **Exequiel** | F1.1, F1.2, F1.4, F2.1–F2.7, F5.5 | 11 componentes — el cerebro |
| **Mauricio** | F1.3, F3.1–F3.7, F4.1–F4.6, F6.1, F6.4 | 16 componentes — la app que envuelve el cerebro |
| **Sebastián** | F1.5, F2.8, F5.1–F5.4, F5.6–F5.7, F6.4 | 9 componentes — narrativa, validación, pitch |

---

## 4. Manejo de errores — 3 capas

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

## 5. Plan hora-por-hora (referencia rápida)

### Día 6 — miércoles 6 mayo

| Hora | Exequiel | Mauricio | Sebastián |
|---|---|---|---|
| 11:00 | Bienvenida — todos | | |
| 11:30 | Mesa con reguladores — todos | | |
| 12:30–15:30 | F1.1 + F1.2 + F1.4 (corpus + embeddings + Files API) | F1.3 schema + F3.1 layout + F3.2 chat + F6.1 deploy | F5.1 refinar casos + F5.2 draft ficha |
| 15:30–18:30 | F2.1 + F2.2 + F2.6 (extract + search + system prompt) | F4.1 SSE + F3.3 consola + F3.4 timeline | F1.5 + F2.8 validación normativa |
| 18:30–20:00 | F2.3 + F2.4 + F2.5 (classify + deadlines MCP + draft) | F4.3 PDF + F4.5 email cron | Mentor 15min Clay (sandbox + MCP propio) |
| 20:00 | Cierre día 1 oficial | | |
| 20:00–23:30 | Integración E2E | Integración E2E | F5.4 grabar video backup |
| 23:30 | Merge `dev` → `main` + deploy | | F5.7 subir backup a Drive |

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

## 6. Sincronización del equipo

- **Standups verbales cada 3 horas en sede** — 5 min: qué hice, qué sigo, qué bloqueo.
- **WhatsApp del equipo** — solo para alertas de "voy a tocar X" o "rompí algo, dame 5 min".
- **Bendi (búho del Lab)** — dudas del Lab, no decisiones técnicas internas.
- **Convención de código** — identificadores en inglés, comentarios en español.

---

*Doc vivo. Si una asignación cambia, se edita el dueño aquí y se mergea a `dev`.*
