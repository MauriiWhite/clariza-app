# Clariza — Design Skill

Principios curados de los mejores referentes en UX/UI e ilustración, **filtrados por nuestro contexto**: producto cívico para ciudadanos chilenos con baja alfabetización financiera y digital. Es la "skill" que cualquiera del equipo (o Claude) puede consultar cuando diseña una pantalla, un componente o una pieza visual.

> Para los **tokens concretos, clases Tailwind y componentes copy-pasteables** ver [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Este doc es el "por qué", el otro es el "cómo".

> Lectura rápida (5 min). Para profundizar, los referentes están linkeados al final.

---

## 1. Principios fundamentales (no negociables)

### 1.1 Claridad antes que belleza
- Si una persona de 60+ años no entiende qué hacer en 5 segundos, está mal. Punto.
- Refactoring UI: *"Start with the smallest, simplest version of every UI."*
- gov.uk Service Manual: *"Make it simple. Make it clear. Make it fast."*

### 1.2 Una sola decisión por pantalla
- **Ley de Hick**: cuantas más opciones, más tiempo de decisión. En contextos de estrés (un cobro indebido) la mente se nubla con 3+ opciones.
- En cada paso del flujo, **una acción primaria** visible, todas las demás secundarias.

### 1.3 Lenguaje, no jerga
- Don Norman, *The Design of Everyday Things*: la affordance debe coincidir con el modelo mental del usuario.
- Reemplazar "iniciar sesión" → "entrar". "Procesar reclamación" → "armar tu reclamo". "Jurisdicción competente" → "a quién reclamar".

### 1.4 Confianza desde el primer pixel
- En productos cívico-financieros, la persona dudó antes de abrirlo. **Cada elemento o suma confianza o la resta.**
- Confianza se construye con: tipografía sólida, normativa real visible, transparencia ("esto no envía nada todavía"), citas de la fuente oficial.

### 1.5 Performance es UX
- Stripe, Linear: *"perceived performance > actual performance, but both matter"*.
- Skeleton loaders, optimistic UI, streaming SSE para que la consola no se sienta congelada.
- En conexiones lentas (gran parte de nuestro público): bundle pequeño, imágenes optimizadas, ningún spinner que dure +2s sin feedback contextual.

---

## 2. Sistema visual — Refactoring UI aplicado

Adam Wathan + Steve Schoger (libro *Refactoring UI*) son la referencia más práctica que existe. Lo más relevante para Clariza:

### 2.1 Jerarquía con peso, color y tamaño — no con tamaño solo
- Usá **tres pesos de fuente como máximo** (400, 500, 700).
- Usá **una escala de tipografía con multiplicadores fijos** (12, 14, 16, 18, 24, 32, 48, 64). Nada de 17px o 22px improvisados.
- Usá **una escala de gris** (50, 100, 200, 300, 500, 700, 900). El secreto del polish: el texto secundario casi nunca es 50% gris — suele ser 700 con menos peso.

### 2.2 Espaciado en escala 4/8
- Spacing tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Si necesitás un valor intermedio, no estás respetando la escala.** Cambiá la composición antes que romper el sistema.

### 2.3 Color con función, no decoración
- Una paleta neutra (cremas + grises) + **un único accent color** para acción primaria.
- Verde para "todo OK" (procedente, plazo lejano).
- Ámbar para "ojo" (plazo cercano).
- Rojo solo para errores reales (plazo vencido, alucinación regulatoria detectada).
- **Nunca usar color como única señal** — siempre acompañar con icono o texto (accesibilidad para daltonismo).

### 2.4 Bordes y sombras
- Border-radius consistente: 4, 8, 12 (no 6, no 10).
- Sombras suaves (elevation 1-2) para elevar tarjetas, no para llamar atención. Para llamar atención, usá fill o color.

### 2.5 Tablas y listas densidad alta
- Para listados de normativa o casos, alinear izquierda, separadores tenues, hover state visible. Refactoring UI cap. 11.

---

## 3. Tipografía — qué pasa en pantallas de baja calidad

Nuestro público usa smartphones viejos y conexiones lentas. La tipografía tiene que aguantar:

- **Stack del sistema** (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) o **Inter** servida desde fonts.googleapis con `font-display: swap`. **No** custom fonts cargados desde CDN externo.
- Tamaño base 16px. **Nunca 14px en cuerpo** para audiencia 60+.
- Line-height 1.5 en cuerpo, 1.05–1.15 en títulos.
- Letter-spacing -0.01em en títulos grandes (≥32px), 0 en cuerpo.

---

## 4. Componentes — patrones que respetamos

### 4.1 Botones
- Primario: fill sólido, texto blanco, peso 600.
- Secundario: stroke de 1px, fill transparente, texto color primario.
- Terciario / link: solo texto subrayado al hover.
- Padding: 14px vertical, 24px horizontal en desktop. 16/24 en mobile.
- **Ningún botón `disabled` sin un mensaje** de por qué está disabled.

### 4.2 Inputs
- Label arriba del input, no placeholder-as-label (Norman: rompe el modelo mental).
- Estado: idle → focus (ring 2px accent) → error (border + texto rojo + icono).
- Mensaje de error debajo del input, no en tooltip.

### 4.3 Cards (diagnosis, normativa)
- Padding interno 24px.
- Border 1px sutil + radius 8 + shadow opcional muy leve.
- Título peso 600, jerarquía clara, máximo 3 niveles de información.

### 4.4 Loading states — Linear/Stripe pattern
- **Skeleton loaders** que imitan la forma del contenido final, no spinners genéricos.
- Para acciones de >1s: optimistic UI + transición suave al estado real.
- Para nuestro agent loop (consola): cada tool call aparece progresivamente con un fade-in 200ms.

---

## 5. Ilustración — humanidad sin caer en cliché

### 5.1 Referentes
- **Pablo Stanley** (Humaaans, Open Peeps): trazos sueltos, diversidad real, sin gradientes neón.
- **Emanuele Salamanca**: ilustración editorial de Stripe — colores planos, narrativa clara.
- **Jorge Lopez Ramon**: ilustración financiera con calidez (no la típica "señor con corbata y maletín de billetes").

### 5.2 Reglas para Clariza
- **Personajes diversos**: edades 20-80, fenotipos chilenos reales (no stock anglosajón).
- **Sin gradientes saturados** (out: morado-rosa neón). Paleta sobria.
- **Trazos finos consistentes** (1.5px), shapes simples, no over-engineered.
- **Contexto reconocible chileno**: cordillera de fondo, cartola con peso chileno, AFP por nombre.
- **Nunca metáforas violentas** (cárcel, bombas, candados). Para reclamos vamos por: **balanza, brújula, mapa, puente, mano que ayuda**.

### 5.3 Cuándo usar foto vs ilustración
- **Foto** solo en casos reales (testimonio post-Lab). Nunca stock genérico.
- **Ilustración** para todo el resto: hero, cards, estados vacíos, error states.

---

## 6. Productos cívicos — gov.uk Design System

El gobierno británico tiene el manual más maduro del mundo para servicios cívicos. Lo que aplicamos:

### 6.1 Una pregunta por pantalla
- Si el formulario tiene 8 datos, son 8 pantallas (mobile) o 8 secciones claras (desktop).
- Reduce abandono dramáticamente en personas con baja alfabetización digital.

### 6.2 Plain English / Castellano simple
- Verbos activos, oraciones de 15-20 palabras.
- Lectura nivel 9 años (medible con métrica Fernández-Huerta para español).

### 6.3 Mostrar progreso
- Barra de pasos visible: "Paso 2 de 4".
- Permitir "atrás" sin perder datos. Confianza absoluta.

### 6.4 Privacidad y confianza explícitas
- *"Tus datos no se envían a ninguna entidad sin que toques **enviar**."*
- *"Esta app no es la CMF. Es una herramienta para que tu reclamo llegue mejor."*

---

## 7. Accesibilidad — WCAG AA mínimo

- **Contraste**: texto sobre fondo ≥ 4.5:1. Textos grandes (24px+) ≥ 3:1.
- **Foco visible** en todos los elementos interactivos (ring de 2px accent + offset 2px).
- **Click targets** ≥ 44x44px en mobile.
- **Lectores de pantalla**: cada imagen con `alt`, cada botón con label semántico.
- **Sin animaciones críticas** (`prefers-reduced-motion`).
- **Escalable sin romper layout** hasta 200% zoom.

---

## 8. Mobile-first absoluto

Nuestro segmento principal abre Clariza desde celular en una micro o cola de banco.

- Empezar el diseño en 375x667 (iPhone SE), no en desktop.
- Touch primero: hover es decoración. Las interacciones críticas tienen que funcionar tap.
- Header sticky con CTA claro. Footer con datos de soporte.
- **Adjuntar archivo desde cámara** como primer mecanismo (foto del contrato), upload PDF como segundo.

---

## 9. Microcopy — la diferencia entre confianza y abandono

### 9.1 Reglas
- Nunca "Procesando..." → siempre "Buscando la normativa que aplica a tu caso..."
- Nunca "Error 500" → siempre "Algo falló de nuestro lado. Tu caso está guardado, podés reintentar."
- Nunca "Generar reclamo" en pasiva → "Armar mi reclamo".

### 9.2 Para alucinación regulatoria (interna)
- *"No tengo certeza suficiente sobre esa norma. Te recomiendo verificarla en cmfchile.cl o consultar a un abogado."*
- **Honestidad explícita > confianza falsa.**

### 9.3 Para improcedencia
- *"Por lo que me contás, este caso no califica para reclamo formal. Acá te explico por qué y qué podés hacer en cambio."*

---

## 10. Stack técnico de diseño

- **Pencil** (`design/pen/clariza.pen`) — wireframes y exploración visual.
- **Tailwind v4** en `src/modules/core/design-system/` — implementación.
- **Tokens compartidos** entre Pencil y Tailwind: definir variables en Pencil con los mismos nombres que las CSS custom properties (ej: `--color-accent`, `--font-size-body`).

### Paleta inicial — inspirada en el lenguaje público de Anthropic
```
--cream:           #FAF7F2   /* fondo principal cálido */
--paper:           #FFFFFF   /* superficies elevadas */
--ink:             #1A1F2E   /* texto primario */
--ink-2:           #475569   /* texto secundario */
--ink-3:           #6B7280   /* texto muted */
--clay:            #CC785C   /* acento terracota (estilo Anthropic) */
--clay-soft:       #E8A88E   /* clay más claro */
--accent-soft:     #2563EB   /* azul para links */
--success:         #059669
--warning:         #D97706
--error:           #DC2626
--border:          #E5E7EB
--border-strong:   #D1D5DB
```

### Tipografía
- **Sans (UI + cuerpo)**: Inter — neutra, legible a todo tamaño, latin extended para acentos y ñ.
- **Serif (titulares editoriales)**: Newsreader — alternativa libre a Tiempos Headline (la serif que usa Anthropic). Le da a los H1/H2 un peso editorial sin perder modernidad.
- Combinación: serif solo en títulos y números grandes (ej: `01`, `02`, `03` en steps). Cuerpo y UI siempre sans.

## 11. Lenguaje visual de Anthropic — referencia clave

Mirar claude.ai y anthropic.com como faro. Lo que tomamos:

- **Cream cálido** como fondo dominante (no blanco estéril).
- **Serif editorial en titulares** — da peso, autoridad y humanidad. Importante en un producto cívico.
- **Clay terracota** como único accent color cromático. No usar azul o verde para llamar atención — usar clay.
- **Ritmo editorial generoso**: padding vertical 96-128px en secciones, leading 1.5+ en cuerpo, max-width ~700px en párrafos largos.
- **Cero gradientes saturados**, cero sombras pesadas, cero bordes gruesos. Diseño que respeta al lector.
- **Ilustraciones con calidez humana**, no iconos planos genéricos. Si no tenemos tiempo de ilustrar, mejor un emoji bien usado o un símbolo unicode que un icono "tech" estéril.

---

## Referentes para profundizar

| Área | Recurso | Por qué |
|---|---|---|
| UI Foundation | *Refactoring UI* — Adam Wathan, Steve Schoger | El libro más práctico para devs que diseñan |
| UX | *The Design of Everyday Things* — Don Norman | Modelo mental, affordances |
| Sistema cívico | gov.uk Service Manual | Lo más maduro para servicios públicos |
| Sistemas | Material 3 (Google) y Apple HIG | Convenciones de plataforma |
| Craft | Linear y Stripe (web pública) | El estándar 2024-2026 de polish |
| Ilustración | Pablo Stanley, Emanuele Salamanca | Humanidad sin cliché |
| Accesibilidad | WCAG 2.2 + W3C ARIA Authoring Practices | Estándares oficiales |
| Spanish UX writing | *El estilo del lenguaje claro* — RAE Lenguaje claro | Castellano simple |

---

*Doc vivo. Cuando descubramos un patrón que funciona en testeo con usuarios reales, lo agregamos acá.*
