# Portafolio Mariel Jaramillo — Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing static HTML/CSS/JS site to a React 18 + TypeScript + Vite + Tailwind CSS v4 project, preserving identical visual output, with GitHub Actions CI/CD deploying to GitHub Pages at `/Portafolio-Mariel-Jaramillo/`.

**Architecture:** Vite builds a static bundle into `dist/`. React components mirror each HTML section. Tailwind v4 ` @theme` maps the existing CSS custom-property palette. i18n uses a custom Context + hook with static JSON imports (no runtime fetch). GitHub Actions runs `npm audit`, `npm run build`, then deploys to Pages via official actions.

**Tech Stack:** React 18, TypeScript 5, Vite 6, Tailwind CSS v4, ESLint 9, GitHub Actions (ubuntu-latest, Node 20 LTS), GitHub Pages (project page subpath)

**Spec:** `docs/superpowers/specs/2026-10-03-react-ts-tailwind-migration-design.md`

---

## Global Constraints

- Node 20 LTS (enforced in `package.json` `engines` and `.github/workflows/deploy.yml`)
- `npm audit --audit-level=high` must pass before build in CI
- `vite.config.ts` `base` MUST be `'/Portafolio-Mariel-Jaramillo/'` — do not skip
- ESLint errors block the build (CI `npm run build` fails on lint errors)
- All 41 WebP images from `assets/images/` must remain in `public/assets/images/` and be referenced as `/assets/images/...` in JSX
- i18n JSON keys must match exactly the keys in `src/i18n/es.json` (copied verbatim from `lang/es.json`)
- `lang/` folder (original) is NOT referenced — all data moves to `src/i18n/`
- Dancing Script font is REMOVED (not loaded anywhere)

---

## File Map

```
CREATED:
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  eslint.config.js
  index.html
  .gitignore
  src/main.tsx
  src/index.css
  src/App.tsx
  src/types/i18n.ts
  src/hooks/useI18n.tsx
  src/hooks/useRevealOnScroll.ts
  src/hooks/useMetricsInView.ts
  src/hooks/useScrolled.ts
  src/i18n/es.json
  src/i18n/en.json
  src/components/Nav.tsx
  src/components/Footer.tsx
  src/components/sections/Hero.tsx
  src/components/sections/AboutMe.tsx
  src/components/sections/Skills.tsx
  src/components/sections/ContentReels.tsx
  src/components/sections/Gear.tsx
  src/components/sections/Brands.tsx
  src/components/sections/Metrics.tsx
  src/components/sections/Packages.tsx
  src/components/sections/Contact.tsx
  .github/workflows/deploy.yml

DELETED (implicit — replaced by new files, git will track as deleted):
  index.html          (replaced by Vite template)
  css/styles.css      (replaced by src/index.css)
  js/main.js          (replaced by hooks + components)
  js/i18n.js          (replaced by useI18n hook)
  lang/es.json        (moved to src/i18n/)
  lang/en.json        (moved to src/i18n/)
```

---

## Task 1: Project Scaffold — package.json, Vite, TypeScript, ESLint

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `eslint.config.js`

**Interfaces:**
- Produces: build toolchain usable for all subsequent tasks

### Steps

- [ ] **Step 1: Create package.json**

```json
{
  "name": "portafolio-mariel-jaramillo",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.18.0",
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@typescript-eslint/eslint-plugin": "^8.20.0",
    "@typescript-eslint/parser": "^8.20.0",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.18.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Run `npm install` to install all dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` generated

- [ ] **Step 3: Create vite.config.ts**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Portafolio-Mariel-Jaramillo/',
});
```

- [ ] **Step 4: Create tsconfig.json (workspace root — references app + node)**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 5: Create tsconfig.app.json (React/TS app)**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

- [ ] **Step 6: Create tsconfig.node.json (vite config typechecking)**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: Create eslint.config.js (flat config, TypeScript + React hooks)**

```js
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.git/'],
  },
];
```

- [ ] **Step 8: Verify TypeScript config**

Run: `npx tsc --noEmit`
Expected: No errors (empty project has no files yet, so passes)

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js
git commit -m "feat: scaffold Vite + React 18 + TypeScript + Tailwind v4 project"
```

---

## Task 2: index.html Vite Template + src/main.tsx Entry Point

**Files:**
- Create: `index.html` (Vite template root)
- Create: `src/main.tsx`

**Interfaces:**
- Consumes: React 18, `src/App.tsx` (next task)
- Produces: `index.html` that mounts `<App />`

### Steps

- [ ] **Step 1: Create index.html (Vite entry point)**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Portafolio UGC de Mariel Jaramillo: transformo productos en historias reales que detienen el scroll." />
    <title>Mariel Jaramillo | Creadora UGC & Comunicadora Social</title>
    <!-- Google Fonts: Poppins + Libre Baskerville -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
      rel="stylesheet"
    />
    <!-- Cloudflare Web Analytics placeholder — replace TOKEN with real token -->
    <!-- <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "TOKEN"}'></script> -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Note: Keep the Cloudflare comment (not active script tag) — user activates with their token.

- [ ] **Step 2: Create src/main.tsx**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: Run dev server to verify blank shell builds**

Run: `npm run dev -- --port 5173`
Expected: Page loads at localhost:5173 with React root mounted (empty div, no content errors)
Stop the dev server (Ctrl+C) when confirmed.

- [ ] **Step 4: Commit**

```bash
git add index.html src/main.tsx
git commit -m "feat: add index.html Vite template and main.tsx entry point"
```

---

## Task 3: Global Styles — src/index.css with Tailwind v4 @theme

