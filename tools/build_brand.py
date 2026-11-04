# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Собирает логотипы, фавиконы и превью ссылок сайта из исходников в tools/brand.

    uv run tools/build_brand.py

throne_studios.jpg — белый логотип на чёрном: яркость становится прозрачностью.
storyveil_icon.jpg — иконка приложения на белом: обрезаем по рамке и скругляем углы.
storyveil_key_art.jpg — обложка с первого слайда питч-дека: стартовый экран демо в телефоне.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools/brand"
OUT = ROOT / "assets/brand"

# Границы найдены по исходникам: надпись логотипа, буква T и рамка иконки.
THRONE_BOX = (250, 232, 1160, 536)
T_BOX = (266, 248, 421, 400)
ICON_BOX = (82, 92, 942, 952)
# Сдвиг героев вниз на обложке: сверху статус-бар и плашки «Глава 1» и кристаллы.
COVER_TOP = 64


def white_on_alpha(img: Image.Image, lo: int = 18, hi: int = 225) -> Image.Image:
    """Белый знак с прозрачностью по яркости: чёрный фон исчезает, мелкие детали остаются."""
    lum = img.convert("L").point(lambda v: 0 if v <= lo else 255 if v >= hi else round((v - lo) * 255 / (hi - lo)))
    out = Image.new("RGBA", img.size, (255, 255, 255, 0))
    out.putalpha(lum)
    return out


def rounded(img: Image.Image, radius: float) -> Image.Image:
    """Скругление углов со сглаживанием: маска рисуется вчетверо крупнее."""
    s = 4
    w, h = img.size
    mask = Image.new("L", (w * s, h * s), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w * s - 1, h * s - 1), round(radius * s), fill=255)
    out = img.convert("RGBA")
    out.putalpha(mask.resize((w, h), Image.LANCZOS))
    return out


def throne() -> Image.Image:
    src = Image.open(SRC / "throne_studios.jpg").convert("RGB")
    logo = white_on_alpha(src.crop(THRONE_BOX))
    logo.save(OUT / "throne-studios.png", optimize=True)
    small = logo.resize((logo.width // 2, logo.height // 2), Image.LANCZOS)
    small.save(OUT / "throne-studios-sm.png", optimize=True)

    # Фавикон и знак студии: буква T на тёмной плашке.
    t = white_on_alpha(src.crop(T_BOX))
    for size, name in [(512, "throne-mark-512.png"), (180, "apple-touch-icon.png"), (64, "favicon-64.png"), (32, "favicon-32.png")]:
        tile = Image.new("RGBA", (size, size), (10, 10, 16, 255))
        pad = round(size * 0.2)
        glyph = t.resize((size - 2 * pad, size - 2 * pad), Image.LANCZOS)
        tile.alpha_composite(glyph, (pad, pad))
        if name != "apple-touch-icon.png":  # iOS скругляет сам
            tile = rounded(tile, size * 0.22)
        tile.save(OUT / name, optimize=True)
    return logo


def storyveil() -> Image.Image:
    src = Image.open(SRC / "storyveil_icon.jpg").convert("RGB")
    icon = rounded(src.crop(ICON_BOX), (ICON_BOX[2] - ICON_BOX[0]) * 0.185)
    icon.resize((512, 512), Image.LANCZOS).save(OUT / "storyveil-icon.webp", "WEBP", quality=86, method=6)
    icon.resize((640, 640), Image.LANCZOS).save(OUT / "storyveil-icon.png", optimize=True)
    return icon


def cover() -> None:
    """Стартовый экран демо (assets/bg/cover.jpg) под размер телефона, как остальные фоны.

    Сверху трое героев целиком, низ уходит в размытую ту же картинку:
    там стартовый экран кладёт затемнение и текст.
    """
    W, H = 540, 1174
    art = Image.open(SRC / "storyveil_key_art.jpg").convert("RGB")
    back = art.resize((round(art.width * H / art.height), H), Image.LANCZOS)
    left = (back.width - W) // 2
    back = back.crop((left, 0, left + W, H)).filter(ImageFilter.GaussianBlur(36))
    img = Image.blend(back, Image.new("RGB", (W, H), (6, 12, 24)), 0.5).convert("RGBA")

    # Лица героев на исходнике лежат по ширине от 115 до 835 px: столько и помещаем в экран.
    scale = W / 720
    fg = art.resize((round(art.width * scale), round(art.height * scale)), Image.LANCZOS).convert("RGBA")
    fx, fy = round(-475 * scale + W / 2), COVER_TOP
    top, bottom = 70, round(fg.height * 0.3)
    alpha = Image.new("L", (1, fg.height))
    for y in range(fg.height):
        a = min(1.0, y / top, (fg.height - y) / bottom)
        alpha.putpixel((0, y), round(255 * a * a * (3 - 2 * a)))
    fg.putalpha(alpha.resize(fg.size))
    img.alpha_composite(fg, (fx, fy))
    img.convert("RGB").save(ROOT / "assets/bg/cover.jpg", "JPEG", quality=82, optimize=True)


def og(logo: Image.Image, icon: Image.Image) -> None:
    """Превью ссылки: зал детектора, логотип студии и иконка игры."""
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (6, 6, 10, 255))
    cave = Image.open(ROOT / "assets/bg/detector_cavern.jpg").convert("RGB")
    cave = cave.resize((W, round(cave.height * W / cave.width)), Image.LANCZOS)
    top = round(cave.height * 0.34)
    cave = cave.crop((0, top, W, top + H)).filter(ImageFilter.GaussianBlur(2))
    img.paste(Image.blend(cave, Image.new("RGB", (W, H), (6, 6, 10)), 0.62))

    # Тень под иконкой, затем сама иконка справа.
    size = 380
    ic = icon.resize((size, size), Image.LANCZOS)
    x, y = W - size - 96, (H - size) // 2
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 200), (x, y + 24), ic.getchannel("A"))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(28)))
    img.alpha_composite(ic, (x, y))

    lw = 560
    lg = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(lg, (88, (H - lg.height) // 2))
    img.convert("RGB").save(ROOT / "assets/og.jpg", "JPEG", quality=86, optimize=True)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    og(throne(), storyveil())
    cover()
