import toUpperCase from './logic/uppercase.js';
import toLowerCase from './logic/lowercase.js';
import toTitleCase from './logic/titlecase.js';
import toSentenceCase from './logic/sentencecase.js';
import toToggleCase from './logic/togglecase.js';
import toRandomCase from './logic/randomcase.js';
import { copyToClipboard } from './utils/copy.js';
import { resetTool } from './utils/reset.js';
import { setInputText, getOutputText, setOutputText } from './state/text-state.js';

// Map actions to logic functions
const logicMap = {
  uppercase: toUpperCase,
  lowercase: toLowerCase,
  titlecase: toTitleCase,
  sentencecase: toSentenceCase,
  togglecase: toToggleCase,
  randomcase: toRandomCase
};

document.addEventListener('DOMContentLoaded', () => {
  const landingView = document.getElementById('landing-view');
  const toolView = document.getElementById('tool-view');
  const useToolBtn = document.getElementById('use-tool-btn');
  const backBtn = document.getElementById('back-btn');

  // Navigation
  useToolBtn.addEventListener('click', () => {
    landingView.classList.add('hidden');
    toolView.classList.remove('hidden');
    // Focus input
    setTimeout(() => document.getElementById('input-text').focus(), 100);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backBtn.addEventListener('click', () => {
    toolView.classList.add('hidden');
    landingView.classList.remove('hidden');
  });

  // Initialize Logic
  initializeLogic();
});

function initializeLogic() {
  const inputEl = document.getElementById('input-text');
  const outputEl = document.getElementById('output-text');

  // Input tracking
  inputEl.addEventListener('input', (e) => {
    setInputText(e.target.value);
  });

  // Action Buttons
  document.querySelectorAll('.btn-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const text = inputEl.value;

      if (!text) return;

      const logicFn = logicMap[action];
      if (logicFn) {
        try {
          const result = logicFn(text);
          outputEl.value = result;
          setOutputText(result);
        } catch (err) {
          console.error(`Error executing ${action}:`, err);
        }
      }
    });
  });

  // Utility Buttons
  document.getElementById('btn-copy').addEventListener('click', () => {
    if (!outputEl.value) return;

    copyToClipboard(outputEl.value).then(success => {
      if (success) {
        const btn = document.getElementById('btn-copy');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('btn-primary'); // Feedback style
        btn.classList.remove('btn-secondary');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-secondary');
        }, 2000);
      }
    });
  });

  document.getElementById('btn-clear').addEventListener('click', () => {
     inputEl.value = '';
     outputEl.value = '';
     setInputText('');
     setOutputText('');
     inputEl.focus();
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    resetTool(inputEl, outputEl);
  });
}
