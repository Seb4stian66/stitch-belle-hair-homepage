from PIL import Image

def extract_from_black(image_path, out_path):
    img = Image.open(image_path).convert('RGBA')
    width, height = img.size
    pixels = img.load()

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            lum = max(r, g, b)
            # The AI images often have a dark gray noise instead of pure black.
            base_bg = 25  
            if lum <= base_bg:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                raw_alpha = (lum - base_bg) * (255 / (255 - base_bg))
                alpha = max(0, min(255, int(raw_alpha)))
                # Restore original hue but at full brightness 
                new_r = min(255, int(r * (255 / max(lum, 1))))
                new_g = min(255, int(g * (255 / max(lum, 1))))
                new_b = min(255, int(b * (255 / max(lum, 1))))
                pixels[x, y] = (new_r, new_g, new_b, alpha)

    img.save(out_path, 'PNG')

extract_from_black('public/images/belle_hair_logo.png', 'public/images/belle_hair_logo_transparent.png')
print("Successfully generated transparent logo.")
