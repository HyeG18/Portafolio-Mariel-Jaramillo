"""Extrae imagenes, colores dominantes y fuentes del PDF del portafolio."""
import json
from collections import Counter
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "UGC Portafolio-Mariel Jaramillo.pdf"
OUT_IMG = ROOT / "assets" / "images"
REPORT = ROOT / "scripts" / "pdf_report.json"

OUT_IMG.mkdir(parents=True, exist_ok=True)

doc = fitz.open(PDF)
report = {"pages": doc.page_count, "fonts": set(), "images": [], "colors": {}}

for pno, page in enumerate(doc, start=1):
    # Fuentes usadas en la pagina
    for f in page.get_fonts():
        report["fonts"].add(f[3])
    # Imagenes embebidas (con canal alfa via SMask si existe)
    for ino, img in enumerate(page.get_images(full=True), start=1):
        xref, smask = img[0], img[1]
        try:
            pix = fitz.Pixmap(doc, xref)
            if smask:
                mask = fitz.Pixmap(doc, smask)
                pix = fitz.Pixmap(pix, mask)
            elif pix.n - pix.alpha > 3:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            name = f"p{pno:02d}_img{ino:02d}.png"
            pix.save(OUT_IMG / name)
            report["images"].append({"file": name, "w": pix.width, "h": pix.height, "alpha": bool(smask)})
            pix = None
        except Exception as e:  # noqa: BLE001
            report["images"].append({"file": f"p{pno:02d}_img{ino:02d}", "error": str(e)})
    # Colores dominantes de la pagina renderizada
    pix = page.get_pixmap(matrix=fitz.Matrix(0.5, 0.5))
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img = img.quantize(colors=8).convert("RGB")
    counts = Counter(img.getdata())
    total = pix.width * pix.height
    report["colors"][f"page_{pno}"] = [
        {"hex": "#%02x%02x%02x" % rgb, "pct": round(100 * c / total, 1)}
        for rgb, c in counts.most_common(8)
    ]

report["fonts"] = sorted(report["fonts"])
REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Paginas: {report['pages']}")
print(f"Imagenes: {len(report['images'])}")
print("Fuentes:")
for f in report["fonts"]:
    print("  -", f)
print("Reporte:", REPORT)
