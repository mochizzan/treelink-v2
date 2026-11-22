# Color system

The palette lives in three layers so raw values, semantic roles, and global
styles stay separate and easy to change.

| File           | Responsibility                                                        |
| -------------- | --------------------------------------------------------------------- |
| `palette.css`  | Raw brand scales (`gold`, `blue`, `sand`) with steps from 50 to 950.   |
| `semantic.css` | Role tokens (`background`, `primary`, `accent`, …) as light/dark pairs. |
| `base.css`     | Global element styles that consume the semantic tokens.                |
| `index.css`    | Entry point imported by `src/main.tsx`.                                |

Component styles stay in `src/App.css`.

## Anchors

The three hex codes from the brief are preserved exactly in the raw scale:

| Token      | Hex       | Role in the UI                         |
| ---------- | --------- | -------------------------------------- |
| `gold-500` | `#AFA640` | Accent surface (light theme)           |
| `gold-600` | `#A79E38` | Accent hover (light theme)             |
| `blue-500` | `#418FFF` | Brand blue, CTA fill and focus ring    |

All other steps are generated in OKLCH at the same hue (gold `104.3°`,
blue `257.9°`) so the ramp stays perceptually even. The warm neutral scale
(`sand`) uses hue `100°` at very low chroma.

## Semantic roles

Each role is declared once with `light-dark(light, dark)` in `semantic.css`.

| Token                        | Light     | Dark      | Typical use                     |
| ---------------------------- | --------- | --------- | ------------------------------- |
| `--background`               | `#DFDBE5` | `#171220` | Lilac dot-pattern ground        |
| `--surface`                  | `#F6F3F8` | `#211A2C` | Cards, panels                   |
| `--surface-muted`            | `#E9E4EF` | `#2B2337` | Secondary surfaces, code blocks |
| `--foreground`               | `#241F2C` | `#F4F0F9` | Primary text                    |
| `--foreground-muted`         | `#4F465C` | `#BCB2CC` | Secondary text                  |
| `--border`                   | `#C9C1D4` | `#453C54` | Dividers and outlines           |
| `--border-strong`            | `#A99FB7` | `#5F5470` | Emphasized borders              |
| `--primary`                  | `#1B447F` | `#8FB8FF` | Primary actions                 |
| `--primary-hover`            | `#12305C` | `#B4CFFF` | Primary hover                   |
| `--primary-foreground`       | `#FFFFFF` | `#171220` | Text on primary                 |
| `--primary-subtle`           | `#EEF3FB` | `#172A4A` | Quiet primary backgrounds       |
| `--primary-subtle-foreground` | `#12305C` | `#BBD7FF` | Text on quiet primary           |
| `--cta`                      | `#418FFF` | `#6DA8FF` | Support pill fill               |
| `--cta-hover`                | `#2F82FA` | `#95C0FF` | Support pill hover              |
| `--cta-foreground`           | `#15121C` | `#171220` | Ink text on the blue fill       |
| `--accent`                   | `#AFA640` | `#BFB867` | Accent actions                  |
| `--accent-hover`             | `#A79E38` | `#CFCB8F` | Accent hover                    |
| `--accent-foreground`        | `#15121C` | `#171220` | Text on accent                  |
| `--accent-subtle`            | `#F1EFD9` | `#2D2A03` | Quiet accent backgrounds        |
| `--accent-subtle-foreground` | `#5F5908` | `#CFCB8F` | Text on quiet accent            |
| `--ring`                     | `#418FFF` | `#6DA8FF` | Focus ring                      |
| `--link`                     | `#1B447F` | `#9CC0FF` | Inline links                    |
| `--link-hover`               | `#12305C` | `#C4DAFF` | Inline link hover               |
| `--overlay`                  | `rgb(23 18 32 / 0.58)` | `rgb(0 0 0 / 0.68)` | Dialog backdrop and shadow |
| `--scrollbar-track`          | `#E9E4EF` | `#211A2C` | Scrollbar track                 |
| `--scrollbar-thumb`          | `#8B8199` | `#6E6380` | Scrollbar thumb                 |
| `--scrollbar-thumb-hover`    | `#A79E38` | `#CFCB8F` | Scrollbar thumb hover           |

## Background pattern

The page ground is the brief's lilac dot tile, kept exactly as supplied:

```css
background-color: #dfdbe5;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
```