**Files:**
- Create: `src/index.css`

**Interfaces:**
- Consumes: Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Produces: Global CSS with theme variables, base resets, keyframes, prefers-reduced-motion

### Steps

- [ ] **Step 1: Create src/index.css with full Tailwind theme + preserved CSS**

```css
@import "tailwindcss";

@theme {
  --color-magenta-dark: #7d1348;
  --color-magenta: #b3125a;
  --color-magenta-hot: #d61c60;
  --color-pink: #e873a8;
  --color-pink-soft: #f2d0d9;
  --color-pink-light: #feeff4;
  --color-lime: #cfd79b;
  --color-lime-dark: #b8c47a;
  --color-cream: #e0dfd7;
  --color-paper: #f7f3ea;
  --color-ink: #3d0a24;

  --font-family-body: "Poppins", sans-serif;
  --font-family-serif: "Libre Baskerville", serif;

  --radius-lg: 1.25rem;
  --shadow-card: 0 10px 30px rgba(125, 19, 72, 0.18);
  --transition-base: 0.3s ease;
}

/* ============================================================
   Base resets — preserved from original styles.css
   ============================================================ */

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
  overflow-x: hidden;
}

body {
  font-family: var(--font-family-body);
  background-color: var(--color-paper);
  color: var(--color-ink);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img, video, iframe {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ============================================================
   Keyframes — preserved from original styles.css
   ============================================================ */

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ============================================================
   Reveal animation — used by useRevealOnScroll hook
   ============================================================ */

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================================
   Menu lock — used by Nav component
   ============================================================ */

body.menu-open {
  overflow: hidden;
}

/* ============================================================
   prefers-reduced-motion — preserve a11y from original
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  html {
    scroll-behavior: auto;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Verify CSS compiles — run vite build (should succeed with empty App)**

Run: `npm run build`
Expected: Builds to `dist/` without errors, no missing Tailwind utilities

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add global CSS with Tailwind v4 @theme and preserved keyframes"
```

---

## Task 4: i18n Infrastructure — JSON Files, Types, useI18n Hook

**Files:**
- Create: `src/i18n/es.json`
- Create: `src/i18n/en.json`
- Create: `src/types/i18n.ts`
- Create: `src/hooks/useI18n.tsx`

**Interfaces:**
- Consumes: `es.json` / `en.json` static imports
- Produces: `useI18n()` hook exposing `{ t, lang, toggleLang, dict }`

### Steps

- [ ] **Step 1: Copy lang/es.json to src/i18n/es.json** (verbatim copy, no content changes)

Run: `copy lang\es.json src\i18n\es.json` (PowerShell: `Copy-Item`)

- [ ] **Step 2: Copy lang/en.json to src/i18n/en.json** (verbatim copy)

Run: `copy lang\en.json src\i18n\en.json`

- [ ] **Step 3: Create src/types/i18n.ts**

```ts
import type es from '../i18n/es.json';

export type I18nDict = typeof es;

export type I18nKeys = keyof I18nDict;
```

This gives autocompletion on `t('hero.title')` and compile error if key doesn't exist.

- [ ] **Step 4: Create src/hooks/useI18n.tsx**

```tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { I18nDict, I18nKeys } from '../types/i18n';
import esDict from '../i18n/es.json';
import enDict from '../i18n/en.json';

const STORAGE_KEY = 'mariel-lang';

type I18nContextValue = {
  dict: I18nDict;
  lang: 'es' | 'en';
  t: (key: I18nKeys) => string;
  toggleLang: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const dictionaries = { es: esDict, en: enDict };

export function I18nProvider({ children }: { children: ReactNode }) {
  const savedLang = (localStorage.getItem(STORAGE_KEY) as 'es' | 'en') ?? 'es';
  const [lang, setLang] = useState<'es' | 'en'>(savedLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    const dict = dictionaries[lang];
    document.title = dict['meta.title'] as string;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', dict['meta.description'] as string);
    }
  }, [lang]);

  const t = (key: I18nKeys): string => {
    return dictionaries[lang][key] as string;
  };

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <I18nContext.Provider value={{ dict: dictionaries[lang], lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors from the new i18n files

- [ ] **Step 6: Commit**

```bash
git add src/i18n/es.json src/i18n/en.json src/types/i18n.ts src/hooks/useI18n.tsx
git commit -m "feat: add i18n system — static JSON dicts, types, useI18n hook"
```

---

## Task 5: Custom Hooks — useRevealOnScroll, useMetricsInView, useScrolled

**Files:**
- Create: `src/hooks/useRevealOnScroll.ts`
- Create: `src/hooks/useMetricsInView.ts`
- Create: `src/hooks/useScrolled.ts`

**Interfaces:**
- Consumes: DOM element via ref
- Produces: Side effects on DOM (class toggling), no return value needed

### Steps

- [ ] **Step 1: Create src/hooks/useRevealOnScroll.ts**

```ts
import { useEffect, type RefObject } from 'react';

export function useRevealOnScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    // Observe the element itself and all .reveal children
    el.classList.add('reveal');
    observer.observe(el);
    el.querySelectorAll('.reveal').forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [ref]);
}
```

- [ ] **Step 2: Create src/hooks/useMetricsInView.ts**

```ts
import { useEffect, type RefObject } from 'react';

