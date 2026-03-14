from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

CANVAS = (1280, 640)
REPO_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = REPO_ROOT.parent
ASSET_RELATIVE = Path("docs/assets/social-preview.png")

DISPLAY_FONT = "/System/Library/Fonts/Supplemental/Futura.ttc"
BODY_FONT = "/System/Library/Fonts/Supplemental/GillSans.ttc"
MONO_FONT = "/System/Library/Fonts/Menlo.ttc"

CARDS = [
    {
        "repo": "oss-maintainer-kit-example",
        "title": "First Public Repo",
        "preset": "first-public-repo",
        "subtitle": "A minimal public-repo starter for solo builders who want structure before process bloat.",
        "accent": (46, 167, 255),
        "accent_soft": (145, 214, 255),
        "bg": (8, 16, 33),
        "panel": (13, 25, 46),
        "panel_soft": (22, 39, 68),
        "monogram": "OPEN",
        "signals": ["solo-maintainer ready", "issue and PR intake", "no release-prep by default"],
        "command": "npx oss-maintainer-kit init . --preset first-public-repo",
    },
    {
        "repo": "oss-maintainer-kit-javascript-example",
        "title": "JavaScript Library",
        "preset": "javascript-library",
        "subtitle": "Package-focused review guidance for npm libraries, CLIs, and reusable JS or TS modules.",
        "accent": (245, 158, 11),
        "accent_soft": (251, 211, 141),
        "bg": (20, 13, 4),
        "panel": (39, 26, 10),
        "panel_soft": (64, 42, 16),
        "monogram": "PKG",
        "signals": ["exports and semver", "install and docs parity", "runtime compatibility checks"],
        "command": "npx oss-maintainer-kit init . --preset javascript-library",
    },
    {
        "repo": "oss-maintainer-kit-python-example",
        "title": "Python Package",
        "preset": "python-package",
        "subtitle": "Packaging and environment guidance for Python tools that need reliable installs and releases.",
        "accent": (37, 99, 235),
        "accent_soft": (147, 197, 253),
        "bg": (7, 14, 30),
        "panel": (14, 24, 51),
        "panel_soft": (24, 40, 77),
        "monogram": "PY",
        "signals": ["packaging metadata", "clean-environment smoke tests", "example command accuracy"],
        "command": "npx oss-maintainer-kit init . --preset python-package",
    },
    {
        "repo": "oss-maintainer-kit-nextjs-example",
        "title": "Next.js App",
        "preset": "nextjs-app",
        "subtitle": "App-oriented maintainer guidance for routing, rendering boundaries, auth, and deploy behavior.",
        "accent": (226, 232, 240),
        "accent_soft": (148, 163, 184),
        "bg": (7, 8, 10),
        "panel": (15, 18, 24),
        "panel_soft": (28, 34, 44),
        "monogram": "APP",
        "signals": ["server and client boundaries", "route and middleware risk", "preview and deploy checks"],
        "command": "npx oss-maintainer-kit init . --preset nextjs-app",
    },
    {
        "repo": "oss-maintainer-kit-python-service-example",
        "title": "Python Service",
        "preset": "python-service",
        "subtitle": "Service-focused defaults for APIs, workers, and backend repos where config and runtime drift matter.",
        "accent": (15, 118, 110),
        "accent_soft": (94, 234, 212),
        "bg": (6, 22, 24),
        "panel": (10, 37, 40),
        "panel_soft": (17, 57, 61),
        "monogram": "API",
        "signals": ["config and env discipline", "migration and queue review", "smoke and rollback notes"],
        "command": "npx oss-maintainer-kit init . --preset python-service",
    },
    {
        "repo": "oss-maintainer-kit-docs-example",
        "title": "Docs Heavy",
        "preset": "docs-heavy",
        "subtitle": "Documentation-first review guidance where broken navigation and stale examples are product bugs.",
        "accent": (22, 163, 74),
        "accent_soft": (134, 239, 172),
        "bg": (7, 20, 12),
        "panel": (13, 36, 22),
        "panel_soft": (23, 57, 34),
        "monogram": "DOC",
        "signals": ["link and anchor checks", "canonical doc alignment", "example command reliability"],
        "command": "npx oss-maintainer-kit init . --preset docs-heavy",
    },
    {
        "repo": "oss-maintainer-kit-security-sensitive-example",
        "title": "Security-Sensitive Repo",
        "preset": "security-sensitive-repo",
        "subtitle": "Risk-aware maintainer guidance for repos touching auth, secrets, trust boundaries, or packaging risk.",
        "accent": (220, 38, 38),
        "accent_soft": (252, 165, 165),
        "bg": (28, 8, 13),
        "panel": (49, 14, 23),
        "panel_soft": (73, 18, 30),
        "monogram": "SEC",
        "signals": ["higher-scrutiny reviews", "doc updates with risky changes", "automation disabled by default"],
        "command": "npx oss-maintainer-kit init . --preset security-sensitive-repo",
    },
    {
        "repo": "oss-maintainer-kit-security-web-service-example",
        "title": "Security Web Service",
        "preset": "security-sensitive-repo",
        "subtitle": "A service-flavored security example focused on auth, deploy paths, runbooks, and threat models.",
        "accent": (185, 28, 28),
        "accent_soft": (125, 211, 252),
        "bg": (8, 16, 29),
        "panel": (15, 29, 51),
        "panel_soft": (25, 43, 70),
        "monogram": "EDGE",
        "signals": ["threat-model context", "deploy and rollback notes", "service-boundary review guidance"],
        "command": "npx oss-maintainer-kit init . --preset security-sensitive-repo",
    },
]


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def with_alpha(rgb: tuple[int, int, int], alpha: int) -> tuple[int, int, int, int]:
    return rgb[0], rgb[1], rgb[2], alpha


