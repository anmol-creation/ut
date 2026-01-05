export function copyToClipboard(text) {
  if (!text) return Promise.resolve(false);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(err => {
        console.error('Failed to copy: ', err);
        return false;
      });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve(successful);
    } catch (err) {
      document.body.removeChild(textArea);
      console.error('Fallback copy failed', err);
      return Promise.resolve(false);
    }
  }
}
