# Grammar Checker

A lightweight, client-side grammar and spell checker built with pure JavaScript.

## Folder Structure

- `ui/`: Handles DOM manipulation and rendering (especially the highlighting logic).
- `logic/`: Contains the regex rules and checking algorithms.
- `styles/`: Custom CSS for highlighting and popovers.
- `main.js`: Entry point and event listeners.

## How it works

1.  **Input:** User enters text.
2.  **Analysis:** `logic/checker.js` runs a series of Regex rules defined in `logic/rules.js` and checks against a small list of common typos.
3.  **Readability:** `logic/readability.js` calculates Flesch-Kincaid score.
4.  **Display:** `ui/display.js` reconstructs the text with `<span>` tags wrapping the detected errors/suggestions.
5.  **Interaction:** Clicking a highlighted span opens a popover to Apply or Ignore the suggestion.

## Extending

To add more rules, edit `tools/grammar-checker/logic/rules.js`. Add a new object to the `rules` array:

```javascript
{
    id: "your-rule-id",
    regex: /your-regex/g,
    type: "grammar", // or "style", "spelling"
    message: "Description of the error",
    suggestion: "Suggestion text"
}
```
