# Clariza — Spec v0.1

**Hackathon:** Claude Impact Lab Chile 2026 · 6–7 mayo · Espacio Riesco · Chile Fintech Forum 2026
**Equipo:** Cruzaders (3 personas) — categoría de inscripción: **AI Builder** (perfiles internos complementarios: AI Builder + Vibecoder + Comercial)
**Track:** Línea 01 — Inclusión Financiera
**Tip de regulador:** CMF — Asistente Inteligente de Consultas y Reclamaciones Financieras
**Ventana de construcción válida:** 2026-05-06 00:00 a 2026-05-07 23:59 hora Chile (UTC-4). Commits fuera de ventana = score técnico 0.

---

## 1. One-liner

> **Clariza es una plataforma de orientación inteligente que democratiza la justicia financiera: toma el relato en lenguaje sencillo del ciudadano, lo transforma en una denuncia formal tipificada, lo deriva al regulador competente (CMF, SERNAC, SUSESO, SUPEN o tribunales) y monitorea los plazos hábiles para que nunca pierda un reclamo por no saber qué decir o cuándo actuar.**

### 1.1 Resumen oficial (para submission)

**El problema:** Miles de chilenos pierden su derecho a restitución económica porque el lenguaje legal es una barrera y los plazos regulatorios son invisibles para el ciudadano común.

**La solución:** Una plataforma de orientación inteligente que democratiza la justicia financiera. La IA toma el relato en lenguaje sencillo, lo transforma en una denuncia formal tipificada y guía paso a paso para que nadie más pierda un reclamo por no saber qué decir o cuándo actuar.

**Cómo usamos IA:** La IA actúa como traductor jurídico y estratega proactivo. Usamos Claude con MCP para conectar en tiempo real con bases de datos de CMF y SERNAC. Funciona como monitor inteligente que calcula días hábiles restantes y envía recordatorios críticos, asegurando que el usuario mantenga control total del proceso de principio a fin, con interpretación y orientación constante basada en su caso.

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
Mapeamos a **3 de los 4 perfiles oficiales del Impact Lab**, cada uno con un caso demo distinto que muestra derivación multi-regulador:

| Perfil oficial | Caso demo | Regulador competente |
|---|---|---|
| **El jubilado invisible** | Comisión adicional AFP no explicada | SUPEN |
| **La emprendedora a ciegas** | Cláusula abusiva en crédito retail | SERNAC |
| **La víctima del fraude** | Cobro indebido tarjeta de banco | CMF |

El cuarto perfil ("la universitaria perdida") queda como caso secundario para post-Lab.

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

**Posición de Clariza:** único agente que ejecuta el tip oficial CMF tal cual, con cuatro pilares que ningún competidor cubre junto:

1. **Derivación inteligente entre 5 reguladores** (CMF / SERNAC / SUSESO / SUPEN / tribunales).
2. **Redacción del reclamo formal** como output accionable.
3. **Monitor de plazos hábiles** — calcula días restantes según ente competente y envía recordatorios críticos antes del vencimiento.
4. **Conexión MCP a fuentes oficiales** CMF y SERNAC en tiempo real.

Frase de pitch frente a colisión: *"Ellos te traducen. Nosotros te resolvemos hasta el reclamo enviado, antes de que se te venza el plazo."*

---

## 4. Arquitectura agéntica (M3 — el criterio más pesado, 35%)

### 4.1 Loop principal
Agent loop con system prompt específico que orquesta tool-use de Claude Sonnet 4.6. Cada paso queda visible en una **consola de razonamiento** que el jurado ve en pantalla (cumple sub-check B3: ≥3 mensajes en ventana).

### 4.2 Tools expuestas (≥2 según rúbrica — vamos con 5 para bonus agéntico)

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

