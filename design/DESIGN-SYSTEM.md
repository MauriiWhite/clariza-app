# Clariza — Design System (referencia operacional)

Tokens exactos, clases Tailwind, fuentes y componentes para que **todos los que tocan UI estén alineados**. Si vas a escribir un `<div className="...">` o un estilo, esto es el contrato.

> Los principios están en [DESIGN-SKILL.md](DESIGN-SKILL.md). Acá solo lo que se usa.

**Source of truth real**: `src/app/globals.css` (`@theme` block). Si querés cambiar un token, **solo se edita ahí** y se propaga a todo el proyecto.

---

## 1. Paleta de colores

| Token | Hex | Clase Tailwind (color) | Uso |
|---|---|---|---|
| `--color-cream` | `#FAF7F2` | `bg-cream`, `text-cream` | Fondo principal de la app · texto sobre fondos oscuros |
| `--color-paper` | `#FFFFFF` | `bg-paper` | Cards, surfaces elevadas, inputs |
| `--color-ink` | `#1A1F2E` | `text-ink`, `bg-ink` | Texto primario · acento principal (botón primary) |
| `--color-ink-2` | `#475569` | `text-ink-2` | Texto secundario (subtitles, body) |
| `--color-ink-3` | `#6B7280` | `text-ink-3` | Texto muted (eyebrow, captions, placeholders) |
| `--color-clay` | `#CC785C` | `bg-clay`, `text-clay` | **Único acento cromático** — links, focus ring, números editoriales, CTA secundaria si aplica |
| `--color-clay-soft` | `#E8A88E` | `bg-clay-soft` | Hover de clay, pills informativas |
| `--color-success` | `#059669` | `text-success`, `bg-success` | Estados OK, badges procedente |
| `--color-warning` | `#D97706` | `text-warning`, `bg-warning` | Plazo cercano, atención |
| `--color-error` | `#DC2626` | `text-error`, `bg-error` | Errores reales, plazo vencido |
| `--color-border` | `#E5E7EB` | `border-border` | Bordes sutiles default |
| `--color-border-strong` | `#D1D5DB` | `border-border-strong` | Bordes que necesitan presencia (ej: secondary button) |

**Regla:** **NUNCA** usar arbitrary values (`text-[#abc]`, `bg-[#xyz]`) si existe un token. Si necesitás un color nuevo, agregalo a `globals.css` y documentalo acá.

**Color para llamar atención**: clay (`#CC785C`). No usar azul, no usar verde — esos son funcionales (links/success).

---

## 2. Tipografía

### Fuentes

| Fuente | Variable CSS | Tailwind class | Cuándo usar |
|---|---|---|---|
| **Inter** | `var(--font-sans)` | `font-sans` (default) | UI, body, buttons, inputs, párrafos |
| **Newsreader** | `var(--font-serif)` | `font-serif` | H1, H2, números editoriales (01/02/03), citas destacadas |

Ambas se cargan con `next/font/google` en `src/app/layout.tsx` con `display: swap`. **No agregar otras fuentes.**

### Escala tipográfica (no inventar tamaños intermedios)

| Token | Tamaño | Tailwind class | Uso |
|---|---|---|---|
| `--text-xs` | 12px | `text-xs` | Microcopy, badges, footnotes |
| `--text-sm` | 14px | `text-sm` | Captions, eyebrows, labels de formulario |
| `--text-base` | 16px | `text-base` | Body — el default |
| `--text-lg` | 18px | `text-lg` | Subtítulos, párrafos de hero |
| `--text-xl` | 24px | `text-xl` | H3, títulos de cards |
| `--text-2xl` | 32px | `text-2xl` | H2 de secciones |
| `--text-3xl` | 48px | `text-3xl` | H2 hero, big numbers |
| `--text-4xl` | 64px | `text-4xl` | H1 desktop |

Para H1 de landing usamos clases custom (`text-[88px]` etc.) en serif — esos son títulos editoriales irrepetibles.

### Pesos de fuente — máximo 3 en uso

| Peso | Tailwind | Uso |
|---|---|---|
| 400 (regular) | `font-normal` | Body, párrafos |
| 500 (medium) | `font-medium` | H1/H2 serif (Newsreader medium se ve mejor que bold), eyebrows |
| 600 (semibold) | `font-semibold` | Botones, labels de formulario, énfasis |

**No usar `font-bold` (700)** salvo casos excepcionales — el 600 ya es suficiente y respeta el feel editorial.

### Line-height

- Cuerpo: `leading-relaxed` (1.625) o explicito `leading-[1.5]`
- Títulos grandes: `leading-[1.05]` o `leading-[0.98]` para H1 hero
- UI compacta: default (~1.5)

---

## 3. Espaciado (escala 4/8 — usar la de Tailwind)

```
0   1   2   3   4   6   8   10  12  16  20  24  32  48  64  96
0   4   8  12  16  24  32  40  48  64  80  96 128 192 256 384  px
```

**No inventar valores intermedios**. Si necesitás 22px, repensá la composición — probablemente tengas que cambiar la jerarquía visual, no el spacing.

Padding típico:
- Cards: `p-6` o `p-8`
- Botones: `px-5 py-3` (md) · `px-6 py-3.5` (lg)
- Sections: `py-20 md:py-32` (hero), `py-24 md:py-32` (secciones grandes)
- Inputs: `px-4 py-3`

---

## 4. Bordes y radios

