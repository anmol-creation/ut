# Image to Text Extractor (OCR)

## Purpose
A client-side tool to extract text from images using Optical Character Recognition (OCR). It focuses on high accuracy and specifically supports Hindi text extraction alongside English.

## Architecture
- **Library**: `Tesseract.js` (via CDN) for processing OCR entirely in the browser using WebAssembly and Web Workers.
- **Languages**: Employs Tesseract's `hin` and `eng` training data.
- **Client-Side**: No image data is sent to a server. Execution is entirely local, ensuring privacy and saving server costs.

## Directory Structure
- `index.html`: UI structure.
- `css/`: Modular stylesheets (`theme.css`, `layout.css`, `components.css`, `tool.css`).
- `js/`: Modular JavaScript files:
  - `main.js`: Initialization.
  - `ui.js`: DOM manipulation, drag-drop handling.
  - `ocr.js`: Tesseract.js worker initialization and text extraction logic.
  - `actions.js`: Copy and download logic.

## UX Rules
- Uses a "Split View" layout: Left side for image input, Right side for text output.
- Features a progress bar to keep users informed during the OCR process (which can take a few seconds).
- Default view is a landing page; the actual tool is hidden until activation.
- Extracted text area is editable so users can correct minor OCR errors.
