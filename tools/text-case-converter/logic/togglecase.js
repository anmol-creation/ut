export default function toToggleCase(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === char.toUpperCase()) {
      result += char.toLowerCase();
    } else {
      result += char.toUpperCase();
    }
  }
  return result;
}
