# Tailwind Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the native CSS in `src/App.css` to Tailwind utility classes. BEM class names on the components are replaced by utilities; `src/App.css` becomes a small native remnant (dialog choreography, easing vars, dot-lens mask, small-screens tweaks).

**Architecture:** Mechanical, file-by-file migration driven by the spec's utility map. Each task swaps class names in one component file; every task ends with `npm run build` passing. Task 13 replaces `src/App.css` content with the remnant. Task 14 re-verifies.

**Tech Stack:** Vite 8, React 19, Tailwind CSS v4.3 (CSS-first, `@theme inline` semantics).

**Spec:** `docs/superpowers/specs/2026-11-21-tailwind-migration-design.md`

## Global Constraints

- `src/styles/` is untouched — `palette.css` (`@theme static`), `semantic.css` (`@theme inline`), `base.css`, `fonts.css` already expose the utilities used below.
- Every class string below is verbatim from the spec (`docs/superpowers/specs/2026-11-21-tailwind-migration-design.md`).
- No smoke/e2e steps — the user excluded the visual verification; per-task checks are the project's static checks: `npm run build` (tsc + vite build).
- No unit tests exist in this project (no test runner, no test files; AGENTS.md: "No backend, tests, or CI") — verification per task is `npm run build`.
- One commit per task.
- Match existing code style: single quotes, no semicolons, 2-space indent (AGENTS.md).

## Review Focus

1. Custom transitions via `transition-[...]` — Tailwind's `transition` docs page is 404 (unverified); if rejected by the version in `package.json`, the transitions drop — check in dev. Owning tasks: StickerLink, SupportLink, AboutDialog, ActionDialog, Toast, App.css remnant (panel transition).
2. `bg-[var(--dot-pattern)]` and `bg-size-[8px_8px]` on `.backdrop__pattern` — the spec marks these "verify in dev" — confirm the dot tile still renders. Task: Backdrop.
3. `w-[min(420px,calc(100vw-32px))]` on `.dialog__panel` — spec: "verify in dev". Task: AboutDialog.
4. Toast translate composability: `translate-x-[-50%]` + `translate-y-*` (spec behavior note) — verify centering in dev. Task: Toast.
5. Dialog remnant selectors must still match: the `dialog` class stays on the `<dialog>` elements (Task 11) and `dialog__panel` on the panel div (Tasks 11, 12).
6. ≤420px tie in Task 13: remnant `padding: 24px` vs utility `p-[28px]` on `.dialog__panel`; remnant `max-width: 34ch` vs utility `max-w-[50ch]` on `.hero__bio` — verify at ≤420px.
7. `--ease-bounce` retained in the remnant (Task 13) — still used by the native `rise` animation on `.hero__stem` in the original `App.css`.

---

### Task 1: App.tsx — page shell

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: the page-shell classes from the spec on `App.tsx`; the other tasks are independent files.

**Steps:**
- [ ] **Step 1: Edit `src/App.tsx`** — remove `import './App.css'` (line 2).
- [ ] **Step 2: Edit `src/App.tsx`** — `<div className="page">` → `<div className="relative z-[1] flex flex-col min-h-[100svh] p-9 sm:p-[60px] lg:p-20">`.
- [ ] **Step 3: Edit `src/App.tsx`** — `<main className="page__main">` → `<main className="flex flex-1 flex-col">`.
- [ ] **Step 4: Edit `src/App.tsx`** — `<div className="hub">` → `<div className="w-full max-w-[640px] mx-auto text-center">`.
- [ ] **Step 5: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 6: Commit** — `git add src/App.tsx && git commit -m "refactor: migrate App page shell to Tailwind utilities"`.

### Task 2: Backdrop.tsx

**Files:**
- Modify: `src/components/Backdrop.tsx`

**Interfaces:**
- Produces: `backdrop`, `backdrop__pattern`, `backdrop__lens` on the `<div>`s in `Backdrop.tsx`.

