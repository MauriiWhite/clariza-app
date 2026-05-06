# Mauricio — empezar ya

Quick-start específico para tu rol como **Vibecoder** del equipo Cruzaders en Clariza. Lectura: ~10 min. Después estás listo para tirar código.

---

## 1) Setup en tu laptop (5 min)

```bash
git clone https://github.com/MauriiWhite/clariza-app.git   # si no la tenías
cd clariza-app
git checkout dev-mauricio
git pull
npm install
cp .env.example .env.local       # editás cuando lleguen las keys del Lab
npm run dev                      # http://localhost:3000
```

---

## 2) Documentos a leer en orden (15 min)

1. [WORKFLOW.md](WORKFLOW.md) — zonas de propiedad, contratos, mocks, hitos de integración
2. [SPEC.md](SPEC.md) — §4 (arquitectura agéntica) y §7 (UX)
3. [DIAGRAMS.md](DIAGRAMS.md) — flujos visuales
4. [CASES.md](CASES.md) — los 4 casos demo (María, Camila, Patricio, Javiera)
5. [design/DESIGN-SKILL.md](design/DESIGN-SKILL.md) — principios visuales y paleta (cream + ink + clay terracota estilo Anthropic)

---

## 3) Tu zona en `src/modules/`

| Módulo | Qué construir | Espera contrato de |
|---|---|---|
| `diagnosis/` | Card de regulador + `TimelineDeadlines` | Exequiel publica `RegulatoryDiagnosis` y `DeadlineSchedule` |
| `claim/` | `ReclamoPreview` + generador PDF con `@react-pdf/renderer` + plantillas por regulador | Exequiel publica `ClaimDocument` |
| `reminders/` | Form email + cron Resend + tabla `cases` Supabase + magic link auth | Independiente, podés arrancar ya |

> Tu zona es **sólo estos 3 módulos**. El flujo principal (landing, chat, consola, app, core) lo trabaja Exequiel.

---

## 4) Por dónde arrancar (orden recomendado)

1. **`reminders/schema/cases.sql`** — definí la tabla Supabase de casos guardados. No depende de nadie. Hito independiente.
2. **`diagnosis/components/`** — armá `DiagnosisCard.tsx` y `TimelineDeadlines.tsx` con datos mockeados desde `CASES.md` (Caso 1 — María tiene 18 días hábiles a SUPEN).
3. **`claim/components/ReclamoPreview.tsx`** — preview del reclamo con datos hardcodeados de María. Despues sumás `claim/services/PDFGenerator.ts` con `@react-pdf/renderer`.
4. **`claim/templates/`** — plantillas por regulador: `cmf.tsx`, `sernac.tsx`, `suseso.tsx`, `supen.tsx`, `tribunales.tsx`. Cada una recibe el `ClaimDocument` y produce el formato esperado por ese canal.
5. **`reminders/services/email.ts`** + **`cron.ts`** — Resend + cron de Vercel para alertas 7/3/1 días.

### Ruta `/preview` para desarrollar sin depender del agente

Recomendación: armate una ruta `src/app/preview/page.tsx` (tu zona — estás autorizado a tocar `app/` cuando es para preview de tus módulos) que renderice `DiagnosisCard`, `TimelineDeadlines`, `ReclamoPreview` y `ReminderForm` con datos mockeados. Así trabajás los 3 módulos sin levantar el agente.

```tsx
// src/app/preview/page.tsx — solo para desarrollo de Mauricio
import { mockDiagnosis, mockDeadlineSchedule, mockClaimDocument } from "@/modules/diagnosis/mocks";

export default function Preview() {
  return (
    <div className="space-y-8 p-8">
      <DiagnosisCard data={mockDiagnosis} />
      <TimelineDeadlines schedule={mockDeadlineSchedule} />
      <ReclamoPreview claim={mockClaimDocument} />
      <ReminderForm />
    </div>
  );
}
```

Borrala antes del deploy productivo (o protegela tras un flag).

---

## 5) Convenciones del equipo

- **Identificadores en inglés, comentarios en español** (ej: `function classifyCase()` con `// Cruza el caso con la normativa vigente`).
- **TypeScript strict** — correr `npx tsc --noEmit` antes de pushear.
- **Commits chicos** — mergeá a `dev` cuando un módulo esté verde.
- **Si tocás `package.json` o `.env.example`** — avisás por WhatsApp del equipo.
- **Si tocás `WORKFLOW.md` o `SPEC.md`** — solo tu sección, no la de los demás.

---

## 6) No tocar (zona de Exequiel)

```
src/app/                  ← rutas del flujo principal y API routes
src/modules/agent/        ← runner, prompts, tipos
src/modules/tools/        ← las 5 tools del agente
src/modules/regulations/  ← corpus regulatorio + RAG
src/modules/core/         ← design system compartido
src/modules/chat/         ← UI conversacional
src/modules/console/      ← consola con tool calls
data/corpus/              ← markdown de leyes y NCG
scripts/                  ← smoke tests, ingest scripts
```

Si necesitás algo de ahí (un componente del design-system, un tipo, un hook), pedilo en WhatsApp y Exequiel lo expone como contrato público en `@/modules/<modulo>` para que lo importes.

---

## 7) Contratos que esperás de Exequiel

Exequiel publica estos tipos en `@/modules/agent/types` y en cada tool. Los importás y los respetás:

- `ConsoleEvent` — para que tu UI consuma streams si la usás.
- `RegulatoryDiagnosis` — output de `classifyJurisdiction`. Lo renderiza tu `DiagnosisCard`.
- `DeadlineSchedule` — output de `calculateDeadlines`. Lo pinta tu `TimelineDeadlines`.
- `ClaimDocument` — output de `draftClaim`. Lo materializa tu `ReclamoPreview` y `PDFGenerator`.

Mientras Exequiel los publica, vos creás mocks tipados en `src/modules/<modulo>/mocks.ts` con datos del Caso 1 (María) y trabajás contra esos. Cuando los reales aparezcan, swap es un import.

---

## 8) Hitos a respetar

| Hito | Cuándo | Qué tiene que estar listo |
|---|---|---|
| Setup verde | Día 6 ~13:00 | `npm run dev` levanta sin errores en tu laptop |
| Diagnosis demo-able | Día 6 ~16:00 | `/preview` muestra DiagnosisCard + Timeline con mocks |
| Claim demo-able | Día 6 ~18:30 | PDF descargable de un reclamo de María |
| Reminders activable | Día 6 ~20:00 | Form email + envío de prueba con Resend |
| Integración con tools reales | Día 6 ~21:00 | Tus componentes consumen output real del agente |
| Deploy productivo | Día 6 ~23:00 | Vercel deploy verde con tu parte funcionando |

---

## 9) Si te bloqueás

- **Bug bloqueante** → WhatsApp del equipo, pedí 5 min de Exequiel o Seba.
- **Duda regulatoria** → preguntale a Sebastián, él valida normativa.
- **Duda de stack/Claude API** → preguntale al mentor del Lab (Bendi o presencial).
- **No entiendo qué hace un módulo** → leé `WORKFLOW.md` §4 (contratos) y los tipos en `@/modules/agent/types`.

¡A construir 🚀!
