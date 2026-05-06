@AGENTS.md

# Clariza — Contexto para Claude Code

Asistente IA de reclamaciones financieras para ciudadanos chilenos. Construido durante el Claude Impact Lab Chile 2026 (6-7 mayo, equipo Cruzaders, track Inclusión Financiera).

## Documentos clave

- [SPEC.md](SPEC.md) — especificación completa del producto, arquitectura agéntica, plan 48h
- [DIAGRAMS.md](DIAGRAMS.md) — flujos visuales y arquitectura
- [CASES.md](CASES.md) — 4 casos de uso reales para guion de demo y validación

## Convención de código

- Identificadores en **inglés** (variables, funciones, tipos, archivos).
- Comentarios en **español**.
- Strings de UI visibles al usuario en **español Chile**.
- Documentación markdown en **español**.

## Estructura

```
src/
  agent/
    tools/        — implementación de las 5 tools (extract, search, classify, deadlines, draft)
    prompts/      — system prompts y templates
  lib/
    anthropic/    — cliente Claude + helpers de tool-use
    supabase/     — cliente DB + helpers de pgvector
    mcp/          — MCP server propio para calcular_plazos
    regulators/   — lógica de derivación CMF/SERNAC/SUSESO/SUPEN/tribunales
  components/
    chat/         — UI del chat con streaming SSE
    console/      — consola lateral con tool calls visibles (M3 sub-check B3)
    timeline/     — visualización de plazos hábiles
    reclamo/      — preview y export del reclamo formal en PDF
  app/            — App Router de Next.js 16
data/
  corpus/         — markdown del corpus regulatorio (RAN, leyes, NCG) antes de indexar
```

## Reglas críticas (rúbrica del Lab)

1. **No inventar normativa** — toda cita legal debe venir de la tool `searchRegulation` o de Files API con `citations: { enabled: true }`. La alucinación regulatoria es gate de descalificación.
2. **Todo el código se commitea entre 06-may 00:00 y 07-may 23:59 hora Chile (UTC-4)**.
3. **Claude es el motor obligatorio** — no usar otros LLMs como motor principal.
4. **Consola visible** — el agent loop debe mostrar ≥3 tool calls en pantalla durante la demo.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Supabase + pgvector · Anthropic SDK · MCP SDK · Resend (recordatorios) · Vercel.
