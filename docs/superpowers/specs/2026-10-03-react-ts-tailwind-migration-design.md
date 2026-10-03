# Spec: Migración Portafolio Mariel Jaramillo — Vanilla → React + TypeScript + Tailwind CSS v4

**Fecha:** 2026-10-03
**Tipo:** Refactor tecnológico (mismo output visual, stack moderno)
**Repo:** `Portafolio-Mariel-Jaramillo`
**GitHub Pages:** Project page — subpath `/Portafolio-Mariel-Jaramillo/`

---

## 1. Resumen

Migrar el sitio existente (HTML/CSS/vanilla JS estático) a un proyecto **React 18 + TypeScript + Vite + Tailwind CSS v4**. El resultado visual debe ser **idéntico** al sitio actual. El site sigue siendo 100% estático en producción (HTML/CSS/JS serviría via GitHub Pages). Se elimina toda dependencia innecesaria y se configura CI/CD con GitHub Actions.

**Decisión de fonts:** Eliminar `Dancing Script` — no se usa en ningún lugar del CSS (dead load). Mantener `Poppins` (cuerpo) y `Libre Baskerville` (acento serif). Decisión documentada en §8.

**Decisión de Cloudflare Analytics:** Mantener el snippet en `index.html` como placeholder; el token `"TOKEN"` se reemplaza manualmente al deployar con un token real. No es parte de este spec agregarle analytics — se deja pendiente.

---

## 2. Stack Técnico

| Capa | Herramienta | Versión | Justificación |
|---|---|---|---|
| UI | React | 18 | Funcional components + hooks, sin clases |
| Lenguaje | TypeScript | 5.x | Tipado fuerte, previene bugs comunes |
| Bundler | Vite | 6.x | Build rápido, TS out-of-box, plugin oficial Tailwind v4 |
| Estilos | Tailwind CSS | v4 | Plugin `@tailwindcss/vite`, config en CSS (`@theme`), cero JS config |
| Linting | ESLint | 9.x | + `eslint-plugin-react-hooks` + `@typescript-eslint/*` |
| CI/CD | GitHub Actions | — | `actions/deploy-pages` + `actions/upload-pages-artifact` (oficiales) |
| Runtime | Node | 20 LTS | Solo en dev y CI; prod es archivos estáticos |

**No se usa:** Next.js (no hay SSR/backend), React Router (SPA con anchor-nav, no rutas), librerías de animación (Framer Motion, etc. — CSS transitions + class toggle es suficiente).

---

## 3. Dependencias Cerradas

### Runtime
- `react` ^18
- `react-dom` ^18

### DevDependencies
- `vite` ^6
- `@vitejs/plugin-react` ^4
- `typescript` ^5
- `@types/react` ^18
- `@types/react-dom` ^18
- `tailwindcss` ^4
- `@tailwindcss/vite` ^4
- `eslint` ^9
- `eslint-plugin-react-hooks` ^5
- `@typescript-eslint/eslint-plugin` ^8
- `@typescript-eslint/parser` ^8

**Total directo:** ~11 paquetes. Todos de organizaciones oficiales (facebook, vitejs, tailwindlabs, typescript-eslint). Ninguno de autor individual desconocido.

**Auditoría en CI:** `npm audit --audit-level=high` corre como step antes del build. Si hay vulnerabilidades High o Critical, el pipeline falla y no se despliega.

---

## 4. Estructura de Carpetas

