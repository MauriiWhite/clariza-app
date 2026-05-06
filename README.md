# Clariza

> **Asistente IA que recibe tu problema financiero, lo cruza con la normativa chilena vigente, decide a qué regulador corresponde (CMF, SERNAC, SUSESO, SUPEN o tribunales) y te entrega un reclamo formal listo para enviar.**

Construido para el **Claude Impact Lab Chile 2026** · Línea 01 — Inclusión Financiera · Equipo Cruzaders.

---

## El problema

Miles de chilenos pierden su derecho a restitución económica porque el **lenguaje legal es una barrera** y los **plazos regulatorios son invisibles** para el ciudadano común. En 2023 la CMF recibió más de 28.000 reclamos contra instituciones financieras — la mayoría llega mal dirigida, fuera de plazo o mal redactada.

Clariza democratiza la justicia financiera.

## Cómo funciona

1. Describes tu caso en lenguaje natural y adjuntas antecedentes (contrato, cartola, correos).
2. Un agente con tool-use real cruza los hechos con la normativa vigente (Ley 19.496, 21.234, 21.521, 21.680, RAN y circulares CMF).
3. Te dice **a quién reclamar**, **bajo qué normativa**, **en qué plazo hábil** y **con qué petición concreta**.
4. Genera el reclamo formal en PDF y **monitorea los días hábiles restantes**, avisándote antes de que se te venza.

## Diferenciador

- **Único agente que ejecuta el tip oficial CMF tal cual** publicado por el Lab.
- **Derivación inteligente entre 5 reguladores** — nadie más cubre el enrutamiento.
- **Monitor de plazos hábiles + recordatorios críticos** — la pieza invisible que nadie resuelve.
- **Termina en acción**, no solo en explicación.

## Stack

- Claude Sonnet 4.6 con tool-use + prompt caching del corpus regulatorio
- MCP para conectar con bases CMF y SERNAC en tiempo real
- Next.js 15 (PWA) + Tailwind
- Supabase + pgvector (RAG sobre normativa CMF)
- Claude Vision para OCR de documentos
- Vercel para deploy

## Arquitectura agéntica

El agente expone 5 tools que el usuario ve operar en una consola en vivo:

- `extraer_antecedentes` — extrae info estructurada de PDFs/imágenes
- `buscar_normativa` — RAG sobre el corpus regulatorio chileno
- `clasificar_competencia` — decide CMF / SERNAC / SUSESO / SUPEN / tribunales
- `calcular_plazos` — días hábiles restantes + hitos críticos (vía MCP)
- `generar_reclamo` — produce el documento formal según canal destino

## Estado

🚧 En construcción durante el hackathon (6–7 mayo 2026).

- [SPEC.md](SPEC.md) — detalle técnico, plan 48h y rúbrica de evaluación
- [DIAGRAMS.md](DIAGRAMS.md) — flujos del producto, agent loop y arquitectura
- [CASES.md](CASES.md) — 4 casos de uso reales (1 por perfil oficial del Lab)

## Equipo

**Cruzaders** — primer Impact Lab de Anthropic en LATAM.

- Exequiel Alvarado
- Mauricio Blanco
- Sebastián Fuentes

## Licencia

Por definir tras el evento.
