export default function toRandomCase(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (Math.random() < 0.5) {
      result += char.toLowerCase();
    } else {
      result += char.toUpperCase();
    }
  }
  return result;
}
