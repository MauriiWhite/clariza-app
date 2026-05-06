# Sebastián — empezar ya

Quick-start específico para tu rol como **Comercial / Producto** del equipo Cruzaders en Clariza. Lectura: ~10 min. Después estás listo para entregar tu parte.

---

## 1) Setup en tu laptop (3 min)

No tocás código pero sí necesitás el repo:

```bash
git clone https://github.com/MauriiWhite/clariza-app.git
cd clariza-app
git checkout dev-seba
git pull
```

Para abrir los `.md` en algo cómodo: VSCode con preview de Markdown (`Ctrl+Shift+V`).

---

## 2) Documentos a leer en orden (15 min)

1. [SPEC.md](SPEC.md) — todo el spec, especialmente §1 (one-liner), §2 (problema), §13 (pitch) y §14 (impacto y adopción).
2. [CASES.md](CASES.md) — los 4 casos demo. Tu base de validación.
3. [WORKFLOW.md](WORKFLOW.md) §F5 — tus entregables específicos.
4. [DIAGRAMS.md](DIAGRAMS.md) — los flujos para que entiendas el producto.
5. [design/DESIGN-SKILL.md](design/DESIGN-SKILL.md) — principios de microcopy y narrativa.

---

## 3) Tus entregables (toda la rúbrica de pitch + impacto pasa por vos)

| ID | Componente | Deadline |
|---|---|---|
| F5.1 | 4 casos curados con normativa validada en CASES.md | ✅ ya están — solo validar contra fuentes reales |
| F5.2 | **Ficha cívica oficial** | **Día 7 — 10:00 AM** |
| F5.3 | Guion del video demo 3-5 min | Día 6 — 21:00 |
| F5.4 | Grabar video demo (Mauricio + Exequiel filman, vos narrás) | Día 6 — 22:30 |
| F5.6 | Pitch script 3 min + 2 min Q&A | Día 7 — 14:00 |
| F5.7 | Video MP4 backup del flujo (plan B si falla red) | Día 6 — 23:00 |
| F1.5 | Validación de cada cita normativa contra BCN/CMF | Continuo |
| F2.8 | QA de cada tool con los 4 casos | Continuo |

---

## 4) Por dónde arrancar (orden recomendado)

### Día 6 — mañana (12:30–15:30)

**A. Refinar los 4 casos en CASES.md:**
- Verificá cada cita normativa abriendo:
  - https://www.bcn.cl/leychile (para leyes)
  - https://www.cmfchile.cl/portal/principal/613/w3-propertyname-702.html (para NCG y circulares)
  - https://www.sernac.cl (para SERNAC)
- Si una cita es imprecisa o el artículo cambió, **avisame en WhatsApp y la corregís en una PR a `dev-seba`**.

**B. Draft de la ficha cívica (deadline mañana 10:00):**
La ficha cívica es un formulario estructurado oficial del Lab. Tiene que tener:
- Línea temática: 01 — Inclusión Financiera
- Problema ciudadano (1 párrafo, lenguaje simple)
- Segmento específico (mapeá a los 3 perfiles oficiales: jubilado invisible, emprendedora a ciegas, víctima del fraude)
- Propuesta de valor (usá la plantilla del SPEC §14.1)
- Canal de adopción (B2G primario: CMF + SERNAC)
- Datos usados (lista las 9+ fuentes regulatorias del SPEC §5.1)

Trabajalo en un Google Doc compartido, llevalo al formulario oficial cuando esté listo.

### Día 6 — tarde (15:30–18:30)

**C. Validación de tools contra casos:**
Cuando Exequiel suba una tool a `dev`, vos:
1. Hacés `git pull` en tu rama.
2. Corrés `npm run smoke:agent` con un caso real.
3. Verificás que la respuesta del agente cite normativa real, no inventada.
4. Si detectás alucinación → **issue en GitHub con label "anti-hallucination"** y screenshot.

