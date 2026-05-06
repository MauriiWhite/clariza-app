# 06 · Screenshots a capturar — Checklist

> Para los entregables 02 (técnico) y 03 (pitch).
> Día 6 noche, después del deploy verde.

---

## Pre-requisitos

1. **API key Anthropic** seteada en `.env.local` o en Vercel (cuando llegue del Lab).
2. **App deployada** en https://clariza-app.vercel.app o corriendo en local.
3. **Browser**: Chrome incógnito 1920x1080, sin extensiones que ensucien la captura.
4. **Tema OS**: claro, sin barra de notificaciones de WhatsApp/Slack abiertas.

---

## SCREENSHOT A — Consola Anthropic (OBLIGATORIO)

**Para qué:** marca obligatoria del entregable técnico.
**Requiere:** API key Anthropic (no funciona con OpenRouter).

**Pasos:**
1. Login en https://console.anthropic.com
2. Sidebar izquierdo → **Usage** o **Logs**
3. Filtrar por fecha del Lab (6-7 mayo 2026)
4. La pantalla debe mostrar:
   - Nombre del modelo (claude-sonnet-4-6, claude-haiku-4-5)
   - Número de llamadas
   - Tokens consumidos (input/output)
   - Cache reads (si Prompt Caching funcionó — debería ✅)
5. Capturar pantalla completa con `Win + Shift + S` (Windows) o `Cmd + Shift + 4` (Mac)
6. Subir a Drive como `clariza-anthropic-console.png`

**Resolución mínima:** 1920x1080. **Formato:** PNG (no JPG, perdería claridad del texto).

---

## SCREENSHOT B — Consola del agente en /chat (RECOMENDADO)

**Para qué:** mostrar tool calls visibles al jurado, complementa al A.

**Pasos:**
1. Abrir https://clariza-app.vercel.app/chat
2. Tipear (o pegar) "Mi AFP me cobra 14.200 hace 3 meses, no entiendo por qué"
3. Esperar a que terminen los tool calls (~12 segundos)
4. Captura mostrando split chat + consola dark con todos los tool calls visibles
5. Crop a 1920x1080 si es necesario
6. Guardar como `clariza-app-console.png`

**Variante:** capturar también las cards de DiagnosisCard + Timeline + ReclamoPreview que aparecen al final del flujo. Es el "wow moment".

---

## SCREENSHOT C — Landing Page (para slides)

**Para qué:** slide de portada y cierre del pitch.

**Pasos:**
1. Abrir https://clariza-app.vercel.app
2. Captura del hero con título serif + clay + CTAs
3. Resolution: 1920x1080

---

## SCREENSHOT D — DiagnosisCard + Timeline (para slides)

**Para qué:** slide demo del diferenciador.

**Pasos:**
1. Después de correr un caso, scroll hasta ver las cards
2. Captura de la card de regulador (SUPEN) + timeline con barra clay
3. Recortar al borde de las cards para que se vea limpio sobre fondo cream

---

## SCREENSHOT E — Reclamo PDF preview (para slides o video)

**Para qué:** mostrar el output accionable.

**Pasos:**
1. Después de correr Caso 1 o Caso 2 (los que tienen claim mock), scroll al final
2. Captura del componente ReclamoPreview con el markdown del reclamo formal visible

---

## Estructura de carpeta para Drive

```
/clariza-impact-lab-2026
  ├── 01-anthropic-console.png         ← OBLIGATORIO entregable técnico
  ├── 02-app-console.png               ← bonus
  ├── 03-landing.png                   ← slides
  ├── 04-diagnosis-card.png            ← slides
  ├── 05-reclamo-pdf.png               ← slides
  └── 06-demo-video.mp4                ← OBLIGATORIO entregable técnico
```

Permisos: cualquiera con el link puede ver. Probar el link desde una pestaña incógnita antes de pegarlo en el formulario.

---

## Si NO tenemos API key Anthropic a la hora del submit

**Plan B:** documentar transparentemente que usamos OpenRouter como provider durante el desarrollo, mostrar:
- Captura de https://openrouter.ai/settings/credits con consumo real
- Captura de logs de OpenRouter mostrando llamadas a `anthropic/claude-sonnet-4.5`
- Adjuntar nuestra propia consola del agente (Screenshot B) como prueba de tool-use

Esto puede no contar como "consola Claude oficial", pero es honesto y muestra que el sistema funciona.

**Decisión:** preguntar a Bendi (búho) o mentor del Lab si OpenRouter sirve como evidencia técnica si no nos llegó la key Anthropic en plazo.
