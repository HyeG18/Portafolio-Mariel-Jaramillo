# Visual Parity Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all visual bugs so migrated React site matches original vanilla HTML/CSS site exactly.

**Architecture:** Tailwind v4 CSS-first config with hybrid approach — Tailwind for spacing/layout/colors, original CSS custom classes ported to `@layer components` for complex effects (gradients, textures, pseudo-elements, calc animations).

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, vanilla CSS custom classes

**Spec:** `docs/superpowers/specs/2026-10-03-react-ts-tailwind-migration-design.md`

---

## Global Constraints

- Site must look visually identical to original vanilla site (not improved, not reinterpreted)
- GitHub Pages subpath: `/Portafolio-Mariel-Jaramillo/`
- No new features — only visual parity fixes
- Assets: 44 WebP images in `assets/images/` (original location)
- No `public/` directory — use `assetUrl()` utility with `import.meta.env.BASE_URL`

---

## File Structure

```
SRC/
├── utils/assetUrl.ts                      # NEW: base-aware asset path helper
├── index.css                              # MOD: add @layer components with original CSS classes
├── App.tsx                                # MOD: remove duplicate section wrappers
├── components/
│   ├── Nav.tsx                            # REWRITE
│   └── sections/
│       ├── Hero.tsx                       # REWRITE
│       ├── AboutMe.tsx                    # FIX: colors, image name, badge position, breakpoint
│       ├── Skills.tsx                     # FIX: replace emojis with images
│       ├── ContentReels.tsx               # REWRITE: show all categories (not tabs), add formats list
│       ├── Brands.tsx                     # REWRITE: real logos, hover effects
│       ├── Gear.tsx                       # FIX: background, hover, filenames already identified
│       ├── Metrics.tsx                    # REWRITE: 2 bars per card, decorative image
│       ├── Packages.tsx                   # FIX: background, texture, badge position
│       └── Contact.tsx                    # REWRITE: 2-col grid, photo, rotated card, SVG icons
INFRA/
├── public/assets/images/                   # NEW: served assets (copy from assets/images/)
└── vite.config.ts                         # MOD: add publicDir or fix base path
```

---

## Task 1: Infrastructure — Serve Images + Asset Utility

**Files:**
- Create: `src/utils/assetUrl.ts`
- Create: `public/assets/images/` (copy all 44 WebPs from `assets/images/`)
- Modify: `vite.config.ts` (set `publicDir: 'public'` or adjust base)

**Interfaces:**
- Produces: `assetUrl(path: string) => string` — returns `/Portafolio-Mariel-Jaramillo/assets/images/x.webp`

**Verification:** `npm run dev` → images load in browser devtools

- [ ] **Step 1: Create `src/utils/assetUrl.ts`**

```typescript
export const assetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL; // "/Portafolio-Mariel-Jaramillo/" or "/"
  return `${base}${path}`.replace(/\/+/g, '/');
};
```

- [ ] **Step 2: Create `public/assets/images/` and copy all 44 WebPs**

Run in PowerShell:
```powershell
New-Item -ItemType Directory -Path "public/assets/images"
Copy-Item -Path "assets/images/*.webp" -Destination "public/assets/images/" -Recurse
```