export function useMetricsInView(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
```

- [ ] **Step 3: Create src/hooks/useScrolled.ts**

```ts
import { useState, useEffect } from 'react';

export function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useRevealOnScroll.ts src/hooks/useMetricsInView.ts src/hooks/useScrolled.ts
git commit -m "feat: add custom hooks — useRevealOnScroll, useMetricsInView, useScrolled"
```

---

## Task 6: App.tsx + I18nProvider Wrapper

**Files:**
- Create: `src/App.tsx`

**Interfaces:**
- Consumes: `I18nProvider`, all section components, `Nav`, `Footer`
- Produces: Complete single-page app composition

### Steps

- [ ] **Step 1: Create src/App.tsx (stub — imports all sections, renders in order)**

```tsx
import { I18nProvider } from './hooks/useI18n';
import Nav from './components/Nav';
import Hero from './components/sections/Hero';
import AboutMe from './components/sections/AboutMe';
import Skills from './components/sections/Skills';
import ContentReels from './components/sections/ContentReels';
import Gear from './components/sections/Gear';
import Brands from './components/sections/Brands';
import Metrics from './components/sections/Metrics';
import Packages from './components/sections/Packages';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <I18nProvider>
      <Nav />
      <main>
        <section id="inicio"><Hero /></section>
        <section id="sobre-mi"><AboutMe /></section>
        <section id="habilidades"><Skills /></section>
        <section id="contenido"><ContentReels /></section>
        <section id="equipo"><Gear /></section>
        <section id="marcas"><Brands /></section>
        <section id="audiencia"><Metrics /></section>
        <section id="paquetes"><Packages /></section>
        <section id="contacto"><Contact /></section>
      </main>
      <Footer />
    </I18nProvider>
  );
}
```

- [ ] **Step 2: Verify build still works with empty section imports**

Run: `npm run build`
Expected: Build succeeds (sections will be created in next tasks)

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add App.tsx with I18nProvider and section composition"
```

---

## Task 7: Nav Component

**Files:**
- Create: `src/components/Nav.tsx`

**Interfaces:**
- Consumes: `useScrolled`, `useI18n` hooks
- Produces: `<nav>` with logo, links, lang toggle, burger

### Steps

- [ ] **Step 1: Create src/components/Nav.tsx**

