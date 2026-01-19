export function toUpperCase(text) {
  return text.toUpperCase();
}

export function toLowerCase(text) {
  return text.toLowerCase();
}

export function toTitleCase(text) {
  return text.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

export function toSentenceCase(text) {
    // Basic implementation: Capitalize first letter of each sentence.
    // Handles . ? ! followed by space or end of string.
    return text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function(c) { return c.toUpperCase(); });
}