```
Portafolio-Mariel-Jaramillo/
├── public/
│   └── assets/
│       └── images/          # 41 .webp — sin cambios, se referencian via /assets/images/...
├── src/
│   ├── main.tsx             # Entry point, <App /> mount
│   ├── App.tsx              # Compone todas las secciones + Nav + Footer
│   ├── index.css            # @import "tailwindcss"; @theme { ... }; — paleta completa
│   ├── components/
│   │   ├── Nav.tsx          # Nav con logo, links, lang toggle, burger (responsive)
│   │   ├── Footer.tsx       # Crédito + back-to-top
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── AboutMe.tsx
│   │       ├── Skills.tsx
│   │       ├── ContentReels.tsx
│   │       ├── Gear.tsx
│   │       ├── Brands.tsx
│   │       ├── Metrics.tsx
│   │       ├── Packages.tsx
│   │       └── Contact.tsx
│   ├── hooks/
│   │   ├── useI18n.ts        # Context + hook para traducciones
│   │   ├── useRevealOnScroll.ts  # IntersectionObserver → .reveal.visible
│   │   └── useMetricsInView.ts   # IntersectionObserver → .metrics.in-view
│   ├── i18n/
│   │   ├── es.json           # Copia del lang/es.json actual — sin cambios en contenido
│   │   └── en.json           # Copia del lang/en.json actual — sin cambios en contenido
│   └── types/
│       └── i18n.ts           # Tipo I18nKeys derivado de es.json para autocompletado
├── scripts/                  # Scripts Python de asset-prep — fuera de scope para la app
├── docs/superpowers/specs/  # Este spec
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI: audit → build → deploy a GitHub Pages
├── index.html                # Template Vite — meta tags, Google Fonts, Cloudflare snippet
├── vite.config.ts            # base: '/Portafolio-Mariel-Jaramillo/', plugins: [react(), tailwindcss()]
├── tsconfig.json             # Estricto, path aliases src/ → @
├── eslint.config.js          # Flat config, react-hooks + @typescript-eslint
├── tailwind.config.ts        # NO se usa — v4 usa @theme en CSS
├── package.json
└── .gitignore                # Ver §10
```

---

## 5. Componentes

Cada sección = 1 componente de React = 1 responsabilidad. Componentes pequeños, sin lógica de negocio compleja, mayormente JSX + clases Tailwind.

### `Nav.tsx`
- Logo + nav links + language toggle button + burger icon
- Estado local: `isMenuOpen` (useState) + `isScrolled` (useEffect scroll listener)
- Scroll lock en body cuando el menú móvil está abierto (`classList.toggle('menu-open')`)
- `aria-label` en toggle de idioma e icono burger
- Links: `href="#inicio"`, `href="#sobre-mi"`, etc. — same anchor-nav behavior as now

### `Hero.tsx`
- Foto circular, SVG starburst (inline), taglines, 2 CTAs
- Animación spin-slow en starburst via CSS (`@keyframes spin-slow` se移植 a CSS plano en `index.css`)
- Textos vía `t('hero.*')`

### `AboutMe.tsx`
- Phone-frame photo + bio paragraphs
- `about.p1/p2/p3` contienen `<strong>`, `<em>` — se renderizan con `RichText` (ver §7)

### `Skills.tsx`
- 2 cards: herramientas + estrategia
- Grid responsive: `grid-cols-1 sm:grid-cols-2`
- Card variants: `--dark` modifier → clase `bg-magenta-dark text-paper`

### `ContentReels.tsx`
- 4 niches (food, beauty, lifestyle, pets) con tabs/pills
- Cada reel: placeholder div → click → construye `<iframe src="{url}embed/captioned/">` y lo inyecta
- Estado local: `Map<reelId, boolean>` — qué reel ya cargó su embed
- URLs de reels como constante tipada `INSTAGRAM_REELS` en este archivo

### `Gear.tsx`
- Grid 2x3 (mobile: 1 col), fotos + nombres de equipo
- `<figure>` + `<figcaption>` semántico

### `Brands.tsx`
- Strip horizontal con logos de marcas
- Logos referencian `/assets/images/brands/...webp`

### `Metrics.tsx`
- Stats de IG + TikTok con barras de porcentaje
- `useMetricsInView` hook aplica `.in-view` al section cuando entra en viewport
- Barras: `style={{ '--pct': 78 }}` (TypeScript typed) → CSS `width: calc(var(--pct) * 1%)`
- `prefers-reduced-motion`: si está activo, las barras no se animan (se muestran ya llenas)

### `Packages.tsx`
- 3 tiers: Free / $60 / $100
- Tier popular: clase `ring` o borde highlight
- Botón "Lo quiero" → `href="https://wa.me/584249406129"`