- [ ] **Step 3: Modify `vite.config.ts` — add `publicDir`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Portafolio-Mariel-Jaramillo/',
  publicDir: 'public',
});
```

- [ ] **Step 4: Commit**

```bash
git add src/utils/assetUrl.ts public/assets/images/
git commit -m "fix: serve images via publicDir and assetUrl utility"
```

---

## Task 2: Nav.tsx — Rewrite to Match Original

**Files:**
- Modify: `src/components/Nav.tsx`

**Original behavior (from `git show 47d9864:index.html`):**
- Logo: `UGC <em>Mariel</em>` (not "Mariel Jaramillo")
- Lang toggle: both "ES" and "EN" visible simultaneously; inactive has opacity ~0.45, active has opacity 1
- Mobile menu: dropdown with `translateY(-120%)` → `translateY(0)` + opacity transition
- Burger: 3 `<span>` lines with transform on `.open` state
- Background: `rgba(254,239,244,0.85)` + `backdrop-filter: blur(12px)`
- Breakpoint: 859px (not 768px)

- [ ] **Step 1: Rewrite Nav.tsx with correct logo, lang toggle, mobile menu, burger, background, breakpoint**

```tsx
import { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, lang, setLang } = useI18n();

  return (
    <nav
      id="nav"
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: 'rgba(254,239,244,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="nav__logo text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          UGC <em style={{ color: 'var(--magenta-hot)' }}>Mariel</em>
        </a>

        {/* Desktop links */}
        <ul className="nav__links hidden md:flex gap-8" style={{ '@media (max-width: 859px)': { display: 'none' } }>
          {[t('nav.home'), t('nav.about'), t('nav.skills'), t('nav.content'), t('nav.gear'), t('nav.pricing'), t('nav.contact')].map((label, i) => (
            <li key={i}><a href={`#${['inicio','sobre-mi','habilidades','contenido','equipo','paquetes','contacto'][i]}`} className="hover:opacity-70 transition-opacity">{label}</a></li>
          ))}
        </ul>

        {/* Lang toggle */}
        <div className="nav__lang flex gap-1">
          <button
            onClick={() => setLang('es')}
            className={`transition-opacity ${lang === 'es' ? 'opacity-100' : 'opacity-45'}`}
          >ES</button>
          <span>|</span>
          <button
            onClick={() => setLang('en')}
            className={`transition-opacity ${lang === 'en' ? 'opacity-100' : 'opacity-45'}`}
          >EN</button>
        </div>

        {/* Burger */}
        <button
          className="nav__burger md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-black transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-6 h-0.5 bg-black transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-black transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`nav__dropdown absolute top-full left-0 right-0 transition-all duration-300 ${
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(254,239,244,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <ul className="flex flex-col p-6 gap-4 md:hidden">
          {[t('nav.home'), t('nav.about'), t('nav.skills'), t('nav.content'), t('nav.gear'), t('nav.pricing'), t('nav.contact')].map((label, i) => (
            <li key={i}><a href={`#${['inicio','sobre-mi','habilidades','contenido','equipo','paquetes','contacto'][i]}`} onClick={() => setMenuOpen(false)}>{label}</a></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Add CSS to `src/index.css`**

```css
@layer components {
  .nav__lang button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
  }
}
```

- [ ] **Step 3: Fix breakpoint in Tailwind — add 859px custom breakpoint**

In `src/index.css` @theme block, add:
```css
@layer base {
  @media (max-width: 859px) {
    .md\:hidden { display: block; }
  }
}
```
Or add to tailwind.config if extended.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.tsx src/index.css
git commit -m "fix(Nav): match original logo, lang toggle, mobile menu, breakpoint"
```

---

## Task 3: Hero.tsx — Complete Rewrite

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/index.css`

**Original behavior (from `git show 47d9864:index.html` + `git show 47d9864:css/styles.css`):**
- Background: `texture-pink.webp` with gradient overlay, NOT solid `var(--color-paper)`
- Layout: flex row (not grid), `gap: 10rem` between left (photo+decorations) and right (text)
- Left column: `hero__photo-wrap` → `hero__starburst` (starburst-glitter.webp as img) + `hero__circle-text` (SVG, radio 75) + `@soymarielitaaa` handle + `camera-pink.webp` (70px decorative)
- Right column: kicker + h1 + tagline (highlighted bg) + camera image + CTAs
- Kicker: `--magenta-dark` color
- Title: white with `text-shadow`
- Tagline mid: `--magenta-dark` background with `--pink-light` text (marker highlight effect)
- Mobile: flex-col, stack vertically
- Breakpoint: 768px

- [ ] **Step 1: Rewrite Hero.tsx**

```tsx
import { useI18n } from '../../hooks/useI18n';
import { assetUrl } from '../../utils/assetUrl';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="inicio"
      className="hero relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(254,228,236,0.7), rgba(254,228,236,0.4)), url('${assetUrl('assets/images/texture-pink.webp')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="flex flex-row gap-10 items-center lg:gap-40">
          {/* LEFT — Photo + decorations */}
          <div className="hero__left flex flex-col items-center relative">
            <div className="hero__photo-wrap relative" style={{ width: 'min(320px, 35vw)' }}>
              <img
                src={assetUrl('assets/images/starburst-glitter.webp')}
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ transform: 'scale(1.2)', top: '-18%', left: '-18%', width: '136%', height: '136%' }}
                aria-hidden="true"
              />
              <div className="relative z-10">
                <img
                  src={assetUrl('assets/images/mariel-hero.webp')}
                  alt="Mariel Jaramillo"
                  className="w-full rounded-lg shadow-xl"
                  style={{ borderRadius: '12px' }}
                />
              </div>
              {/* Circular text SVG */}
              <svg
                className="absolute -top-4 -right-16 w-40 h-40 hero__circle-text"
                viewBox="0 0 200 200"
                style={{ animation: 'spin-slow 20s linear infinite' }}
                aria-hidden="true"
              >
                <path
                  id="circlePath"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  fill="none"
                />
                <text fontSize="13" fill="white" letterSpacing="3.5">
                  <textPath href="#circlePath">CONECTEMOS • CREEMOS JUNTOS • </textPath>
                </text>
              </svg>
              {/* @soymarielitaaa handle */}
              <p className="text-center mt-2 text-sm" style={{ color: 'var(--magenta-dark)', fontFamily: 'Playfair Display, serif' }}>
                @soymarielitaaa
              </p>
              {/* Camera decorative image */}
              <img
                src={assetUrl('assets/images/camera-pink.webp')}
                alt=""
                className="absolute -bottom-8 right-0 w-16 opacity-90"
                style={{ width: '70px' }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* RIGHT — Text content */}
          <div className="hero__right flex flex-col gap-6 flex-1">
            <span
              className="hero__kicker text-sm font-bold tracking-widest uppercase"
              style={{ color: 'var(--magenta-dark)' }}
            >
              {t('hero.kicker')}
            </span>
            <h1
              className="hero__title text-5xl lg:text-7xl font-bold leading-tight"
              style={{ color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.15)', fontFamily: 'Playfair Display, serif' }}
            >
              {t('hero.title')}
            </h1>
            <p
              className="hero__tagline-mid inline-block px-3 py-1 text-lg"
              style={{ backgroundColor: 'var(--magenta-dark)', color: 'var(--pink-light)' }}
            >
              {t('hero.taglineMid')}
            </p>
            <p className="hero__tagline text-lg" style={{ color: 'var(--ink)' }}>
              {t('hero.tagline')}
            </p>
            <img
              src={assetUrl('assets/images/camera-pink.webp')}
              alt=""
              className="w-20 opacity-80"
              aria-hidden="true"
            />
            <div className="hero__ctas flex gap-4 flex-wrap">
              <a
                href="#contacto"
                className="inline-block px-8 py-3 text-white font-bold rounded-full transition-transform hover:scale-105"
                style={{ backgroundColor: 'var(--magenta-hot)' }}
              >
                {t('hero.cta1')}
              </a>
              <a
                href="#paquetes"
                className="inline-block px-8 py-3 font-bold rounded-full border-2 transition-transform hover:scale-105"
                style={{ borderColor: 'var(--magenta-dark)', color: 'var(--magenta-dark)' }}
              >
                {t('hero.cta2')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `src/index.css` — add `spin-slow` keyframe at base level (not just in media query)**

```css
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@layer components {
  .hero__circle-text {
    animation: spin-slow 20s linear infinite;
  }
}
```

- [ ] **Step 3: Ensure responsive — add flex-col on mobile**

In the flex container: `flex flex-col lg:flex-row gap-10 lg:gap-40`

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx src/index.css
git commit -m "fix(Hero): match original flex layout, texture bg, starburst img, circular text, colors"
```

---

## Task 4: AboutMe.tsx — Fix Background, Badge Position, Image Name, Breakpoint

**Files:**
- Modify: `src/components/sections/AboutMe.tsx`

**Original behavior:**
- Section background: `--lime` (NOT `pink-light`)
- Badge "Creadora UGC...": positioned `absolute; bottom: 12%` OVER the photo (not below text)
- Image: `portrait-about.webp` (not `about-portrait.webp`)
- Grid: 2 columns only at 860px+ (not "md" 768px)

- [ ] **Step 1: Read current AboutMe.tsx and apply fixes**

Fix: background `var(--lime)`, badge absolute over photo, correct image name, breakpoint 860px.

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/AboutMe.tsx
git commit -m "fix(AboutMe): lime bg, portrait-about.webp, badge over photo, 860px grid"
```

---

## Task 5: Skills.tsx — Replace Emojis with Images

**Files:**
- Modify: `src/components/sections/Skills.tsx`

**Original behavior:**
- Card "Herramientas" (tools): uses `camera-pink.webp` as decorative image (position absolute bottom-right, 110px width, opacity 0.95), NOT emoji
- Card "Estrategia" (strategy): uses `tulips.webp` as decorative image (same treatment), NOT emoji
- Card tools bg: `--magenta-dark`, bullets `--pink`
- Card strategy bg: white, border `--pink-soft`, bullets `--lime-dark`

- [ ] **Step 1: Read current Skills.tsx and replace emoji icons with images**

```tsx
// Tools card — add decorative image
<img
  src={assetUrl('assets/images/camera-pink.webp')}
  alt=""
  className="absolute bottom-2 right-2"
  style={{ width: '110px', opacity: 0.95 }}
  aria-hidden="true"
/>

// Strategy card — add decorative image
<img
  src={assetUrl('assets/images/tulips.webp')}
  alt=""
  className="absolute bottom-2 right-2"
  style={{ width: '110px', opacity: 0.95 }}
  aria-hidden="true"
/>
```

Remove all emoji characters (`✂️`, `🎬`, etc.) from the component.

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Skills.tsx
git commit -m "fix(Skills): replace emoji icons with camera-pink.webp and tulips.webp images"
```

---

## Task 6: ContentReels.tsx — Show All Categories Without Tabs + Add Formats List

**Files:**
- Modify: `src/components/sections/ContentReels.tsx`

**Original behavior:**
- Shows ALL 4 categories simultaneously (Reviews, Tutoriales, VLOGS, Problema-Solución), NOT tab-based
- Has `videos__formats` list: Reviews | Tutoriales | VLOGS | Problema-Solución
- Section bg: `--magenta-dark`, title `--pink-light`
- Grid: 2 columns, gap 5rem; niche "pets" has only 1 reel → spans full width (`grid-column: 1/-1`)
- Overlay "▶" semi-transparent on thumbnail before hover (pseudo-element)

**Instagram URLs are in `instagram-reels-urls.txt` — use those for the 4 niches:**

```typescript
const niches = [
  { name: 'reviews', title: 'Reviews', handle: '@soymarielitaaa', reels: [
    'https://www.instagram.com/reel/C/',
    // ... from instagram-reels-urls.txt
  ]},
  // ... all 4
];
```

- [ ] **Step 1: Rewrite ContentReels.tsx — remove tabs, show all niches, add formats list, pets spans 2 cols**

- [ ] **Step 2: Add format list styling in CSS**

```css
.videos__formats {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ContentReels.tsx src/index.css
git commit -m "fix(ContentReels): show all niches simultaneously, add formats list, pets spans 2 cols"
```

---

## Task 7: Brands.tsx — Use Real Logos + Correct Hover

**Files:**
- Modify: `src/components/sections/Brands.tsx`

**Original behavior:**
- 4 logos: `brand-chicago.webp` (alt "Restaurante Chicago"), `brand-brocks.webp`, `brand-gummylove.webp`, `brand-kittypom.webp`
- Hover: `scale(1.08) rotate(-3deg)` + drop-shadow filter
- Logos displayed on `--cream` section bg

- [ ] **Step 1: Update image URLs and alt text**

```tsx
const brands = [
  { src: assetUrl('assets/images/brand-chicago.webp'), alt: 'Restaurante Chicago' },
  { src: assetUrl('assets/images/brand-brocks.webp'), alt: 'Brocks' },
  { src: assetUrl('assets/images/brand-gummylove.webp'), alt: 'Gummy Love' },
  { src: assetUrl('assets/images/brand-kittypom.webp'), alt: 'Kitty Pom' },
];
```

- [ ] **Step 2: Apply hover style**

```tsx
<img
  src={brand.src}
  alt={brand.alt}
  className="h-12 w-auto object-contain transition-all duration-300 hover:scale-110 hover:-rotate-3"
  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
/>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Brands.tsx
git commit -m "fix(Brands): use real logo filenames, correct alt text, hover scale+rotate"
```

---

## Task 8: Gear.tsx — Fix Background + Hover + Filenames (Already Identified)

**Files:**
- Modify: `src/components/sections/Gear.tsx`

**Original behavior:**
- Section bg: `--cream` (not white/paper)
- Card hover: `translateY(-6px) rotate(-1deg)` (not just scale)
- Image filenames (fix all 6):
  - `ring-light.webp` (not `ring-light-kit.webp`)
  - `phone-iphone.webp` (not `phone-ios.webp`)
  - `tripod.webp` (not `tripod-fluid.webp`)
  - `microwave.webp` (not `microwave-pink.webp`)
  - `softbox.webp` (not `softbox-led.webp`)
  - `backdrop.webp` (not `backdrop-paper.webp`)

- [ ] **Step 1: Read current Gear.tsx, fix bg, hover, image names**

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Gear.tsx
git commit -m "fix(Gear): cream bg, correct hover transform, all 6 image filenames"
```

---

## Task 9: Metrics.tsx — 2 Bars Per Card + Decorative Image

**Files:**
- Modify: `src/components/sections/Metrics.tsx`

**Original behavior:**
- Each card has **TWO bars**: one for "Mujeres" and one for "Hombres"
- IG values: 58% women / 42% men
- TikTok values: 66% women / 34% men
- Decorative image `hand-phone.webp` positioned absolute bottom-right of section (hidden on mobile <859px)
- Subtitle has pill border: `border: 2px solid magenta-dark; border-radius: 999px`

- [ ] **Step 1: Rewrite Metrics.tsx — 2 bars per card**

```tsx
// Per platform card, two bars:
const platforms = [
  {
    name: 'Instagram',
    stats: [
      { label: 'Mujeres', pct: 58 },
      { label: 'Hombres', pct: 42 },
    ],
  },
  {
    name: 'TikTok',
    stats: [
      { label: 'Mujeres', pct: 66 },
      { label: 'Hombres', pct: 34 },
    ],
  },
];
```

Each bar: `<div className="metrics__bar"><span>{label}</span><div className="metrics__bar-track"><div className="metrics__bar-fill" data-pct={pct} /></div></div>`

- [ ] **Step 2: Add CSS for bar animation (`.in-view` class approach from original)**

```css
@layer components {
  .metrics__bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s ease-out;
    width: 0;
  }
  .metrics__bar-fill.in-view {
    width: calc(var(--pct) * 1%);
  }
}
```

- [ ] **Step 3: Add decorative image**

```tsx
<img
  src={assetUrl('assets/images/hand-phone.webp')}
  alt=""
  className="absolute bottom-0 right-0 w-32 opacity-70 hidden md:block"
  style={{ display: 'none' }} // visible only at 859px+
  aria-hidden="true"
/>
```

- [ ] **Step 4: Add Intersection Observer to trigger `.in-view` on bars**

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.metrics__bar-fill').forEach(bar => {
          bar.style.setProperty('--pct', bar.getAttribute('data-pct') || '0');
          bar.classList.add('in-view');
        });
      }
    }),
    { threshold: 0.3 }
  );
  const el = document.querySelector('.metrics');
  if (el) observer.observe(el);
  return () => observer.disconnect();
}, []);
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Metrics.tsx src/index.css
git commit -m "fix(Metrics): 2 bars per card (women+men), hand-phone image, pill subtitle"
```

---

## Task 10: Packages.tsx — Fix Background + Texture + Badge Position

**Files:**
- Modify: `src/components/sections/Packages.tsx`

**Original behavior:**
- Section bg: `--cream` (not `paper`)
- Background texture: grid pattern using `repeating-linear-gradient` (0° and 90°)
- Badge "Más popular": `position: absolute; top: -14px; right: 18px`

- [ ] **Step 1: Fix section bg color**

- [ ] **Step 2: Add texture pattern CSS**

```css
@layer components {
  .packages {
    background-color: var(--cream);
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(200,180,160,0.15) 40px, rgba(200,180,160,0.15) 41px),
      repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(200,180,160,0.15) 40px, rgba(200,180,160,0.15) 41px);
  }
}
```

- [ ] **Step 3: Fix popular badge position to `absolute; top: -14px; right: 18px`**

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Packages.tsx src/index.css
git commit -m "fix(Packages): cream bg, repeating-gradient texture, popular badge position"
```

---

## Task 11: Contact.tsx — Complete Rewrite (2-Column Grid, Photo, Rotated Card)

**Files:**
- Modify: `src/components/sections/Contact.tsx`

**Original behavior (from `git show 47d9864:index.html`):**
- Layout: 2-column grid (photo left, content right) at 860px+; 1 column on mobile
- Photo: `mariel-contact.webp`
- Background: gradient pink over `texture-pink.webp` (same as Hero)
- Card: `transform: rotate(-1deg)`, bg `--paper`
- SVG icons: specific paths from original (not generic icons)
- h2: `<span>` highlighted in `--lime`, `<em>` in `--magenta-dark`
- Links: email, Instagram DM button, Calendly

- [ ] **Step 1: Rewrite Contact.tsx with 2-column grid, photo, rotated card, correct SVG icons**

```tsx
export default function Contact() {
  const { t } = useI18n();

  return (
    <section
      id="contacto"
      className="contact relative py-24 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(254,228,236,0.6), rgba(254,228,236,0.3)), url('${assetUrl('assets/images/texture-pink.webp')}')`,
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="contact__photo">
            <img
              src={assetUrl('assets/images/mariel-contact.webp')}
              alt="Mariel Jaramillo"
              className="rounded-2xl shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="contact__content">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span style={{ color: 'var(--lime)' }}>{t('contact.titlePart1')}</span>{' '}
              <em style={{ color: 'var(--magenta-dark)', fontStyle: 'normal' }}>{t('contact.titlePart2')}</em>
            </h2>
            <div
              className="contact__card p-8 rounded-2xl shadow-lg"
              style={{ backgroundColor: 'var(--paper)', transform: 'rotate(-1deg)' }}
            >
              <div className="flex flex-col gap-6">
                {/* Email */}
                <a href="mailto:hola@soymariel.com" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>hola@soymariel.com</span>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com/soymarielitaaa" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>@{t('contact.instagram')}</span>
                </a>
                {/* Calendly */}
                <a href="https://calendly.com/soymariel" target="_blank" rel="noreferrer" className="inline-block px-6 py-3 text-white font-bold rounded-full text-center transition-transform hover:scale-105" style={{ backgroundColor: 'var(--magenta-hot)' }}>
                  {t('contact.cta')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Contact.tsx
git commit -m "fix(Contact): 2-col grid, mariel-contact photo, rotated card, gradient texture bg"
```

---

## Task 12: App.tsx — Remove Duplicate Section Wrappers

**Files:**
- Modify: `src/App.tsx`

**Original behavior:**
- No `<section id="x">` wrapper around each component — each component has its own `id` on the root element
- Hero should have `id="inicio"` (only section missing it)

- [ ] **Step 1: Remove all `<section id="x">` wrappers from App.tsx**

```tsx
export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <AboutMe />
      <Skills />
      <ContentReels />
      <Brands />
      <Gear />
      <Metrics />
      <Packages />
      <Contact />
    </div>
  );
}
```

- [ ] **Step 2: Ensure Hero.tsx has `id="inicio"` (it should from Task 3 rewrite)**

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "fix(App): remove duplicate section wrappers, each component has own id"
```

---

## Task 13: index.css — Add All Original CSS Custom Classes

**Files:**
- Modify: `src/index.css`

**Classes to port (complex effects Tailwind can't express cleanly):**

```css
@layer components {
  /* Nav */
  .nav__lang button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
  }

  /* Hero */
  .hero__circle-text {
    animation: spin-slow 20s linear infinite;
  }

  /* Metrics bars */
  .metrics__bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s ease-out;
    width: 0;
  }
  .metrics__bar-fill.in-view {
    width: calc(var(--pct) * 1%);
  }

  /* Packages texture */
  .packages {
    background-color: var(--cream);
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(200,180,160,0.15) 40px, rgba(200,180,160,0.15) 41px),
      repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(200,180,160,0.15) 40px, rgba(200,180,160,0.15) 41px);
  }

  /* Contact card */
  .contact__card {
    transition: transform 0.3s ease;
  }
  .contact__card:hover {
    transform: rotate(-1deg) scale(1.02);
  }

  /* Packages popular badge */
  .package__badge {
    position: absolute;
    top: -14px;
    right: 18px;
  }

  /* ContentReels reel overlay */
  .reel {
    position: relative;
  }
  .reel::after {
    content: '▶';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .reel:hover::after {
    opacity: 1;
  }

  /* Metrics reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .metrics__bar-fill {
      transition: none;
    }
    .hero__circle-text {
      animation: none;
    }
  }
}
```

- [ ] **Step 1: Read current `src/index.css`, add `@layer components` block**

- [ ] **Step 2: Verify `spin-slow` keyframe exists at top of file (not only in media query)**

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "fix(css): port original custom classes to @layer components"
```

---

## Task 14: index.html — Restore Favicon Link

**Files:**
- Modify: `src/index.html`

**Original behavior:**
- Has `<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />`
- May have other meta tags from original index.html

- [ ] **Step 1: Read `src/index.html` and compare with original `git show 47d9864:index.html` — add missing meta/favicon tags**

- [ ] **Step 2: Commit**

```bash
git add src/index.html
git commit -m "fix(index.html): restore favicon and meta tags from original"
```

---

## Verification

After all tasks:

```bash
npm run lint    # expect 0 errors
npm run build   # expect success
```

Then user tests `npm run dev` in browser and verifies:
1. All images render
2. Hero matches original (flex layout, texture bg, starburst, circular text, correct colors)
3. Nav matches (logo "UGC Mariel", both langs visible, mobile menu animation)
4. AboutMe has lime bg, badge over photo
5. Skills uses images not emojis
6. ContentReels shows all 4 categories at once
7. Brands logos are real and have correct hover
8. Gear has cream bg and correct hover transform
9. Metrics has 2 bars per card + hand-phone image
10. Packages has cream bg + grid texture + badge position
11. Contact has 2-col grid with photo + rotated card
12. No duplicate section IDs in DOM

---

## Execution Order

1. **Task 1** (Infrastructure) must complete first — all other tasks depend on `assetUrl()`
2. **Tasks 2–11** can run in parallel across subagents (Nav, Hero, AboutMe, Skills, ContentReels, Brands, Gear, Metrics, Packages, Contact)
3. **Task 12** (App.tsx) after Tasks 2–11 complete
4. **Task 13** (CSS) can run parallel with Tasks 2–11
5. **Task 14** (index.html) last
6. **Final verification** — user tests dev server
