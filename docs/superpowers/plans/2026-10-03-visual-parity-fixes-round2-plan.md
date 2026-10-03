# Visual Parity Fixes Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all defects found in the Round 2 audit — inverted colors, wrong layout structure, a broken image path, orphaned/dead CSS, and mis-sized decorative elements — while keeping the Hero photo as a rounded rectangle (not circular, per explicit user decision).

**Architecture:** Same hybrid approach as Round 1 — Tailwind utilities for layout/spacing, targeted CSS classes in `@layer components` only where Tailwind can't express the effect (textured gradients, `::after` pseudo-elements, nested `<em>` color overrides inside `dangerouslySetInnerHTML` content). Every new CSS class added in this plan is verified to be referenced by an actual `className` in the component it belongs to — Round 1 left several CSS rules that matched no element in the DOM (dead code); this plan removes those and never repeats the pattern.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, vanilla CSS custom classes

**Spec:** No separate spec doc — this plan implements the findings from the Round 2 audit presented in chat (full original reference: `git show 47d9864:index.html` and `git show 47d9864:css/styles.css`).

## Global Constraints

- Site must look visually identical to the original vanilla site, EXCEPT the Hero photo stays a rounded rectangle (not circular) — explicit user decision, do not revert.
- GitHub Pages subpath: `/Portafolio-Mariel-Jaramillo/`
- No new features — only visual parity fixes
- Use `assetUrl()` from `src/utils/assetUrl.ts` for every image path — never hardcode `/assets/...` or `/public/...`
- No test framework in this repo — verification is `npm run build` (must succeed) and `npm run lint` (must report 0 errors) after every task
- Any new CSS class added to `src/index.css` MUST be added to the component's `className` in the SAME task — never add a CSS rule whose selector matches nothing

---

## Task 1: Hero.tsx — Fix photo-wrap sizing, circular badge, colors, tagline structure

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `assetUrl` from `../../utils/assetUrl`, `useI18n` from `../../hooks/useI18n`
- Produces: new CSS classes `.hero-title-text` and `.hero-cta-ghost` that Task 12 must NOT remove

**Context:** The current implementation wraps the photo + starburst + circular badge in a flex container with no explicit width, so the starburst's `width:'136%'` and the circular badge's percentage positioning resolve against an undefined parent size — likely rendering clipped or misaligned. The circular badge is also sized to 110% (near-halo) instead of a small 42% corner accent, contains a duplicated `@soymarielitaaa` text line that doesn't belong there, and uses a hardcoded English-unrelated string instead of the real `hero.circular` translation key. Multiple colors (kicker, title `<em>`, CTA buttons) and the tagline structure (marker-highlight on wrong text) are also wrong. The photo itself stays a rounded rectangle — this task does NOT change its shape.

- [ ] **Step 1: Read current Hero.tsx**

Confirm current state matches what's described above before editing (file may have drifted).

- [ ] **Step 2: Replace the "Left: Photo + decorations" block**

Replace the entire `<div className="flex flex-col items-center relative">...</div>` block (the left column containing starburst, circular SVG, photo wrapper, and handle) with:

```tsx
<div className="flex flex-col items-center relative" style={{ width: 'min(320px, 35vw)' }}>
  {/* Starburst image (behind photo, now sized relative to an explicitly-widthed wrapper) */}
  <img
    src={assetUrl('assets/images/starburst-glitter.webp')}
    alt=""
    className="absolute pointer-events-none"
    aria-hidden="true"
    loading="eager"
    style={{
      width: '136%',
      top: '-18%',
      left: '-18%',
      animation: 'spin-slow 40s linear infinite',
      zIndex: 0,
    }}
  />

  {/* Circular spinning badge — small corner accent, NOT a halo around the whole photo */}
  <svg
    className="absolute pointer-events-none"
    viewBox="0 0 200 200"
    aria-hidden="true"
    style={{
      width: '42%',
      top: '-14%',
      right: '-16%',
      animation: 'spin-slow 18s linear infinite',
      zIndex: 3,
    }}
  >
    <defs>
      <path id="hc" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0" />
    </defs>
    <text fontSize="28" fontFamily="Poppins" fontWeight="700" fill="white" letterSpacing="0.12em">
      <textPath href="#hc" startOffset="0%">
        {t('hero.circular' as any)}
      </textPath>
    </text>
  </svg>

  {/* Photo — kept as rounded rectangle, NOT circular (explicit design decision) */}
  <div
    className="relative overflow-hidden w-full"
    style={{
      aspectRatio: '280 / 340',
      borderRadius: '1.25rem',
      border: '6px solid var(--color-pink)',
      boxShadow: '0 0 0 3px var(--color-paper), 0 8px 32px rgba(179,18,90,0.22)',
      zIndex: 2,
    }}
  >
    <img
      src={assetUrl('assets/images/portrait-hero.webp')}
      alt="Mariel Jaramillo"
      className="w-full h-full object-cover"
      loading="eager"
    />
  </div>

  {/* @soymarielitaaa handle below photo — appears ONLY here, not duplicated in the SVG */}
  <p
    className="mt-6 z-10"
    style={{
      fontFamily: 'var(--font-family-body)',
      fontWeight: 700,
      fontSize: '1.3rem',
      color: '#fff',
      textShadow: '0 2px 10px rgba(125,19,72,0.6)',
    }}
  >
    @soymarielitaaa
  </p>
</div>
```

- [ ] **Step 3: Fix the kicker (remove pill background)**

Replace:
```tsx
<span
  className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start"
  style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-pink-light)' }}
>
  {t('hero.kicker' as any)}
</span>
```
With:
```tsx
<span
  className="inline-block text-xs font-bold tracking-[0.35em] uppercase self-start"
  style={{ color: 'var(--color-magenta-dark)' }}
>
  {t('hero.kicker' as any)}
</span>
```

- [ ] **Step 4: Fix title — add className for the `<em>` color override**

Replace:
```tsx
<h1
  className="text-4xl md:text-5xl font-bold leading-tight"
  style={{ fontFamily: 'var(--font-family-serif)', color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.15)' }}
  dangerouslySetInnerHTML={{ __html: t('hero.title' as any) }}
/>
```
With:
```tsx
<h1
  className="hero-title-text text-4xl md:text-5xl font-bold leading-tight"
  style={{ fontFamily: 'var(--font-family-serif)', color: 'white', textShadow: '0 4px 24px rgba(125,19,72,0.35)' }}
  dangerouslySetInnerHTML={{ __html: t('hero.title' as any) }}
/>
```

- [ ] **Step 5: Remove the subtitle paragraph and restructure the tagline block**

