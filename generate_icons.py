#!/usr/bin/env python3
"""
Simple script to generate placeholder PWA icons
Requires: pip install pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Error: Pillow not installed. Install with: pip install pillow")
    exit(1)

# Icon sizes needed for PWA
SIZES = [192, 512]

# Colors for the icon
BG_COLOR = (74, 144, 226)  # Primary blue
TEXT_COLOR = (255, 255, 255)  # White

def create_icon(size):
    """Create a simple icon with a baby bottle emoji/symbol"""
    # Create image with blue background
    img = Image.new('RGB', (size, size), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Draw a simple baby bottle shape
    # Bottle body (rectangle with rounded corners approximation)
    margin = size // 6
    bottle_width = size - (margin * 2)
    bottle_height = int(bottle_width * 1.5)
    bottle_x = margin
    bottle_y = (size - bottle_height) // 2

    # Draw bottle body (white)
    draw.rectangle(
        [bottle_x, bottle_y, bottle_x + bottle_width, bottle_y + bottle_height],
        fill=(255, 255, 255),
        outline=None
    )

    # Draw bottle neck (smaller rectangle on top)
    neck_width = bottle_width // 3
    neck_height = bottle_height // 4
    neck_x = bottle_x + (bottle_width - neck_width) // 2
    neck_y = bottle_y - neck_height

    draw.rectangle(
        [neck_x, neck_y, neck_x + neck_width, neck_y + neck_height],
        fill=(255, 255, 255),
        outline=None
    )

    # Draw nipple (circle on top)
    nipple_radius = neck_width // 2
    nipple_x = neck_x + neck_width // 2
    nipple_y = neck_y

    draw.ellipse(
        [nipple_x - nipple_radius, nipple_y - nipple_radius,
         nipple_x + nipple_radius, nipple_y + nipple_radius],
        fill=(255, 200, 200),
        outline=None
    )

    # Draw milk level (light blue rectangle inside bottle)
    milk_height = int(bottle_height * 0.6)
    milk_margin = size // 20
    draw.rectangle(
        [bottle_x + milk_margin,
         bottle_y + bottle_height - milk_height + milk_margin,
         bottle_x + bottle_width - milk_margin,
         bottle_y + bottle_height - milk_margin],
        fill=(200, 230, 255),
        outline=None
    )

    return img

def main():
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)

    # Generate icons for each size
    for size in SIZES:
        icon = create_icon(size)
        filename = f'icons/icon-{size}x{size}.png'
        icon.save(filename, 'PNG')
        print(f'Created {filename}')

    print('\nIcons generated successfully!')
    print('The app is now ready to be deployed.')

if __name__ == '__main__':
    main()