### `Contact.tsx`
- Título + subtítulo
- 4 links: WhatsApp, email, Instagram, TikTok
- Inline SVG icons para cada uno
- `aria-label` en cada link icono

### `Footer.tsx`
- Crédito + back-to-top (`href="#inicio"`)
- `t('footer.*')`

---

## 6. Estilos: CSS Custom Properties → Tailwind `@theme`

Tu paleta actual en `:root` se mapea 1:1 a `@theme` en `index.css`:

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

  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
```

Breakpoints: se normalizan los actuales (640 / 768 / 859 / 860) a la escala de Tailwind (`sm=640`, `md=768`, `lg=1024`). El breakpoint del burger-menu (actual 859px) sube a `md` (768px) — ajuste visual menor, se verifica en desarrollo.

Layouts que usan CSS grid/column tricks del original se replican con `grid` + `gap` + responsive classes.

`prefers-reduced-motion` se mantiene en `index.css` como media query que deshabilita transiciones/animaciones — no cambia con Tailwind.

Casos donde layout es muy específico (ej. el SVG circular con texto alrededor, photo-frame phone mockup): se usan `@layer components` con clases named en vez de utility soup.

### Fonts
Google Fonts se cargan en `index.html` (Vite template) via `<link>` preconnect + stylesheet — mismo approach, mismo CDN. `Poppins` (300/400/600/700/800 + italic), `Libre Baskerville` (400/700 + italic). `Dancing Script` **eliminado** (no se usa en CSS — decisión §8).

---

## 7. i18n: `useI18n` Hook + `RichText` Component

### `useI18n.ts`

Replica la lógica de `js/i18n.js` pero en React:

1. Carga estática de `es.json` / `en.json` via `import` (Vite las bundleea — no hay fetch en runtime, funciona hasta offline, ya no necesita servidor HTTP para i18n)
2. `useState` para `lang` actual (inicial: `es` o `localStorage.getItem('mariel-lang') ?? 'es'`)
3. `useEffect` que actualiza `document.documentElement.lang`, `<title>`, meta description
4. `toggleLang()` que escribe a `localStorage` y cambia estado
5. Expone `{ t, lang, toggleLang }` vía `I18nContext`

```ts
// Uso en componente:
const { t } = useI18n();
<p>{t('hero.tagline1')}</p>
```

### `types/i18n.ts`

Tipo derivado de las keys de `es.json`:

```ts
type I18nKeys = typeof import('../i18n/es.json');
```

Esto da autocompletado en `t('...')` y error de compilación si falta una key.

### `RichText` Component

Las traducciones contienen markup HTML (`<em>`, `<strong>`, `<span>`, `<small>`) y entidades (`&amp;`). `innerHTML` rewriting del original se replica con un componente `RichText`:

```tsx
function RichText({ id }: { id: keyof I18nKeys }) {
  const { lang, dict } = useI18n();
  return (
    <span
      dangerouslySetInnerHTML={{ __html: dict[lang][id] }}
    />
  );
}
```

**Consideración XSS:** El contenido de `es.json` / `en.json` es estático, de primera parte, controlado por el desarrollador — no es input de usuario. El riesgo de XSS es cero en la práctica. Se documenta la decisión en comentarios del componente.

Cada componente que tiene keys con markup usa `<RichText id="..." />` en vez de `{t('...')}`.

---

## 8. Hooks de Interacción

### `useRevealOnScroll.ts`
```ts
//threshold: 0.15 — igual que el IntersectionObserver original
//Aplica .visible al elemento cuando entra en viewport
//unobserve después de trigger — mismo pattern
```

### `useMetricsInView.ts`
```ts
//threshold: 0.3
//Agrega .in-view al elemento metrics cuando entra en viewport
//disconnect después de trigger
```

### `useScrolled.ts`
```ts
//Retorna boolean: window.scrollY > 10
//Útil para Nav shadow
```

### Instagram Reels en `ContentReels.tsx`
Estado local por reel (map o array de useState). Click handler construye iframe y reemplaza children del div — parity exacto con `main.js`.

---

## 9. Deploy: GitHub Actions Native

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Security audit
        run: npm audit --audit-level=high
        # Fail pipeline on High/Critical vulnerabilities

      - name: Build
        run: npm run build
        # Output: dist/

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

**Repo Settings → Pages → Source:** "GitHub Actions".

**`vite.config.ts` `base`:** `'/Portafolio-Mariel-Jaramillo/'` — obligatorio para que todas las rutas de assets funcionen en el subpath. Sin esto, las imágenes dan 404 en producción aunque funcionen en local.

**Importante:** Si en el futuro se cambia el nombre del repo, actualizar `base` en `vite.config.ts` Y en `index.css` las referencias a `/assets/images/...` (o usar `new URL('...', import.meta.url)` para assets referencing).

---

## 10. `.gitignore` Adiciones

```gitignore
# Node
node_modules/

