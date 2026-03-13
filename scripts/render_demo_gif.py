#!/usr/bin/env python3

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "docs" / "assets" / "quickstart-demo.gif"
WIDTH = 1200
HEIGHT = 760
PADDING_X = 44
PADDING_Y = 84
LINE_HEIGHT = 28
FONT_SIZE = 22
BACKGROUND = "#0b1020"
PANEL = "#11182b"
TEXT = "#e7eefc"
MUTED = "#9bb0d3"
COMMAND = "#ffd166"
WINDOW_RED = "#ff5f57"
WINDOW_YELLOW = "#febc2e"
WINDOW_GREEN = "#28c840"


def load_font() -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Menlo.ttc",
        "/Library/Fonts/Menlo.ttc",
        "/System/Library/Fonts/SFNSMono.ttf",
    ]

    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, FONT_SIZE)

    return ImageFont.load_default()


FONT = load_font()


def run_command(args: list[str]) -> str:
    result = subprocess.run(
        args,
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    return result.stdout.strip()


def collect_demo_lines() -> list[str]:
    explain_output = run_command(["node", "./bin/maintainer-kit.js", "explain"])

    with tempfile.TemporaryDirectory(prefix="oss-mk-demo-") as tempdir:
        dry_run_output = run_command(
            [
                "node",
                "./bin/maintainer-kit.js",
                "init",
                tempdir,
                "--repo-name",
                "my-repo",
                "--maintainer",
                "Your Name",
                "--preset",
                "first-public-repo",
                "--dry-run",
            ]
        )

    command_one = "$ npx oss-maintainer-kit explain"
    command_two = (
        "$ npx oss-maintainer-kit init ../my-repo --repo-name my-repo "
        '--maintainer "Your Name" --preset first-public-repo --dry-run'
    )

    return [
        command_one,
        *explain_output.splitlines(),
        "",
        command_two,
        *dry_run_output.splitlines(),
    ]


def wrap_line(draw: ImageDraw.ImageDraw, text: str, max_width: int) -> list[tuple[str, str]]:
    if not text:
        return [("blank", "")]

    prefix = "command" if text.startswith("$ ") else "text"
    current = ""
    wrapped: list[str] = []

    for word in text.split(" "):
        next_value = word if not current else f"{current} {word}"
        box = draw.textbbox((0, 0), next_value, font=FONT)
        if box[2] <= max_width:
            current = next_value
            continue
        if current:
            wrapped.append(current)
        current = word

    if current:
        wrapped.append(current)

    return [(prefix, item) for item in wrapped]


def layout_lines(lines: list[str], draw: ImageDraw.ImageDraw) -> list[tuple[str, str]]:
    max_width = WIDTH - (PADDING_X * 2)
    rendered: list[tuple[str, str]] = []
    for line in lines:
        rendered.extend(wrap_line(draw, line, max_width))
    return rendered


def render_frame(lines: list[str], cursor: bool = False) -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((24, 24, WIDTH - 24, HEIGHT - 24), radius=26, fill=PANEL)
    draw.ellipse((50, 44, 66, 60), fill=WINDOW_RED)
    draw.ellipse((74, 44, 90, 60), fill=WINDOW_YELLOW)
    draw.ellipse((98, 44, 114, 60), fill=WINDOW_GREEN)
    draw.text((140, 40), "oss-maintainer-kit quick start", font=FONT, fill=MUTED)

    rendered = layout_lines(lines, draw)
    y = PADDING_Y

    for kind, line in rendered:
        if y > HEIGHT - 60:
            break
        fill = COMMAND if kind == "command" else TEXT
        draw.text((PADDING_X, y), line, font=FONT, fill=fill)
        y += LINE_HEIGHT

    if cursor and rendered:
        last_kind, last_line = rendered[-1]
        fill = COMMAND if last_kind == "command" else TEXT
        box = draw.textbbox((PADDING_X, y - LINE_HEIGHT), last_line, font=FONT)
        cursor_x = box[2] + 3
        cursor_y = y - LINE_HEIGHT + 4
        draw.rectangle((cursor_x, cursor_y, cursor_x + 12, cursor_y + 20), fill=fill)

    return image


def build_frames(lines: list[str]) -> tuple[list[Image.Image], list[int]]:
    frames: list[Image.Image] = []
    durations: list[int] = []

    checkpoints = [
        1,
        7,
        13,
        20,
        27,
        len(lines),
    ]

    for index, checkpoint in enumerate(checkpoints):
        current_lines = lines[:checkpoint]
        frames.append(render_frame(current_lines, cursor=index < len(checkpoints) - 1))
        durations.append(800 if index == 0 else 1200)

    return frames, durations


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    lines = collect_demo_lines()
    frames, durations = build_frames(lines)
    frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=False,
    )
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