It is painted on `.backdrop__pattern` in `src/App.css`, an oversized fixed
plane so the parallax can move without exposing an edge. The 4×4 tile is
drawn at 8px so the dots read as a grid rather than grain, and the plane is
held at `opacity: 0.3` so the ground stays a faint texture. The same tile is
reused at 8px in `.backdrop__lens`: a radial-gradient mask that follows the
pointer and carries a stronger fill (`0.65` light / `0.55` dark). Its
background offset matches the base plane's parallax, so the dots line up and
only their opacity changes. The mask is fully opaque at the cursor and fades
to transparent at the rim, so the pattern gets more transparent with distance
from the pointer. On touch screens the lens stays hidden and scroll drives
the parallax; with `prefers-reduced-motion` the pattern is still and the lens
is removed.

`semantic.css` holds two extra tiles for dark mode with the same 4×4
geometry and a tinted fill for the plum ground. `light-dark()` cannot switch
an image, so `--dot-pattern` and `--dot-lens` are mapped by the
`prefers-color-scheme` query and the `.light` / `.dark` classes.

## Theme

Light is the default: `index.html` puts `class="light"` on `<html>`. The
`:root.light` rule in `semantic.css` fixes `color-scheme: light` and maps the
dot tiles to their light variants, so the page stays light even when the OS
prefers dark.

To use dark, change the class on `<html>`:

```html
<html class="dark">
```

The switch is handled entirely by CSS. There is no React theme state: the
quick-actions FAB toggles the class on `<html>` and saves the choice under
`lt2-theme` in `localStorage`. A small inline script in `index.html` restores
it before first paint, so there is still no flash of the wrong theme.

## Scrollbar

`base.css` draws a 14px scrollbar for WebKit/Blink from
`--scrollbar-track`, `--scrollbar-thumb`, and `--scrollbar-thumb-hover`.
Firefox gets the same colors through `scrollbar-color` with a thin width.
`scrollbar-gutter: stable` keeps the page from shifting when a dialog locks
scrolling.

## Tailwind utilities

`@theme inline` maps each role to a Tailwind color utility:

```tsx
<main className="bg-background text-foreground">
  <section className="bg-surface border border-border">
    <h2 className="text-foreground-muted">Links</h2>
    <a className="bg-primary text-primary-foreground hover:bg-primary-hover">
      Open
    </a>
    <button className="bg-accent text-accent-foreground hover:bg-accent-hover">
      Follow
    </button>
  </section>
</main>
```

Raw scale utilities are also available, for example `bg-gold-500`,
`text-blue-600`, or `border-sand-300`.

## Accessibility

| Pair                                  | Ratio    | WCAG        |
| ------------------------------------- | -------- | ----------- |
| `#1B447F` on `#FFFFFF` (primary)      | 9.6:1    | AAA         |
| `#15121C` on `#418FFF` (CTA)          | 5.8:1    | AA, AAA large |
| `#AFA640` on `#15121C` (accent)       | 7.4:1    | AAA         |
| `#5F5908` on `#F1EFD9` (accent subtle) | 6.2:1  | AA, AAA large |
| `#4F465C` on `#DFDBE5` (muted light)  | 6.5:1    | AAA         |
| `#6DA8FF` on `#171220` (primary dark) | 7.6:1    | AAA         |
| `#171220` on `#6DA8FF` (CTA dark)     | 7.6:1    | AAA         |
| `#BFB867` on `#171220` (accent dark)  | 9.0:1    | AAA         |
| `#BCB2CC` on `#171220` (muted dark)   | 9.1:1    | AAA         |
| `#418FFF` on `#DFDBE5` (focus ring)   | 2.3:1    | non-text indicator |

`#418FFF` is intentionally kept as the brand anchor and CTA fill. White on
this blue is only 3.0:1, so every blue fill uses `--cta-foreground`
(`#15121C`) instead. Use `--link` (`#1B447F`) for text links in the light
theme. The blue focus ring is a non-text indicator, always drawn 3px thick
with a 4px offset, and is never used for small text.

## Adding or changing a color

1. Add the step to the relevant scale in `palette.css`.
2. If it has a semantic job, add a `light-dark()` pair in `semantic.css`.
3. If it needs a utility class, expose it in the `@theme inline` block.
4. Re-check the contrast of any text/background pair you introduce.
