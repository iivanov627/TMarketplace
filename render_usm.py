#!/usr/bin/env python3
"""Extract a PlantUML block from Markdown and render it to SVG.

Usage:
  python render_usm.py USM_marketplace.md --output docs/usm.svg

Renderer selection:
  1. PLANTUML_JAR=/path/to/plantuml.jar (requires Java)
  2. Docker (requires Docker daemon and pulls plantuml/plantuml if absent)
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def extract_plantuml(markdown: str) -> str:
    match = re.search(
        r"```plantuml\s*\n(.*?)\n```",
        markdown,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not match:
        raise ValueError("В Markdown не найден блок ```plantuml ... ```.")
    source = match.group(1).strip() + "\n"
    if "@startwbs" not in source or "@endwbs" not in source:
        raise ValueError("В блоке должен находиться корректный @startwbs ... @endwbs.")
    return source


def render_with_jar(source: str, output: Path, jar: Path) -> None:
    java = shutil.which("java")
    if not java:
        raise RuntimeError("Не найден Java. Установите Java или используйте Docker.")
    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        puml = tmpdir / "usm.puml"
        puml.write_text(source, encoding="utf-8")
        output.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [java, "-jar", str(jar), "-tsvg", "-o", str(output.parent), str(puml)],
            check=True,
        )
        generated = output.parent / "usm.svg"
        if generated.exists() and generated != output:
            generated.replace(output)
        if not output.exists():
            raise RuntimeError("PlantUML завершился, но SVG не найден.")


def render_with_docker(source: str, output: Path, image: str) -> None:
    docker = shutil.which("docker")
    if not docker:
        raise RuntimeError("Не найден Docker.")

    output.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp).resolve()
        puml = tmpdir / "usm.puml"
        puml.write_text(source, encoding="utf-8")

        subprocess.run(
            [
                docker,
                "run",
                "--rm",
                "-v", f"{tmpdir}:/data",
                image,
                "-tsvg",
                "usm.puml",
            ],
            check=True,
        )

        generated = tmpdir / "usm.svg"

        if not generated.exists():
            raise RuntimeError(
                "PlantUML завершился, но файл usm.svg не найден."
            )

        shutil.copy2(generated, output)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("markdown", nargs="?", default="USM_marketplace.md")
    parser.add_argument("--output", default="docs/usm.svg")
    parser.add_argument("--docker-image", default="plantuml/plantuml:latest")
    args = parser.parse_args()

    md_path = Path(args.markdown).resolve()
    output = Path(args.output).resolve()
    if not md_path.is_file():
        parser.error(f"Markdown-файл не найден: {md_path}")

    try:
        source = extract_plantuml(md_path.read_text(encoding="utf-8"))
        jar_env = os.environ.get("PLANTUML_JAR")
        if jar_env:
            jar = Path(jar_env).expanduser().resolve()
            if not jar.is_file():
                raise FileNotFoundError(f"PLANTUML_JAR не найден: {jar}")
            render_with_jar(source, output, jar)
        else:
            render_with_docker(source, output, args.docker_image)
    except (OSError, ValueError, RuntimeError, subprocess.CalledProcessError) as exc:
        print(f"Ошибка: {exc}", file=sys.stderr)
        return 1

    print(f"SVG создан: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
