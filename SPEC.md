# Clariza — Spec v0.1

**Hackathon:** Claude Impact Lab Chile 2026 · 6–7 mayo · Espacio Riesco
**Equipo:** Cruzaders (3 personas)
**Track:** Línea 01 — Inclusión Financiera
**Tip de regulador:** CMF — Asistente Inteligente de Consultas y Reclamaciones Financieras

---

## 1. One-liner

> **Clariza es un agente conversacional que recibe el problema financiero de cualquier ciudadano, lo cruza con la normativa vigente, decide a qué regulador corresponde (CMF, SERNAC, SUSESO, SUPEN o tribunales) y le entrega un reclamo formal listo para enviar.**

---

## 2. Problema (M1)

### 2.1 Hecho duro
- **28.000 reclamos** recibidos por la CMF en 2023 contra instituciones financieras (fuente: tip oficial CMF / Impact Lab 2026).
- **21%** de chilenos entiende conceptos financieros básicos (OECD 2023).
- 5M chilenos desbancarizados o sub-bancarizados (cifra del Lab).

### 2.2 Dolor concreto
El ciudadano que tiene un problema financiero **no sabe a quién reclamar**:
- ¿Es CMF, SERNAC, SUSESO o SUPEN?
- ¿Aplica a tribunales?
- ¿Cuáles son los plazos?
- ¿Qué normativa lo respalda?
- ¿Cómo se redacta un reclamo formal?

Resultado: reclamos mal dirigidos, fuera de plazo, mal redactados — o directamente abandonados.

### 2.3 Segmento específico para demo
Clientes de **AFP, seguros y créditos** que enfrentan cobros, negativas o cláusulas que no entienden y no distinguen competencia regulatoria. Es el caso donde la derivación multi-regulador brilla.

### 2.4 Canal concreto
PWA liviana (web móvil-first, opera con conexión lenta) + export de reclamo en PDF firmable.

---

## 3. Diferenciador competitivo

| Competidor (equipo Lab) | Qué hacen | Lo que les falta |
|---|---|---|
| F Base (Luis Arráez) | Traductor lenguaje bancario | No genera acción / no enruta |
| Recupera tus lucas (J. Castillo) | Cobros indebidos en préstamos → SERNAC | Único producto, único canal |
| Amaro Alvial | Alfabetización financiera + trámites | No agéntico explícito |
| Data Guardia (C. González) | Privacidad, cartas de reclamo | Track distinto (Línea 03) |

**Posición de Clariza:** único agente que ejecuta el tip oficial CMF tal cual, con **derivación inteligente entre 5 reguladores** y **redacción del reclamo formal** como output final.

Frase de pitch frente a colisión: *"Ellos te traducen. Nosotros te resolvemos hasta el reclamo enviado."*

---

## 4. Arquitectura agéntica (M3 — el criterio más pesado, 35%)

### 4.1 Loop principal
Agent loop con system prompt específico que orquesta tool-use de Claude Sonnet 4.6. Cada paso queda visible en una **consola de razonamiento** que el jurado ve en pantalla (cumple sub-check B3: ≥3 mensajes en ventana).

### 4.2 Tools expuestas (≥2 según rúbrica — vamos con 4 para bonus agéntico)

#### `extraer_antecedentes(archivo: File) → Antecedentes`
Claude Vision sobre PDF/imagen/foto. Extrae: entidad, producto, monto, fechas, cláusulas relevantes, comunicaciones previas.

#### `buscar_normativa(query: string, fuentes?: string[]) → CitasNormativas[]`
RAG con pgvector sobre corpus pre-indexado:
- Recopilación Actualizada de Normas (RAN) — CMF
- Circulares e instrucciones CMF
- Ley 19.496 (Protección al consumidor)
- Ley 21.234 (Fraudes)
- Ley 21.680 (REDEC)
- Ley 21.521 (Fintech)
- Dictámenes públicos CMF

Devuelve cada cita con: artículo, texto literal, fuente, link al original.

#### `clasificar_competencia(hechos: Antecedentes) → Derivacion`
Devuelve estructura:
```ts
{
  ente_competente: "CMF" | "SERNAC" | "SUSESO" | "SUPEN" | "TRIBUNAL",
  procedencia: "procedente" | "improcedente" | "incompleto",
  gravedad: "alta" | "media" | "baja",
  canal_oficial: string, // URL del canal correcto
  plazo_legal_dias: number,
  motivo_derivacion: string
}
```

