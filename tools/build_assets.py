# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Собирает ассеты страницы из проекта novella.

    uv run tools/build_assets.py

Персонажи: тело + лицо эмоции → один WebP с прозрачностью (как слои в игре).
Фоны: постер JPEG и видео-петля H.264 под размер телефона на странице.
Арт-пайплайн: кадр Midjourney и лица эмоций из Nano Banana — как есть, только уменьшены.
"""

import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CODE = ROOT.parent
CH1 = CODE / "novella/content/stories/interference/ch1"
OUT = ROOT / "assets"

CHARS = {
    "hero": ["neutral", "amused", "skeptical", "surprised"],
    "viktor": ["neutral", "smile", "thoughtful"],
    "samira": ["neutral", "amused", "focused"],
    "elias": ["neutral", "amused", "serious", "surprised"],
    "adrian": ["neutral", "amused"],
}

# Фоны фрагмента играются в телефоне; остальные — карточки галереи, поменьше.
DEMO_BG = ["balcony_night", "lift", "detector_cavern", "control_room"]
GALLERY_BG = [
    "qlattice_hub",
    "sector4_spine",
    "keller_cam_far",
    "overlap_zone_alpha",
    "old_lhc_archive",
    "containment_level",
    "meeting_room",
    "surface_campus",
]

# У лифта в кадре много движения: без этого петля весит втрое больше остальных.
CRF = {"lift": "33"}

def chars() -> None:
    out = OUT / "chars"
    out.mkdir(parents=True, exist_ok=True)
    for cid, emotions in CHARS.items():
        body = Image.open(CH1 / f"chars/{cid}/body.png").convert("RGBA")
        for emo in emotions:
            img = body.copy()
            face = CH1 / f"chars/{cid}/face/{emo}.png"
            if face.exists():
                layer = Image.open(face).convert("RGBA")
                if layer.getbbox():
                    img.alpha_composite(layer)
            img = img.resize((600, 1200), Image.LANCZOS)
            img.save(out / f"{cid}_{emo}.webp", "WEBP", quality=84, method=6)


def ffmpeg(*args: str) -> None:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def backgrounds() -> None:
    out = OUT / "bg"
    out.mkdir(parents=True, exist_ok=True)
    jobs = [(n, 540, CRF.get(n, "29")) for n in DEMO_BG] + [(n, 360, "31") for n in GALLERY_BG]
    for name, width, crf in jobs:
        poster = Image.open(CH1 / f"bg/{name}.jpg").convert("RGB")
        h = round(poster.height * width / poster.width)
        poster.resize((width, h), Image.LANCZOS).save(out / f"{name}.jpg", "JPEG", quality=80, optimize=True)
        ffmpeg(
            "-i", str(CH1 / f"bg/{name}.mp4"),
            "-an", "-vf", f"scale={width}:-2:flags=lanczos",
            "-c:v", "libx264", "-preset", "slow", "-crf", crf,
            "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(out / f"{name}.mp4"),
        )


def pipeline() -> None:
    out = OUT / "pipeline"
    out.mkdir(parents=True, exist_ok=True)
    frame = Image.open(CH1 / "src/_hero/frame.webp").convert("RGB")
    frame.resize((500, 1000), Image.LANCZOS).save(out / "hero_frame.jpg", "JPEG", quality=82, optimize=True)
    for emo in ["neutral", "amused", "skeptical", "surprised", "scared", "angry"]:
        face = Image.open(CH1 / f"src/_hero/crops/{emo}.jpeg").convert("RGB")
        w, h = face.size
        face = face.crop((round(w * 0.27), round(h * 0.22), round(w * 0.73), round(h * 0.68)))
        face.resize((360, 360), Image.LANCZOS).save(out / f"face_{emo}.jpg", "JPEG", quality=84, optimize=True)


def og() -> None:
    """Картинка для превью ссылки: детектор за спиной и пять героев."""
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), (5, 10, 19))
    cave = Image.open(CH1 / "bg/detector_cavern.jpg").convert("RGB")
    cave = cave.resize((W, round(cave.height * W / cave.width)), Image.LANCZOS)
    top = round(cave.height * 0.36)
    img.paste(Image.blend(cave.crop((0, top, W, top + H)), img, 0.55))
    row = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    lineup = ["hero_neutral", "elias_neutral", "adrian_neutral", "samira_amused", "viktor_smile"]
    fig_h = 760
    fig_w = fig_h // 2
    step = (W - fig_w) // (len(lineup) - 1)
    for i, name in enumerate(lineup):
        f = Image.open(OUT / f"chars/{name}.webp").convert("RGBA").resize((fig_w, fig_h), Image.LANCZOS)
        row.alpha_composite(f, (i * step, 70))
    fade = Image.linear_gradient("L").resize((W, H)).point(lambda v: 255 if v < 150 else max(0, 255 - (v - 150) * 3))
    row.putalpha(Image.composite(row.getchannel("A"), Image.new("L", (W, H), 0), fade))
    img = img.convert("RGBA")
    img.alpha_composite(row)
    img.convert("RGB").save(OUT / "og.jpg", "JPEG", quality=84, optimize=True)


if __name__ == "__main__":
    chars()
    backgrounds()
    pipeline()
    og()
