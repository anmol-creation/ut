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
  const useToolBtn = document.getElementById('use-tool-btn');
  const toolContainer = document.getElementById('tool-ui-container');

  // Load UI Components
  async function loadComponents() {
    if (toolContainer.innerHTML.trim() !== '') return; // Already loaded

    try {
      // Fetch components
      const [inputHtml, actionBtnsHtml, outputHtml, utilityBtnsHtml] = await Promise.all([
        fetch('components/input-area.html').then(res => res.text()),
        fetch('components/action-buttons.html').then(res => res.text()),
        fetch('components/output-area.html').then(res => res.text()),
        fetch('components/utility-buttons.html').then(res => res.text())
      ]);

      // Construct the UI
      const uiWrapper = document.createElement('div');
      uiWrapper.id = 'tool-ui';
      uiWrapper.innerHTML = `
        ${inputHtml}
        ${actionBtnsHtml}
        ${outputHtml}
        ${utilityBtnsHtml}
      `;

      toolContainer.appendChild(uiWrapper);

      // Initialize Logic wiring after DOM is ready
      initializeLogic();

      // Reveal UI
      // Small timeout to allow DOM reflow for transition
      setTimeout(() => {
        uiWrapper.classList.add('visible');
        uiWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);

    } catch (error) {
      console.error('Failed to load tool components:', error);
      toolContainer.innerHTML = '<p style="color:red; text-align:center;">Error loading tool. Please try refreshing.</p>';
    }
  }

  useToolBtn.addEventListener('click', () => {
    loadComponents();
  });
});

function initializeLogic() {
  const inputEl = document.getElementById('input-text');
  const outputEl = document.getElementById('output-text');

  // Input tracking
  inputEl.addEventListener('input', (e) => {
    setInputText(e.target.value);
  });

  // Action Buttons
  document.querySelectorAll('.action-btn').forEach(btn => {
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
          // Don't break the tool, maybe show a toast (not implemented yet)
        }
      }
    });
  });

  // Utility Buttons
  document.getElementById('btn-copy').addEventListener('click', () => {
    copyToClipboard(outputEl.value).then(success => {
      if (success) {
        const originalText = document.getElementById('btn-copy').textContent;
        document.getElementById('btn-copy').textContent = 'Copied!';
        setTimeout(() => {
          document.getElementById('btn-copy').textContent = originalText;
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
