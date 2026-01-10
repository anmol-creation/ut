# Text Summarizer

## Overview
A simple, client-side text summarization tool that uses extractive summarization techniques to shorten text while retaining key information.

## Features
- **Extractive Summarization**: Scores sentences based on keyword frequency.
- **Keyword Extraction**: Identifies top recurring words.
- **Readability Score**: Estimates the complexity of the text.
- **File Support**: Reads .txt files.
- **History**: Saves recent summaries locally.
- **Privacy Focused**: All processing happens in the browser.

## Structure
- `ui/`: Handles DOM manipulation and event listeners.
- `logic/`: Core algorithms (summarizer, keywords, readability).
- `state/`: Manages application state (current text, settings).
- `utils/`: Helper functions (file reading, string manipulation).
- `styles/`: Tool-specific CSS.
- `components/`: Reusable HTML fragments (if any).

## Usage
1. Paste text or upload a file.
2. Select summary length and type.
3. Click "Summarize".
