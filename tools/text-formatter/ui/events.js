import { elements } from './dom.js';
import { setInputText, setOutputText, getInputText, getOutputText } from '../state/store.js';
import * as Formatting from '../logic/formatting.js';
import * as Transformation from '../logic/transformation.js';
import * as Cleaning from '../logic/cleaning.js';

export function initEvents() {
  // Navigation
  elements.useToolBtn.addEventListener('click', () => {
    elements.landingView.classList.add('hidden');
    elements.toolView.classList.remove('hidden');
    elements.inputText.focus();
  });

  elements.backBtn.addEventListener('click', () => {
    elements.toolView.classList.add('hidden');
    elements.landingView.classList.remove('hidden');
  });

  // Input
  elements.inputText.addEventListener('input', (e) => {
    setInputText(e.target.value);
    // Auto update output if we were in "auto" mode?
    // For this tool, usually users click a button to format.
    // So we just update state.
    // But maybe we want to keep output in sync if they just type?
    // Let's just update state.
  });

  // Actions
  elements.actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const input = getInputText();
      if (!input) return;

      let result = input;
      switch (action) {
        // Transformation
        case 'uppercase':
          result = Transformation.toUpperCase(input);
          break;
        case 'lowercase':
          result = Transformation.toLowerCase(input);
          break;
        case 'titlecase':
          result = Transformation.toTitleCase(input);
          break;
        case 'sentencecase':
          result = Transformation.toSentenceCase(input);
          break;

        // Formatting
        case 'indent':
          result = Formatting.indentText(input);
          break;
        case 'unindent':
          result = Formatting.unindentText(input);
          break;

        // Cleaning
        case 'remove-spaces':
          result = Cleaning.removeExtraSpaces(input);
          break;
        case 'remove-lines':
          result = Cleaning.removeEmptyLines(input);
          break;
        case 'remove-tabs':
            result = Cleaning.removeTabs(input);
            break;
        case 'one-line': // remove line breaks
             result = Cleaning.removeLineBreaks(input);
             break;
      }

      setOutputText(result);
      elements.outputText.value = result;

      // Track event
      if (window.gtag) {
        window.gtag('event', 'format_text', {
          'event_category': 'text_formatter',
          'event_label': action
        });
      }
    });
  });

  // Utilities
  elements.copyBtn.addEventListener('click', () => {
    const text = elements.outputText.value;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        const originalText = elements.copyBtn.textContent;
        elements.copyBtn.textContent = 'Copied!';
        setTimeout(() => elements.copyBtn.textContent = originalText, 2000);
         // Track event
        if (window.gtag) {
            window.gtag('event', 'copy_text', {
            'event_category': 'text_formatter'
            });
        }
      });
    }
  });

  elements.clearBtn.addEventListener('click', () => {
    setInputText('');
    setOutputText('');
    elements.inputText.value = '';
    elements.outputText.value = '';
  });

  elements.resetBtn.addEventListener('click', () => {
      // Just clear output? Or reset input to original?
      // Usually "Reset" might mean clear everything or reset to initial state.
      // Let's make it clear output for now, or maybe revert input?
      // Since we don't store "original" distinct from "current input" if we modified input...
      // But here input and output are separate.
      setOutputText('');
      elements.outputText.value = '';
  });

  if (elements.downloadBtn) {
      elements.downloadBtn.addEventListener('click', () => {
          const text = getOutputText() || getInputText(); // Download input if output empty? Or just output.
          if (!text) return;
          const blob = new Blob([text], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'formatted-text.txt';
          a.click();
          URL.revokeObjectURL(url);

          if (window.gtag) {
            window.gtag('event', 'download_text', {
            'event_category': 'text_formatter'
            });
        }
      });
  }
}
