# Cómo generar el PDF en 30 segundos

Sin Pencil. Sin descargar nada. Solo el browser.

## Pasos

1. **Abrir el HTML** en Chrome (doble click sobre `clariza-pitch-deck.html`)

2. **Imprimir como PDF** — `Ctrl+P` (o `Cmd+P` en Mac)

3. En el diálogo de impresión:
   - **Destino**: "Guardar como PDF"
   - **Diseño**: Horizontal (Landscape)
   - **Tamaño de papel**: Personalizado o "Más ajustes" → activar "Tamaño personalizado: 1920 x 1080 px"
   - **Márgenes**: Ninguno (Sin márgenes)
   - **Fondo**: Activar "Gráficos de fondo" (importante — sino se va el cream y el clay)
   - **Escala**: 100%

4. **Guardar** → nombre `clariza-pitch-deck.pdf` en esta misma carpeta

## Verificación

El PDF debe tener **7 páginas**:

1. Portada — Clariza
2. 3 números — 28.000 / 5M / 21%
3. 5 reguladores — pills + quote
4. Demo — chat + consola dark con tool calls
5. Diferenciador — 01 / 02 / 03 en clay
6. Cierre — "Clariza no traduce la ley..."
7. Mockup `/preview/diagnosis` — María SUPEN con DiagnosisCard + Timeline

Si alguna página se ve cortada o sin colores, revisar:
- "Gráficos de fondo" debe estar **activado**
- Tamaño personalizado: 1920 x 1080
- Márgenes: ninguno

## Subir al portal Bendita IA

Campo "Pitch — sube aquí tus slides o material de apoyo":
- **Opción A**: subir directo el PDF como archivo
- **Opción B**: subir a Drive con permisos públicos y pegar link

## Si Chrome no respeta el tamaño 1920x1080

Plan B: usar Firefox o Safari para imprimir, o probar online en https://smallpdf.com/html-to-pdf con la URL local. La mayoría de los navegadores modernos respetan `@page { size: 1920px 1080px }`.
