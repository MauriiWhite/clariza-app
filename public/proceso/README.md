# public/proceso/

Carpeta para los assets visuales que muestra la página `/proceso`.

## Cómo agregar un screenshot

1. Captura desde Claude Code o donde estés trabajando (`Win+Shift+S`).
2. Guardá la imagen en esta carpeta con uno de estos nombres:
   - `build-conversation.png` ← el que muestra `/proceso/page.tsx` por defecto
   - O agregá uno nuevo y editá el array `SCREENSHOTS` en `src/app/proceso/page.tsx`
3. `git add public/proceso/*.png`
4. `git commit -m "feat(proceso): screenshot del build"`
5. `git push` → Vercel redesployea automático

## Recomendación de formato

- **PNG** (no JPG) — preserva el texto de las consolas nítido
- Resolución mínima: **1280px ancho** para que se vea bien en desktop
- Aspecto recomendado: cercano a 16:12 (que es lo que renderiza la página)

## Para el entregable técnico del Lab

Esta página sirve como evidencia adjunta del uso intensivo de Claude Code.
Podés referenciar la URL `https://clariza-app.vercel.app/proceso` en el
campo "Repo o ZIP (opcional — suma bonus)" del formulario.
