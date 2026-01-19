
export function indentText(text, type = 'space', count = 2) {
  const lines = text.split('\n');
  const indentStr = type === 'tab' ? '\t' : ' '.repeat(count);
  return lines.map(line => indentStr + line).join('\n');
}

export function unindentText(text, count = 2) {
  const lines = text.split('\n');
  const regex = new RegExp(`^ {1,${count}}|^\\t`);
  return lines.map(line => line.replace(regex, '')).join('\n');
}

export function addLineBreaks(text, everyNChars) {
  // Simple implementation: add newline every N chars if not already there?
  // Or maybe "Split long lines"?
  // Let's assume the user wants to break lines at a certain width.
  if (!everyNChars) return text;
  const regex = new RegExp(`.{1,${everyNChars}}`, 'g');
  return text.match(regex).join('\n');
}
