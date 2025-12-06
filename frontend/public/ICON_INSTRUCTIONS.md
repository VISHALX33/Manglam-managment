## PWA Icon Generation

Since we need PNG icons for the PWA, you have two options:

### Option 1: Use Online Tool (Recommended - Easy)
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload the `public/icon.svg` file
3. Download the generated icons
4. Place them in the `public` folder:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `apple-touch-icon.png` (180x180)
   - `favicon.ico`

### Option 2: Manual Creation
If you have image editing software (Photoshop, GIMP, Figma):
1. Open `public/icon.svg`
2. Export as PNG with these sizes:
   - 192x192 pixels → save as `pwa-192x192.png`
   - 512x512 pixels → save as `pwa-512x512.png`
   - 180x180 pixels → save as `apple-touch-icon.png`
3. Create a favicon.ico (32x32 or 16x16)
4. Save all in the `public` folder

### Option 3: Use ImageMagick (Command Line)
If you have ImageMagick installed:
```bash
cd frontend/public

# Convert SVG to PNG at different sizes
magick convert -background none icon.svg -resize 192x192 pwa-192x192.png
magick convert -background none icon.svg -resize 512x512 pwa-512x512.png
magick convert -background none icon.svg -resize 180x180 apple-touch-icon.png
magick convert -background none icon.svg -resize 32x32 favicon.ico
```

For now, I'll create placeholder files so the app works, but you should replace them with proper icons.
