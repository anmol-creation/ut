# Image Format Converter

A purely client-side image format converter tool for acTools.

## Features
- **Formats:** JPEG, PNG, WebP, GIF (static), BMP, TIFF (uncompressed).
- **Client-Side:** Uses Canvas API and custom encoders for BMP/TIFF.
- **Privacy:** No images are uploaded to any server.
- **Resize:** Optional resizing with aspect ratio lock.
- **Quality:** Adjustable quality for JPEG/WebP.

## Structure
- `index.html`: Main UI.
- `styles/main.css`: Styling.
- `logic/converter.js`: Main conversion orchestration.
- `logic/encoders.js`: Custom BMP and TIFF encoders.
- `ui/ui.js`: DOM manipulation.
- `main.js`: Entry point.

## Development
- Uses native ES modules.
- No external frameworks.
- Minimal dependencies.
