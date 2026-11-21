# AGENTS.md

Single-package Vite + React 19 + TypeScript app with Tailwind CSS v4. No backend, tests, or CI.

## Commands

- `npm run dev` — Vite dev server with HMR.
- `npm run build` — `tsc -b && vite build`. This is also the only typecheck; there is no standalone typecheck or test script.
- `npm run lint` — Oxlint via `.oxlintrc.json`. It does not typecheck (type-aware rules are disabled).
- `npm run preview` — serve the built `dist/`.

Vite 8 requires Node `^20.19.0 || >=22.12.0` (Node 24 is installed here).

## Layout

- Entry flow: `src/main.tsx` → `src/App.tsx`; global CSS is imported once from `src/styles/index.css`.
- `src/styles/` is a layered color system — read `src/styles/README.md` before changing colors. `palette.css` = raw `gold`/`blue`/`sand` scales, `semantic.css` = role tokens via `light-dark()`, `base.css` = global element styles. Component styles belong in `src/App.css`.
- `public/` is served at `/`; icons are an SVG sprite used as `<use href="/icons.svg#id">`.
- `dist/` is generated and gitignored; never edit it.

## Quirks

- Tailwind v4 is configured entirely in CSS — no `tailwind.config.js` or PostCSS config. Add theme tokens with `@theme` / `@theme inline` in `src/styles/`.
- Keep `@theme static` in `palette.css` for the raw scales. Plain `@theme` would let Tailwind drop steps that are only referenced through semantic variables.
- Theme switching is CSS-only (`color-scheme` plus `.light`/`.dark` on `<html>`). Do not add React theme state.
- Preserve the brand anchors exactly: `gold-500 #AFA640`, `gold-600 #A79E38`, `blue-500 #418FFF`. Use `--link` for light-theme text links; `--ring` (`#418FFF`) is 3.05:1 and fails text contrast.
- TypeScript uses project references (`tsc -b`), `verbatimModuleSyntax` (use `import type`), `erasableSyntaxOnly` (no enums, namespaces, or parameter properties), and `noUnusedLocals`/`noUnusedParameters`. No path aliases — imports are relative.
- `src/App.tsx` is still the stock Vite starter demo (counter, docs/social links), not a finished linktree UI.

## Style

- Match existing code: no semicolons, single quotes, 2-space indent.