**D. Mentor 15 min con Clay** (a coordinar con Felipe):
Preguntas concretas:
- ¿Hay sandbox o demo key de la API Bancaria de Clay para hackathon?
- ¿Su MCP Grac.IA es consumible por agentes externos?
- ¿Pueden ser stakeholder confirmado para piloto post-Lab? (subiría puntaje viabilidad de 3 → 4-5)

### Día 6 — noche (18:30–22:30)

**E. Guion del video demo:**
Estructura (ver SPEC §8.1):
- 0:00–0:30 hook ("Miles de chilenos pierden plata no por no tener razón, sino porque se les vence el plazo")
- 0:30–1:30 caso A en vivo (María → SUPEN)
- 1:30–2:15 timeline de plazos aparece
- 2:15–3:00 caso B (Camila → SERNAC, distinto regulador)
- 3:00–3:45 caso C improcedente
- 3:45–4:15 zoom a la consola con tool calls
- 4:15–4:30 cierre con métrica + CTA

**F. Grabar video backup E2E:**
Con la app levantada por Mauricio, grabá el flujo completo de los 3 casos. Subilo a Drive como respaldo por si la red de Espacio Riesco falla en vivo.

### Día 7 — mañana

**G. Submit ficha cívica antes de las 10:00.**

**H. Pitch script (3 min + 2 min Q&A):**
Usá la plantilla del SPEC §13. Practicá con Mauricio y Exequiel. Apunta a:
- Hook claro (15s).
- Problema cuantificado (28.000 reclamos/año).
- Demo en vivo (90s) — apoyado por Mauricio operando la app.
- Diferenciador (4 pilares: tip oficial CMF + multi-regulador + monitor plazos + reclamo formal).
- Cierre accionable.

---

## 5) Lenguaje — tu sello

Toda la narrativa de Clariza pasa por vos. Reglas:

- **Castellano simple** — nivel lectura 9 años. Métrica Fernández-Huerta para validar.
- **Verbos activos** — "Te avisamos" en vez de "se le notificará".
- **Frases cortas** — 15-20 palabras max.
- **Cero jerga jurídica** sin traducir — "interés moratorio compuesto" → "intereses extra por atraso".
- **Cero tono corporativo** — somos una vecina experta, no un banco.

Lee `design/DESIGN-SKILL.md` §9 (microcopy) y §11 (lenguaje visual Anthropic) para profundizar.

---

## 6) No tocar (código)

Vos no tocás `src/`. Tu zona son los `.md` en raíz y `_briefing/` (gitignored, local solo tuyo).

Si encontrás algo en el código que afecta narrativa (ej: un texto en la UI que no suena bien), avisás por WhatsApp y Exequiel/Mauricio lo cambian.

---

## 7) Canales para validación normativa

Cuando dudes si una cita está bien:

- **Leyes** → https://www.bcn.cl/leychile
- **NCG y circulares CMF** → https://www.cmfchile.cl/portal/principal/613/w3-propertyname-702.html
- **Reclamos por entidad CMF** → https://www.cmfchile.cl/institucional/estadisticas/
- **SERNAC** → https://www.sernac.cl
- **API Ley Fácil** (gratis, JSON) → https://www.bcn.cl/api-leyfacil/

---

## 8) Si te bloqueás

- **No entiendo qué hace una tool** → preguntale a Exequiel (él la construye).
- **Esto no se ve / no funciona** → preguntale a Mauricio (él construye UI/backend).
- **Duda del Lab** → Bendi (búho oficial) en `/app` 24/7 o mentor presencial.
- **Cita normativa que no encuentro** → avisame y la marcamos como "pendiente verificar" hasta resolverla.

---

## 9) Hitos críticos

| Cuándo | Qué tiene que estar listo |
|---|---|
| Día 6 ~15:00 | Casos de CASES.md validados con normativa real |
| Día 6 ~21:00 | Guion del video escrito |
| Día 6 ~23:00 | Video backup grabado y subido a Drive |
| **Día 7 — 10:00** | **Ficha cívica enviada** |
| Día 7 ~14:00 | Pitch script ensayado 2+ veces |
| Día 7 tarde | Pitch en vivo (si pasamos Top 6) |

¡Vamos! 🎤