| Token | Tamaño | Clase | Uso |
|---|---|---|---|
| `--radius-sm` | 4px | `rounded-sm` | Pills, badges chicos, focus ring |
| `--radius-md` | 8px | `rounded-md` | Botones, inputs, badges grandes |
| `--radius-lg` | 12px | `rounded-lg` | Cards, paneles, contenedores grandes |

Bordes:
- Default: `border border-border` (1px sutil)
- Énfasis: `border border-border-strong` (1px más visible)
- **No bordes de 2px+** salvo casos especiales (separadores de sección).

---

## 5. Sombras

Solo dos elevaciones; minimal style.

```css
shadow-sm  → 0 1px 2px rgba(26,31,46,0.05)   /* sutil, para hover */
shadow     → 0 2px 8px rgba(26,31,46,0.08)   /* cards elevadas */
```

**Cero `shadow-lg`, `shadow-xl`** — si lo necesitás, repensá el contraste con color en lugar de sombras pesadas.

---

## 6. Foco (accesibilidad)

Todo elemento interactivo tiene foco visible:

```css
:focus-visible {
  outline: 2px solid var(--color-clay);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

Esto está en `globals.css` y se aplica auto. **No quitarlo** de ningún input/button.

---

## 7. Componentes core (importar siempre desde el design-system)

Los primitives viven en `@/modules/core/design-system/`. Si necesitás un primitive nuevo, **agregalo ahí** y documentalo acá — no lo crees en tu módulo.

### Button

```tsx
import { Button } from "@/modules/core/design-system/Button";

<Button variant="primary" size="lg">Probar con mi caso</Button>
<Button variant="secondary" size="md">Ver más</Button>
<Button variant="ghost" size="md">Cancelar</Button>

// Como link:
<Button href="/chat" variant="primary">Empezar</Button>
```

Variantes: `primary` (fill ink + texto cream) · `secondary` (border + transparente) · `ghost` (solo texto + hover sutil).
Tamaños: `md` (default, 16px) · `lg` (18px, +padding).

### Card (próximamente — Mauricio)

Patrón actual mientras no exista `Card.tsx`:

```tsx
<div className="rounded-lg bg-paper border border-border p-6">
  ...
</div>
```

### Input (próximamente — Mauricio)

Patrón actual:

```tsx
<input
  className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-clay"
  placeholder="..."
/>
```

---

## 8. Patrones recurrentes

### Hero editorial
Serif H1 + sans body. Ejemplo en `src/app/page.tsx`:
```tsx
<h1 className="font-serif text-[44px] md:text-[72px] lg:text-[88px] font-medium leading-[0.98] tracking-[-0.02em]">
  ...
</h1>
```

### Eyebrow (texto que va arriba del título)
```tsx
<p className="text-sm font-medium tracking-wide uppercase text-ink-3">
  Asistente de reclamos financieros · Chile
</p>
```

### Card de output del agente
```tsx
<div className="rounded-lg bg-paper border border-border p-8">
  <span className="text-sm font-semibold text-ink-3 uppercase tracking-wide">
    Etiqueta
  </span>
  <h3 className="font-serif text-xl font-medium mt-3">Título</h3>
  <p className="text-base text-ink-2 mt-3 leading-relaxed">Body</p>
</div>
```

### Pill informativa
```tsx
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-cream border border-border text-xs font-medium text-ink-2">
  7 días antes
</span>
```

---

## 9. Mobile-first

Empezar siempre en 375x667 (iPhone SE). Breakpoints Tailwind:

| Prefijo | Min width | Cuándo |
|---|---|---|
| (default) | 0 | Mobile |
| `sm:` | 640 | Tablet pequeña |
| `md:` | 768 | Tablet / desktop chico |
| `lg:` | 1024 | Desktop |
| `xl:` | 1280 | Desktop grande |

**Nunca diseñar primero desktop**. La pantalla principal del demo en el Lab puede ser un proyector, pero los usuarios reales usan celular.

Touch targets mínimos: 44x44px en mobile (botones, links críticos).

---

## 10. Reglas que NO se rompen

1. ✅ **Solo tokens del @theme**. Cero hex hardcoded en componentes.
2. ✅ **Cream como fondo**, paper para superficies elevadas. **No blanco como background general**.
3. ✅ **Serif solo en H1/H2 y números editoriales**. Cuerpo siempre sans.
4. ✅ **Clay como único acento cromático**. Azul/verde solo funcionales.
5. ✅ **Espaciado en escala 4/8**. Si querés 22px, está mal.
6. ✅ **Foco visible siempre**. No quitar el `:focus-visible` global.
7. ✅ **Mobile-first**. Diseñá primero en 375px de ancho.
8. ✅ **Máximo 3 pesos** de fuente en uso (400/500/600).
9. ✅ **Si necesitás un primitive nuevo**, va a `modules/core/design-system/`. No en tu módulo.
10. ✅ **Cambios al sistema** se hacen en `src/app/globals.css` + actualizás este doc, mismo PR.

---

## 11. Checklist antes de pushear UI

- [ ] Sin colores hex hardcoded (busqué `#` en mi diff y solo aparece en globals.css).
- [ ] `npx tsc --noEmit` pasa.
- [ ] Probado en mobile (375px) y desktop.
- [ ] Foco visible en todos los interactivos.
- [ ] Texto legible: contraste ≥ 4.5:1 (Cream + Ink ya cumple).
- [ ] No agregué fuentes nuevas.
- [ ] Si toqué `globals.css` o agregué primitive, actualicé este doc.

---

*Doc operacional. Si encontrás un patrón que repetís ≥3 veces, agregalo acá — esa es señal de que necesita ser primitive.*
