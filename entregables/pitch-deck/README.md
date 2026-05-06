# Pitch deck — exportación

> El .pen está abierto en Pencil pero todavía sin guardar.
> Una vez guardado, el PDF y los PNGs se generan en 30 segundos.

## Paso 1 — Guardar el .pen (1 minuto)

En el editor de Pencil:

1. `Ctrl+S` (Windows) o `Cmd+S` (Mac)
2. Cuadro de diálogo "Save As" → navegar a:
   ```
   x:/Proyectos/fintech/clariza-app/design/pen/
   ```
3. Nombre del archivo: `clariza-pitch.pen`
4. Guardar

## Paso 2 — Avisarme

Avisame "guardado" y corro el export inmediatamente. Va a generar:

```
entregables/pitch-deck/
├── clariza-pitch-deck.pdf      ← ÚNICO archivo a subir al portal Bendita IA
├── slide-01-portada.png
├── slide-02-numeros.png
├── slide-03-reguladores.png
├── slide-04-demo.png
├── slide-05-diferenciador.png
├── slide-06-cierre.png
└── mockup-preview-diagnosis.png
```

## Paso 3 — Subir al portal

En el formulario "Pitch · Sube aquí tus slides o material de apoyo":

**Opción A**: subir directo el PDF como archivo en el campo "Subir archivo"
**Opción B**: subir el PDF a Drive con permisos públicos y pegar el link

Recomendado: **Opción A** (más simple, el portal ya lo guarda).

## Si Pencil no logra exportar

Plan B: capturas manuales en alta resolución. En la app de Pencil:
1. Click derecho sobre cada frame de slide
2. "Export as PNG"
3. Resolución: 2x o 3x
4. Guardar en `entregables/pitch-deck/` con los nombres de arriba

Después combinar los 7 PNGs en un PDF usando una de estas opciones:
- macOS: Preview → drag de los PNGs → File → Export as PDF
- Windows: abrir todos en navegador y "Print to PDF" como un solo doc
- Online: https://smallpdf.com/png-to-pdf (gratis, sin login)

## Node IDs en el .pen

Por si Mauricio o yo necesitamos volver a editar:

| Slide | ID Pencil |
|---|---|
| 1 - Portada | `bi8Au` |
| 2 - Tres números | `F41zG` |
| 3 - 5 reguladores | `BxNdb` |
| 4 - Demo screenshot | `yuOCj` |
| 5 - Diferenciador | `K70Wpf` |
| 6 - Cierre | `G90k7o` |
| Mockup preview | `J0AZb` |
