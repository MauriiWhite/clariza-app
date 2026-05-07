# 03 · Pitch — Clariza

> Cuándo: **7 de mayo, tarde** (solo si pasamos Top 6)
> Owner: **Sebastián** narra · **Exequiel** opera la demo en pantalla
> Duración: **3 min pitch + 2 min Q&A**

---

## Script — 3 minutos

### Hook (15 segundos)

> "Cuando un chileno tiene un problema con su banco, AFP o seguro, lo primero que pierde no es la plata. Es el plazo."

*[Pausa de 1 segundo. Mirar al jurado.]*

---

### Problema (30 segundos)

> "En 2023, la CMF recibió 28.000 reclamos. La mayoría llegó mal dirigida o fuera de plazo, porque el sistema regulatorio chileno tiene 5 puertas de entrada — CMF, SERNAC, SUSESO, SUPEN, tribunales — y nadie le explica al ciudadano cuál es la suya. La gente sabe que tiene razón. No sabe a quién decírsela."

*[Mostrar slide con los 5 logos de los reguladores.]*

---

### Solución — demo en vivo (90 segundos)

> "Esto es Clariza."

*[Cambiar a /chat en pantalla.]*

> "María, jubilada de 67 años, escribe lo que le pasa."

*[Exequiel tipea: "Mi AFP me descuenta 14.200 hace 3 meses, no entiendo por qué."]*

> "El agente lee el caso, busca normativa real chilena, decide cuál es el regulador correcto, y calcula el plazo legal. Todo visible en la consola."

*[Mostrar consola con tool calls visibles: extractEvidence, searchRegulation, classifyJurisdiction, calculateDeadlines, draftClaim.]*

> "En menos de 30 segundos María tiene su diagnóstico: SUPEN, no CMF. 18 días hábiles. Y el reclamo formal listo para descargar."

*[Cambiar al diagnóstico + timeline + PDF.]*

> "Si abro otro caso..."

*[Tipear: "Me clonaron la tarjeta y el banco no devuelve la plata."]*

> "...mismo flujo, otro regulador, otro plazo. CMF. 90 días. Ley 21.234."

*[Volver al jurado.]*

---

### Diferenciador (30 segundos)

> "Tres cosas que ningún otro equipo cubre juntas:"
>
> "**Una.** Derivación inteligente entre los 5 reguladores chilenos. Otros equipos hacen un canal. Nosotros enrutamos."
>
> "**Dos.** Monitor de plazos hábiles con feriados oficiales — la pieza invisible que hace que la gente pierda el reclamo."
>
> "**Tres.** Anti-alucinación regulatoria. El agente solo cita normativa que viene de tools verificadas contra BCN y CMF. Si no la tiene, lo dice."

---

### Cierre (15 segundos)

> "Clariza no traduce la ley. La pone a tu favor antes de que se te venza el plazo. Gracias."

*[Slide final con URL: clariza.cl + logo Cruzaders.]*

---

## Q&A — preguntas probables y respuestas

### "¿Cómo verifican que la normativa que cita es real?"
> "Cada cita viene de una tool con ID estable a una fuente oficial: BCN, CMF, SUPEN. El system prompt prohíbe expresamente citar normativa que no haya sido devuelta por la tool en el turno actual. Si quieres, lo mostramos en la consola en vivo."

### "¿Dónde corre el agente?"
> "Claude Sonnet 4.5 vía Anthropic Agent SDK. Tools de Anthropic: Agent SDK, Files API para Vision sobre cartolas/contratos, MCP listo para ampliar. Stack: Next.js + Vercel + Supabase preparado para pgvector."

### "¿Cuántas personas pueden usarlo? ¿Escala?"
> "PWA web pura, sin descarga, sirve a cualquier smartphone con conexión. La parte cara — la API de Claude — la cubrimos con Prompt Caching y modelo Haiku para extracción Vision (5x más barato). Estimamos USD 0.05 por caso completo."

### "¿Cuál es la viabilidad post-Lab?"
> "B2G primario: CMF y SERNAC ya nos publicaron como pista oficial — el tip salió de ellos. Plan 60 días: piloto con SERNAC Financiero. B2NGO secundario: Coopeuch y ChileMujeres ya distribuyen contenido educativo y nos sumarían."

### "¿Por qué los chilenos van a confiar?"
> "Porque la respuesta cita ley con link a BCN. Y porque acompaña paso a paso, no es un formulario. La diferencia entre 'reclama ante SUPEN' y 'esto va a SUPEN, te toma 18 días, te aviso por mail antes que se venza' es enorme en confianza."

### "¿Y si la persona miente o exagera?"
> "El reclamo es del ciudadano, no de Clariza. Nosotros estructuramos lo que cuenta y lo armamos en formato regulador. La verificación de hechos la hace el regulador, como siempre. Si Clariza detecta inconsistencias, las marca antes de generar el reclamo."

---

## Slides (esqueleto, opcional)

Si subimos slides al portal, seguir este orden minimal — máximo 6 slides para 3 minutos:

1. **Portada**: Logo Clariza + "Tu reclamo financiero, sin abogado." + equipo Cruzaders
2. **Problema**: 28.000 / 5M / 21% — los tres números clave
3. **5 reguladores**: visual con 5 logos + flecha que indica la confusión del ciudadano
4. **Demo screenshot**: pantalla del chat con consola visible (tool calls)
5. **Diferenciador**: 3 pilares con íconos
6. **Cierre**: clariza.cl + créditos del equipo

Estilo visual: cream, ink, clay terracota — el mismo del producto. Tipografía serif (Newsreader) para titulares.

---

## Material de apoyo

**Link a slides:** _[completar al subir]_

**Link al deploy productivo:** _[Vercel cuando esté]_

**Repo:** https://github.com/MauriiWhite/clariza-app

---

## Notas para el día del pitch

- Sebastián práctica la apertura y cierre con tono firme, sin leer.
- Exequiel tiene 2 inputs pre-cargados en clipboard para no fallar tipeando.
- Mauricio queda como respaldo para Q&A técnica si pegan duro con preguntas.
- Si la red falla en Espacio Riesco, tenemos video MP4 backup en USB + en Drive.
- 3 min son MUY cortos. Cronometrar el ensayo varias veces.
