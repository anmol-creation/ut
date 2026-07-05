# Text Case Converter

## Purpose
Text Case Converter is a clean, fast, and UX-first tool designed for the acTools platform. It allows users to convert text between various cases (Uppercase, Lowercase, Title Case, etc.) without any distractions. The tool is built to be ads-friendly but user-centric, ensuring ads never interfere with the workflow.

## Folder Philosophy
The folder structure is strictly modular to ensure isolation and scalability.
- **/ui/**: Contains high-level layout HTML fragments.
- **/components/**: Contains specific UI parts like input areas and buttons.
- **/logic/**: Contains pure JavaScript functions for text transformation. Each transformation is in its own file.
- **/styles/**: CSS split by responsibility (base, tool-specific, buttons, responsive).
- **/state/**: Manages the application state (input text).
- **/utils/**: Helper functions for UI interactions like copy and reset.

## How to Add a New Function
1. Create a new JS file in `/logic/` (e.g., `newcase.js`).
2. Export a default function that takes a string and returns the transformed string.
3. Add a new button in `/components/action-buttons.html` (or dynamically in `main.js` if strictly following component separation).
4. Wire up the button in `main.js` to import and use the new logic file.
**Do not modify existing logic files.**

## UX Rules Summary
- **Landing Page**: Shows explanation and "Use Tool" button only. Tool UI is hidden.
- **Interaction**: Clicking "Use Tool" reveals the UI below with a smooth scroll. No reload.
- **Ads**: Never place ads between input/output or near buttons. Only after explanation or at the bottom.
- **Design**: Minimal, whitespace-heavy, dark/light mode compatible.
- **Performance**: Large text support, no lag, no data storage.

## Credits
© acTools — All tools are free
