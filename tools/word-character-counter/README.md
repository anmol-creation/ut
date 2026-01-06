# Word & Character Counter

## Overview
A real-time, browser-based utility for counting words, characters, sentences, and paragraphs. It also provides reading/speaking time estimates and text analysis.

## Features
- **Real-time Counting**: Updates instantly as you type.
- **Detailed Stats**: Words, Characters (with/without spaces), Sentences, Paragraphs.
- **Time Estimates**: Reading and Speaking time calculations.
- **Text Analysis**: Unique words, longest/shortest word identification, average word length.
- **Text Utilities**: Extra space removal, trimming, empty line removal.
- **Dark/Light Mode**: Persisted user preference.
- **Privacy Focused**: 100% client-side, no data leaves the browser.

## Directory Structure
- `ui/`: DOM manipulation, event listeners, rendering logic.
- `logic/`: Core calculation algorithms (pure functions).
- `state/`: Application state management.
- `styles/`: CSS files.
- `utils/`: Helper functions.
- `components/`: Reusable UI component logic (if any).

## Usage
1. Open `index.html`.
2. Click "Launch Tool" to enter the main interface.
3. Type or paste text to see real-time statistics.

## UX Rules
- Default view is a landing page.
- No external frameworks.
- Mobile-first responsive design.