def luminance(rgb: tuple[int, int, int]) -> float:
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2])


def draw_vertical_gradient(image: Image.Image, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> None:
    draw = ImageDraw.Draw(image)
    width, height = image.size
    for y in range(height):
        mix = y / max(height - 1, 1)
        color = tuple(int(top[i] + (bottom[i] - top[i]) * mix) for i in range(3))
        draw.line([(0, y), (width, y)], fill=color)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font_obj, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textlength(candidate, font=font_obj) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def fit_font(draw: ImageDraw.ImageDraw, text: str, font_path: str, start_size: int, max_width: int) -> ImageFont.FreeTypeFont:
    size = start_size
    while size > 24:
        candidate = font(font_path, size)
        if draw.textlength(text, font=candidate) <= max_width:
            return candidate
        size -= 2
    return font(font_path, 24)


def draw_signal(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    label: str,
    accent: tuple[int, int, int],
    text_color: tuple[int, int, int],
) -> None:
    draw.rounded_rectangle((x, y, x + width, y + 48), radius=18, fill=with_alpha(accent, 34), outline=with_alpha(accent, 120), width=2)
    bullet_y = y + 24
    draw.ellipse((x + 18, bullet_y - 6, x + 30, bullet_y + 6), fill=accent)
    draw.text((x + 44, y + 10), label, fill=text_color, font=font(BODY_FONT, 22))


def draw_motif(card: Image.Image, config: dict) -> None:
    overlay = Image.new("RGBA", card.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    accent = config["accent"]
    accent_soft = config["accent_soft"]
    panel_soft = config["panel_soft"]

    # Large soft orb and framing lines.
    draw.ellipse((820, 96, 1180, 456), fill=with_alpha(accent, 42), outline=with_alpha(accent_soft, 110), width=3)
    draw.ellipse((900, 176, 1250, 526), outline=with_alpha(accent_soft, 70), width=2)
    draw.rounded_rectangle((760, 88, 1188, 544), radius=42, outline=with_alpha(panel_soft, 160), width=2)

    for offset in range(0, 280, 56):
        draw.line((790, 118 + offset, 1150, 118 + offset), fill=with_alpha(accent_soft, 40), width=1)
    for offset in range(0, 300, 60):
        draw.line((818 + offset, 110, 818 + offset, 520), fill=with_alpha(accent_soft, 26), width=1)

    mono_font = fit_font(draw, config["monogram"], DISPLAY_FONT, 132, 360)
    text_image = Image.new("RGBA", (420, 240), (0, 0, 0, 0))
    text_draw = ImageDraw.Draw(text_image)
    text_draw.text((0, 10), config["monogram"], font=mono_font, fill=with_alpha(accent_soft, 88))
    text_draw.text((10, 120), config["preset"], font=font(BODY_FONT, 26), fill=with_alpha(accent_soft, 110))
    rotated = text_image.rotate(-90, expand=True, resample=Image.Resampling.BICUBIC)
    overlay.alpha_composite(rotated, dest=(920, 90))

    # Accent ribbon.
    ribbon = Image.new("RGBA", card.size, (0, 0, 0, 0))
    ribbon_draw = ImageDraw.Draw(ribbon)
    ribbon_draw.polygon([(700, 0), (980, 0), (1280, 240), (1280, 360)], fill=with_alpha(accent, 58))
    ribbon_draw.polygon([(720, 0), (1080, 0), (1280, 180), (1280, 250)], fill=with_alpha(accent_soft, 32))
    ribbon = ribbon.filter(ImageFilter.GaussianBlur(6))
    overlay.alpha_composite(ribbon)

    card.alpha_composite(overlay)


def render_card(config: dict) -> Image.Image:
    img = Image.new("RGBA", CANVAS, config["bg"] + (255,))
    draw_vertical_gradient(img, config["bg"], tuple(min(255, c + 18) for c in config["bg"]))

    noise = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    noise_draw = ImageDraw.Draw(noise)
    for step in range(0, CANVAS[0], 32):
        noise_draw.line((step, 0, step, CANVAS[1]), fill=(255, 255, 255, 10), width=1)
    for step in range(0, CANVAS[1], 32):
        noise_draw.line((0, step, CANVAS[0], step), fill=(255, 255, 255, 8), width=1)
    img.alpha_composite(noise)

    panel = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    panel_draw = ImageDraw.Draw(panel)
    panel_draw.rounded_rectangle((28, 28, 1252, 612), radius=36, fill=config["panel"] + (238,), outline=with_alpha(config["accent_soft"], 72), width=2)
    panel_draw.rounded_rectangle((28, 28, 1252, 40), radius=12, fill=config["accent"] + (255,))
    img.alpha_composite(panel)

    draw_motif(img, config)
    draw = ImageDraw.Draw(img)

    overline_font = font(BODY_FONT, 22)
    title_font = fit_font(draw, config["title"], DISPLAY_FONT, 74, 620)
    subtitle_font = font(BODY_FONT, 30)
    label_font = font(BODY_FONT, 18)
    mono_font = font(MONO_FONT, 24)

    fg = (245, 248, 255)
    body = (200, 212, 229)
    signal_text = (19, 26, 38) if luminance(config["accent"]) > 180 else fg

    draw.text((76, 82), "OSS MAINTAINER KIT / EXAMPLE REPO", font=overline_font, fill=config["accent_soft"])
    draw.text((76, 142), config["title"], font=title_font, fill=fg)

    subtitle_lines = wrap_text(draw, config["subtitle"], subtitle_font, 620)
    y = 228
    for line in subtitle_lines:
        draw.text((76, y), line, font=subtitle_font, fill=body)
        y += 36

    draw.rounded_rectangle((76, y + 18, 248, y + 58), radius=18, fill=with_alpha(config["accent"], 42), outline=with_alpha(config["accent_soft"], 110), width=2)
    draw.text((96, y + 28), config["preset"], font=label_font, fill=signal_text if luminance(config["accent"]) > 180 else config["accent_soft"])

    signals_y = y + 92
    for signal in config["signals"][:2]:
        draw_signal(draw, 76, signals_y, 540, signal, config["accent"], signal_text)
        signals_y += 60

    footer_y = 548
    draw.rounded_rectangle((76, footer_y, 1204, footer_y + 52), radius=18, fill=with_alpha((4, 7, 12), 220), outline=with_alpha(config["accent_soft"], 85), width=2)
    draw.text((102, footer_y + 14), config["command"], font=mono_font, fill=config["accent_soft"])

    return img.convert("RGB")


def main() -> None:
    for config in CARDS:
        repo_dir = WORKSPACE_ROOT / config["repo"]
        assets_dir = repo_dir / "docs" / "assets"
        assets_dir.mkdir(parents=True, exist_ok=True)
        output_path = assets_dir / "social-preview.png"
        image = render_card(config)
        image.save(output_path, format="PNG", optimize=True)
        print(output_path)


if __name__ == "__main__":
    main()