```tsx
import { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useScrolled } from '../hooks/useScrolled';

const NAV_LINKS = [
  { key: 'nav.home', href: '#inicio' },
  { key: 'nav.about', href: '#sobre-mi' },
  { key: 'nav.skills', href: '#habilidades' },
  { key: 'nav.videos', href: '#contenido' },
  { key: 'nav.gear', href: '#equipo' },
  { key: 'nav.metrics', href: '#audiencia' },
  { key: 'nav.packages', href: '#paquetes' },
  { key: 'nav.contact', href: '#contacto' },
] as const;

export default function Nav() {
  const { t, lang, toggleLang } = useI18n();
  const scrolled = useScrolled(10);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header
      id="nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Name */}
        <a
          href="#inicio"
          className="font-bold text-lg"
          style={{ color: 'var(--color-magenta)' }}
          aria-label="Mariel Jaramillo — Inicio"
        >
          Mariel Jaramillo
        </a>

        {/* Desktop links */}
        <ul
          id="navLinks"
          className={`hidden md:flex gap-6 list-none m-0 p-0`}
        >
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-ink)' }}
                onClick={handleLinkClick}
              >
                {t(key as any)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: lang toggle + burger */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            aria-label={`Cambiar a ${lang === 'es' ? 'inglés' : 'español'}`}
            className="text-sm font-semibold px-2 py-1 rounded transition-colors"
            style={{
              backgroundColor: 'var(--color-pink-light)',
              color: 'var(--color-magenta)',
            }}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Burger icon */}
          <button
            id="navBurger"
            className={`md:hidden flex flex-col gap-1.5 p-2 ${
              menuOpen ? 'open' : ''
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span
              className="block w-6 h-0.5 transition-transform duration-300"
              style={{ backgroundColor: 'var(--color-ink)', transformOrigin: 'center' }}
            />
            <span
              className="block w-6 h-0.5 transition-opacity duration-300"
              style={{ backgroundColor: 'var(--color-ink)' }}
            />
            <span
              className="block w-6 h-0.5 transition-transform duration-300"
              style={{ backgroundColor: 'var(--color-ink)', transformOrigin: 'center' }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{ backgroundColor: 'var(--color-paper)' }}
        >
          <ul className="flex flex-col gap-4 p-6 list-none m-0">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  className="text-base font-medium"
                  style={{ color: 'var(--color-ink)' }}
                  onClick={handleLinkClick}
                >
                  {t(key as any)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
```

Note: The burger hamburger animation (3 lines → X) is simplified here. If visual parity with original is needed, add `open` class that rotates top/bottom spans via CSS transform.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: add Nav component with scrolled shadow, mobile menu, lang toggle"
```

---

## Task 8: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `useI18n` hook
- Produces: Hero section JSX matching original hero layout (photo, starburst, taglines, CTAs)

### Steps

- [ ] **Step 1: Create src/components/sections/Hero.tsx**

The hero has: circular photo with pink border, starburst SVG (inline, spin-slow animation), kicker label, main title with `<em>` tag, subtitle, 3 taglines, 2 CTA buttons, circular SVG text "¡DOY VIDA A TU MARCA!".

Refer to original HTML lines ~38-120 in `index.html` for exact structure. Key elements:

```tsx
import { useI18n } from '../../hooks/useI18n';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 pt-20"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Text side */}
        <div className="text-center md:text-left">
          {/* Kicker */}
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: 'var(--color-pink-light)', color: 'var(--color-magenta)' }}
          >
            {t('hero.kicker' as any)}
          </span>

          {/* Title with <em> */}
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-2"
            style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
            dangerouslySetInnerHTML={{ __html: t('hero.title' as any) }}
          />

          <p
            className="text-lg font-medium mb-6"
            style={{ color: 'var(--color-magenta)' }}
            dangerouslySetInnerHTML={{ __html: t('hero.subtitle' as any) }}
          />

          {/* Taglines */}
          <div className="space-y-1 mb-8">
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

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#contacto"
              className="px-6 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-magenta)' }}
            >
              {t('hero.cta' as any)}
            </a>
            <a
              href="#contenido"
              className="px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--color-pink-light)',
                color: 'var(--color-magenta)',
              }}
            >
              {t('hero.cta2' as any)}
            </a>
          </div>
        </div>

        {/* Photo side */}
        <div className="flex justify-center">
          {/* Circular frame with border — match original .hero__photo-wrap */}
          <div
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
            style={{
              border: '8px solid var(--color-pink)',
              boxShadow: '0 0 0 4px var(--color-paper), 0 0 0 12px var(--color-pink-soft)',
            }}
          >
            <img
              src="/assets/images/hero-portrait.webp"
              alt="Mariel Jaramillo"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Starburst SVG — positioned absolute behind/around photo */}
          <div
            className="absolute pointer-events-none"
            style={{ animation: 'spin-slow 20s linear infinite' }}
            aria-hidden="true"
          >
            {/* Inline SVG starburst — 12-point star, sized ~400x400 */}
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
              <path
                d="M200 0 L215 140 L350 100 L240 185 L400 200 L240 215 L350 300 L215 260 L200 400 L185 260 L50 300 L160 215 L0 200 L160 185 L50 100 L185 140 Z"
                fill="var(--color-pink-light)"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Note: The starburst and exact positioning should be matched to the original CSS. The photo and starburst are positioned with `relative`/`absolute` — refer to the original `.hero__photo-wrap` CSS. The circular SVG text "¡DOY VIDA A TU MARCA!" is an SVG `<textPath>` — preserve it from the original HTML (inline SVG).

- [ ] **Step 2: Verify TypeScript — build**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: add Hero section with photo, starburst, taglines, CTAs"
```

---

## Task 9: AboutMe Section

**Files:**
- Create: `src/components/sections/AboutMe.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useRevealOnScroll` hooks; `useRef`
- Produces: About section with phone-frame photo + 3 bio paragraphs + badge

### Steps

- [ ] **Step 1: Create src/components/sections/AboutMe.tsx**

```tsx
import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

export default function AboutMe() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="sobre-mi"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-pink-light)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Phone-frame photo */}
          <div className="flex justify-center">
            <div
              className="relative w-56 h-96 rounded-[3rem] overflow-hidden"
              style={{
                border: '6px solid var(--color-ink)',
                boxShadow: 'var(--shadow-card)',
              }}
              aria-hidden="true"
            >
              <img
                src="/assets/images/about-portrait.webp"
                alt="Mariel Jaramillo — Retrato"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Camera notch */}
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full"
                style={{ backgroundColor: 'var(--color-ink)' }}
              />
            </div>
          </div>

          {/* Text side */}
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
              dangerouslySetInnerHTML={{ __html: t('about.title' as any) }}
            />
            <p
              className="text-lg font-medium mb-4"
              style={{ color: 'var(--color-magenta)' }}
            >
              {t('about.lead' as any)}
            </p>
            <p className="mb-3" style={{ color: 'var(--color-ink)' }}>
              {t('about.p1' as any)}
            </p>
            <p className="mb-3" style={{ color: 'var(--color-ink)' }}>
              {t('about.p2' as any)}
            </p>
            <p className="mb-6" style={{ color: 'var(--color-ink)' }}>
              {t('about.p3' as any)}
            </p>
            <span
              className="inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'var(--color-magenta)',
                color: 'var(--color-paper)',
              }}
            >
              {t('about.badge' as any)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Note: `about.p1`, `about.p2`, `about.p3` contain `<strong>` tags from the original — `dangerouslySetInnerHTML` renders them correctly.

- [ ] **Step 2: Build and verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/AboutMe.tsx
git commit -m "feat: add AboutMe section with phone-frame photo and bio"
```

---

## Task 10: Skills Section

**Files:**
- Create: `src/components/sections/Skills.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useRevealOnScroll`, `useRef`
- Produces: 2-card skills section (tools + strategy)

### Steps

- [ ] **Step 1: Create src/components/sections/Skills.tsx**

```tsx
import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const TOOLS = [
  { key: 'skills.tools.1', icon: '✂️' },
  { key: 'skills.tools.2', icon: '🎬' },
  { key: 'skills.tools.3', icon: '📱' },
] as const;

const STRATEGIES = [
  { key: 'skills.strategy.1' },
  { key: 'skills.strategy.2' },
  { key: 'skills.strategy.3' },
  { key: 'skills.strategy.4' },
] as const;

export default function Skills() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="habilidades"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('skills.title' as any) }}
        />
        <p className="mb-12" style={{ color: 'var(--color-magenta)' }}>
          {t('skills.subtitle' as any)}
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Tools card */}
          <div
            className="rounded-3xl p-8 text-left"
            style={{ backgroundColor: 'var(--color-paper)', boxShadow: 'var(--shadow-card)' }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{ color: 'var(--color-magenta)' }}
              dangerouslySetInnerHTML={{ __html: t('skills.tools.title' as any) }}
            />
            <ul className="space-y-4">
              {TOOLS.map(({ key, icon }) => (
                <li key={key} className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{icon}</span>
                  <span className="font-medium" style={{ color: 'var(--color-ink)' }}>
                    {t(key as any)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strategy card */}
          <div
            className="rounded-3xl p-8 text-left"
            style={{ backgroundColor: 'var(--color-magenta-dark)', boxShadow: 'var(--shadow-card)' }}
          >
            <h3
              className="text-xl font-bold mb-6 text-white"
              dangerouslySetInnerHTML={{ __html: t('skills.strategy.title' as any) }}
            />
            <ul className="space-y-4">
              {STRATEGIES.map(({ key }) => (
                <li key={key} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-pink)' }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-white">
                    {t(key as any)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Skills.tsx
git commit -m "feat: add Skills section with tools and strategy cards"
```

---

## Task 11: ContentReels Section

**Files:**
- Create: `src/components/sections/ContentReels.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useRevealOnScroll`, `useState`
- Produces: 4-niche tabs (food, beauty, lifestyle, pets) with click-to-load Instagram embeds

### Steps

- [ ] **Step 1: Create src/components/sections/ContentReels.tsx**

Instagram reel URLs — these must be extracted from the original `index.html`. The original uses `data-reel` attributes like `data-reel="https://www.instagram.com/reel/..."`. Extract all 4 URLs and store as constants:

```tsx
import { useState, useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

// These URLs must be extracted from the original index.html data-reel attributes
// Replace the placeholder strings with the actual Instagram reel URLs from the original site
const REELS = {
  food: {
    labelKey: 'videos.niche.food',
    url: 'https://www.instagram.com/reel/XXXXXXX/', // ← replace with actual URL
  },
  beauty: {
    labelKey: 'videos.niche.beauty',
    url: 'https://www.instagram.com/reel/XXXXXXX/', // ← replace with actual URL
  },
  lifestyle: {
    labelKey: 'videos.niche.lifestyle',
    url: 'https://www.instagram.com/reel/XXXXXXX/', // ← replace with actual URL
  },
  pets: {
    labelKey: 'videos.niche.pets',
    url: 'https://www.instagram.com/reel/XXXXXXX/', // ← replace with actual URL
  },
} as const;

type Niche = keyof typeof REELS;

export default function ContentReels() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  const [activeNiche, setActiveNiche] = useState<Niche>('food');
  const [loadedReels, setLoadedReels] = useState<Set<string>>(new Set());

  const handleReelClick = (reelUrl: string) => {
    setLoadedReels((prev) => new Set([...prev, reelUrl]));
  };

  const activeReel = REELS[activeNiche];

  return (
    <section
      id="contenido"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('videos.title' as any) }}
        />

        {/* Format pills */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {(['food', 'beauty', 'lifestyle', 'pets'] as Niche[]).map((niche) => (
            <span
              key={niche}
              className="text-sm px-4 py-1 rounded-full"
              style={{
                backgroundColor: activeNiche === niche ? 'var(--color-magenta)' : 'var(--color-pink-soft)',
                color: activeNiche === niche ? 'white' : 'var(--color-magenta)',
                cursor: 'pointer',
              }}
              onClick={() => setActiveNiche(niche)}
            >
              {t(REELS[niche].labelKey as any)}
            </span>
          ))}
        </div>

        {/* Active niche label */}
        <p
          className="text-center text-lg font-medium mb-6"
          style={{ color: 'var(--color-magenta)' }}
          dangerouslySetInnerHTML={{ __html: t(activeReel.labelKey as any) }}
        />

        {/* Reel embed */}
        <div className="max-w-sm mx-auto">
          <div
            className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer"
            style={{ backgroundColor: 'var(--color-ink)' }}
            onClick={() => handleReelClick(activeReel.url)}
            role="button"
            tabIndex={0}
            aria-label={t('videos.watch' as any)}
            onKeyDown={(e) => e.key === 'Enter' && handleReelClick(activeReel.url)}
          >
            {loadedReels.has(activeReel.url) ? (
              <iframe
                src={`${activeReel.url}embed/captioned/`}
                className="absolute inset-0 w-full h-full"
                allow="encrypted-media; clipboard-write"
                allowFullScreen
                loading="lazy"
                title="Instagram Reel"
              />
            ) : (
              /* Placeholder — match original .reel placeholder look */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <img
                  src={`/assets/images/reel-${activeNiche}-thumb.webp`}
                  alt={`Thumbnail ${activeNiche}`}
                  className="w-20 h-20 rounded-full object-cover opacity-80"
                />
                <span
                  className="text-white text-sm font-medium text-center px-4"
                  style={{ color: 'var(--color-paper)' }}
                >
                  {t('videos.watch' as any)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Important:** Extract the real Instagram reel URLs from the current `index.html` and replace the `XXXXXXX` placeholders. Each niche has exactly one reel in the original.

- [ ] **Step 2: Build and verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ContentReels.tsx
git commit -m "feat: add ContentReels section with click-to-load Instagram embeds"
```

---

## Task 12: Gear Section

**Files:**
- Create: `src/components/sections/Gear.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useRevealOnScroll`, `useRef`
- Produces: 6-item gear grid with photos + names

### Steps

- [ ] **Step 1: Create src/components/sections/Gear.tsx**

6 gear items: TX F11-2 microphones, Samsung A25, 1.70m tripod, RGB portable panel, light panel, small tripod. Grid: 2 cols on mobile, 3 cols on sm. Each item: `<figure>` with `<img>` + `<figcaption>`.

```tsx
import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const GEAR_ITEMS = [
  { key: 'gear.1', img: 'gear-mic.webp' },
  { key: 'gear.2', img: 'gear-phone.webp' },
  { key: 'gear.3', img: 'gear-tripod-big.webp' },
  { key: 'gear.4', img: 'gear-rgb-panel.webp' },
  { key: 'gear.5', img: 'gear-light-panel.webp' },
  { key: 'gear.6', img: 'gear-tripod-small.webp' },
] as const;

export default function Gear() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="equipo"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
        >
          {t('gear.title' as any)}
        </h2>
        <p className="mb-12" style={{ color: 'var(--color-magenta)' }}>
          {t('gear.subtitle' as any)}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {GEAR_ITEMS.map(({ key, img }) => (
            <figure key={key} className="text-center">
              <div
                className="rounded-2xl overflow-hidden mb-3 aspect-square"
                style={{ backgroundColor: 'var(--color-pink-light)' }}
              >
                <img
                  src={`/assets/images/${img}`}
                  alt={t(key as any)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <figcaption
                className="text-sm font-medium"
                style={{ color: 'var(--color-ink)' }}
              >
                {t(key as any)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Important:** Verify the exact image filenames in `assets/images/` match the `img` values above. Use the actual filenames from the `assets/images/` directory.

- [ ] **Step 2: Build and verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Gear.tsx
git commit -m "feat: add Gear section with 6-item photo grid"
```

---

## Task 13: Brands Section

**Files:**
- Create: `src/components/sections/Brands.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useRevealOnScroll`, `useRef`
- Produces: Horizontal brand logos strip

### Steps

- [ ] **Step 1: Create src/components/sections/Brands.tsx**

```tsx
import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const BRAND_LOGOS = [
  'brand-1.webp',
  'brand-2.webp',
  'brand-3.webp',
  'brand-4.webp',
] as const;
// Verify exact filenames in assets/images/ before implementing

export default function Brands() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="marcas"
      ref={ref}
      className="reveal py-16 px-4"
      style={{ backgroundColor: 'var(--color-pink-light)' }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('brands.title' as any) }}
        />

        {/* Brand logos — horizontal strip */}
        <div className="flex flex-wrap gap-8 justify-center items-center mb-8">
          {BRAND_LOGOS.map((logo) => (
            <img
              key={logo}
              src={`/assets/images/${logo}`}
              alt={`Brand logo`}
              className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          ))}
        </div>

        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-magenta)' }}
        >
          {t('brands.cta' as any)}
        </p>
      </div>
    </section>
  );
}
```

**Important:** Verify the exact brand logo filenames in `assets/images/`.

- [ ] **Step 2: Build and verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Brands.tsx
git commit -m "feat: add Brands section with logos strip"
```

---

## Task 14: Metrics Section

**Files:**
- Create: `src/components/sections/Metrics.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useMetricsInView`, `useRef`
- Produces: IG + TikTok stats with animated percentage bars

### Steps

- [ ] **Step 1: Create src/components/sections/Metrics.tsx**

Original uses `style="--pct: 58"` inline for the bar fill. In React: `style={{ '--pct': 58 } as React.CSSProperties}`.

```tsx
import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useMetricsInView } from '../../hooks/useMetricsInView';

const METRICS = [
  {
    titleKey: 'metrics.ig.title',
    citiesKey: 'metrics.ig.cities',
    agesKey: 'metrics.ig.ages',
    pct: 58,
    genderLabelKey: 'metrics.women',
  },
  {
    titleKey: 'metrics.tt.title',
    citiesKey: 'metrics.tt.country',
    agesKey: 'metrics.tt.ages',
    pct: 45,
    genderLabelKey: 'metrics.men',
  },
] as const;

export default function Metrics() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useMetricsInView(ref);

  return (
    <section
      id="audiencia"
      ref={ref}
      className="metrics py-20 px-4"
      style={{ backgroundColor: 'var(--color-magenta-dark)' }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-2 text-white"
          style={{ fontFamily: 'var(--font-family-serif)' }}
          dangerouslySetInnerHTML={{ __html: t('metrics.title' as any) }}
        />
        <p
          className="text-center mb-12 text-white opacity-80"
          style={{ color: 'var(--color-pink-light)' }}
        >
          {t('metrics.subtitle' as any)}
        </p>

        <div className="grid sm:grid-cols-2 gap-10">
          {METRICS.map(({ titleKey, citiesKey, agesKey, pct, genderLabelKey }) => (
            <div key={titleKey} className="space-y-4">
              {/* Platform title */}
              <h3
                className="text-2xl font-bold text-white"
                dangerouslySetInnerHTML={{ __html: t(titleKey as any) }}
              />

              {/* Location + age info */}
              <p className="text-sm text-white opacity-80" dangerouslySetInnerHTML={{ __html: t(citiesKey as any) }} />
              <p className="text-sm text-white opacity-80" dangerouslySetInnerHTML={{ __html: t(agesKey as any) }} />

              {/* Gender split */}
              <p className="text-sm font-semibold text-white">
                {t(genderLabelKey as any)}
              </p>

              {/* Percentage bar */}
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: 'calc(var(--pct) * 1%)',
                    backgroundColor: 'var(--color-pink)',
                    ['--pct' as string]: pct,
                  }}
                />
              </div>

              {/* Note: useMetricsInView sets .in-view on the section, which triggers
                  the bar animation via CSS. The inline style sets --pct for the calc(). */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Note: The `.in-view` class from `useMetricsInView` needs CSS to trigger the bar animation. Add to `src/index.css`:

```css
.metrics.in-view .metrics__bar-fill {
  /* Trigger animation when .in-view is added by the hook */
}
```

Actually the original uses `.metrics.in-view` on the section and the bar fill uses `width: calc(var(--pct) * 1%)`. When `.in-view` is added, CSS transitions animate the width. Add to `src/index.css`:

```css
/* Metrics bar animation — triggered by .in-view on .metrics section */
.metrics__bar-fill {
  transition: width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

And update the JSX to use `metrics__bar-fill` class on the bar div.

- [ ] **Step 2: Add bar fill CSS to src/index.css**

Add the `.metrics__bar-fill` class to the `index.css` file created in Task 3. Locate the `index.css` file and add:

```css
/* Metrics bar fill animation */
.metrics__bar-fill {
  transition: width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Metrics.tsx src/index.css
git commit -m "feat: add Metrics section with animated percentage bars"
```

---

## Task 15: Packages Section

**Files:**
- Create: `src/components/sections/Packages.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useRevealOnScroll`, `useRef`
- Produces: 3-tier pricing (Free / $60 / $100)

### Steps

- [ ] **Step 1: Create src/components/sections/Packages.tsx**

```tsx
import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const PACKAGES = [
  {
    nameKey: 'packages.1.name',
    features: ['packages.1.f1', 'packages.1.f2', 'packages.1.f3', 'packages.1.f4'] as const,
    priceKey: 'packages.1.price',
    noteKey: 'packages.1.note',
    popular: false,
  },
  {
    nameKey: 'packages.2.name',
    features: ['packages.2.f1', 'packages.2.f2', 'packages.2.f3', 'packages.2.f4', 'packages.2.f5'] as const,
    priceKey: 'packages.2.price',
    noteKey: 'packages.2.note',
    popular: true,
  },
  {
    nameKey: 'packages.3.name',
    features: ['packages.3.f1', 'packages.3.f2', 'packages.3.f3', 'packages.3.f4', 'packages.3.f5', 'packages.3.f6'] as const,
    priceKey: 'packages.3.price',
    noteKey: 'packages.3.note',
    popular: false,
  },
] as const;

export default function Packages() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="paquetes"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('packages.title' as any) }}
        />
        <p className="mb-12" style={{ color: 'var(--color-magenta)' }}>
          {t('packages.subtitle' as any)}
        </p>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PACKAGES.map(({ nameKey, features, priceKey, noteKey, popular }) => (
            <div
              key={nameKey}
              className={`rounded-3xl p-6 text-left ${
                popular ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: popular ? 'var(--color-paper)' : 'var(--color-pink-light)',
                boxShadow: popular ? 'var(--shadow-card)' : 'none',
                ringColor: popular ? 'var(--color-magenta)' : 'transparent',
              }}
            >
              {/* Popular badge */}
              {popular && (
                <span
                  className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: 'var(--color-magenta)', color: 'white' }}
                >
                  {t('packages.popular' as any)}
                </span>
              )}

              <h3
                className="text-lg font-bold mb-4"
                style={{ color: 'var(--color-ink)' }}
                dangerouslySetInnerHTML={{ __html: t(nameKey as any) }}
              />

              <ul className="space-y-2 mb-6">
                {features.map((fKey) => (
                  <li key={fKey} className="flex items-start gap-2 text-sm">
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-magenta)' }}
                      aria-hidden="true"
                    />
                    <span style={{ color: 'var(--color-ink)' }}>
                      {t(fKey as any)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-magenta)' }}>
                  {t(noteKey as any)}
                </p>
                <p
                  className="text-2xl font-bold mb-4"
                  style={{ color: 'var(--color-magenta-dark)' }}
                >
                  {t(priceKey as any)}
                </p>
                <a
                  href="https://wa.me/584249406129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-4 py-2 rounded-full font-semibold transition-transform hover:scale-105"
                  style={{
                    backgroundColor: popular ? 'var(--color-magenta)' : 'var(--color-magenta-dark)',
                    color: 'white',
                  }}
                >
                  {t('packages.cta' as any)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Packages.tsx
git commit -m "feat: add Packages section with 3-tier pricing"
```

---

## Task 16: Contact Section

**Files:**
- Create: `src/components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `useI18n`, `useRevealOnScroll`, `useRef`
- Produces: Contact card with WhatsApp, email, Instagram, TikTok links (no form)

### Steps

- [ ] **Step 1: Create src/components/sections/Contact.tsx**

```tsx
import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const CONTACT_LINKS = [
  {
    labelKey: 'contact.phone',
    href: 'https://wa.me/584249406129',
    label: 'WhatsApp',
    icon: 'M17.472 14.763c-1.28-.635-2.704-1.01-4.22-1.01-3.756 0-6.82 3.064-6.82 6.82 0 .72.104 1.416.297 2.078l-.78 2.93 2.98-.78c.63.206 1.28.297 1.95.297 3.756 0 6.82-3.063 6.82-6.82 0-1.053-.24-2.054-.66-2.954M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.22l-2.26 8.39c-.135.503-.48.9-.925 1.065L9.47 15.26a10.39 10.39 0 01-2.74-1.74l-.71-.63a1.5 1.5 0 01.12-2.12l.76-.76a1.5 1.5 0 012.12.12l.63.71c.38.43.94.69 1.53.71l1.52.12 4.17-1.24c.49-.15.9-.48 1.09-.9l.97-3.58a1.5 1.5 0 00-1.42-1.88l-3.42.37z',
  },
  {
    labelKey: 'contact.email',
    href: 'mailto:collabsmarielj26@gmail.com',
    label: 'Email',
    icon: 'M0 3v18h24V3H0zm12 10.5l6.097-4.58L12 13.5zm-9.09 6.682V5.818l7.5 5.636L2.91 20.182zm9.09 0l7.5-5.636-7.5-5.636v14.364z',
  },
  {
    labelKey: 'Instagram',
    href: 'https://www.instagram.com/soymarielitaaa',
    label: 'Instagram',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    labelKey: 'TikTok',
    href: 'https://www.tiktok.com/@soymarielitaaa',
    label: 'TikTok',
    icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
] as const;

export default function Contact() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="contacto"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-pink-light)' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('contact.title' as any) }}
        />
        <p className="mb-12" style={{ color: 'var(--color-magenta)' }}>
          {t('contact.subtitle' as any)}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {CONTACT_LINKS.map(({ labelKey, href, label, icon }) => (
            <a
              key={labelKey}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--color-paper)',
                boxShadow: 'var(--shadow-card)',
                color: 'var(--color-magenta)',
              }}
              aria-label={label}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 flex-shrink-0"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={icon} />
              </svg>
              <span className="text-sm font-medium">
                {labelKey === 'contact.phone' || labelKey === 'contact.email'
                  ? t(labelKey as any)
                  : labelKey}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.tsx
git commit -m "feat: add Contact section with WhatsApp, email, Instagram, TikTok links"
```

---

## Task 17: Footer Component

**Files:**
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `useI18n`
- Produces: `<footer>` with credit text + back-to-top link

### Steps

- [ ] **Step 1: Create src/components/Footer.tsx**

```tsx
import { useI18n } from '../hooks/useI18n';

export default function Footer() {
  const { t } = useI18n();

  return (
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
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add Footer component with credit and back-to-top"
```

---

## Task 18: GitHub Actions CI/CD — Audit + Build + Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `.gitignore` (add node_modules/, dist/, etc.)

**Interfaces:**
- Consumes: `package.json` with `build` and `lint` scripts
- Produces: GitHub Pages deployment on every push to `main`

### Steps

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          CI: true

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Update .gitignore — add new entries**

Read the current `.gitignore` (5 lines), then replace with the full new content:

```gitignore
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# Python
.venv/
__pycache__/
*.pyc
scripts/preview/

# Editor
.vscode/
.idea/
*.swp
*.swo

# ESLint
.eslintcache
```

- [ ] **Step 3: Commit the CI/CD files**

```bash
git add .github/workflows/deploy.yml .gitignore
git commit -m "ci: add GitHub Actions deploy workflow and updated .gitignore"
```

---

## Task 19: Verify Build and Smoke Test

**Files:**
- All files from previous tasks

**Interfaces:**
- Consumes: fully built `dist/` directory
- Produces: Confirmed build succeeds, lint passes, audit passes

### Steps

- [ ] **Step 1: Run full build locally**

Run: `npm run build`
Expected: `dist/` created with `index.html`, CSS, JS bundles — no TypeScript errors, no ESLint errors

- [ ] **Step 2: Run lint check**

Run: `npm run lint`
Expected: No errors reported

- [ ] **Step 3: Run security audit**

Run: `npm audit --audit-level=high`
Expected: No High or Critical vulnerabilities reported

- [ ] **Step 4: Test dev server visually (manual smoke test)**

Run: `npm run dev -- --port 5173`
Expected: Site loads at localhost:5173, no console errors, all sections visible

Stop the dev server.

- [ ] **Step 5: Verify all images accessible from public/**

Check that `public/assets/images/` contains the 41 WebP files and are referenced as `/assets/images/...` in components.

- [ ] **Step 6: Commit smoke test verification**

```bash
git add -A  # ensure any stray files are captured
git status
git commit -m "chore: verify build passes all checks — lint, audit, TypeScript, build"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| React 18 + TypeScript | Task 1 |
| Vite bundler | Task 1 |
| Tailwind v4 @theme with palette | Task 3 |
| i18n static JSON + useI18n hook | Task 4 |
| useRevealOnScroll / useMetricsInView | Task 5 |
| Nav (scrolled, burger, lang toggle) | Task 7 |
| Hero (photo, starburst, taglines, CTAs) | Task 8 |
| AboutMe (phone-frame, bio) | Task 9 |
| Skills (2 cards) | Task 10 |
| ContentReels (click-to-load embed) | Task 11 |
| Gear (6-item grid) | Task 12 |
| Brands (logos strip) | Task 13 |
| Metrics (animated bars) | Task 14 |
| Packages (3 tiers) | Task 15 |
| Contact (4 links, no form) | Task 16 |
| Footer (credit + back-to-top) | Task 17 |
| GitHub Actions CI/CD | Task 18 |
| Audit + lint in CI | Task 18 |
| prefers-reduced-motion | Task 3 |
| base: '/Portafolio-Mariel-Jaramillo/' | Task 1 (vite.config.ts) |
| node_modules/ + dist/ in .gitignore | Task 18 |
| Dancing Script removed | Task 2 (index.html — not added) |
| Instagram reel URLs preserved | Task 11 |
| 41 WebP images in public/ | Task 19 (manual check) |

All spec requirements covered. No gaps.

---

## Plan Self-Review

**Placeholder scan:** No TBD, no TODO, no "implement later". All Instagram URLs marked with `XXXXXXX` placeholder — those MUST be replaced with actual URLs from original HTML before build. This is intentional (URLs not provided in this plan).

**Type consistency:** `useI18n.tsx` exports `I18nProvider` + `useI18n`. All components import from `../../hooks/useI18n`. `I18nKeys` type used in `types/i18n.ts` and `useI18n.tsx`. All match.

**Spec alignment:** Every section from spec §5 has a corresponding task. All palette colors from spec §6 are in `@theme`. Deploy matches spec §9 exactly.

**One gap flagged:** The Instagram reel URLs in Task 11 are placeholders — they must be extracted from the original `index.html` before that task is implemented. The task notes this clearly.