**Steps:**
- [ ] **Step 1: Edit `src/components/Backdrop.tsx`** — `<div className="backdrop">` → `<div className="fixed inset-0 overflow-hidden bg-background pointer-events-none z-0">`.
- [ ] **Step 2: Edit `src/components/Backdrop.tsx`** — `<div className="backdrop__pattern" />` → `<div className="absolute inset-[-64px] bg-background bg-[var(--dot-pattern)] bg-size-[8px_8px] opacity-[0.3] translate-x-[calc(var(--parallax-x,0px)*3)] translate-y-[calc(var(--parallax-y,0px)*3)] will-change-[transform]" />`.
- [ ] **Step 3: `.backdrop__lens`** — unchanged (native, per spec).
- [ ] **Step 4: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 5: Commit** — `git add src/components/Backdrop.tsx && git commit -m "refactor: migrate Backdrop classes to Tailwind utilities"`.

### Task 3: FrameRails.tsx

**Files:**
- Modify: `src/components/FrameRails.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/FrameRails.tsx`** — `.frame` → `absolute inset-0 z-20 pointer-events-none translate-x-[calc(var(--parallax-x,0px)*-0.35)] translate-y-[calc(var(--parallax-y,0px)*-0.35)] will-change-[transform]`.
- [ ] **Step 2: Edit `src/components/FrameRails.tsx`** — `.frame__rail` → `absolute bg-foreground opacity-[0.72]`.
- [ ] **Step 3: Edit `src/components/FrameRails.tsx`** — `.frame__rail--top` → `absolute top-5 sm:top-11 lg:top-16 right-0 left-0 h-[2px]`.
- [ ] **Step 4: Edit `src/components/FrameRails.tsx`** — `.frame__rail--bottom` → `absolute bottom-5 sm:bottom-11 lg:bottom-16 left-0 right-0 h-[2px]`.
- [ ] **Step 5: Edit `src/components/FrameRails.tsx`** — `.frame__rail--left` → `absolute top-0 bottom-0 left-5 sm:left-11 lg:left-16 w-[2px]`.
- [ ] **Step 6: Edit `src/components/FrameRails.tsx`** — `.frame__rail--right` → `absolute top-0 right-5 sm:right-11 lg:right-16 bottom-0 w-[2px]`.
- [ ] **Step 7: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 8: Commit** — `git add src/components/FrameRails.tsx && git commit -m "refactor: migrate FrameRails classes to Tailwind utilities"`.

### Task 4: ProfileHero.tsx

**Files:**
- Modify: `src/components/ProfileHero.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/ProfileHero.tsx`** — `.hero` → `flex flex-col items-center`.
- [ ] **Step 2: Edit `src/components/ProfileHero.tsx`** — `.hero__stem` → `w-[2px] h-9 bg-foreground opacity-[0.72]`.
- [ ] **Step 3: Edit `src/components/ProfileHero.tsx`** — `.avatar` → `block w-[104px] h-[104px] p-1 border-2 border-solid border-foreground rounded-full bg-surface transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]` + `hover:translate-y-[-3px] hover:rotate-[1.5deg] hover:scale-[1.03]` + `active:scale-[0.97]`.
- [ ] **Step 4: Edit `src/components/ProfileHero.tsx`** — `.hero__name` → `mt-5 text-[clamp(2.5rem,5.2vw,4.75rem)] font-[900] leading-none tracking-[-0.045em]`.
- [ ] **Step 5: Edit `src/components/ProfileHero.tsx`** — `.hero__role` → `mt-3.5 text-lg font-bold leading-[1.35]`.
- [ ] **Step 6: Edit `src/components/ProfileHero.tsx`** — `.hero__bio` → `max-w-[50ch] mt-3 text-lg leading-[1.5] text-foreground-muted` (the `@media (max-width: 420px) { max-width: 34ch }` rule moves to the remnant — see Task 13).
- [ ] **Step 7: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 8: Commit** — `git add src/components/ProfileHero.tsx && git commit -m "refactor: migrate ProfileHero classes to Tailwind utilities"`.

### Task 5: PortraitAvatar.tsx

**Files:**
- Modify: `src/components/PortraitAvatar.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/PortraitAvatar.tsx`** — `.avatar-photo` → `block w-full h-full rounded-full object-cover`.
- [ ] **Step 2: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 3: Commit** — `git add src/components/PortraitAvatar.tsx && git commit -m "refactor: migrate PortraitAvatar classes to Tailwind utilities"`.

### Task 6: StickerLink.tsx