#### `generar_reclamo(canal: string, hechos: Antecedentes, normativa: CitasNormativas[]) → Reclamo`
Devuelve PDF/markdown con: identificación, hechos, normativa invocada, petición concreta — formateado según el canal destino (cada regulador tiene formato propio).

### 4.3 Sistema de prompts
- **System prompt principal**: rol asistente CMF, restricciones contra alucinación regulatoria, obligación de citar fuente con cada afirmación legal, escalación a "no sé" cuando aplique.
- **Sub-prompts por tool**: cada tool tiene contrato estricto de input/output validado con Zod.

### 4.4 Anti-alucinación (M2 sub-check A6)
- Cada cita normativa que el agente menciona **debe venir de `buscar_normativa`** — el system prompt prohíbe afirmar normativa no devuelta por la tool.
- Validación post-respuesta: regex extrae menciones a artículos/leyes y verifica que estén en las citas devueltas. Si no, se descarta y se vuelve a pedir.
- Si la confianza es baja, el agente lo dice: *"No tengo certeza suficiente — te recomiendo verificar directamente en CMF."*

---

## 5. Datos (M2 — 20%)

### 5.1 Fuentes regulatorias (≥2 según rúbrica — vamos con 6)
1. RAN — CMF
2. Circulares CMF
3. Ley 19.496 — SERNAC base
4. Ley 21.521 — Fintech
5. Ley 21.234 — Fraudes
6. Ley 21.680 — REDEC
7. (Bonus) Registro de entidades fiscalizadas CMF para verificación de fraude

### 5.2 Pipeline
1. Scrape/descarga del corpus desde fuentes oficiales (script one-shot pre-hackathon legal: el corpus es público).
2. Chunking semántico por artículo/inciso.
3. Embeddings con `text-embedding-3-small` (o equivalente).
4. Index en pgvector (Supabase).
5. Cache de embeddings — no se regeneran en runtime.

### 5.3 Datos sintéticos
3 casos de demo curados manualmente con antecedentes reales o sinteticos justificables ante jurado:
- **Caso A**: cobro indebido tarjeta crédito banco → CMF
- **Caso B**: comisión adicional AFP → SUPEN
- **Caso C**: cláusula abusiva crédito retail → SERNAC

---

## 6. Stack técnico

| Capa | Elección | Justificación |
|---|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind | Stack del usuario, deploy 1-click |
| UI agente | Streaming SSE con consola visible | Cumple M3 sub-check B3 |
| Backend | Next.js Route Handlers + Anthropic SDK | Sin servidor extra |
| Modelo | Claude Sonnet 4.6 (`claude-sonnet-4-6`) | Tool-use + costo razonable; Opus 4.7 para casos complejos opcional |
| Prompt caching | Sí — corpus regulatorio cacheado | Crítico para latencia y costo |
| Vector DB | Supabase + pgvector | Setup rápido, free tier |
| OCR/Vision | Claude Vision (input multimodal) | Evita Tesseract, una sola API |
| PDF output | `@react-pdf/renderer` o similar | Reclamo descargable |
| Hosting | Vercel | Deploy automático, demo en la nube |
| Auth | Ninguna en MVP | No agrega valor a la demo |

---

## 7. UX / Pantallas mínimas

1. **Landing** — hook + ejemplo de caso resuelto en 30s.
2. **Chat principal** — input texto + adjuntar archivo + **consola lateral derecha** mostrando el agent loop en vivo (tool calls + resultados).
3. **Diagnóstico** — card con: ente competente, procedencia, plazo, normativa invocada (con links), gravedad.
4. **Reclamo** — preview del documento + botón descargar PDF + copy texto.

Estética: clara, alto contraste, tipografía grande (inclusividad: smartphone viejo, conexión lenta, baja alfabetización digital).

---

## 8. Demo (M4 — 25%, video 3–5 min)

### 8.1 Estructura del video
- **0:00–0:30** — hook: "5 millones de chilenos no saben a quién reclamar. Esto es Clariza."
- **0:30–1:30** — caso A en vivo: usuario sube cartola banco, agente analiza, deriva a CMF, genera reclamo.
- **1:30–2:30** — caso B: AFP → SUPEN. Mostrar que **el agente cambia de regulador** según el caso.
- **2:30–3:30** — caso C improcedente: agente explica por qué no aplica reclamo y sugiere acción alternativa.
- **3:30–4:00** — arquitectura agéntica: zoom a la consola con tool calls visibles.
- **4:00–4:30** — cierre con métrica de impacto y CTA.