Delete this entire block (the marker-highlight is currently on the wrong content — `hero.subtitle` isn't part of the real Hero design):
```tsx
<p
  className="text-base font-medium inline-block px-2 py-0.5"
  style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-pink-light)' }}
  dangerouslySetInnerHTML={{ __html: t('hero.subtitle' as any) }}
/>
```

Replace the "Tagline lines" block:
```tsx
<div className="space-y-1">
  <p className="text-2xl font-bold" style={{ color: 'var(--color-magenta-dark)' }}>
    {t('hero.tagline1' as any)}
  </p>
  <p className="text-xl" style={{ color: 'var(--color-ink)' }}>
    {t('hero.tagline2' as any)}
  </p>
  <p className="text-xl italic" style={{ color: 'var(--color-pink)' }}>
    {t('hero.tagline3' as any)}
  </p>
</div>
```
With:
```tsx
<div className="space-y-2">
  <p className="text-2xl font-bold" style={{ color: 'var(--color-magenta-dark)' }}>
    {t('hero.tagline1' as any)}
  </p>
  <p>
    <em
      className="not-italic inline-block px-2 py-0.5 font-bold text-xl md:text-2xl"
      style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-pink-light)' }}
    >
      {t('hero.tagline2' as any)}
    </em>
  </p>
  <p className="text-xl font-bold" style={{ color: 'var(--color-ink)' }}>
    {t('hero.tagline3' as any)}
  </p>
</div>
```

- [ ] **Step 6: Add drop-shadow to the camera decorative image**

Replace:
```tsx
<img
  src={assetUrl('assets/images/camera-pink.webp')}
  alt=""
  aria-hidden="true"
  loading="eager"
  className="w-[70px] self-center md:self-start"
/>
```
With:
```tsx
<img
  src={assetUrl('assets/images/camera-pink.webp')}
  alt=""
  aria-hidden="true"
  loading="eager"
  className="w-[70px] self-center md:self-start"
  style={{ filter: 'drop-shadow(0 6px 12px rgba(61,10,36,0.3))' }}
/>
```

- [ ] **Step 7: Fix the CTA buttons**

Replace:
```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
  <a
    href="#contacto"
    className="px-6 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105 text-center"
    style={{ backgroundColor: 'var(--color-magenta)' }}
  >
    {t('hero.cta' as any)}
  </a>
  <a
    href="#contenido"
    className="px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105 text-center"
    style={{
      backgroundColor: 'var(--color-pink-light)',
      color: 'var(--color-magenta)',
    }}
  >
    {t('hero.cta2' as any)}
  </a>
</div>
```
With:
```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
  <a
    href="#contacto"
    className="px-6 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105 text-center"
    style={{ backgroundColor: 'var(--color-magenta-dark)' }}
  >
    {t('hero.cta' as any)}
  </a>
  <a
    href="#contenido"
    className="hero-cta-ghost px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105 text-center"
  >
    {t('hero.cta2' as any)}
  </a>
</div>
```

- [ ] **Step 8: Add new CSS classes to `src/index.css`**

Read the current file first, then add this block right after the `.reveal.visible { ... }` rule (or any logical location inside the base CSS, outside `@layer components`):

```css
/* ============================================================
   Hero — title em color + ghost CTA button
   ============================================================ */

.hero-title-text em {
  color: var(--lime);
  font-style: normal;
}

.hero-cta-ghost {
  background: transparent;
  color: var(--magenta-dark);
  border: 2px solid var(--magenta-dark);
  transition: var(--transition-base);
}

.hero-cta-ghost:hover {
  background: var(--magenta-dark);
  color: var(--pink-light);
}
```

Note: `var(--lime)`, `var(--magenta-dark)`, `var(--pink-light)`, `var(--transition-base)` are Tailwind v4 `@theme` tokens already defined at the top of `index.css` (as `--color-lime`, `--color-magenta-dark`, etc. — Tailwind v4 auto-generates the bare alias too). If the bare alias doesn't resolve, use the full `--color-*` names instead.

- [ ] **Step 9: Verify**

```bash
npm run build
npm run lint
```
Expected: both succeed with 0 errors.

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/Hero.tsx src/index.css
git commit -m "fix(Hero): size photo-wrap explicitly, shrink circular badge to corner accent, fix colors and tagline structure"
```

---

## Task 2: Nav.tsx — Full-width layout, lang pill, logo/burger colors

**Files:**
- Modify: `src/components/Nav.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useScrolled` (unchanged)

**Context:** The original nav is edge-to-edge (`justify-content: space-between` across the full fixed header, no centered max-width container). The current implementation wraps content in `max-w-6xl mx-auto`, which centers the nav content on wide screens, leaving large empty margins the original never had. The lang toggle is two bare buttons with no visible pill/border container and no "|" separator. "UGC" in the logo has no color (only "Mariel" does). The burger lines use `ink` instead of `magenta-dark`.

- [ ] **Step 1: Read current Nav.tsx**

- [ ] **Step 2: Remove the max-width wrapper from the inner `<nav>`**

Replace:
```tsx
<nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
```
With:
```tsx
<nav className="w-full flex items-center justify-between" style={{ padding: '0.9rem 1.5rem' }}>
```

- [ ] **Step 3: Fix the logo color**

Replace:
```tsx
<a
  href="#inicio"
  className="font-bold text-lg"
  aria-label="Mariel Jaramillo — Inicio"
>
  UGC <em style={{ color: 'var(--color-magenta-hot)' }}>Mariel</em>
</a>
```
With:
```tsx
<a
  href="#inicio"
  className="font-bold text-lg"
  style={{ color: 'var(--color-magenta-dark)' }}
  aria-label="Mariel Jaramillo — Inicio"
>
  UGC <em style={{ color: 'var(--color-magenta-hot)', fontStyle: 'normal' }}>Mariel</em>
</a>
```

- [ ] **Step 4: Wrap the lang toggle in a bordered pill with a separator**

Replace:
```tsx
<div className="nav__lang flex gap-2">
  <button
    onClick={() => setLang('es')}
    aria-label="Cambiar a español"
    style={{ opacity: lang === 'es' ? 1 : 0.45 }}
  >
    ES
  </button>
  <button
    onClick={() => setLang('en')}
    aria-label="Change to English"
    style={{ opacity: lang === 'en' ? 1 : 0.45 }}
  >
    EN
  </button>
</div>
```
With:
```tsx
<div
  className="nav__lang flex items-center gap-1"
  style={{
    border: '2px solid var(--color-magenta-dark)',
    borderRadius: '999px',
    padding: '0.3rem 0.7rem',
  }}
>
  <button
    onClick={() => setLang('es')}
    aria-label="Cambiar a español"
    style={{
      opacity: lang === 'es' ? 1 : 0.45,
      color: 'var(--color-magenta-dark)',
      fontWeight: 700,
      fontSize: '0.8rem',
    }}
  >
    ES
  </button>
  <span style={{ color: 'var(--color-magenta-dark)', opacity: 0.6, fontSize: '0.8rem' }}>|</span>
  <button
    onClick={() => setLang('en')}
    aria-label="Change to English"
    style={{
      opacity: lang === 'en' ? 1 : 0.45,
      color: 'var(--color-magenta-dark)',
      fontWeight: 700,
      fontSize: '0.8rem',
    }}
  >
    EN
  </button>
</div>
```

- [ ] **Step 5: Fix burger span color (all 3 spans)**

In the burger button, change every occurrence of `backgroundColor: 'var(--color-ink)'` (there are 3, one per `<span>`) to `backgroundColor: 'var(--color-magenta-dark)'`.

- [ ] **Step 6: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "fix(Nav): remove max-width centering, add lang toggle pill+separator, fix logo and burger colors"
```

---

## Task 3: AboutMe.tsx — Fix broken image, remove invented notch, badge, colors, breakpoint

**Files:**
- Modify: `src/components/sections/AboutMe.tsx`

**Interfaces:**
- Consumes: `assetUrl` from `../../utils/assetUrl` (NEW import needed — not currently imported in this file)

**Context:** Line 30 has `src="/public/assets/images/portrait-about.webp"` — an invalid path (Vite never exposes a literal `/public` prefix), so this image 404s always. There's also an invented decorative "notch" div that doesn't exist in the original design, a badge positioned/colored/shaped incorrectly, a `lead` paragraph with the wrong color, and a grid breakpoint/ratio that doesn't match the original's 860px / 1fr-1.4fr spec.

- [ ] **Step 1: Read current AboutMe.tsx**

- [ ] **Step 2: Add the assetUrl import**

Add after the existing imports:
```tsx
import { assetUrl } from '../../utils/assetUrl';
```

- [ ] **Step 3: Fix the broken image path, remove the invented notch, and fix the badge**

Replace this entire block:
```tsx
<img
  src="/public/assets/images/portrait-about.webp"
  alt="Mariel Jaramillo — Retrato"
  className="w-full h-full object-cover"
  loading="lazy"
/>
<div
  className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full"
  style={{ backgroundColor: 'var(--color-ink)' }}
/>
<span
  className="absolute text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full"
  style={{
    bottom: '12%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--color-magenta)',
    color: 'var(--color-paper)',
    whiteSpace: 'nowrap',
  }}
>
  {t('about.badge' as any)}
</span>
```
With:
```tsx
<img
  src={assetUrl('assets/images/portrait-about.webp')}
  alt="Mariel Jaramillo — Retrato"
  className="w-full h-full object-cover"
  loading="lazy"
/>
<span
  className="absolute text-xs font-bold uppercase tracking-wider text-center"
  style={{
    bottom: '12%',
    left: '5%',
    right: '5%',
    backgroundColor: 'var(--color-magenta-hot)',
    color: '#fff',
    padding: '0.35em 0.5em',
    borderRadius: '0.4rem',
  }}
>
  {t('about.badge' as any)}
</span>
```

- [ ] **Step 4: Fix the `about.lead` color**

Replace:
```tsx
<p
  className="text-lg font-medium mb-4"
  style={{ color: 'var(--color-magenta)' }}
>
  {t('about.lead' as any)}
</p>
```
With:
```tsx
<p
  className="text-lg font-medium mb-4"
  style={{ color: 'var(--color-magenta-dark)' }}
>
  {t('about.lead' as any)}
</p>
```

- [ ] **Step 5: Fix the grid breakpoint/ratio**

Replace:
```tsx
<div className="grid lg:grid-cols-2 gap-12 items-center">
```
With:
```tsx
<div className="grid min-[860px]:grid-cols-[1fr_1.4fr] gap-12 items-center">
```

- [ ] **Step 6: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/AboutMe.tsx
git commit -m "fix(AboutMe): repair broken image path, remove invented notch, fix badge shape/color, fix lead color and grid ratio"
```

---

## Task 4: Skills.tsx — Em color overrides, card bottom padding

**Files:**
- Modify: `src/components/sections/Skills.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Produces: new CSS classes `.skills-card-dark-title` and `.skills-card-light-title`

**Context:** Each card's title contains a translated string with an `<em>` tag inside (e.g. `"Herramientas <em>que utilizo</em>"`) rendered via `dangerouslySetInnerHTML`. The `<em>` should be a distinct color (lime in the dark card, magenta-hot in the light card) but currently inherits the parent's flat color. The cards also use `p-8` (2rem all sides), but the decorative image needs more bottom clearance (original uses `6.5rem` bottom padding) to avoid overlapping the last list item.

- [ ] **Step 1: Read current Skills.tsx**

- [ ] **Step 2: Add className and fix padding on the Tools (dark) card**

Replace:
```tsx
<div
  className="relative rounded-3xl p-8 text-left overflow-hidden"
  style={{ backgroundColor: 'var(--magenta-dark)', boxShadow: 'var(--shadow-card)' }}
>
  <img
    src={assetUrl('assets/images/camera-pink.webp')}
    alt=""
    className="absolute bottom-2 right-2 pointer-events-none"
    style={{ width: '110px', opacity: 0.95 }}
    aria-hidden="true"
  />
  <h3
    className="text-xl font-bold mb-6"
    style={{ color: 'var(--color-pink-soft)' }}
    dangerouslySetInnerHTML={{ __html: t('skills.tools.title' as any) }}
  />
```
With:
```tsx
<div
  className="relative rounded-3xl text-left overflow-hidden"
  style={{ backgroundColor: 'var(--magenta-dark)', boxShadow: 'var(--shadow-card)', padding: '2.2rem 2rem 6.5rem' }}
>
  <img
    src={assetUrl('assets/images/camera-pink.webp')}
    alt=""
    className="absolute bottom-4 right-5 pointer-events-none"
    style={{ width: '110px', opacity: 0.95 }}
    aria-hidden="true"
  />
  <h3
    className="skills-card-dark-title text-xl font-bold mb-6"
    style={{ color: 'var(--color-pink-light)' }}
    dangerouslySetInnerHTML={{ __html: t('skills.tools.title' as any) }}
  />
```

- [ ] **Step 3: Add className and fix padding on the Strategy (light) card**

Replace:
```tsx
<div
  className="relative rounded-3xl p-8 text-left overflow-hidden"
  style={{ backgroundColor: 'white', border: '2px solid var(--pink-soft)', boxShadow: 'var(--shadow-card)' }}
>
  <img
    src={assetUrl('assets/images/tulips.webp')}
    alt=""
    className="absolute bottom-2 right-2 pointer-events-none"
    style={{ width: '110px', opacity: 0.95 }}
    aria-hidden="true"
  />
  <h3
    className="text-xl font-bold mb-6"
    style={{ color: 'var(--color-magenta-dark)' }}
    dangerouslySetInnerHTML={{ __html: t('skills.strategy.title' as any) }}
  />
```
With:
```tsx
<div
  className="relative rounded-3xl text-left overflow-hidden"
  style={{ backgroundColor: 'white', border: '2px solid var(--pink-soft)', boxShadow: 'var(--shadow-card)', padding: '2.2rem 2rem 6.5rem' }}
>
  <img
    src={assetUrl('assets/images/tulips.webp')}
    alt=""
    className="absolute bottom-4 right-5 pointer-events-none"
    style={{ width: '110px', opacity: 0.95 }}
    aria-hidden="true"
  />
  <h3
    className="skills-card-light-title text-xl font-bold mb-6"
    style={{ color: 'var(--color-magenta-dark)' }}
    dangerouslySetInnerHTML={{ __html: t('skills.strategy.title' as any) }}
  />
```

- [ ] **Step 4: Add the new CSS classes to `src/index.css`**

```css
/* ============================================================
   Skills — em color overrides inside card titles
   ============================================================ */

.skills-card-dark-title em {
  color: var(--lime);
  font-style: normal;
}

.skills-card-light-title em {
  color: var(--magenta-hot);
  font-style: normal;
}
```

- [ ] **Step 5: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Skills.tsx src/index.css
git commit -m "fix(Skills): em color overrides in card titles, restore bottom padding to prevent image overlap"
```

---

## Task 5: ContentReels.tsx — Restructure to single-column stacked niches

**Files:**
- Modify: `src/components/sections/ContentReels.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `assetUrl`, `useI18n`, `useRevealOnScroll` (unchanged)
- Produces: new CSS class `.niche-title`

**Context:** The original layout is a SINGLE column of niche articles stacked vertically (food, then beauty, then lifestyle, then pets, one full-width block after another). The current implementation puts the 4 niches in a 2-column outer grid (food+beauty side by side, lifestyle+pets side by side) with `pets` spanning both columns — this is structurally wrong. The original's `:only-child` CSS rule was meant for the single reel INSIDE its own niche's 2-column, 600px-wide, 5rem-gap reel sub-grid — not for the whole niche card in an outer grid that doesn't exist in the original. Reels are also missing their 3px pink border, their `max-width: 280px` cap, and the 5rem gap (currently 1rem). The formats list should be pill-badges, not plain text.

- [ ] **Step 1: Read current ContentReels.tsx**

- [ ] **Step 2: Replace the formats list with pill badges**

Replace:
```tsx
<div className="flex justify-center gap-6 flex-wrap mb-12" style={{ color: 'var(--color-pink-light)' }}>
  {FORMATS.map((format) => (
    <span key={format}>{t(`videos.formats.${format}` as any)}</span>
  ))}
</div>
```
With:
```tsx
<div className="flex justify-center gap-4 flex-wrap mb-12">
  {FORMATS.map((format) => (
    <span
      key={format}
      className="font-bold text-sm"
      style={{
        backgroundColor: 'var(--color-pink)',
        color: 'var(--color-magenta-dark)',
        padding: '0.5rem 1.4rem',
        borderRadius: '999px',
      }}
    >
      {t(`videos.formats.${format}` as any)}
    </span>
  ))}
</div>
```

- [ ] **Step 3: Replace the entire niches grid with a single-column stacked list**

Replace this whole block:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-20">
  {NICHE_ORDER.map((niche) => {
    const isPets = niche === 'pets';
    return (
      <article
        key={niche}
        className={`niche ${isPets ? 'col-span-2' : ''}`}
      >
        <h3
          className="text-xl md:text-2xl font-bold mb-6 text-center"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-pink-light)' }}
          dangerouslySetInnerHTML={{ __html: t(`videos.niche.${niche}` as any) }}
        />
        <div className="grid grid-cols-2 gap-4">
          {REELS[niche].map(({ url, thumb, alt }) => (
            <div
              key={url}
              className="reel relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer"
              style={{ backgroundColor: 'var(--color-ink)' }}
              onClick={() => handleReelClick(niche, url)}
              role="button"
              tabIndex={0}
              aria-label={t('videos.watch' as any)}
              onKeyDown={(e) => e.key === 'Enter' && handleReelClick(niche, url)}
            >
              {loadedReels[niche].has(url) ? (
                <iframe
                  src={`${url}embed/captioned/`}
                  className="absolute inset-0 w-full h-full"
                  allow="encrypted-media; clipboard-write"
                  allowFullScreen
                  loading="lazy"
                  title={alt}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <img
                    src={assetUrl(`assets/images/${thumb}`)}
                    alt={alt}
                    className="w-16 h-16 rounded-full object-cover"
                    loading="lazy"
                  />
                  <span className="text-white text-sm font-medium text-center px-4">
                    {t('videos.watch' as any)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </article>
    );
  })}
</div>
```
With:
```tsx
<div className="flex flex-col gap-16 max-w-[1100px] mx-auto">
  {NICHE_ORDER.map((niche) => {
    const reels = REELS[niche];
    const isSingle = reels.length === 1;
    return (
      <article key={niche} className="niche text-center">
        <h3
          className="niche-title text-xl md:text-2xl font-bold mb-6"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'white' }}
          dangerouslySetInnerHTML={{ __html: t(`videos.niche.${niche}` as any) }}
        />
        <div className="grid grid-cols-2 gap-20 max-w-[600px] mx-auto">
          {reels.map(({ url, thumb, alt }) => (
            <div
              key={url}
              className={`reel relative aspect-[9/16] overflow-hidden cursor-pointer mx-auto ${isSingle ? 'col-span-2' : ''}`}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '3px solid var(--color-pink)',
                backgroundColor: 'var(--color-ink)',
                maxWidth: isSingle ? '320px' : '280px',
              }}
              onClick={() => handleReelClick(niche, url)}
              role="button"
              tabIndex={0}
              aria-label={t('videos.watch' as any)}
              onKeyDown={(e) => e.key === 'Enter' && handleReelClick(niche, url)}
            >
              {loadedReels[niche].has(url) ? (
                <iframe
                  src={`${url}embed/captioned/`}
                  className="absolute inset-0 w-full h-full"
                  allow="encrypted-media; clipboard-write"
                  allowFullScreen
                  loading="lazy"
                  title={alt}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <img
                    src={assetUrl(`assets/images/${thumb}`)}
                    alt={alt}
                    className="w-16 h-16 rounded-full object-cover"
                    loading="lazy"
                  />
                  <span className="text-white text-sm font-medium text-center px-4">
                    {t('videos.watch' as any)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </article>
    );
  })}
</div>
```

- [ ] **Step 4: Add the `.niche-title` CSS class to `src/index.css`**

```css
/* ============================================================
   ContentReels — niche title em color
   ============================================================ */

.niche-title em {
  color: var(--pink);
  font-style: normal;
  font-weight: 700;
}
```

- [ ] **Step 5: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ContentReels.tsx src/index.css
git commit -m "fix(ContentReels): restructure to single-column stacked niches, add reel border/max-width/gap, pill-style formats list"
```

---

## Task 6: Gear.tsx — Add white card wrapper, fix object-fit, move hover to whole card

**Files:**
- Modify: `src/components/sections/Gear.tsx`

**Context:** Each gear item is currently just a colored square containing a cropped (`object-cover`) image with plain caption text below — there's no elevated white card at all. The original wraps each item in a white card with padding and shadow, uses `object-contain` so product photos aren't cropped, and lifts the WHOLE card on hover (not just the inner image).

- [ ] **Step 1: Read current Gear.tsx**

- [ ] **Step 2: Replace the figure markup**

Replace:
```tsx
<figure key={key} className="text-center">
  <div
    className="rounded-2xl overflow-hidden mb-3 aspect-square"
    style={{ backgroundColor: 'var(--color-pink-light)' }}
  >
    <img
      src={assetUrl('assets/images/' + img)}
      alt={t(key as any)}
      className="w-full h-full object-cover transition-transform duration-300"
      loading="lazy"
      style={{ transform: 'translateY(0) rotate(0deg)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) rotate(-1deg)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) rotate(0deg)';
      }}
    />
  </div>
  <figcaption
    className="text-sm font-medium"
    style={{ color: 'var(--color-ink)' }}
  >
    {t(key as any)}
  </figcaption>
</figure>
```
With:
```tsx
<figure
  key={key}
  className="text-center transition-transform duration-300"
  style={{
    backgroundColor: 'white',
    borderRadius: 'var(--radius-lg)',
    padding: '1.4rem 1rem 1.1rem',
    boxShadow: '0 6px 18px rgba(61,10,36,0.08)',
    transform: 'translateY(0) rotate(0deg)',
  }}
  onMouseEnter={(e) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = 'translateY(-6px) rotate(-1deg)';
    el.style.boxShadow = 'var(--shadow-card)';
  }}
  onMouseLeave={(e) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = 'translateY(0) rotate(0deg)';
    el.style.boxShadow = '0 6px 18px rgba(61,10,36,0.08)';
  }}
>
  <div className="mb-3 flex items-center justify-center" style={{ height: '130px' }}>
    <img
      src={assetUrl('assets/images/' + img)}
      alt={t(key as any)}
      style={{ height: '130px', width: 'auto', objectFit: 'contain', margin: '0 auto' }}
      loading="lazy"
    />
  </div>
  <figcaption
    className="text-sm font-bold uppercase tracking-wide"
    style={{ color: 'var(--color-magenta-dark)' }}
  >
    {t(key as any)}
  </figcaption>
</figure>
```

- [ ] **Step 3: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Gear.tsx
git commit -m "fix(Gear): add elevated white card per item, object-contain instead of object-cover, hover lifts whole card"
```

---

## Task 7: Brands.tsx — Fix logo sizing, remove unwanted opacity

**Files:**
- Modify: `src/components/sections/Brands.tsx`

**Context:** Logos are currently constrained by `h-12` (48px fixed height) instead of the original's width-based `clamp(100px, 18vw, 160px)` — they render much smaller than intended. There's also a permanent `opacity: 0.7` dimming them that doesn't exist in the original (logos should be fully opaque, only the hover transform changes).

- [ ] **Step 1: Read current Brands.tsx**

- [ ] **Step 2: Fix the logo image styling**

Replace:
```tsx
<img
  key={file}
  src={assetUrl('assets/images/' + file)}
  alt={alt}
  className="h-12 w-auto object-contain transition-all duration-300 hover:scale-110 hover:-rotate-3"
  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))', opacity: 0.7 }}
  loading="lazy"
/>
```
With:
```tsx
<img
  key={file}
  src={assetUrl('assets/images/' + file)}
  alt={alt}
  className="w-auto object-contain transition-all duration-300 hover:scale-110 hover:-rotate-3"
  style={{
    width: 'clamp(100px, 18vw, 160px)',
    filter: 'drop-shadow(0 6px 14px rgba(61,10,36,0.15))',
  }}
  loading="lazy"
/>
```

- [ ] **Step 3: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Brands.tsx
git commit -m "fix(Brands): width-based clamp sizing instead of fixed height, remove unwanted permanent opacity"
```

---

## Task 8: Metrics.tsx — Fix inverted color scheme, add cards, percentage values, hand image

**Files:**
- Modify: `src/components/sections/Metrics.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Produces: new CSS class `.metrics-card-title`

**Context:** This is the most severe color bug in the audit — the section background is currently `magenta-dark` (dark) when the original is `pink-light` (pale pink), with white card-less text floating directly on it. The original wraps each platform's stats in a white card. The subtitle should be a small centered pill (currently stretched to 100% width). Percentage values (e.g. "58%") next to each bar are missing entirely. The decorative hand image uses the wrong size/position/rotation/opacity.

- [ ] **Step 1: Read current Metrics.tsx**

- [ ] **Step 2: Replace the entire `return` block**

Replace the whole `return (...)` statement with:

```tsx
return (
  <section
    id="audiencia"
    ref={ref}
    className="metrics py-20 px-4 relative overflow-hidden"
    style={{ backgroundColor: 'var(--color-pink-light)' }}
  >
    <img
      src={assetUrl('assets/images/hand-phone.webp')}
      alt=""
      aria-hidden="true"
      className="absolute hidden md:block"
      style={{
        width: 'clamp(150px, 22vw, 260px)',
        right: '-30px',
        bottom: '-20px',
        transform: 'rotate(-10deg)',
        opacity: 0.9,
      }}
    />
    <div className="max-w-4xl mx-auto relative z-10">
      <h2
        className="text-3xl md:text-4xl font-bold text-center mb-2"
        style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-magenta-dark)' }}
        dangerouslySetInnerHTML={{ __html: t('metrics.title' as any) }}
      />
      <p
        className="text-center mb-12 mx-auto"
        style={{
          color: 'var(--color-magenta-dark)',
          border: '2px solid var(--color-magenta-dark)',
          borderRadius: '999px',
          display: 'table',
          padding: '0.35rem 1.4rem',
          fontWeight: 600,
        }}
      >
        {t('metrics.subtitle' as any)}
      </p>

      <div className="grid sm:grid-cols-2 gap-8">
        {PLATFORMS.map(({ titleKey, infoKey1, infoKey2, stats }) => (
          <div
            key={titleKey}
            className="flex flex-col"
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <h3
              className="metrics-card-title text-2xl font-bold mb-2"
              style={{ color: 'var(--color-magenta-dark)' }}
              dangerouslySetInnerHTML={{ __html: t(titleKey as any) }}
            />
            <p
              className="text-sm mb-1"
              style={{ color: 'var(--color-ink)' }}
              dangerouslySetInnerHTML={{ __html: t(infoKey1 as any) }}
            />
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--color-ink)' }}
              dangerouslySetInnerHTML={{ __html: t(infoKey2 as any) }}
            />

            <div className="flex flex-col gap-3 mt-auto pt-4">
              {stats.map(({ labelKey, pct }) => (
                <div key={labelKey} className="grid grid-cols-[4.5rem_1fr_3.2rem] items-center gap-3 text-sm">
                  <span className="font-bold" style={{ color: 'var(--color-magenta-dark)' }}>
                    {t(labelKey as any)}
                  </span>
                  <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--color-pink-soft)' }}
                  >
                    <div
                      className="metrics__bar-fill"
                      data-pct={pct}
                      style={{
                        backgroundColor: pct >= 50 ? 'var(--color-lime)' : 'var(--color-pink)',
                      }}
                    />
                  </div>
                  <span className="font-extrabold text-right" style={{ color: 'var(--color-magenta-dark)' }}>
                    {pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

- [ ] **Step 3: Add the `.metrics-card-title` CSS class to `src/index.css`**

```css
/* ============================================================
   Metrics — small sub-label inside card title
   ============================================================ */

.metrics-card-title small {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--magenta);
}
```

- [ ] **Step 4: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Metrics.tsx src/index.css
git commit -m "fix(Metrics): correct inverted color scheme (pink-light bg, white cards), add percentage values, fix subtitle pill and hand image"
```

---

## Task 9: Packages.tsx — Move texture to per-card, add border, featured tint, fix badge colors

**Files:**
- Modify: `src/components/sections/Packages.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Produces: new CSS classes `.package-card` and `.package-card[data-popular="true"]`

**Context:** The repeating-gradient texture is currently applied to the whole SECTION (`.packages` class) when it belongs on each INDIVIDUAL card in the original. Cards are missing their 3px border (pink for regular, magenta-dark for featured) and the featured card is missing its lime-tint background layer. The "Más popular" badge uses inverted colors (magenta bg / white text instead of magenta-dark bg / lime text). Cards are also missing the hover lift.

- [ ] **Step 1: Read current Packages.tsx**

- [ ] **Step 2: Replace the card wrapper and badge**

Replace:
```tsx
<div
  key={nameKey}
  className={`relative rounded-3xl p-6 text-left ${popular ? 'ring-2' : ''}`}
  style={{
    backgroundColor: popular ? 'white' : 'var(--pink-light)',
    boxShadow: popular ? 'var(--shadow-card)' : 'none',
    '--tw-ring-color': popular ? 'var(--color-magenta)' : 'transparent',
  } as React.CSSProperties}
>
  {popular && (
    <span
      className="absolute text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full"
      style={{ top: '-14px', right: '18px', backgroundColor: 'var(--color-magenta)', color: 'white' }}
    >
      {t('packages.popular' as any)}
    </span>
  )}
```
With:
```tsx
<div
  key={nameKey}
  className="package-card relative rounded-3xl p-6 text-left transition-transform duration-300 hover:-translate-y-1.5"
  data-popular={popular}
  style={{
    border: `3px solid ${popular ? 'var(--color-magenta-dark)' : 'var(--color-pink)'}`,
    boxShadow: 'var(--shadow-card)',
  }}
>
  {popular && (
    <span
      className="package__badge text-xs font-bold tracking-wider uppercase px-4 py-1 rounded-full"
      style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-lime)' }}
    >
      {t('packages.popular' as any)}
    </span>
  )}
```

Note: `.package__badge` already has `position: absolute; top: -14px; right: 18px;` defined in `@layer components` in `src/index.css` from Round 1 — keep that rule, this task only fixes the inline colors here.

- [ ] **Step 3: Add the `.package-card` CSS classes to `src/index.css`**

```css
/* ============================================================
   Packages — textured background per card (not per section)
   ============================================================ */

.package-card {
  background:
    linear-gradient(rgba(254,239,244,0.92), rgba(254,239,244,0.92)),
    repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(232,115,168,0.35) 24px, rgba(232,115,168,0.35) 25px),
    repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(232,115,168,0.35) 24px, rgba(232,115,168,0.35) 25px);
}

.package-card[data-popular="true"] {
  background:
    linear-gradient(rgba(207,215,155,0.35), rgba(207,215,155,0.35)),
    linear-gradient(rgba(254,239,244,0.92), rgba(254,239,244,0.92)),
    repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(232,115,168,0.35) 24px, rgba(232,115,168,0.35) 25px),
    repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(232,115,168,0.35) 24px, rgba(232,115,168,0.35) 25px);
}
```

- [ ] **Step 4: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Packages.tsx src/index.css
git commit -m "fix(Packages): move texture+border to individual cards, add featured lime tint, fix badge colors, add hover lift"
```

---

## Task 10: Contact.tsx — Fix overlay, heading color, photo sizing, subtitle, link hover, breakpoint

**Files:**
- Modify: `src/components/sections/Contact.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Produces: new CSS class `.contact-item:hover`

**Context:** The background overlay currently uses a two-tone diagonal fade (`135deg`, opacity `0.6` → `0.3`) when the original is a uniform single-color wash (same color/opacity on both gradient stops). The `<h2>` is colored `ink` (dark) when it should be white for contrast against the pink overlay. The photo has no `max-width` cap or drop-shadow. The subtitle is too small and the wrong color. The contact links are missing padding/border-radius and a hover background+slide effect. The grid breakpoint/ratio doesn't match the original's 860px / 1fr-1.4fr.

- [ ] **Step 1: Read current Contact.tsx**

- [ ] **Step 2: Fix the background overlay**

Replace:
```tsx
style={{
  backgroundImage: `linear-gradient(135deg, rgba(254,228,236,0.6), rgba(254,228,236,0.3)), url('${assetUrl('assets/images/texture-pink.webp')}')`,
  backgroundSize: 'cover',
}}
```
With:
```tsx
style={{
  backgroundImage: `linear-gradient(rgba(232,115,168,0.7), rgba(232,115,168,0.7)), url('${assetUrl('assets/images/texture-pink.webp')}')`,
  backgroundSize: 'cover',
}}
```

- [ ] **Step 3: Fix the grid breakpoint/ratio**

Replace:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
```
With:
```tsx
<div className="grid grid-cols-1 min-[860px]:grid-cols-[1fr_1.4fr] gap-12 items-center">
```

- [ ] **Step 4: Fix the photo (max-width + drop-shadow)**

Replace:
```tsx
<div className="contact__photo reveal">
  <img
    src={assetUrl('assets/images/mariel-contact.webp')}
    alt="Mariel Jaramillo con micrófono"
    className="rounded-2xl"
  />
</div>
```
With:
```tsx
<div className="contact__photo reveal flex justify-center">
  <img
    src={assetUrl('assets/images/mariel-contact.webp')}
    alt="Mariel Jaramillo con micrófono"
    className="rounded-2xl"
    style={{
      maxWidth: '400px',
      width: '100%',
      filter: 'drop-shadow(0 12px 24px rgba(61,10,36,0.35))',
    }}
  />
</div>
```

- [ ] **Step 5: Fix the heading color**

Replace:
```tsx
<h2
  className="text-3xl md:text-4xl font-bold mb-4"
  style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
  dangerouslySetInnerHTML={{ __html: t('contact.title' as any) }}
/>
```
With:
```tsx
<h2
  className="text-3xl md:text-4xl font-bold mb-4"
  style={{ fontFamily: 'var(--font-family-serif)', color: '#fff' }}
  dangerouslySetInnerHTML={{ __html: t('contact.title' as any) }}
/>
```

- [ ] **Step 6: Fix the subtitle size/color**

Replace:
```tsx
<p className="contact__subtitle mb-8" style={{ color: 'var(--color-magenta)' }}>
  {t('contact.subtitle' as any)}
</p>
```
With:
```tsx
<p className="contact__subtitle mb-8 font-bold" style={{ color: 'var(--color-magenta-dark)', fontSize: '1.6rem' }}>
  {t('contact.subtitle' as any)}
</p>
```

- [ ] **Step 7: Fix the card to use flex+gap instead of per-link margins, add hover class to each link**

Replace the entire `contact__card` div:
```tsx
<div
  className="contact__card"
  style={{
    transform: 'rotate(-1deg)',
    backgroundColor: 'var(--paper)',
    boxShadow: 'var(--shadow-card)',
    borderRadius: '1rem',
    padding: '1.5rem',
  }}
>
  <a
    href="https://wa.me/584249406129"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 mb-4 text-sm"
    style={{ color: 'var(--color-magenta)' }}
  >
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d={WHATSAPP_PATH} />
    </svg>
    <span>{t('contact.phone' as any)}</span>
  </a>
  <a
    href="mailto:collabsmarielj26@gmail.com"
    className="flex items-center gap-3 mb-4 text-sm"
    style={{ color: 'var(--color-magenta)' }}
  >
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d={EMAIL_PATH} />
    </svg>
    <span>{t('contact.email' as any)}</span>
  </a>
  <a
    href="https://www.instagram.com/soymarielitaaa"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 mb-4 text-sm"
    style={{ color: 'var(--color-magenta)' }}
  >
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d={INSTAGRAM_PATH} />
    </svg>
    <span>@soymarielitaaa</span>
  </a>
  <a
    href="https://www.tiktok.com/@soymarielitaaa"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-sm"
    style={{ color: 'var(--color-magenta)' }}
  >
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d={TIKTOK_PATH} />
    </svg>
    <span>@soymarielitaaa</span>
  </a>
</div>
```
With:
```tsx
<div
  className="contact__card flex flex-col"
  style={{
    transform: 'rotate(-1deg)',
    backgroundColor: 'var(--paper)',
    boxShadow: 'var(--shadow-card)',
    borderRadius: '1rem',
    padding: '1.5rem',
    gap: '0.6rem',
  }}
>
  <a
    href="https://wa.me/584249406129"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-item flex items-center gap-3 text-sm font-semibold"
    style={{ color: 'var(--color-magenta-dark)', padding: '0.55rem 0.7rem', borderRadius: '0.7rem' }}
  >
    <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d={WHATSAPP_PATH} />
    </svg>
    <span>{t('contact.phone' as any)}</span>
  </a>
  <a
    href="mailto:collabsmarielj26@gmail.com"
    className="contact-item flex items-center gap-3 text-sm font-semibold"
    style={{ color: 'var(--color-magenta-dark)', padding: '0.55rem 0.7rem', borderRadius: '0.7rem' }}
  >
    <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d={EMAIL_PATH} />
    </svg>
    <span>{t('contact.email' as any)}</span>
  </a>
  <a
    href="https://www.instagram.com/soymarielitaaa"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-item flex items-center gap-3 text-sm font-semibold"
    style={{ color: 'var(--color-magenta-dark)', padding: '0.55rem 0.7rem', borderRadius: '0.7rem' }}
  >
    <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d={INSTAGRAM_PATH} />
    </svg>
    <span>@soymarielitaaa</span>
  </a>
  <a
    href="https://www.tiktok.com/@soymarielitaaa"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-item flex items-center gap-3 text-sm font-semibold"
    style={{ color: 'var(--color-magenta-dark)', padding: '0.55rem 0.7rem', borderRadius: '0.7rem' }}
  >
    <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d={TIKTOK_PATH} />
    </svg>
    <span>@soymarielitaaa</span>
  </a>
</div>
```

- [ ] **Step 8: Add the `.contact-item:hover` CSS to `src/index.css`**

```css
/* ============================================================
   Contact — link row hover
   ============================================================ */

.contact-item {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.contact-item:hover {
  background: var(--pink-soft);
  transform: translateX(6px);
}
```

- [ ] **Step 9: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/Contact.tsx src/index.css
git commit -m "fix(Contact): uniform overlay wash, white heading, photo max-width+shadow, larger subtitle, link hover, grid ratio"
```

---

## Task 11: Footer.tsx — Fix link color and hover

**Files:**
- Modify: `src/components/Footer.tsx`

**Context:** The footer text color uses `paper` (cream) instead of `pink-light`, and the "Volver arriba" link inherits the dimmed body text color instead of being lime-colored with an underline on hover.

- [ ] **Step 1: Read current Footer.tsx**

- [ ] **Step 2: Fix colors**

Replace:
```tsx
<footer
  className="py-8 px-4 text-center"
  style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-paper)' }}
>
  <p className="text-sm mb-4">{t('footer.text' as any)}</p>
  <a
    href="#inicio"
    className="text-xs opacity-70 hover:opacity-100 transition-opacity"
    aria-label={t('footer.top' as any)}
  >
    ↑ {t('footer.top' as any)}
  </a>
</footer>
```
With:
```tsx
<footer
  className="py-8 px-4 text-center"
  style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-pink-light)' }}
>
  <p className="text-sm mb-4">{t('footer.text' as any)}</p>
  <a
    href="#inicio"
    className="text-xs font-semibold hover:underline transition-opacity"
    style={{ color: 'var(--color-lime)' }}
    aria-label={t('footer.top' as any)}
  >
    ↑ {t('footer.top' as any)}
  </a>
</footer>
```

- [ ] **Step 3: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "fix(Footer): pink-light body text, lime link color with underline hover"
```

---

## Task 12: index.css cleanup — remove orphaned/dead CSS rules

**Files:**
- Modify: `src/index.css`

**Context:** Round 1 added several CSS rules targeting class names (`.hero__kicker`, `.hero__title`, `.hero__tagline-top`, `.hero__tagline-mid em`, `.hero__tagline-bottom`, `.hero__camera`, `.hero__handle`, `.nav__links`, `.nav__links a`, `.nav__links a:hover`, `.nav__burger`, `.nav__burger span`, and the entire `@media (max-width: 859px)` block containing `.nav__links`/`.nav__burger` rules) that no component actually uses — Hero.tsx and Nav.tsx are built with Tailwind utilities + inline styles, never those semantic class names. This task removes all of it. Tasks 1–11 already verified their OWN new CSS connects to real classNames — this task only removes the leftover dead code, it does not add anything new.

- [ ] **Step 1: Read the full current `src/index.css`**

- [ ] **Step 2: Remove the orphaned Nav rules (base, non-media-query)**

Delete this block entirely:
```css
/* ============================================================
   Nav component styles
   ============================================================ */

.nav__links {
  display: flex;
  gap: 1.4rem;
}

.nav__links a {
  color: var(--ink);
  text-decoration: none;
  font-size: 0.92rem;
}

.nav__links a:hover {
  color: var(--magenta-hot);
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
}

.nav__burger span {
  width: 24px;
  height: 3px;
  background: var(--magenta-dark);
}
```

Keep `.nav__lang button { ... }` — that one IS used (Nav.tsx has `className="nav__lang"` on the wrapper div, so the descendant selector `.nav__lang button` matches the real `<button>` elements inside it).

- [ ] **Step 3: Remove the orphaned mobile nav media query block**

Delete this entire block:
```css
/* ============================================================
   Mobile nav — breakpoint 859px
   ============================================================ */

@media (max-width: 859px) {
  .nav__links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(254, 239, 244, 0.95);
    backdrop-filter: blur(12px);
    flex-direction: column;
    gap: 0;
    padding: 0;
    transform: translateY(-120%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .nav__links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav__burger {
    display: flex;
  }

  .nav__burger.open span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .nav__burger.open span:nth-child(2) {
    opacity: 0;
  }

  .nav__burger.open span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}
```

(Nav.tsx's mobile menu is fully self-contained via Tailwind `lg:hidden` + inline style transforms — this media query block never matched anything.)

- [ ] **Step 4: Remove the orphaned Hero rules**

Delete this entire block:
```css
/* ============================================================
   Hero text alignment (desktop)
   ============================================================ */

.hero__right .hero__kicker,
.hero__right .hero__title,
.hero__right .hero__tagline,
.hero__right .hero__ctas {
  text-align: left;
}

.hero__right .hero__ctas {
  justify-content: flex-start;
}

.hero__kicker {
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.15);
}

.hero__tagline-top {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 800;
  color: var(--magenta-dark);
}

.hero__tagline-mid em {
  display: inline-block;
  font-style: normal;
}

.hero__tagline-bottom {
  font-weight: 700;
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
}

.hero__camera {
  width: 70px;
  display: block;
  margin: 1rem auto;
}

.hero__handle {
  display: block;
  text-align: center;
  font-family: var(--font-family-body);
}
```

(None of `.hero__kicker`, `.hero__title`, `.hero__tagline-*`, `.hero__camera`, `.hero__handle`, `.hero__right` are present as `className` anywhere in Hero.tsx after Task 1's rewrite — Hero.tsx uses `.hero-title-text` and `.hero-cta-ghost` instead, added in Task 1.)

- [ ] **Step 5: Verify the file still has everything that IS used**

After deletions, confirm these rules remain (added across Tasks 1–11, all verified connected to real classNames):
- `.hero-title-text em`, `.hero-cta-ghost`, `.hero-cta-ghost:hover` (Task 1)
- `.skills-card-dark-title em`, `.skills-card-light-title em` (Task 4)
- `.niche-title em` (Task 5)
- `.metrics-card-title small` (Task 8)
- `.package-card`, `.package-card[data-popular="true"]` (Task 9)
- `.contact-item`, `.contact-item:hover` (Task 10)

Also confirm these Round-1 rules remain untouched (still connected): `.reveal`/`.reveal.visible`, `body.menu-open`, `.nav__lang button`, `.contact__info h2 span`/`em`, `.packages`, `.reel`/`.reel::after`, `.metrics__bar-fill`/`.in-view`, `.metrics__bar-label`, `.metrics__bar-value`, `.metrics__bar-track`, `.metrics__bar-fill--women`/`--men`, `.package__badge`, `.contact__card`/`:hover`, the `prefers-reduced-motion` media query, and `@keyframes spin-slow`.

- [ ] **Step 6: Verify**

```bash
npm run build
npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/index.css
git commit -m "chore(css): remove orphaned Nav and Hero CSS rules that matched no element in the DOM"
```

---

## Final Verification

After all 12 tasks:

```bash
npm run lint    # expect 0 errors
npm run build   # expect success
```

Then the user tests `npm run dev` in the browser and verifies against the original site:
1. Hero: photo stays rounded-rectangle (not circular, by design); circular badge is now a small corner accent with correct text, not a giant halo; title's "Portafolio" is lime; kicker is plain text; `tagline2` has the marker-highlight; CTAs use correct colors
2. Nav: full-width edge-to-edge layout; ES|EN pill with separator; "UGC" colored; burger lines magenta-dark
3. AboutMe: image loads (no 404); no invented notch; badge spans most of the photo width
4. Skills: `<em>` words colored correctly in both card titles; no overlap between decorative image and list
5. ContentReels: niches stacked in a single column (not 2x2 grid); reels have pink borders and proper gap; formats are pill badges
6. Gear: each item is an elevated white card; images aren't cropped
7. Brands: logos sized via width clamp, fully opaque
8. Metrics: pale pink section background (not dark); white stat cards; percentages visible next to bars
9. Packages: texture+border on each card, not the section; featured card has a greenish tint; badge colors correct
10. Contact: uniform pink overlay; white heading; photo capped at 400px with shadow; link rows highlight on hover
11. Footer: "Volver arriba" is lime and underlines on hover

## Execution Order

Tasks 1–11 each modify a distinct component file (and append to `src/index.css` independently) — dispatch sequentially to avoid `index.css` merge conflicts between tasks (per subagent-driven-development's "never dispatch multiple implementation subagents in parallel" rule, this is already the default). Task 12 (cleanup) MUST run last, after all other tasks have added their own CSS, so the orphaned-rule list in Step 2–4 is accurate against the final file state.
