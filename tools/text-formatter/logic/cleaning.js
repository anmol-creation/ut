export function removeExtraSpaces(text) {
  return text.replace(/\s+/g, ' ').trim();
}

export function removeAllSpaces(text) {
    return text.replace(/\s/g, '');
}

export function removeLineBreaks(text) {
  return text.replace(/[\r\n]+/g, ' ');
}

export function removeEmptyLines(text) {
  return text.split('\n').filter(line => line.trim() !== '').join('\n');
}

export function removeTabs(text) {
    return text.replace(/\t/g, '');
}
