# URL Encoder / Decoder

A simple, fast, and secure tool to encode and decode URLs.

## Features
- **Encode**: Converts characters into their corresponding %xx format.
- **Decode**: Converts encoded URLs back to readable text.
- **Auto-Detect**: Automatically determines whether to encode or decode based on input.
- **Instant**: Results appear as you type.
- **Privacy-First**: All processing happens in your browser.

## File Structure
- `index.html`: Main entry point.
- `ui/layout.js`: Handles UI interactions and DOM updates.
- `logic/encoder.js`: Core encoding/decoding logic.
- `logic/auto_detect.js`: Logic to guess the operation.
- `styles/style.css`: Custom styles (works with Tailwind CDN).

## Usage
Simply type or paste a URL into the input box. The tool will automatically process it. Use the mode toggle to switch between Encode, Decode, and Auto modes.