**Files:**
- Modify: `src/components/StickerLink.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/StickerLink.tsx`** — `.sticker` → `relative inline-flex w-24 h-24 flex-col items-center justify-center gap-1 border-2 border-solid border-foreground rounded-full bg-accent text-accent-foreground group transition-[transform_0.35s_cubic-bezier(0.34,1.56,0.64,1),background-color_0.2s_ease]`.
- [ ] **Step 2: Edit `src/components/StickerLink.tsx`** — `::before` ring → `before:content-[""] before:absolute before:inset-[-8px] before:border-2 before:border-solid before:border-foreground before:rounded-full before:opacity-[0.16] before:pointer-events-none`.
- [ ] **Step 3: Edit `src/components/StickerLink.tsx`** — `.sticker` hover → `hover:bg-accent-hover hover:translate-y-[-4px] hover:rotate-[-2deg]`.
- [ ] **Step 4: Edit `src/components/StickerLink.tsx`** — `.sticker` active → `active:translate-y-[1px] active:scale-[0.96]`.
- [ ] **Step 5: Edit `src/components/StickerLink.tsx`** — focus ring → `focus-visible:outline-offset-[10px]`.
- [ ] **Step 6: Edit `src/components/StickerLink.tsx`** — `.sticker__icon` → `text-[26px] transition-[transform_0.35s_cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.1] group-hover:rotate-[-4deg]`.
- [ ] **Step 7: Edit `src/components/StickerLink.tsx`** — `.sticker__label` → `text-[15px] font-[800] leading-none tracking-[0.01em]`.
- [ ] **Step 8: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 9: Commit** — `git add src/components/StickerLink.tsx && git commit -m "refactor: migrate StickerLink classes to Tailwind utilities"`.

### Task 7: SocialLinks.tsx

**Files:**
- Modify: `src/components/SocialLinks.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/SocialLinks.tsx`** — `.socials` → `flex flex-col items-center gap-[18px] mt-8`.
- [ ] **Step 2: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 3: Commit** — `git add src/components/SocialLinks.tsx && git commit -m "refactor: migrate SocialLinks classes to Tailwind utilities"`.

### Task 8: SupportLink.tsx

**Files:**
- Modify: `src/components/SupportLink.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/SupportLink.tsx`** — `.support` → `flex justify-center mt-9`.
- [ ] **Step 2: Edit `src/components/SupportLink.tsx`** — `.pill` → `inline-flex min-h-14 items-center justify-center gap-2.5 px-[30px] border-2 border-solid border-foreground rounded-[999px] bg-cta text-cta-foreground text-lg font-[800] leading-none transition-[transform_0.35s_cubic-bezier(0.34,1.56,0.64,1),background-color_0.2s_ease]`.
- [ ] **Step 3: Edit `src/components/SupportLink.tsx`** — `.pill` hover → `hover:bg-cta-hover hover:translate-y-[-3px]`.
- [ ] **Step 4: Edit `src/components/SupportLink.tsx`** — `.pill` active → `active:translate-y-[1px] active:scale-[0.97]`.
- [ ] **Step 5: Edit `src/components/SupportLink.tsx`** — `.pill__icon` → `text-[22px]`.
- [ ] **Step 6: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 7: Commit** — `git add src/components/SupportLink.tsx && git commit -m "refactor: migrate SupportLink classes to Tailwind utilities"`.

### Task 9: SiteFooter.tsx

**Files:**
- Modify: `src/components/SiteFooter.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/SiteFooter.tsx`** — `.footer` → `pt-4 text-foreground-muted text-sm leading-[1.4] text-center`.
- [ ] **Step 2: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 3: Commit** — `git add src/components/SiteFooter.tsx && git commit -m "refactor: migrate SiteFooter classes to Tailwind utilities"`.

### Task 10: Toast.tsx

**Files:**
- Modify: `src/components/Toast.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/Toast.tsx`** — `.toast` → `fixed bottom-[28px] left-1/2 z-60 flex max-w-[calc(100vw-32px)] items-center gap-2.5 px-[18px] pt-3 pb-3 rounded-[999px] bg-foreground text-background text-[15px] font-[700] leading-[1.2] opacity-0 translate-x-[-50%] translate-y-[10px] pointer-events-none shadow-[0_16px_36px_-16px_var(--overlay)] transition-[opacity_0.25s_ease,transform_0.25s_cubic-bezier(0.22,_1,_0.36,_1)]`.
- [ ] **Step 2: Edit `src/components/Toast.tsx`** — Toast.tsx: `className={message ? 'opacity-100 translate-x-[-50%] translate-y-0' : 'opacity-0 translate-x-[-50%] translate-y-[10px]'}`.
- [ ] **Step 3: Edit `src/components/Toast.tsx`** — `.toast__dot` → `w-2 h-2 flex-none rounded-full bg-accent`.
- [ ] **Step 4: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 5: Commit** — `git add src/components/Toast.tsx && git commit -m "refactor: migrate Toast classes to Tailwind utilities"`.

