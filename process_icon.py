#!/usr/bin/env python3
"""
Convert and resize the windmill app icon
"""

from PIL import Image
import os

# Open the JPG
img = Image.open('windmill-app-cpver.JPG')

# Convert to RGB if needed (in case there's an alpha channel)
if img.mode in ('RGBA', 'LA', 'P'):
    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
    rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
    img = rgb_img

# Create sizes
sizes = [192, 512]

for size in sizes:
    # Resize with high quality
    resized = img.resize((size, size), Image.Resampling.LANCZOS)

    # Save as PNG
    filename = f'icons/icon-{size}x{size}.png'
    resized.save(filename, 'PNG', quality=95)
    print(f'✓ Created {filename}')

print('\n✨ Icon updated successfully!')
