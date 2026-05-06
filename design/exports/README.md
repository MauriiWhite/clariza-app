# Exports — assets visuales del pitch

## 6 slides para el pitch del 7-may

Diseñadas en Pencil siguiendo el spec de [`entregables/04-slides.md`](../../entregables/04-slides.md). Paleta cream + ink + clay terracota (estilo Anthropic), tipografía serif para titulares, sans para cuerpo.

| # | Slide | Node ID | Propósito |
|---|---|---|---|
| 1 | **Portada** | `bi8Au` | Logo Clariza + sub + equipo + URL |
| 2 | **3 números** | `F41zG` | 28.000 / 5M / 21% — el problema en duro |
| 3 | **5 reguladores** | `BxNdb` | Las 5 puertas del laberinto |
| 4 | **Demo screenshot** | `yuOCj` | Mockup chat + consola con tools visibles |
| 5 | **Diferenciador** | `K70Wpf` | 3 pilares con números clay |
| 6 | **Cierre** | `G90k7o` | "Clariza no traduce la ley..." + CTA |
| **+** | **Mockup /preview/diagnosis** | `J0AZb` | Selector + relato + DiagnosisCard + Timeline (caso María) |

## Cómo exportar desde Pencil

El archivo está abierto en el editor de Pencil pero todavía no se guardó como `.pen`. Para exportar a PNG/PDF:

### Paso 1 — Guardar el .pen
En el editor de Pencil:
1. `Ctrl+S` (o `Cmd+S` en Mac) → "Save As"
2. Guardalo en: `x:/Proyectos/fintech/clariza-app/design/pen/clariza-pitch.pen`

### Paso 2 — Exportar PNG (uno por slide)
En Pencil:
1. Click sobre cada slide (frame)
2. Menú "Export" → PNG
3. Resolución: **2x** (= 3840x2160 final, calidad print-ready)
4. Guardar en: `x:/Proyectos/fintech/clariza-app/design/exports/`
5. Nombrar: `slide-01-portada.png`, `slide-02-numeros.png`, etc.

### Paso 3 — Exportar PDF combinado (para el pitch)
En Pencil:
1. Seleccionar las 6 slides en orden (Shift+click)
2. Menú "Export" → PDF
3. Guardar en: `x:/Proyectos/fintech/clariza-app/design/exports/clariza-pitch-deck.pdf`

## Dimensiones

Cada slide es **1920x1080** (ratio 16:9 estándar para proyección). Exportadas a 2x quedan en 3840x2160 — calidad suficiente para pantalla 4K o impresión a tamaño A3.

## Tipografía embebida

Las slides usan fuentes del sistema (Inter/serif default). Si vas a abrir el PDF en otra máquina sin esas fuentes, usá la opción **"Embed fonts"** en el dialog de exportación.

## Después de exportar

Subir todo a Drive del equipo en una carpeta `clariza-pitch-deck/` con permisos "cualquiera con link puede ver". Pegar el link en el campo "Pitch — material de apoyo" del formulario Bendita IA.

## Plan B si no se logra exportar a tiempo

Las screenshots tomadas con el MCP de Pencil ya quedaron guardadas durante la conversación de diseño. Tomar capturas de pantalla manualmente desde el editor y subirlas como PNG.
