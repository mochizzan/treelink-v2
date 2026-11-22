# Tailwind migration spec — native CSS → utilities

- Date: 2026-11-21
- Status: awaiting your review (approval required before building)
- Branch: n/a (no git repo in this project)

## Intent

The app is already wired to Tailwind v4 (`vite.config.ts` + `@import "tailwindcss"` in
`src/styles/index.css`), and the color system is already utility-ready:
`src/styles/palette.css` is `@theme static`, `src/styles/semantic.css` is `@theme inline`
(e.g. `bg-background`, `text-foreground`, `border-foreground`). **No changes to
`src/styles/`.**

Everything still written as native CSS lives in `src/App.css` (961 lines) plus the
class names on the components in `src/App.tsx` and `src/components/*.tsx`. The migration
converts that to utilities, with a small native remnant kept in `App.css` for things
Tailwind can't express.

## Decisions (from the brief)

1. **Scope:** everything that maps cleanly converts — page shell, backdrop + dot
   pattern, frame rails, hero, stickers, pill, toast, about/action dialogs — including
   dialog styles. Dialog entry/exit *choreography* (`@starting-style`, `display`
   transitions with `allow-discrete`, the `dialog--closing`/`dialog--behind` exit
   state, parallax-driven transforms, the pointer-tracking dot-lens mask, keyframes,
   reduced-motion rules) stays native. See "Native remnant."
2. **Markup:** BEM class names are replaced by utilities in the components; the old
   `.hero`, `.pill`, `.sticker`, … classes are deleted from `App.css` (the `dialog`
   class stays as a hook for the remnant rules).
3. **Verification:** same visuals and behavior; check with `npm run build` and a
   dev-server eyeball after the change.

## Files

| File | Change |
| --- | --- |
| `src/App.css` | Deleted — static styles move to utilities; native remnant kept (below) |
| `src/App.tsx` | Remove `import './App.css'`; class names → utilities |
| `src/components/Backdrop.tsx` | Class names → utilities; `backdrop__lens` stays (native) |
| `src/components/FrameRails.tsx` | Class names → utilities |
| `src/components/ProfileHero.tsx` | Class names → utilities |
| `src/components/PortraitAvatar.tsx` | `avatar-photo` → utilities |
| `src/components/StickerLink.tsx` | Class names → utilities (sticker is the `group`) |
| `src/components/SocialLinks.tsx` | Class names → utilities |
| `src/components/SupportLink.tsx` | Class names → utilities |
| `src/components/CoffeeMug.tsx` | Unchanged (steam paths are native) |
| `src/components/SiteFooter.tsx` | Class names → utilities |
| `src/components/AboutDialog.tsx` | Class names → utilities |
| `src/components/ActionDialog.tsx` | Class names → utilities |
| `src/components/Toast.tsx` | Class names → utilities |
| `src/components/Dialog.tsx` | Unchanged (choreography is native) |
| `src/styles/` | Unchanged |

## Native remnant (in `App.css`)

```css
:root {
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-exit: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --lens-radius: clamp(110px, 16vw, 170px);
}

/* Dialog open/close choreography */
.dialog { transition: opacity 0.2s ease, display 0.26s allow-discrete; }
.dialog:not([open]) { opacity: 0; transition: none; }
@starting-style { .dialog[open] { opacity: 0 } }
.dialog::backdrop { background-color: var(--overlay); transition: background-color 0.24s ease; }
.dialog--closing { opacity: 0; pointer-events: none; }
.dialog--closing::backdrop { background-color: transparent; transition: none; }
.dialog--behind { opacity: 0; pointer-events: none; }
.dialog--behind::backdrop { background-color: transparent; }
@starting-style { .dialog[open]::backdrop { background-color: transparent } }
.dialog--closing .dialog__panel {
  opacity: 0; transform: translateY(10px) scale(0.98);
  transition: opacity 0.16s var(--ease-exit), transform 0.2s var(--ease-exit);
}
@starting-style { .dialog[open] .dialog__panel { opacity: 0; transform: translateY(18px) scale(0.96); } }

/* Small-screens tweaks with no utility match in place */
@media (max-width: 420px) {
  .hero__bio { max-width: 34ch; }
  .dialog__panel { padding: 24px; }
}

/* Dot-lens mask on the pointer-tracking plane */
.backdrop__lens { /* unchanged: absolute inset-0, --dot-lens bg, radial mask, opacity 0 → 1 */ }

/* Keyframes + reduced-motion + body:has rules (unchanged) */
```

