# Clariza

> **Asistente IA que recibe tu problema financiero, lo cruza con la normativa chilena vigente, decide a qué regulador corresponde (CMF, SERNAC, SUSESO, SUPEN o tribunales) y te entrega un reclamo formal listo para enviar.**

Construido para el **Claude Impact Lab Chile 2026** · Línea 01 — Inclusión Financiera · Equipo Cruzaders.

---

## El problema

En 2023 la CMF recibió **más de 28.000 reclamos** contra instituciones financieras. La mayoría llega mal dirigida, fuera de plazo o mal redactada. El sistema regulatorio chileno tiene 5 puertas de entrada (CMF, SERNAC, SUSESO, SUPEN, tribunales) y el ciudadano no sabe cuál tocar.

Clariza es el puente entre la ley y la persona.

## Cómo funciona

1. Describes tu caso en lenguaje natural y adjuntas antecedentes (contrato, cartola, correos).
2. Un agente con tool-use real cruza los hechos con la normativa vigente (Ley 19.496, 21.234, 21.521, 21.680, RAN y circulares CMF).
3. Te dice **a quién reclamar**, **bajo qué normativa**, **en qué plazo** y **con qué petición concreta**.
4. Genera el reclamo formal en PDF, listo para enviar al canal correcto.

## Diferenciador

- **Único agente que ejecuta el tip oficial CMF tal cual** publicado por el Lab.
- **Derivación inteligente entre 5 reguladores** — nadie más cubre el enrutamiento.
- **Termina en acción**, no solo en explicación.

## Stack

- Claude Sonnet 4.6 con tool-use + prompt caching del corpus regulatorio
- Next.js 15 (PWA) + Tailwind
- Supabase + pgvector (RAG sobre normativa CMF)
- Claude Vision para OCR de documentos
- Vercel para deploy

## Arquitectura agéntica

El agente expone 4 tools que el usuario ve operar en una consola en vivo:

- `extraer_antecedentes` — extrae info estructurada de PDFs/imágenes
- `buscar_normativa` — RAG sobre el corpus regulatorio chileno
- `clasificar_competencia` — decide CMF / SERNAC / SUSESO / SUPEN / tribunales
- `generar_reclamo` — produce el documento formal según canal destino

## Estado

🚧 En construcción durante el hackathon (6–7 mayo 2026). Ver [SPEC.md](SPEC.md) para el detalle técnico, plan 48h y rúbrica de evaluación.

## Equipo

**Cruzaders** — primer Impact Lab de Anthropic en LATAM.

- Exequiel Alvarado
- Mauricio Blanco
- Sebastián Fuentes

## Licencia

Por definir tras el evento.
