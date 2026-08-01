# Portafolio UGC — Mariel Jaramillo

Sitio web one-page del portafolio UGC de Mariel Jaramillo, basado en el diseño del PDF `UGC Portafolio-Mariel Jaramillo.pdf`. HTML + CSS + JavaScript puro, sin dependencias de build. Bilingüe (ES/EN).

## Estructura

```
├── index.html            # Página única con todas las secciones
├── css/
│   └── styles.css        # Estilos (paleta extraída del PDF como variables CSS)
├── js/
│   ├── main.js           # Nav, menú móvil, animaciones, embeds de reels
│   └── i18n.js           # Toggle de idioma ES/EN (persiste en localStorage)
├── lang/
│   ├── es.json           # Textos en español (idioma por defecto)
│   └── en.json           # Textos en inglés
├── assets/
│   ├── images/           # Imágenes optimizadas (WebP) extraídas del PDF
│   ├── icons/            # (reservado)
│   └── fonts/            # (reservado — se usan Google Fonts: Poppins, Libre Baskerville, Dancing Script)
└── scripts/
    ├── extract_pdf.py    # Extrae imágenes/colores/fuentes del PDF
    ├── optimize_images.py# Convierte PNGs a WebP optimizados
    └── pdf_report.json   # Reporte de extracción (colores, fuentes, imágenes)
```

## Ejecutar localmente

```powershell
python -m http.server 8000
# abrir http://localhost:8000
```

> Necesario servir por HTTP (no abrir como archivo) para que funcione el cambio de idioma (`fetch` de `lang/*.json`).

## Despliegue

Sitio 100% estático: compatible con GitHub Pages, Netlify, Vercel o cualquier hosting estático. Subir todo excepto el PDF si no se quiere publicar.

## Agregar contenido

- **Textos:** editar `lang/es.json` y `lang/en.json` (misma clave en ambos). Los elementos HTML usan `data-i18n="clave"`.
- **Nuevo reel:** duplicar un bloque `<div class="reel" data-reel="URL_DEL_REEL">` en `index.html` dentro de la sección `videos` y agregar su miniatura en `assets/images/`.
- **Nueva sección:** agregar HTML en `index.html`, estilos en `styles.css`, textos en ambos JSON y enlace en el `nav`.
- **Imágenes:** guardar preferiblemente en WebP (usar `scripts/optimize_images.py` como referencia).

## Re-procesar PDF (opcional)

El sitio funciona 100% sin Python. Los scripts en `scripts/` son para re-extraer assets si el PDF cambia.

Para procesar, crear un venv temporal, usar, y eliminar:

```powershell
# 1. Crear venv
python -m venv .venv-temp

# 2. Instalar dependencias
.\.venv-temp\Scripts\pip install pymupdf pillow

# 3. Ejecutar scripts
.\.venv-temp\Scripts\python scripts\extract_pdf.py
.\.venv-temp\Scripts\python scripts\optimize_images.py

# 4. Eliminar venv temporal
Remove-Item -Recurse -Force .venv-temp
```

**Dependencias**: `pymupdf` (extracción), `pillow` (conversión WebP)

Alternativas sin Python: [Squoosh](https://squoosh.app) para WebP, extractores de PDF online.

## Paleta (extraída del PDF)

| Color | Hex | Uso |
|---|---|---|
| Magenta oscuro | `#7d1348` | Fondos destacados, títulos |
| Magenta vivo | `#d61c60` | Acentos |
| Rosa | `#e873a8` | Fondos hero/contacto |
| Rosa suave | `#f2d0d9` / `#feeff4` | Fondos claros |
| Lima | `#cfd79b` | Sección "Sobre mí", acentos |
| Crema | `#e0dfd7` | Fondos neutros |

Fuentes: **Poppins** (texto), **Libre Baskerville** (itálicas de acento), **Dancing Script** (sustituta libre de Authenia Textured, fuente comercial del PDF).