### 8.2 Backup plan
- Versión local funcionando como fallback si el deploy se cae.
- Casos pre-grabados como "modo demo" si la API falla en vivo.

---

## 9. Plan 48h

### Día 6 mayo — 09:00 a 23:59

| Bloque | Hora | Responsable | Entregable |
|---|---|---|---|
| Kickoff + setup repos | 09:00–10:00 | Todos | Repo, .env, accesos |
| Inauguración oficial | 11:00 | — | Asistir |
| Ingesta corpus regulatorio | 10:00–13:00 | Backend | RAN + 4 leyes en pgvector |
| Tools: `buscar_normativa` + `extraer_antecedentes` | 13:00–16:00 | Backend | 2 tools verdes |
| Tools: `clasificar_competencia` + `generar_reclamo` | 16:00–19:00 | Backend | 4 tools verdes |
| Frontend: chat + consola | 13:00–19:00 | Frontend | UI funcional |
| Integración + 3 casos demo | 19:00–21:00 | Todos | E2E funcionando |
| Grabación video demo | 21:00–22:30 | Frontend | MP4 listo |
| Submit corte mentor | antes 23:59 | Líder | Form completo |

### Día 7 mayo — solo si pasamos preselección
- 09:00 — leaderboard de finalistas.
- 09:00–11:30 — pulir pitch 3 min, ensayos, ajustar lo que mentor pidió.
- 12:00 — pitch final.

---

## 10. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Alucinación regulatoria en demo | Alta | Validador post-respuesta + system prompt estricto + 3 casos pre-validados |
| Demo en vivo se cae (red Riesco) | Alta | Deploy Vercel + casos modo offline + video pre-grabado como respaldo |
| Corpus muy grande para indexar en horas | Media | Empezar por 4 leyes núcleo + circulares clave, no RAN completa |
| Equipo de 2/3 con stack desigual | Media | Roles claros desde la 1a hora — ver §11 |
| Colisión con F Base / Recupera tus lucas | Baja | Diferenciador en derivación multi-regulador es defendible |
| Vision API falla con PDFs feos | Media | Fallback a input manual de texto |

### Gates de descalificación
- ❌ Trabajo preexistente — todo se commitea durante el evento.
- ❌ Alucinación regulatoria grave — ver §4.4.
- ❌ Entregables faltantes — checklist final antes de submit.

---

## 11. Equipo y roles (POR CONFIRMAR)

| Rol | Persona | Foco |
|---|---|---|
| Lead técnico + Frontend + Demo | Exequiel | Next.js, UX, video, pitch |
| Backend + Tools | TBD | Ingesta corpus, RAG, tools, agent loop |
| Datos + QA + Pitch coach | TBD | Casos demo, validación normativa, ensayos |

---

## 12. Métricas de éxito (mentor day 6)

Optimizamos contra rúbrica Fase 1:

- ✅ M1 — segmento (clientes AFP/seguros/créditos), canal (PWA + PDF), impacto (28.000 reclamos/año).
- ✅ M2 — 6 fuentes regulatorias reales, validador anti-alucinación.
- ✅ M3 — system prompt específico, 4 tools, consola visible con tool calls en vivo.
- ✅ M4 — video 3–5 min con 3 casos end-to-end.

---

## 13. Pitch final (día 7) — esqueleto

**Hook (15s):** "Cuando un chileno tiene un problema con su banco, AFP o seguro, lo primero que pierde no es la plata. Es la pista de a quién reclamar."

**Problema (30s):** 28.000 reclamos al año solo en CMF. La mayoría llega mal dirigida, fuera de plazo o mal redactada. El sistema regulatorio chileno tiene 5 puertas de entrada y nadie sabe cuál tocar.

**Solución demo en vivo (90s):** subir un caso real, el agente clasifica, deriva, genera el reclamo. Pivot al diferenciador: *misma app, otro caso, otro regulador.*

**Por qué Clariza vs el resto (30s):** único que ejecuta el tip oficial CMF + único con derivación multi-regulador + único que termina en reclamo formal listo.

**Cierre (15s):** "Clariza no traduce la ley. La pone a tu favor."

---

## 14. Out of scope (explícito)

- Login / cuenta de usuario.
- Envío automático del reclamo al canal oficial — solo generamos el documento.
- WhatsApp Business API — riesgo de aprobación Meta en 48h.
- Integración Open Finance real — fuera de alcance.
- Mobile app nativa — PWA cubre el caso.
- Multi-idioma — español Chile only en MVP.

---

*Última actualización: 2026-05-06 · Doc vivo, se ajusta tras feedback del mentor.*