#### `calcular_plazos(ente: Ente, tipo_caso: string, fecha_hechos: Date, fecha_respuesta_entidad?: Date) → Plazos`
Devuelve estructura:
```ts
{
  plazo_total_dias_habiles: number,
  dias_transcurridos: number,
  dias_restantes: number,
  fecha_limite: Date,
  hitos: { fecha: Date, accion: string, critico: boolean }[],
  feriados_considerados: string[]
}
```
Considera feriados oficiales chilenos. Esta tool puede exponerse vía **MCP server propio** para que Claude la consulte como herramienta externa — alineado con el stack del Lab y suma puntos de "pensamiento agéntico".

### 4.3 Sistema de prompts
- **System prompt principal**: rol asistente CMF, restricciones contra alucinación regulatoria, obligación de citar fuente con cada afirmación legal, escalación a "no sé" cuando aplique.
- **Sub-prompts por tool**: cada tool tiene contrato estricto de input/output validado con Zod.

### 4.4 Anti-alucinación (M2 sub-check A6)
- Cada cita normativa que el agente menciona **debe venir de `buscar_normativa`** — el system prompt prohíbe afirmar normativa no devuelta por la tool.
- **Citations nativas de Files API beta** (`citations: { enabled: true }`) cuando se referencian PDFs cargados (circulares CMF, leyes) — Claude devuelve atribución directa al documento y página. Es la primera línea anti-alucinación.
- Validación post-respuesta como segunda capa: regex extrae menciones a artículos/leyes y verifica que estén en las citas devueltas. Si no, se descarta y se vuelve a pedir.
- Si la confianza es baja, el agente lo dice: *"No tengo certeza suficiente — te recomiendo verificar directamente en CMF."*

---

## 5. Datos (M2 — 20%)

