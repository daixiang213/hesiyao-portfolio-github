"""Import portfolio photos without cropping and prepare web-sized JPEGs."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageOps


CATEGORY_IDS = {
    "新娘": "bridal",
    "杂志": "editorial",
    "韩系": "korean",
    "泰系": "thai",
    "新中式": "new-chinese",
    "欧美": "western",
}


def natural_key(path: Path) -> tuple:
    return tuple(int(part) if part.isdigit() else part.lower() for part in path.stem.replace("-", " ").split())


def subject_id(path: Path, fallback: str = "01") -> str:
    digits = "".join(character for character in path.name if character.isdigit())
    return digits[-2:].zfill(2) if digits else fallback


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: import_portfolio.py <source-folder> <public-folder>")

    source_root = Path(sys.argv[1])
    public_root = Path(sys.argv[2])
    output_root = public_root / "portfolio"
    manifest: dict[str, list[dict]] = {}

    for source_category, category_id in CATEGORY_IDS.items():
        category_root = source_root / source_category
        if not category_root.exists():
            continue

        groups: list[dict] = []
        subject_roots = sorted((path for path in category_root.iterdir() if path.is_dir()), key=lambda path: path.name)
        if not subject_roots and any(path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"} for path in category_root.iterdir()):
            subject_roots = [category_root]

        for subject_root in subject_roots:
            images: list[dict] = []
            group_id = subject_id(subject_root)
            destination = output_root / category_id / group_id
            destination.mkdir(parents=True, exist_ok=True)

            source_images = sorted(
                (path for path in subject_root.iterdir() if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}),
                key=natural_key,
            )
            for index, source_image in enumerate(source_images, start=1):
                destination_image = destination / f"{index:02d}.jpg"
                with Image.open(source_image) as opened:
                    image = ImageOps.exif_transpose(opened)
                    image.thumbnail((2400, 2400), Image.Resampling.LANCZOS)
                    if image.mode != "RGB":
                        image = image.convert("RGB")
                    image.save(destination_image, "JPEG", quality=86, optimize=True, progressive=True)
                    width, height = image.size

                images.append(
                    {
                        "src": f"/portfolio/{category_id}/{subject_root.name}/{destination_image.name}",
                        "width": width,
                        "height": height,
                    }
                )

            if images:
                for image in images:
                    image["src"] = image["src"].replace(f"/{subject_root.name}/", f"/{group_id}/")
                groups.append({"id": group_id, "images": images})

        if groups:
            manifest[category_id] = groups

    output_root.mkdir(parents=True, exist_ok=True)
    (output_root / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps({key: [len(group["images"]) for group in groups] for key, groups in manifest.items()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