### Task 11: AboutDialog.tsx

**Files:**
- Modify: `src/components/AboutDialog.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/AboutDialog.tsx`** — `.dialog` (on the `<dialog>`) → `dialog fixed inset-0 w-[fit-content] h-[fit-content] max-w-none max-h-none m-auto p-0 border-0 bg-transparent text-foreground overflow-visible` (class kept as a hook for the remnant; transition comes from the remnant `.dialog` rule).
- [ ] **Step 2: Edit `src/components/AboutDialog.tsx`** — `.dialog__panel` → `relative w-[min(420px,calc(100vw-32px))] max-h-[calc(100svh-32px)] overflow-y-auto p-[28px] border-2 border-solid border-foreground rounded-[28px] bg-surface shadow-[0_28px_64px_-24px_var(--overlay)] transition-[opacity_0.2s_ease,transform_0.3s_cubic-bezier(0.22,_1,_0.36,_1)]`.
- [ ] **Step 3: Edit `src/components/AboutDialog.tsx`** — `.dialog__close` → `absolute top-4 right-4 grid w-9 h-9 place-items-center border-2 border-solid border-foreground rounded-full bg-surface-muted text-foreground text-base transition-[background-color_0.2s_ease,transform_0.2s_ease]` + `hover:bg-accent` + `active:scale-[0.92]`.
- [ ] **Step 4: Edit `src/components/AboutDialog.tsx`** — `.about` → `flex flex-col items-center text-center`.
- [ ] **Step 5: Edit `src/components/AboutDialog.tsx`** — `.about__avatar` → `w-16 h-16 p-[3px] border-2 border-solid border-foreground rounded-full bg-surface`.
- [ ] **Step 6: Edit `src/components/AboutDialog.tsx`** — `.about__name` → `mt-3.5 text-2xl font-[900] leading-[1.1] tracking-[-0.03em]`.
- [ ] **Step 7: Edit `src/components/AboutDialog.tsx`** — `.about__role` → `mt-1 text-foreground-muted text-[15px] font-bold leading-[1.35]`.
- [ ] **Step 8: Edit `src/components/AboutDialog.tsx`** — `.about__bio` → `max-w-[40ch] mt-4 text-base text-foreground-muted leading-[1.55]`.
- [ ] **Step 9: Edit `src/components/AboutDialog.tsx`** — `.about__links` → `flex w-full flex-col gap-0.5 mt-5 text-left`.
- [ ] **Step 10: Edit `src/components/AboutDialog.tsx`** — `.about__link` → `flex min-h-12 items-center gap-3 px-2.5 py-2 rounded-[14px] transition-[background-color_0.2s_ease]` + `hover:bg-surface-muted`.
- [ ] **Step 11: Edit `src/components/AboutDialog.tsx`** — `.about__link-icon` → `flex-none text-xl`.
- [ ] **Step 12: Edit `src/components/AboutDialog.tsx`** — `.about__link-text` → `flex min-w-0 flex-1 flex-col gap-[1px]`.
- [ ] **Step 13: Edit `src/components/AboutDialog.tsx`** — `.about__link-label` → `text-[15px] font-[800] leading-[1.2]`.
- [ ] **Step 14: Edit `src/components/AboutDialog.tsx`** — `.about__link-handle` → `overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground-muted leading-[1.2]`.
- [ ] **Step 15: Edit `src/components/AboutDialog.tsx`** — `.about__link-arrow` → `flex-none text-base text-foreground-muted`.
- [ ] **Step 16: Edit `src/components/AboutDialog.tsx`** — `.about__copy` → `inline-flex w-full min-h-12 items-center justify-center gap-2 mt-5 border-2 border-solid border-foreground rounded-[999px] bg-accent text-accent-foreground text-base font-[800] transition-[background-color_0.2s_ease,transform_0.2s_ease]` + `hover:bg-accent-hover` + `active:scale-[0.98]`.
- [ ] **Step 17: Edit `src/components/AboutDialog.tsx`** — `.about__copy-icon` → `text-lg`.
- [ ] **Step 18: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 19: Commit** — `git add src/components/AboutDialog.tsx && git commit -m "refactor: migrate AboutDialog classes to Tailwind utilities"`.

