// Text Modifiers

function trimWhitespace(text) {
    return text.trim();
}

function removeExtraSpaces(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function removeEmptyLines(text) {
    return text.split('\n').filter(line => line.trim() !== '').join('\n');
}

// These are triggered by UI events, not state changes directly.
// We expose them globally for the event handlers.
window.toolModifiers = {
    trimWhitespace,
    removeExtraSpaces,
    removeEmptyLines
};
