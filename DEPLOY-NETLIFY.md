# Deploy en Netlify

Guía para deployar Clariza en Netlify (alternativa a Vercel).

## Por qué Netlify

- Mejor manejo de variables de entorno con propagación inmediata.
- Plan free generoso para SSE y functions.
- Mismo flujo Git → deploy automático.

## Setup en 5 minutos

### 1. Crear cuenta y conectar repo

1. Ir a https://app.netlify.com → "Add new site" → "Import an existing project"
2. Conectar con GitHub (autorizar la app de Netlify si no lo hiciste)
3. Buscar y seleccionar `MauriiWhite/clariza-app`
4. Branch a deployar: **`main`**

### 2. Configuración de build

Netlify auto-detecta Next.js y usa el plugin oficial. Pero para asegurar:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20 o superior (el repo ya tiene `engines` implícito)

> El repo incluye `netlify.toml` con esta config. Si Netlify pregunta, dejar todo como auto-detect.

### 3. Variables de entorno

Antes del primer deploy, agregar las env vars:

**Site settings** → **Environment variables** → **Add a variable**

Mínimas para que el agente funcione:

| Variable | Valor | Scope |
|---|---|---|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` (la actual) | All deploy contexts |
| `NEXT_PUBLIC_APP_URL` | `https://CLARIZA-NETLIFY-URL.netlify.app` | All deploy contexts |

Cuando llegue la de Anthropic:

| Variable | Valor | Scope |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | All deploy contexts |

> El routing del backend prefiere `ANTHROPIC_API_KEY` > `OPENROUTER_API_KEY` > mock automáticamente.

### 4. Deploy

Click **Deploy site**. Netlify build dura ~3-4 min para Next.js 16.

Vas a recibir una URL tipo `https://random-name-12345.netlify.app`. La podés cambiar en Site settings → Site name.

### 5. Verificación

1. Abrir `/chat` en el sitio deployado.
2. Enviar un caso (ej: "Mi AFP me cobra 14.200 hace 3 meses").
3. En la consola lateral oscura debería aparecer `extractEvidence`, `searchRegulation`, etc. con results reales.
4. Si aparece **"Modo demo (sin API key todavía)"** → la env var no se está leyendo. Volvé al paso 3 y verificá scope "All deploy contexts" + redeploy.

## Auto-deploys

Cada push a `main` dispara redeploy automático. Las otras ramas (`dev`, `dev-mauricio`, etc.) generan **deploy previews** con URLs como `https://deploy-preview-XX--site-name.netlify.app`.

## Domain custom (opcional)

Site settings → Domain management → Add custom domain.
Si tenés `clariza.cl`, agregalo y Netlify provee SSL gratis automático.

## Troubleshooting

### "Build failed: Cannot find module '@netlify/plugin-nextjs'"
Plugin se autoinstala. Si falla, agregar en Build & deploy settings:
- Plugins → @netlify/plugin-nextjs

### El agente sigue en modo demo aunque la env var está
- Verificar nombre exacto: `OPENROUTER_API_KEY` (case-sensitive)
- Scope debe incluir Production, no solo Preview
- Click "Trigger deploy" → "Clear cache and deploy site"

### Streaming SSE muy lento o se corta
El `netlify.toml` ya incluye headers `Cache-Control: no-cache` y `X-Accel-Buffering: no` para `/api/agent`. Si seguís viendo problemas, revisar logs en Functions → ver invocaciones.