### Task 12: ActionDialog.tsx

**Files:**
- Modify: `src/components/ActionDialog.tsx`

**Steps:**
- [ ] **Step 1: Edit `src/components/ActionDialog.tsx`** — `.dialog__close` → same as AboutDialog's.
- [ ] **Step 2: Edit `src/components/ActionDialog.tsx`** — `.action` → `flex flex-col items-center text-center`.
- [ ] **Step 3: Edit `src/components/ActionDialog.tsx`** — `.action__icon` → `grid w-16 h-16 place-items-center border-2 border-solid border-foreground rounded-[18px] bg-accent text-accent-foreground text-[30px] rotate-[-2deg]`.
- [ ] **Step 4: Edit `src/components/ActionDialog.tsx`** — `.action__title` → `mt-[18px] text-[26px] font-[900] leading-[1.05] tracking-[-0.03em]`.
- [ ] **Step 5: Edit `src/components/ActionDialog.tsx`** — `.action__handle` → `mt-1.5 text-sm font-bold leading-[1.35] text-foreground-muted`.
- [ ] **Step 6: Edit `src/components/ActionDialog.tsx`** — `.action__description` → `max-w-[32ch] mt-3.5 text-base leading-[1.5]`.
- [ ] **Step 7: Edit `src/components/ActionDialog.tsx`** — `.action__choices` → `flex w-full flex-col gap-2.5 mt-6`.
- [ ] **Step 8: Edit `src/components/ActionDialog.tsx`** — `.action__choice` → `inline-flex w-full min-h-[52px] items-center justify-center gap-2.5 border-2 border-solid border-foreground rounded-[999px] text-base font-[800] leading-none transition-[background-color_0.2s_ease,transform_0.2s_ease]` + `active:scale-[0.98]`.
- [ ] **Step 9: Edit `src/components/ActionDialog.tsx`** — `.action__copy` variant → `bg-surface text-foreground` + hover `hover:bg-surface-muted`.
- [ ] **Step 10: Edit `src/components/ActionDialog.tsx`** — `.action__open` variant → `bg-cta text-cta-foreground` + hover `hover:bg-cta-hover`.
- [ ] **Step 11: Edit `src/components/ActionDialog.tsx`** — `.action__choice-icon` → `flex-none text-lg`.
- [ ] **Step 12: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 13: Commit** — `git add src/components/ActionDialog.tsx && git commit -m "refactor: migrate ActionDialog classes to Tailwind utilities"`.

### Task 13: App.css — native remnant

**Files:**
- Modify: `src/App.css`

**Steps:**
- [ ] **Step 1: Replace `src/App.css`** — Write the native remnant: the `:root` vars (`--ease-spring`, `--ease-bounce`, `--ease-exit`, `--lens-radius`), the dialog choreography rules (`.dialog` open transition with `display 0.26s allow-discrete`; `.dialog:not([open])`; `@starting-style` entry states; `.dialog::backdrop` + its transition; `.dialog--closing` + backdrop; `.dialog--behind` + backdrop; closing panel transition with `--ease-exit`), the ≤420px block (`.hero__bio { max-width: 34ch }`, `.dialog__panel { padding: 24px }`), `.backdrop__lens` (unchanged), and the unchanged keyframes (`rise`, `stem-grow`, `backdrop-fade`, `rail-x`, `rail-y`, `steam`, `pill-breathe`), the `@media (prefers-reduced-motion)` rules, and the `body:has(dialog[open])` rules from the original `App.css`.
- [ ] **Step 2: Verify — Run: `npm run build`** — Expected: exit 0, no errors.
- [ ] **Step 3: Commit** — `git add src/App.css && git commit -m "refactor: replace App.css with native remnant"`.

### Task 14: Final verification

**Files:** none.

**Steps:**
- [ ] **Step 1: Verify — Run: `npm run build`** — Expected: exit 0 (tsc + vite build).
- [ ] **Step 2: Verify — Run: `npm run lint`** — Expected: clean (oxlint).
- [ ] **Step 3: Note** — Visual verification was excluded per instruction; the diff should be eyeballed once if you want.
