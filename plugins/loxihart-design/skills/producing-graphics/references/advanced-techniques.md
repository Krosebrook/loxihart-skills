# Advanced Techniques and Export Presets

## Advanced Techniques

### Retina/HiDPI Export

**Export at 2x-3x resolution for sharp displays:**

```
Design size: 400×300px
Export sizes:
- 1x: 400×300px (standard displays)
- 2x: 800×600px (Retina MacBook, iPhone)
- 3x: 1200×900px (Retina iPad, high-DPI Android)
```

**CSS for Retina images:**

```css
.logo {
  width: 200px;
  height: 150px;
  background-image: url('logo@1x.png');
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo {
    background-image: url('logo@2x.png');
  }
}
```

### Color Profiles

**Embed correct color profiles:**

| Profile | Use Case |
|---------|----------|
| sRGB IEC61966-2.1 | Web, digital screens (default) |
| Display P3 | Modern Apple devices (wider gamut) |
| Adobe RGB (1998) | Photography, high-end print |
| Coated FOGRA39 | Coated paper (Europe) |
| US Web Coated (SWOP) v2 | Coated paper (USA) |

**Convert profiles:**

```bash
# Embed sRGB for web
convert input.png -profile sRGB-IEC61966-2.1.icc output.png

# Convert RGB to CMYK for print
convert input.png -profile sRGB.icc -profile CoatedFOGRA39.icc -colorspace CMYK output.tif
```

### Compression Comparison

**Lossy vs lossless:**

| Method | Formats | Quality | Size Reduction | Use Case |
|--------|---------|---------|----------------|----------|
| Lossy | JPEG, WebP | Slight degradation | 70-90% | Photos, complex images |
| Lossless | PNG, WebP (lossless) | Perfect | 20-50% | Graphics, logos, screenshots |

**Compression tools:**

```bash
# JPEG (lossy)
jpegoptim --max=85 --strip-all photo.jpg

# PNG (lossless)
pngquant --quality=80-90 screenshot.png
optipng -o7 screenshot.png

# WebP (lossy or lossless)
cwebp -q 80 photo.jpg -o photo.webp       # Lossy
cwebp -lossless screenshot.png -o screenshot.webp  # Lossless

# SVG
npx svgo icon.svg
```

## Export Presets

**Figma export presets:**

```javascript
// Web export (2x scale, optimized)
{
  "format": "PNG",
  "scale": 2,
  "constraint": { "type": "WIDTH", "value": 1200 },
  "suffix": "@2x"
}

// Social media (specific dimensions)
{
  "format": "JPG",
  "constraint": { "type": "WIDTH", "value": 1200 },
  "constraint": { "type": "HEIGHT", "value": 630 },
  "suffix": "-og"
}

// Icon export (multiple sizes)
{
  "format": "PNG",
  "scale": [1, 2, 3],
  "constraint": { "type": "WIDTH", "value": 24 },
  "suffix": ["", "@2x", "@3x"]
}
```

