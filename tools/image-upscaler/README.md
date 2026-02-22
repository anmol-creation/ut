# Image Upscale Tool

An advanced client-side tool to enlarge images up to 8x without losing quality. It uses canvas-based scaling with optional sharpening and noise reduction (simulated) to enhance details.

## Folder Structure

- `ui/`: Handles DOM interactions, rendering, and event listeners.
- `logic/`: Core image processing logic (upscaling, format conversion).
- `styles/`: CSS modules for theme, layout, and components.
- `state/`: simple state management.
- `utils/`: Helper functions for file I/O.

## Features

- **Upscaling**: 2x, 4x, 8x, or custom percentage.
- **Sharpening**: Enhances edges to make the image look crisp.
- **Format Conversion**: Convert to JPEG, PNG, or WebP.
- **Quality Control**: Adjust JPEG quality.
- **Privacy**: All processing happens in the browser.

## How to use

1. Open `index.html`.
2. Upload an image.
3. Choose upscale factor and output format.
4. Click "Upscale & Download".