# Build output
dist/

# Env vars
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# Python (ya existía)
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

Los siguientes ya existían: `.venv/`, `scripts/preview/`, `__pycache__/`, `*.pyc`, `Thumbs.db`.

---

## 11. Accesibilidad — Preservar lo Existente

El sitio actual ya tiene buena accesibilidad. Se preserva en la migración:

- `alt=""` + `aria-hidden="true"` en imágenes decorativas
- `alt` descriptivo en imágenes de contenido
- `aria-label` en botones de icono (lang toggle, burger menu)
- `aria-hidden="true"` en SVGs decorativos inline
- `prefers-reduced-motion` media query (se mantiene en `index.css`)
- `rel="noopener"` en todos los `target="_blank"`
- HTML semántico (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`)
- `scroll-behavior: smooth` + `scroll-padding-top` en `html`

**Mejora pendiente (fuera de scope):** skip-to-content link.

---

## 12. Decisiones de Eliminación

| Elemento | Decisión | Razón |
|---|---|---|
| `Dancing Script` (Google Fonts) | **ELIMINAR** | Font family cargada pero zero uso en CSS. Eliminar elimina 1 request HTTP externa innecesaria. |
| `Cloudflare Web Analytics` snippet | **MANTENER como placeholder** | El token `"TOKEN"` es un placeholder. El componente se incluye en `index.html` para que el usuario lo active fácilmente con su token real. No se activa solo. |
| Python scripts (`scripts/`) | **FUERA del nuevo proyecto** | Son herramientas offline de asset-prep. No son parte del runtime. Se pueden dejar en el repo original o copiar a otro lugar — no se incluyen en `src/`, `public/`, ni en el build. |
| `lang/` folder original | **FUERA** — `es.json`/`en.json` se mueven a `src/i18n/` | Ya no se fetchean en runtime; se importan estáticamente en el bundle. |

---

## 13. Fuera de Alcance (Net New)

- **Formulario de contacto real** — actualmente solo hay links (WhatsApp, mailto, IG, TikTok). Si se quiere agregar un form funcional, se evaluaría Formspree o EmailJS como servicio externo stateless (sin backend).
- **Testing** (Vitest + RTL) — no se configura ahora. Se puede agregar después si el proyecto crece.
- **Dominio propio** — sigue siendo opcional, no necesario para que el site funcione.
- **Cambios en el contenido** — biografías, fotos, métricas, packages, reels, colors, fonts — todo se mantiene igual. Solo se migra el stack, no se edita contenido.

---

## 14. Criterios de Éxito

- [ ] Site migrado compila `npm run build` sin errores
- [ ] `npm run dev` sirve localmente y se ve visualmente idéntico al original
- [ ] Toggle ES/EN funciona, persiste en localStorage
- [ ] Reveal animations triggers al scroll (mismo comportamiento)
- [ ] Metrics bars se animan al entrar en viewport
- [ ] Instagram reels cargan al click
- [ ] Nav burger funciona en mobile, scroll-lock funciona
- [ ] GitHub Actions pipeline pasa: audit → build → deploy
- [ ] GitHub Pages sirve el site en `/Portafolio-Mariel-Jaramillo/` sin assets 404
- [ ] `npm audit` no reporta High/Critical vulnerabilities
- [ ] ESLint no reporta errores en CI
- [ ] `prefers-reduced-motion` deshabilita animaciones correctamente
