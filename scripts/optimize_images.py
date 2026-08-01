"""Convierte PNGs extraidos a WebP optimizados para web."""
from pathlib import Path

from PIL import Image

IMG_DIR = Path(__file__).resolve().parent.parent / "assets" / "images"
MAX_SIZE = 1000

RENAME = {
    "p01_img01": "starburst-glitter", "p01_img02": "portrait-hero", "p01_img03": "texture-pink",
    "p01_img04": "camera-pink", "p01_img05": "paper-corner-grid", "p01_img06": "portrait-about",
    "p01_img07": "torn-strip", "p01_img08": "camera-halftone", "p01_img09": "tulips",
    "p01_img10": "paper-torn", "p01_img11": "sparkles", "p01_img12": "flower-asterisk",
    "p01_img13": "pin-round", "p01_img14": "gingham-strip", "p01_img15": "lips",
    "p01_img16": "video-food-1", "p01_img17": "video-food-2", "p01_img18": "video-beauty-1",
    "p01_img19": "video-beauty-2", "p01_img20": "video-lifestyle-1", "p01_img21": "video-lifestyle-2",
    "p01_img22": "video-pets-1", "p01_img23": "phone-samsung-a25", "p01_img24": "light-panel",
    "p01_img25": "tripod-small", "p01_img26": "tripod-large", "p01_img27": "mics-tx-f11",
    "p01_img28": "panel-rgb", "p01_img29": "paper-notebook", "p01_img30": "pin-push",
    "p01_img31": "gimbal-camera", "p01_img32": "brand-chicago", "p01_img33": "brand-brocks",
    "p01_img34": "brand-gummylove", "p01_img35": "brand-kittypom", "p01_img36": "torn-strip-wide",
    "p01_img37": "hand-phone", "p01_img38": "paper-card-1", "p01_img39": "paper-card-2",
    "p01_img40": "paper-card-3", "p01_img41": "starburst-gingham", "p01_img42": "mariel-contact",
    "p01_img44": "clipboard-note",
}
SKIP = {"p01_img43"}  # duplicado de texture-pink

total_before = total_after = 0
for png in sorted(IMG_DIR.glob("*.png")):
    if png.stem in SKIP:
        png.unlink()
        continue
    im = Image.open(png)
    if max(im.size) > MAX_SIZE:
        im.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    name = RENAME.get(png.stem, png.stem)
    out = IMG_DIR / f"{name}.webp"
    im.save(out, "WEBP", quality=85, method=6)
    b, a = png.stat().st_size, out.stat().st_size
    total_before += b
    total_after += a
    png.unlink()
    print(f"{png.name}: {b//1024}KB -> {out.name}: {a//1024}KB")

print(f"\nTotal: {total_before//1024//1024}MB -> {total_after//1024}KB")
