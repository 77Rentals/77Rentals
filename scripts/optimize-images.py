"""Shrink the property photos in public/images for the web.

For every JPG/PNG it:
  - rewrites the file in place at a max of 1920 px on the long edge (JPEG q80,
    progressive) when it's bigger than that or heavier than 900 KB, and
  - writes a small "<name>-800.webp" (800 px wide) next to it for cards and thumbnails
    (see src/lib/image.ts).

Run it after adding new photos:  python scripts/optimize-images.py
Originals stay recoverable from git history.
"""
import os
import sys
from PIL import Image, ImageOps

ROOT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
FULL, THUMB = 1920, 800
before = after = 0

for dirpath, _, files in os.walk(ROOT):
    for f in files:
        name, ext = os.path.splitext(f)
        if ext.lower() not in ('.jpg', '.jpeg', '.png') or name.endswith('-800'):
            continue
        path = os.path.join(dirpath, f)
        size = os.path.getsize(path)
        before += size
        im = ImageOps.exif_transpose(Image.open(path))
        has_alpha = im.mode in ('RGBA', 'LA') or 'transparency' in im.info
        im = im.convert('RGBA' if has_alpha else 'RGB')

        if (max(im.size) > FULL or size > 900_000) and not has_alpha:
            full = im.copy()
            full.thumbnail((FULL, FULL), Image.LANCZOS)
            if ext.lower() == '.png':
                full.save(path, 'PNG', optimize=True)
            else:
                full.save(path, 'JPEG', quality=80, optimize=True, progressive=True)

        # Width-based so portrait photos stay sharp in landscape cards.
        thumb = im.copy()
        if thumb.width > THUMB:
            thumb = thumb.resize((THUMB, round(thumb.height * THUMB / thumb.width)), Image.LANCZOS)
        thumb_path = os.path.join(dirpath, name + '-800.webp')
        thumb.save(thumb_path, 'WEBP', quality=76, method=6)
        after += os.path.getsize(path)
        print(f'{os.path.relpath(path, ROOT)}: {size // 1024} KB -> {os.path.getsize(path) // 1024} KB '
              f'(+ {os.path.getsize(thumb_path) // 1024} KB thumb)')

print(f'\nTotal: {before / 1048576:.1f} MB -> {after / 1048576:.1f} MB', file=sys.stderr)