Notes: `--frame-inset` is deleted (converted to spacing + breakpoint variants).
`--ease-bounce` stays because `rise` is used by the native animation on `.hero__stem`.

## Migration map (component → new classes)

### `App.tsx`

- `.page` → `relative z-[1] flex flex-col min-h-[100svh] p-9 sm:p-[60px] lg:p-20`
  (default `--frame-inset` 20px → padding 36px = `p-9`; ≥640px (sm) → 60px; ≥1024px (lg) → 80px = `p-20`. The original's `max(20px, calc(...))` right/left sides are all equal to the shorthand in every breakpoint, so a uniform `p-` is equivalent.)
- `.page__main` → `flex flex-1 flex-col`
- `.hub` → `w-full max-w-[640px] mx-auto text-center`

### `Backdrop.tsx`

- `.backdrop` → `fixed inset-0 overflow-hidden bg-background pointer-events-none z-0`
- `.backdrop__pattern` → `absolute inset-[-64px] bg-background bg-[var(--dot-pattern)] bg-size-[8px_8px] opacity-[0.3] translate-x-[calc(var(--parallax-x,0px)*3)] translate-y-[calc(var(--parallax-y,0px)*3)] will-change-[transform]`
- `.backdrop__lens` → unchanged (native)

### `FrameRails.tsx`

- `.frame` → `absolute inset-0 z-20 pointer-events-none translate-x-[calc(var(--parallax-x,0px)*-0.35)] translate-y-[calc(var(--parallax-y,0px)*-0.35)] will-change-[transform]`
- `.frame__rail` → `absolute bg-foreground opacity-[0.72]`
- `.frame__rail--top` → `absolute top-5 sm:top-11 lg:top-16 right-0 left-0 h-[2px]`
- `.frame__rail--bottom` → `absolute bottom-5 sm:bottom-11 lg:bottom-16 left-0 right-0 h-[2px]`
- `.frame__rail--left` → `absolute top-0 bottom-0 left-5 sm:left-11 lg:left-16 w-[2px]`
- `.frame__rail--right` → `absolute top-0 right-5 sm:right-11 lg:right-16 bottom-0 w-[2px]`
  (all rails also carry the inherited `bg-foreground opacity-[0.72]`)

### `ProfileHero.tsx`

- `.hero` → `flex flex-col items-center`
- `.hero__stem` → `w-[2px] h-9 bg-foreground opacity-[0.72]`
- `.avatar` → `block w-[104px] h-[104px] p-1 border-2 border-solid border-foreground rounded-full bg-surface transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]` + hover `hover:translate-y-[-3px] hover:rotate-[1.5deg] hover:scale-[1.03]` + active `active:scale-[0.97]`
  (original: `transition: transform 0.35s var(--ease-bounce)`; hover kills the hover
  transform while pressing — approximate: keep hover translate/rotate, add active scale.
  Verify on press.)
- `PortraitAvatar` → `.avatar-photo` → `block w-full h-full rounded-full object-cover`
- `.hero__name` → `mt-5 text-[clamp(2.5rem,5.2vw,4.75rem)] font-[900] leading-none tracking-[-0.045em]` (original `margin-top: 20px`)
- `.hero__role` → `mt-3.5 text-lg font-bold leading-[1.35]`
- `.hero__bio` → `max-w-[50ch] mt-3 text-lg leading-[1.5] text-foreground-muted` (the `@media (max-width: 420px) { max-width: 34ch }` rule moves to the remnant — see below)

### `SocialLinks.tsx`

- `.socials` → `flex flex-col items-center gap-[18px] mt-8`

### `StickerLink.tsx`

- `.sticker` → `relative inline-flex w-24 h-24 flex-col items-center justify-center gap-1 border-2 border-solid border-foreground rounded-full bg-accent text-accent-foreground group transition-[transform_0.35s_cubic-bezier(0.34,1.56,0.64,1),background-color_0.2s_ease]`
  - `::before` ring → `before:content-[""] before:absolute before:inset-[-8px] before:border-2 before:border-solid before:border-foreground before:rounded-full before:opacity-[0.16] before:pointer-events-none`
  - hover → `hover:bg-accent-hover hover:translate-y-[-4px] hover:rotate-[-2deg]`
  - active → `active:translate-y-[1px] active:scale-[0.96]`
  - focus ring offset → `focus-visible:outline-offset-[10px]`
- `.sticker__icon` (on `Icon`) → `text-[26px] transition-[transform_0.35s_cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.1] group-hover:rotate-[-4deg]`
- `.sticker__label` → `text-[15px] font-[800] leading-none tracking-[0.01em]`

### `SupportLink.tsx`

- `.support` → `flex justify-center mt-9`
- `.pill` → `inline-flex min-h-14 items-center justify-center gap-2.5 px-[30px] border-2 border-solid border-foreground rounded-[999px] bg-cta text-cta-foreground text-lg font-[800] leading-none transition-[transform_0.35s_cubic-bezier(0.34,1.56,0.64,1),background-color_0.2s_ease]`
  - hover → `hover:bg-cta-hover hover:translate-y-[-3px]`
  - active → `active:translate-y-[1px] active:scale-[0.97]`
- `.pill__icon` (on `CoffeeMug`) → `text-[22px]`

### `SiteFooter.tsx`

- `.footer` → `pt-4 text-foreground-muted text-sm leading-[1.4] text-center`

### `Toast.tsx`

- `.toast` → `fixed bottom-[28px] left-1/2 z-60 flex max-w-[calc(100vw-32px)] items-center gap-2.5 px-[18px] pt-3 pb-3 rounded-[999px] bg-foreground text-background text-[15px] font-[700] leading-[1.2] opacity-0 translate-x-[-50%] translate-y-[10px] pointer-events-none shadow-[0_16px_36px_-16px_var(--overlay)] transition-[opacity_0.25s_ease,transform_0.25s_cubic-bezier(0.22,_1,_0.36,_1)]`
- `.toast.is-visible` → Toast.tsx: `className={message ? 'opacity-100 translate-x-[-50%] translate-y-0' : 'opacity-0 translate-x-[-50%] translate-y-[10px]'}`
- `.toast__dot` → `w-2 h-2 flex-none rounded-full bg-accent`

### `AboutDialog.tsx`

- `.dialog` (on the `<dialog>`) → `dialog fixed inset-0 w-[fit-content] h-[fit-content] max-w-none max-h-none m-auto p-0 border-0 bg-transparent text-foreground overflow-visible` (class kept as a hook for the remnant; transition comes from the remnant `.dialog` rule)
- `.dialog__panel` → `relative w-[min(420px,calc(100vw-32px))] max-h-[calc(100svh-32px)] overflow-y-auto p-[28px] border-2 border-solid border-foreground rounded-[28px] bg-surface shadow-[0_28px_64px_-24px_var(--overlay)] transition-[opacity_0.2s_ease,transform_0.3s_cubic-bezier(0.22,_1,_0.36,_1)]` (class kept — remnant `.dialog--closing .dialog__panel` selectors target it; the ≤420px `padding: 24px` is in the remnant)
- `.dialog__close` → `absolute top-4 right-4 grid w-9 h-9 place-items-center border-2 border-solid border-foreground rounded-full bg-surface-muted text-foreground text-base transition-[background-color_0.2s_ease,transform_0.2s_ease]` + hover `hover:bg-accent` + active `active:scale-[0.92]`
- `.about` → `flex flex-col items-center text-center`
- `.about__avatar` → `w-16 h-16 p-[3px] border-2 border-solid border-foreground rounded-full bg-surface`
- `.about__name` → `mt-3.5 text-2xl font-[900] leading-[1.1] tracking-[-0.03em]`
- `.about__role` → `mt-1 text-foreground-muted text-[15px] font-bold leading-[1.35]`
- `.about__bio` → `max-w-[40ch] mt-4 text-base text-foreground-muted leading-[1.55]`
- `.about__links` → `flex w-full flex-col gap-0.5 mt-5 text-left`
- `.about__link` → `flex min-h-12 items-center gap-3 px-2.5 py-2 rounded-[14px] transition-[background-color_0.2s_ease]` + hover `hover:bg-surface-muted`
- `.about__link-icon` (on `Icon`) → `flex-none text-xl`
- `.about__link-text` → `flex min-w-0 flex-1 flex-col gap-[1px]`
- `.about__link-label` → `text-[15px] font-[800] leading-[1.2]`
- `.about__link-handle` → `overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground-muted leading-[1.2]`
- `.about__link-arrow` (on `Icon`) → `flex-none text-base text-foreground-muted`
- `.about__copy` → `inline-flex w-full min-h-12 items-center justify-center gap-2 mt-5 border-2 border-solid border-foreground rounded-[999px] bg-accent text-accent-foreground text-base font-[800] transition-[background-color_0.2s_ease,transform_0.2s_ease]` + hover `hover:bg-accent-hover` + active `active:scale-[0.98]` (original `.about__copy:active { transform: scale(0.98) }`)
- `.about__copy-icon` (on `Icon`) → `text-lg`

### `ActionDialog.tsx`

- `.dialog__close` → same as AboutDialog's
- `.action` → `flex flex-col items-center text-center`
- `.action__icon` → `grid w-16 h-16 place-items-center border-2 border-solid border-foreground rounded-[18px] bg-accent text-accent-foreground text-[30px] rotate-[-2deg]`
- `.action__title` → `mt-[18px] text-[26px] font-[900] leading-[1.05] tracking-[-0.03em]`
- `.action__handle` → `mt-1.5 text-sm font-bold leading-[1.35] text-foreground-muted`
- `.action__description` → `max-w-[32ch] mt-3.5 text-base leading-[1.5]`
- `.action__choices` → `flex w-full flex-col gap-2.5 mt-6`
- `.action__choice` → `inline-flex w-full min-h-[52px] items-center justify-center gap-2.5 border-2 border-solid border-foreground rounded-[999px] text-base font-[800] leading-none transition-[background-color_0.2s_ease,transform_0.2s_ease]`
  - active → `active:scale-[0.98]`
  - `.action__copy` variant → `bg-surface text-foreground` + hover `hover:bg-surface-muted`
  - `.action__open` variant → `bg-cta text-cta-foreground` + hover `hover:bg-cta-hover`
- `.action__choice-icon` (on `Icon`) → `flex-none text-lg`

### Verified against docs (Tailwind v4.3)

- Spacing/sizes: `p-9`=36px, `w-24`=96px, `h-9`=36px, `gap-1`=4px, `gap-2.5`=10px,
  `gap-2`=8px, `mt-3.5`=14px, `min-h-14`=56px, `text-sm`=14px, `text-base`=16px,
  `text-lg`=18px, `text-2xl`=24px, `w-16`=64px, `pt-4`=16px.
- `leading-none`=1; `leading-[...]` arbitrary supported.
- `z-0`, `z-20`, `z-60` exist; `z-[1]` used for the page.
- `opacity-[0.3]` / `opacity-0` / `opacity-100` valid.
- `translate-[<value>]` sets both axes; `translate-x-[v]`, `translate-y-[v]` used for the parallax planes and toast; `will-change-[...]` supported.
- `content-["..."]` used for the sticker ring's `::before` (`_` = space).
- Not verified from docs (404): the `backdrop` page and the `transition` shorthand page — noted as "verify in dev": `transition-[...]`, `bg-[var(--dot-pattern)]`, `bg-size-[...]`, `w-[104px]`, `shadow-[...]`.

## Behavior-preservation notes

- `.page` padding: original is a shorthand over `calc(var(--frame-inset)+16px)` with a
  `max(20px, …)` floor on the horizontal sides; the computed value is 36px / 60px /
  80px at the three breakpoints, which is what `p-9`/`sm:p-[60px]`/`lg:p-20` give
  (20+16=36; 44+16=60; 64+16=80; right side never exceeds the shorthand in practice).
- `.dialog` keeps the `dialog` class (remnant selectors `:not([open])`,
  `@starting-style`), and the `dialog--closing`/`dialog--behind` state classes remain
  on the elements — their styles move to the remnant.
- The toast's translate uses `translate-x/translate-y` for the -50% center + offset;
  the visible state re-sets both — verify centering in the dev server.
- The avatar's press state keeps hover translate/rotate + active scale (original CSS
  killed the hover transform on `:active`) — verify on press.
- `Dialog.tsx`'s `EXIT_MS` timing constant is unchanged.

## Verification (after building)

1. `npm run build` passes (typecheck + build).
2. `npm run dev` — eyeball the page: page shell, frame, hero, stickers, pill,
   footer, dialog open/close, toast.
3. `npm run lint` passes.
4. Compare against a screenshot of the previous state if available.

## What's left to the builder

Nothing — the spec is the full plan. Values marked "verify in dev" (`transition-[...]`,
`bg-[var(--dot-pattern)]`, etc.) should be confirmed while eyeballing and swapped if a
Tailwind version rejects them.