### 5.1 Fuentes regulatorias (≥2 según rúbrica — vamos con 9)
1. **RAN — CMF** (Recopilación Actualizada de Normas)
2. **NCG 502** — Registro y obligaciones prestadores Fintec (CMF, ene 2024)
3. **NCG 514** — Sistema de Finanzas Abiertas / Open Finance (CMF, jul 2024)
4. **Ley 21.521** — Fintec
5. **Ley 19.496** — Derechos del consumidor (SERNAC base)
6. **Ley 20.555** — SERNAC Financiero
7. **Ley 21.398** — Pro Consumidor (certificados de deuda 5 días hábiles, etc.)
8. **Ley 21.234** — Fraudes con tarjetas
9. **Ley 21.680** — REDEC (Registro Consolidado de Deudas)
10. **BCN API Ley Fácil** (https://www.bcn.cl/api-leyfacil/) — JSON gratuito, ideal para explicar normas a ciudadanos
11. (Bonus) **Registro Prestadores Fintec (RPSF) CMF** — verificación entidad autorizada vs no autorizada

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
| Modelo principal | Claude Sonnet 4.6 (`claude-sonnet-4-6`) | Tool-use + costo razonable, contexto 1M |
| Modelo razonamiento | Claude Opus 4.7 (`claude-opus-4-7`) con `thinking: adaptive` | Solo para `clasificar_competencia` en casos complejos |
| Modelo rápido | Claude Haiku 4.5 (`claude-haiku-4-5`) | Para validaciones y clasificación previa |
| Agent runtime | `toolRunner` del SDK + Agent SDK opcional | Loop manejado, hooks PreToolUse para auditoría |
| Files API beta | `files-api-2025-04-14` con `citations: { enabled: true }` | Carga corpus regulatorio una vez, citations nativas |
| Prompt caching | Sí — system prompt + corpus cacheados (TTL 1h) | Mínimo 2048 tokens en Sonnet 4.6; verificar `cache_read_input_tokens` |
| Vector DB | Supabase + pgvector | Setup rápido, free tier |
| Embeddings | OpenAI `text-embedding-3-small` | Estándar del Lab |
| MCP server | `@modelcontextprotocol/sdk` para `calcular_plazos` | Suma puntos de "pensamiento agéntico" |
| Vision | Claude Vision multimodal nativo | Evita Tesseract, una sola API |
| PDF output | `@react-pdf/renderer` | Reclamo descargable |
| Hosting | Vercel | Deploy automático, demo en la nube |
| Auth | Magic link Supabase (solo para seguimiento) | Sin password, opcional |
| Créditos | $2.000 USD Claude API por equipo | API key en backend, nunca en frontend |

---

## 7. UX / Pantallas mínimas

1. **Landing** — hook + ejemplo de caso resuelto en 30s.
2. **Chat principal** — input texto + adjuntar archivo + **consola lateral derecha** mostrando el agent loop en vivo (tool calls + resultados).
3. **Diagnóstico** — card con: ente competente, procedencia, normativa invocada (con links), gravedad.
4. **Timeline de plazos** — barra visual con días hábiles transcurridos / restantes, hitos críticos, fecha límite destacada.
5. **Reclamo** — preview del documento + botón descargar PDF + copy texto.
6. **Seguimiento (opcional MVP)** — formulario simple "te avisamos por email" → guarda caso + dispara recordatorios automáticos a 7 / 3 / 1 días del vencimiento.

Estética: clara, alto contraste, tipografía grande (inclusividad: smartphone viejo, conexión lenta, baja alfabetización digital).

---

## 8. Demo y entregables técnicos

**Tres entregables oficiales:**

1. **Ficha cívica** (deadline 7 mayo 10:00): formulario con línea, problema, segmento, propuesta de valor, canal de adopción, datos usados. Sebastián + Exequiel la redactan desde la §1.1 y §14.
2. **Entregable técnico** (deadline 7 mayo 17:00):
   - Obligatorio: **demo video 3-5 min** + **screenshot consola Claude** con tool calls + **system prompt principal** (texto).
   - Bonus: **repo público** (ya lo tenemos), **tools schema**, herramientas Anthropic declaradas (**MCP**, **Agent SDK**, **Extended Thinking**, **Files API** — todas en uso).
3. **Pitch en vivo** (7 mayo tarde, solo si pasamos Top 6): 3 min + 2 min Q&A.

### 8.0 Video demo (M4 — 15%, video 3–5 min)

### 8.1 Estructura del video demo
- **0:00–0:30** — hook: "Miles de chilenos pierden plata no por no tener razón, sino porque se les vence el plazo. Esto es Clariza."
- **0:30–1:30** — caso A en vivo: usuario sube cartola banco, agente analiza, deriva a CMF, genera reclamo.
- **1:30–2:15** — timeline de plazos hábiles aparece: "te quedan 18 días hábiles, te avisamos a los 7, 3 y 1".
- **2:15–3:00** — caso B: AFP → SUPEN. Mostrar que **el agente cambia de regulador y de plazo** según el caso.
- **3:00–3:45** — caso C improcedente: agente explica por qué no aplica reclamo y sugiere acción alternativa.
- **3:45–4:15** — arquitectura agéntica: zoom a la consola con tool calls visibles + MCP a CMF/SERNAC.
- **4:15–4:30** — cierre con métrica de impacto y CTA.

### 8.2 Backup plan
- Versión local funcionando como fallback si el deploy se cae.
- Casos pre-grabados como "modo demo" si la API falla en vivo.

---

## 9. Plan 48h

> **Ventana válida**: 06-mayo 00:00 a 07-mayo 23:59 (UTC-4). Nada de commits previos.

### Día 6 mayo — miércoles

| Hora | Actividad oficial | Responsable | Entregable |
|---|---|---|---|
| 11:00 | Bienvenida + apertura oficial | Todos | Asistir |
| 11:30 | Mesa Pública-Privada con reguladores | Todos | Tomar notas |
| 12:30 | Kick-off de construcción | — | — |
| 12:30–15:30 | Ingesta corpus regulatorio + Files API beta + embeddings | Exequiel | Leyes y NCG cargadas con citations en pgvector |
| 12:30–15:30 | Scaffold Next.js + Vercel + Supabase + UI base | Mauricio | Repo deployado, schema DB, layout chat |
| 12:30–15:30 | 3 casos demo guionados + ficha cívica draft | Sebastián | Casos validados con normativa real |
| 15:30–18:30 | Tools `extraer_antecedentes` + `buscar_normativa` + system prompt | Exequiel | 2 tools verdes + agente respondiendo |
| 15:30–18:30 | API routes + streaming SSE + consola UI + timeline plazos | Mauricio | Frontend conectado al agente |
| 15:30–18:30 | Validación anti-alucinación con casos reales | Sebastián | Cada cita normativa verificada |
| 18:30–20:00 | Tools `clasificar_competencia` + `calcular_plazos` (MCP) + `generar_reclamo` | Exequiel | 5 tools verdes |
| 18:30–20:00 | PDF generator + envío email recordatorio (cron simple) | Mauricio | Reclamo descargable + email funcional |
| 20:00 | **Cierre día 1 oficial** | — | — |
| Noche | Integración E2E + recordatorios email | Todos | Flujo completo funcionando |

### Día 7 mayo — jueves

| Hora | Actividad | Responsable | Entregable |
|---|---|---|---|
| 09:00 | Check-in | Todos | — |
| 09:30 | Mentoría de refinamiento | Todos | Feedback aplicado |
| **10:00** | **Deadline ficha cívica** | Sebastián | Form enviado |
| 10:00–14:00 | Pulido demo + grabación video 3-5 min + screenshot consola | Exequiel + Mauricio | MP4 + screenshot consola + system prompt |
| 14:00–16:30 | Ensayos pitch 3 min + Q&A 2 min | Sebastián lidera, todos | Pitch fluido |
| **17:00** | **Deadline técnico + preselección Top 6** | Líder | Repo + ficha técnica enviados |
| Tarde | Si pasamos: pitches finales | Sebastián + Exequiel | Pitch en vivo |
| Tarde | Premiación + networking | Todos | — |

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

## 11. Equipo y roles

**Cruzaders** — 3 integrantes.

| Persona | Perfil Lab | Rol funcional | Foco |
|---|---|---|---|
| **Exequiel Alvarado** | AI Builder | Datos + Agente | Ingesta corpus regulatorio, embeddings, diseño de tools, agent loop, prompts, screenshot consola, demo |
| **Mauricio Blanco** | Vibecoder | Backend + Frontend | API routes, DB Supabase, integración tools, UI chat + consola + timeline (con Claude Code / Cursor) |
| **Sebastián Fuentes** | Comercial / Producto | QA + Pitch | Casos demo curados, validación normativa anti-alucinación, ficha cívica, narrativa, pitch |

**Lógica del reparto:**
- Exequiel domina IA y datos → owner del corpus + agente.
- Mauricio construye con vibecoding → owner de la app (frontend + backend) que envuelve el agente.
- Sebastián tiene foco comercial → owner de los entregables narrativos y validación de salida.

---

## 12. Métricas de éxito vs rúbrica oficial

Rúbrica final (5 criterios + bonus, escala 1-5):

| # | Criterio | Peso | Cómo lo cumplimos |
|---|---|---|---|
| 1 | Impacto ciudadano | 25% | Mapeo a 3/4 perfiles oficiales + canal B2G CMF/SERNAC + plan post-Lab 60d |
| 2 | Datos responsables | 20% | 9+ fuentes regulatorias reales, Files API citations, validador anti-alucinación |
| 3 | Uso de Claude + agéntico | 25% | 5 tools, MCP server propio, Agent SDK, Extended Thinking, prompt caching, consola visible |
| 4 | Funciona | 15% | Demo video 3-5 min E2E, deploy Vercel, casos pre-grabados como respaldo |
| 5 | Pitch y narrativa | 15% | Hook plazos invisibles + 3 perfiles + cierre accionable |
| — | Bonus agéntico | +5 | MCP + Agent SDK + tool-use multinivel declarados |

Mentoría día 6 es para **refinar**, no es preselección — la preselección Top 6 por línea es **día 7 a las 17:00**.

---

## 13. Pitch final (día 7) — esqueleto

**Hook (15s):** "Cuando un chileno tiene un problema con su banco, AFP o seguro, lo primero que pierde no es la plata. Es el plazo."

**Problema (30s):** 28.000 reclamos al año solo en CMF. La mayoría llega mal dirigida, fuera de plazo o mal redactada. El sistema regulatorio chileno tiene 5 puertas de entrada, plazos hábiles distintos y nadie le explica al ciudadano cuál es cuál.

**Solución demo en vivo (90s):** subir un caso real, el agente clasifica, deriva, calcula los días hábiles restantes, genera el reclamo. Pivot al diferenciador: *misma app, otro caso, otro regulador, otro plazo.*

**Por qué Clariza vs el resto (30s):** único que ejecuta el tip oficial CMF + único con derivación multi-regulador + único que monitorea plazos hábiles + único que termina en reclamo formal listo.

**Cierre (15s):** "Clariza no traduce la ley. La pone a tu favor antes de que se te venza el plazo."

---

## 14. Impacto ciudadano y adopción (rúbrica pitch — 25%)

### 14.1 Propuesta de valor (plantilla oficial Lab)

> Para **el jubilado invisible, la emprendedora a ciegas y la víctima del fraude** que **pierden su derecho a restitución económica porque el lenguaje legal es una barrera y los plazos regulatorios son invisibles**, **Clariza** **traduce su relato en lenguaje sencillo a una denuncia formal tipificada, lo deriva al regulador competente y monitorea sus plazos hábiles** para que **nunca pierdan un reclamo por no saber qué decir o cuándo actuar** — llegando vía **acuerdo con CMF y SERNAC para distribución en sus canales oficiales (B2G), con presencia complementaria en cooperativas y ONGs (B2NGO)**.

### 14.2 Canal de adopción

**Primario — B2G (Regulador adopta en programa público):**
- CMF tiene interés explícito (publicó el tip oficial que ejecutamos).
- SERNAC reduce volumen de reclamos mal dirigidos si los ciudadanos llegan correctamente derivados.

**Secundario — B2NGO:**
- Fundación ChileMujeres, ASECH, FINCA, Coopeuch, Oriencoop atienden población vulnerable que reclama poco por desconocimiento.

**Terciario — B2C directo (PWA pública):**
- Acceso libre desde cualquier smartphone, sin descarga.

### 14.3 Plan post-Lab (target nivel 4-5 en rúbrica)

- **Días 0-15:** contacto con CMF (área de educación financiera y reclamos) presentando los datos del piloto.
- **Días 15-30:** propuesta formal de piloto con SERNAC Financiero.
- **Días 30-60:** integración con cooperativas Coopeuch / Oriencoop en programa de educación financiera.
- **Mantención:** corpus normativo se actualiza con scraping mensual de nuevas circulares CMF.

---

## 15. Out of scope (explícito)

- Login con contraseña / cuenta tradicional — el seguimiento se activa con email simple sin password (link mágico opcional).
- Envío automático del reclamo al canal oficial — solo generamos el documento, el usuario lo presenta.
- WhatsApp Business API — riesgo de aprobación Meta en 48h. Recordatorios solo por email en MVP.
- Integración Open Finance real — fuera de alcance.
- Mobile app nativa — PWA cubre el caso.
- Multi-idioma — español Chile only en MVP.
- Calendario completo de feriados regionales — usamos feriados nacionales + buffer conservador.

---

*Última actualización: 2026-05-06 · Doc vivo, se ajusta tras feedback del mentor.*
