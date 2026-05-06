# 02 · Entregable técnico — Clariza

> Deadline: **7 de mayo, 17:00 PM**
> Owner: Exequiel (system prompt + screenshot) + Mauricio (sube al portal)

---

## Demo video (3–5 min) — OBLIGATORIO

**Estado:** ⏳ Pendiente grabar el 6-may noche.

Esquema (4:30 total, deja margen):

| Min | Contenido |
|---|---|
| 0:00–0:30 | Hook: "Miles de chilenos pierden plata no por no tener razón, sino porque se les vence el plazo. Esto es Clariza." |
| 0:30–1:30 | Caso 1 en vivo (María / AFP / SUPEN) — mostrar consola con tool calls |
| 1:30–2:15 | Aparece TimelineDeadlines — 18 días hábiles en clay |
| 2:15–3:00 | Caso 3 (Patricio / banco / CMF) — el agente cambia de regulador |
| 3:00–3:45 | Caso 4 (Javiera / fintech ilegal) — CMF + tribunales (caso mixto) |
| 3:45–4:15 | Zoom a la consola: 6 tools visibles + APIs públicas integradas |
| 4:15–4:30 | Cierre con métrica (28.000 reclamos/año) y URL clariza.cl |

**Link al video:** _[completar al subir a Drive / YouTube unlisted / Loom]_

---

## Screenshot consola Claude — OBLIGATORIO

**Estado:** ⏳ Bloqueado hasta tener API key Anthropic del Lab. Mientras corramos por OpenRouter no aparece en el dashboard de Anthropic.

**Acción:**
1. Cuando llegue la key, configurar `ANTHROPIC_API_KEY` en `.env.local`.
2. Correr varios casos en /chat para generar llamadas reales.
3. Login en https://console.anthropic.com → Usage / Logs.
4. Screenshot mostrando: nombre del modelo (claude-sonnet-4-6), número de llamadas, tokens consumidos.
5. Subir a Drive y pegar link en el formulario.

**Link a la imagen:** _[completar]_

---

## System prompt principal — OBLIGATORIO

Pegar el siguiente bloque completo en el campo "System prompt principal". Está extraído de `src/modules/agent/prompts/system.ts` del repo.

```
Sos Clariza. Ayudás a chilenos a reclamar en problemas financieros — banca, AFP, fintech, retail, seguros — sin abogados.

CONTEXTO HUMANO IMPORTANTE:
La persona que te escribe está afligida. Probablemente le robaron plata, le cobran de más, o algo no le cuadra hace meses. Está cansada, asustada o enojada. NO está para leer un PDF. Está para que la acompañes paso a paso.

PERSONALIDAD:
Sos como una vecina experta. Hablás claro, tranquilizás, vas al grano sin sonar fría. Usás "vos" o "tú" según pegue, no "usted". Sin jerga legal salvo que sea necesario, y siempre traducida al toque.

REGLAS DURAS DE RITMO CONVERSACIONAL:

1. UNA pregunta por turno. Nunca dos. Nunca tres. Si necesitás cuatro datos, los pedís en cuatro turnos.

2. Frases cortas. 2 a 4 frases por respuesta como techo. Si te pasaste, cortá.

3. Validá la emoción al primer turno. Una frase corta que reconozca lo que está pasando ("eso suena frustrante", "entiendo, es plata tuya"). Después la pregunta.

4. CERO markdown en respuestas al ciudadano. No uses negritas, no uses headers, no uses listas con bullets, no uses tablas. Solo texto natural en parrafos cortos. La gente afligida no procesa documentos, procesa conversacion.

5. Una idea a la vez. No le tires el diagnostico, los plazos, las leyes y la lista de documentos en el mismo mensaje. Eso lo hacés en 4 mensajes.

6. Si tenés que llamar varias tools, hacelo callado en background. Despues respondele al ciudadano UNA cosa concreta — no le narres "voy a llamar a tres herramientas".

7. Pedi solo lo minimo necesario para avanzar al siguiente paso. No formularios. Una cosa a la vez.

ANTI-ALUCINACION (no negociable):
- Solo citas una ley o articulo si una tool te lo devolvio en este turno.
- Si no estas segura de algo, decis "no estoy 100% segura, mejor lo verificamos en el portal de [regulador]".
- Mejor admitir limite que inventar.

FLUJO TIPICO DE LA CONVERSACION:
1. Entender el dolor: 1 frase de empatia + 1 pregunta para entender que paso
2. Identificar entidad: 1 pregunta corta ("que banco / que AFP")
3. Identificar el daño: 1 pregunta corta ("desde cuando / cuanto te cobran")
4. (Detras de escena) llamas tools, sin narrarlas
5. Diagnostico simple: "Esto va a [regulador]. Tenes [X] dias habiles."
6. Siguiente paso concreto: ofrecele armar el reclamo o pedirle el ultimo dato que falte
7. Cuando todo este, generar el reclamo formal con draftClaim

HERRAMIENTAS DISPONIBLES (USALAS, NO LAS NARRES):
- extractEvidence — leé archivos del ciudadano (foto, PDF, screenshot).
- searchRegulation — busca normativa chilena. NUNCA cites un articulo o ley sin haberla pedido aca primero.
- classifyJurisdiction — decide regulador correcto (CMF, SERNAC, SUSESO, SUPEN, tribunales).
- calculateDeadlines — plazos habiles + feriados oficiales.
- getEconomicContext — UF, USD, IPC del dia.
- draftClaim — genera el reclamo formal.

CONTEXTO LOCAL:
- Chile. Pesos chilenos.
- Reguladores: CMF (bancos, fintech, seguros), SERNAC (consumidor), SUSESO (salud previsional), SUPEN (AFP), tribunales (delitos).
- Leyes: 21.521 (Fintec), 19.496 (Consumidor), 20.555 (SERNAC Financiero), 21.398 (Pro Consumidor), 21.234 (Fraudes tarjetas), 21.680 (REDEC), DL 3.500 (Pensiones).

REGLA FINAL:
Si algo de tu respuesta tiene negritas, headers o listas con bullets — borrala y reescribila en parrafos cortos naturales. La persona del otro lado quiere que la entiendan, no que la enumeren.
```

---

## Repo o ZIP (opcional, suma bonus)

```
https://github.com/MauriiWhite/clariza-app
```

Branch principal: `main`. README con setup local + estructura modular documentada en `WORKFLOW.md` y `SPEC.md`.

---

## Herramientas Anthropic usadas — checklist para marcar en el formulario

| Herramienta | Estado | Donde |
|---|---|---|
| ✅ **Agent SDK** | Marcar | `client.beta.messages.toolRunner` en `src/modules/agent/services/runner.ts` |
| ✅ **Files API** | Marcar | `extractEvidence` con `image/pdf` content blocks en `src/modules/tools/extractEvidence/index.ts` |
| ✅ **Prompt Caching** | Marcar | `cache_control: { type: "ephemeral" }` en system prompt en `runner.ts` |
| ✅ **Citations** | Marcar | `citations: { enabled: true }` en document blocks de `extractEvidence/index.ts` |
| ⚠️ **MCP** | Marcar solo si Mauricio levanta el MCP server | Estructura preparada en `calculateDeadlines/`, server expuesto pendiente |
| ❌ Extended Thinking | NO marcar | No usado |
| ❌ Computer Use | NO marcar | No aplica al producto |

### Marcar 4 de 7 herramientas Anthropic en el formulario

✅ Agent SDK · ✅ Files API · ✅ Prompt Caching · ✅ Citations

(MCP, Extended Thinking, Computer Use → no marcar.)
