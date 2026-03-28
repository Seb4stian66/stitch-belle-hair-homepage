#!/usr/bin/env python3
"""Entfernt den Hintergrund aus einem Bild mit rembg.
Usage: python remove_bg.py input.jpg output.png
"""
import sys
from rembg import remove
from PIL import Image

if len(sys.argv) != 3:
    print("Usage: python remove_bg.py input.jpg output.png")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]

img = Image.open(input_path)
result = remove(img)
result.save(output_path)
print(f"✅ Hintergrund entfernt: {output_path}")
