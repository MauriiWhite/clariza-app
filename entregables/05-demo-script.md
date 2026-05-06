# 05 · Demo script — Video 3-5 min

> A grabar el **6 de mayo, 21:00–22:30** con la app deployada y verde
> Owner cámara/edición: Exequiel · Voz: Sebastián
> Output esperado: MP4 H.264, 1920x1080, ~4:30 de duración total

---

## Setup pre-grabación (15 min antes)

1. **App deployada en Vercel verde** — abrir https://clariza-app.vercel.app/chat
2. **Env var ANTHROPIC_API_KEY** seteada en Vercel (cuando llegue) — sino, OpenRouter
3. **Browser limpio**: ventana Chrome incógnito 1920x1080, sin extensiones
4. **DevTools cerrado** durante demo, abierto solo en zoom de consola
5. **Tab única**: solo `/chat` abierto, nada más en background
6. **Screen recorder**: OBS o macOS QuickTime · 60fps · audio mic interno
7. **Mic test**: probar audio de Sebastián 1 min antes para nivel y silencio
8. **Casos pre-listos en clipboard manager** (ver "Inputs" abajo)

### Inputs pre-cargados (Exequiel pega de clipboard, no tipea)

```
Clip 1: "Mi AFP me cobra 14.200 hace 3 meses, no entiendo por qué."
Clip 2: "Me clonaron la tarjeta del banco BICE. Tres movimientos por $480.000 que no reconozco. Ya bloqueé la tarjeta."
Clip 3: "Le mandé 320 mil pesos a una app llamada PayDay que vi en TikTok. No me responden hace una semana."
```

---

## Storyboard minuto a minuto

### 0:00–0:15 — Hook

**[Pantalla negra, fade in título]**
**Voz Seba:** *"Cuando un chileno tiene un problema con su banco, su AFP o su seguro, lo primero que pierde no es la plata. Es el plazo."*

**[Pantalla → screenshot landing de clariza.cl 2 segundos]**

---

### 0:15–0:45 — Problema

**Voz Seba:** *"En 2023, la CMF recibió 28.000 reclamos. La mayoría llegó mal dirigida o fuera de plazo. El sistema chileno tiene 5 reguladores con plazos distintos, y nadie le explica al ciudadano cuál es el suyo."*

**[Slide del problema con los 3 números — 28.000 / 5M / 21% — overlay sobre grabación]**

---

### 0:45–2:15 — Demo Caso 1 (María)

**[Cambiar a navegador en /chat, pantalla completa]**

**Voz Seba:** *"María, jubilada de 67 años, escribe lo que le pasa."*

**[Exequiel pega Clip 1 → Enter]**

*Espera ~12 segundos mientras corren las tools.*

**Voz Seba (mientras se ven aparecer los tool calls en la consola lateral oscura):** *"El agente lee el caso. Llama a 5 herramientas: extrae los datos, busca normativa real, decide cuál es el regulador correcto, calcula el plazo legal con feriados oficiales, y arma el reclamo formal."*

**[Zoom suave a la consola de la derecha — duración 8s]**

**Voz Seba:** *"Cada cita normativa tiene URL a BCN. No inventa, no alucina."*

**[Cuando aparecen DiagnosisCard + Timeline al final, zoom a esas cards]**

**Voz Seba:** *"En menos de 30 segundos: SUPEN, no CMF. 18 días hábiles. Y el reclamo formal listo para descargar."*

---

### 2:15–3:00 — Demo Caso 3 (Patricio, otro regulador)

**[Volver al input, Exequiel pega Clip 2]**

**Voz Seba:** *"Otro caso. Mismo flujo, otro regulador, otro plazo."*

*Espera ~10 segundos.*

**[Cuando aparece el diagnóstico con CMF y 90 días]**

**Voz Seba:** *"Tarjeta clonada. Esto va a CMF. 90 días corridos según Ley 21.234. El banco debe restituir salvo que pruebe culpa grave."*

---

### 3:00–3:45 — Demo Caso 4 (Javiera, caso mixto)

