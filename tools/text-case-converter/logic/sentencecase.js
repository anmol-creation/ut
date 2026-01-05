export default function toSentenceCase(text) {
  // Split by sentence delimiters (. ! ?) followed by space or end of string
  // This is a basic implementation and might not cover all edge cases (like "Dr." or "U.S.A.")
  return text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function(c) {
    return c.toUpperCase();
  });
}
