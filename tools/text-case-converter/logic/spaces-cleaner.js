export default function cleanSpaces(text) {
  // Remove multiple spaces and trim
  return text.replace(/\s+/g, ' ').trim();
}
