# Text Formatter Tool

A simple and efficient tool to format, clean, and transform text directly in the browser.

## Features

- **Text Transformation**: Convert text to Uppercase, Lowercase, Title Case, and Sentence Case.
- **Text Cleaning**: Remove extra spaces, remove empty lines, remove tabs, or convert to a single line.
- **Indentation**: Indent or unindent text with ease.
- **Privacy Focused**: All processing happens client-side; no data is sent to any server.

## Folder Structure

- `ui/`: Handles DOM elements and Event listeners.
- `logic/`: Contains the core text processing functions (formatting, transformation, cleaning).
- `state/`: Manages the application state (input/output).
- `styles/`: CSS files for styling (isolated).
- `utils/`: Utility functions (if any).
- `main.js`: Entry point.

## UX Philosophy

- **Landing View**: Explains the tool and provides a "Use Tool" button.
- **Tool View**: The actual interface, hidden until activated to keep the UI clean.
- **Mobile First**: Optimized for all screen sizes.