**[Exequiel pega Clip 3]**

**Voz Seba:** *"Y el caso más serio: una fintech que no está autorizada por la CMF."*

*Espera ~12 segundos.*

**[Cuando aparece el diagnóstico con CMF + Tribunales]**

**Voz Seba:** *"Acá el agente detecta que es estafa. Dos vías paralelas: alerta administrativa a CMF y denuncia penal a la PDI Cibercrimen. Ningún otro equipo del Lab cubre casos mixtos como este."*

---

### 3:45–4:15 — Tecnología

**[Zoom in a la consola con todos los tool calls visibles del último caso]**

**Voz Seba:** *"6 herramientas del agente, integradas con 2 APIs públicas chilenas: feriados oficiales vía Nager.Date y UF/UTM en tiempo real vía mindicador. Anti-alucinación por construcción: el agente solo cita lo que las herramientas le devuelven."*

**[Cut a slide con stack: Claude Sonnet 4.5 · Agent SDK · Files API · Vision · Citations · Prompt Caching]**

---

### 4:15–4:30 — Cierre

**[Logo Clariza centrado, fondo cream]**

**Voz Seba:** *"Clariza no traduce la ley. La pone a tu favor antes de que se te venza el plazo. Cruzaders, Claude Impact Lab Chile 2026."*

**[Fade out con clariza.cl + GitHub URL]**

---

## Lista de takes a grabar

Para el editor — secuencias separadas que después montamos:

1. **Voz en off completa** (Sebastián lee todo el script de corrido sin pausas largas — duración ~2:30 sin pantalla, después se sincroniza con video)
2. **Captura pantalla Caso 1** flujo completo (~1:30 desde input hasta reclamo PDF visible)
3. **Captura pantalla Caso 2** flujo completo (~45s)
4. **Captura pantalla Caso 3** flujo completo (~45s)
5. **Captura zoom consola** del Caso 1 con todos los tool calls (~10s, en alta resolución)
6. **Captura zoom DiagnosisCard + Timeline** Caso 1 (~5s)
7. **Slides estáticos**: portada, problema 3 números, 5 reguladores, stack, cierre

---

## Edición

**Software:** DaVinci Resolve (gratis y profesional) o Premiere si Exequiel ya lo usa.

**Pacing:**
- Cortes secos en cambios de caso, sin transiciones
- Música muy sutil de fondo (lo-fi instrumental, ~-25dB) — opcional
- Voz a -10dB clara, sin reverb
- Zooms suaves de 0.5–1s, no acelerados

**Color grading:**
- Mantener cream del producto, no saturar
- Sutil viñeta clay si el zoom queda frío

**Subtítulos:**
- Burned-in (quemados) en español, no archivos srt aparte
- Tipografía Inter 24px, color ink, fondo cream semi-transparente
- Posición inferior centrada
- Útil para la accesibilidad y para jurados que vean en silencio

**Export:**
- MP4 H.264, 1920x1080, 60fps
- Bitrate ~12 Mbps (calidad alta sin que el archivo sea de 1GB)
- Audio AAC 192kbps
- Subir a YouTube unlisted O Drive O Loom (según prefiera el equipo)

---

## Plan B: si la red de Espacio Riesco se cae

Tener **listas dos versiones**:

1. **Versión web online** — apunta a la app deployada en Vercel
2. **Versión web local** — mismo flujo grabado con `npm run dev` en localhost:3000

Si en vivo el día 7 algún demo falla, **proyectamos el MP4 backup**. Lo importante es contar la historia, no que el live sea perfecto.

---

## Checklist final pre-submit

- [ ] Video grabado y editado (~4:30)
- [ ] Subido a Drive con permisos "cualquiera con link puede ver"
- [ ] Link probado desde otro dispositivo / cuenta
- [ ] Audio nítido, voz clara, sin clipping
- [ ] Subtítulos legibles
- [ ] Sin información sensible visible (RUTs reales, claves, etc.) — solo casos demo
- [ ] No usamos imágenes con copyright (logos de bancos solo en menciones de demo, no como branding)
