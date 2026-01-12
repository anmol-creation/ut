
import { encodeURL, decodeURL } from '../logic/encoder.js';
import { autoDetect } from '../logic/auto_detect.js';

document.addEventListener('DOMContentLoaded', () => {
    // View switching
    const landingView = document.getElementById('landing-view');
    const toolView = document.getElementById('tool-view');
    const useToolBtn = document.getElementById('use-tool-btn');
    const backBtn = document.getElementById('back-btn');

    useToolBtn.addEventListener('click', () => {
        landingView.classList.add('hidden');
        toolView.classList.remove('hidden');
        window.scrollTo(0, 0);
        // Track tool activation
        if (window.gtag) gtag('event', 'tool_activation', { 'tool_name': 'url_encoder_decoder' });
    });

    backBtn.addEventListener('click', () => {
        toolView.classList.add('hidden');
        landingView.classList.remove('hidden');
    });

    // Tool Logic
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const actionBtn = document.getElementById('action-btn');
    const btnCopy = document.getElementById('btn-copy');
    const btnClear = document.getElementById('btn-clear');
    const pasteBtn = document.getElementById('paste-btn');
    const errorMsg = document.getElementById('error-msg');
    const modeOptions = document.querySelectorAll('.mode-option');

    let currentMode = 'encode'; // encode, decode, auto

    // Mode Switching
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            modeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentMode = option.dataset.mode;
            updateButtonLabel();
            processInput();
        });
    });

    function updateButtonLabel() {
        if (currentMode === 'encode') {
            actionBtn.textContent = 'ENCODE URL';
        } else if (currentMode === 'decode') {
            actionBtn.textContent = 'DECODE URL';
        } else {
            actionBtn.textContent = 'AUTO DETECT & CONVERT';
        }
    }

    // Processing
    function processInput() {
        const input = inputText.value;
        errorMsg.classList.add('hidden');
        errorMsg.textContent = '';
        outputText.value = '';

        if (!input.trim()) return;

        let modeToUse = currentMode;
        if (currentMode === 'auto') {
            modeToUse = autoDetect(input);
            // Optionally inform user which mode was picked?
            // For now, just do the action.
        }

        try {
            let result = '';
            if (modeToUse === 'encode') {
                result = encodeURL(input);
            } else {
                result = decodeURL(input);
            }
            outputText.value = result;

            // Analytics
            if (window.gtag) {
                gtag('event', 'convert', {
                    'tool_name': 'url_encoder_decoder',
                    'mode': modeToUse
                });
            }

        } catch (error) {
            errorMsg.textContent = error.message;
            errorMsg.classList.remove('hidden');

            if (window.gtag) {
                gtag('event', 'error', {
                    'tool_name': 'url_encoder_decoder',
                    'error_message': error.message
                });
            }
        }
    }

    actionBtn.addEventListener('click', processInput);

    // Auto-update on type (optional, maybe better for UX?)
    // The prompt implies a button click "Encode/Decode options", but "instant" in my landing page copy implies real-time.
    // Let's make it real-time but keep the button for explicit action or mobile.
    inputText.addEventListener('input', processInput);

    // Paste
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputText.value = text;
            processInput();
        } catch (err) {
            errorMsg.textContent = 'Failed to read clipboard. Please paste manually.';
            errorMsg.classList.remove('hidden');
        }
    });

    // Copy
    btnCopy.addEventListener('click', () => {
        if (!outputText.value) return;

        navigator.clipboard.writeText(outputText.value).then(() => {
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = `<span class="text-green-400">Copied!</span>`;
            setTimeout(() => {
                btnCopy.innerHTML = originalText;
            }, 2000);

            if (window.gtag) {
                gtag('event', 'copy', { 'tool_name': 'url_encoder_decoder' });
            }
        }).catch(err => {
            console.error('Failed to copy', err);
        });
    });

    // Clear
    btnClear.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        errorMsg.classList.add('hidden');
    });
});
