import { generatePassword } from './logic/generator.js';
import { calculateStrength } from './logic/strength.js';
import { copyToClipboard } from './utils/clipboard.js';

document.addEventListener('DOMContentLoaded', () => {
    // View Switching
    const landingView = document.getElementById('landing-view');
    const toolView = document.getElementById('tool-view');
    const useToolBtn = document.getElementById('use-tool-btn');
    const backBtn = document.getElementById('back-btn');

    useToolBtn.addEventListener('click', () => {
        landingView.classList.add('hidden');
        toolView.classList.remove('hidden');
        generateAndDisplay();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    backBtn.addEventListener('click', () => {
        toolView.classList.add('hidden');
        landingView.classList.remove('hidden');
    });

    // Elements
    const outputEl = document.getElementById('password-output');
    const btnCopy = document.getElementById('btn-copy');
    const btnRegenerate = document.getElementById('btn-regenerate');
    const slider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-value');

    // Options
    const optUppercase = document.getElementById('opt-uppercase');
    const optLowercase = document.getElementById('opt-lowercase');
    const optNumbers = document.getElementById('opt-numbers');
    const optSpecial = document.getElementById('opt-special');
    const optExclude = document.getElementById('opt-exclude');

    // Strength
    const strengthMeter = document.getElementById('strength-meter');
    const strengthText = document.getElementById('strength-text');

    function getOptions() {
        return {
            uppercase: optUppercase.checked,
            lowercase: optLowercase.checked,
            numbers: optNumbers.checked,
            special: optSpecial.checked,
            exclude: optExclude.value
        };
    }

    function generateAndDisplay() {
        const length = parseInt(slider.value, 10);
        const options = getOptions();

        // Ensure at least one option is checked
        if (!options.uppercase && !options.lowercase && !options.numbers && !options.special) {
             outputEl.textContent = 'Select at least one option';
             outputEl.style.color = 'var(--danger-color)';
             strengthMeter.className = 'strength-meter strength-weak';
             strengthText.textContent = '-';
             return;
        } else {
             outputEl.style.color = 'var(--text-primary)';
        }

        const password = generatePassword(length, options);
        outputEl.textContent = password;

        updateStrength(password);
    }

    function updateStrength(password) {
        const strength = calculateStrength(password);
        strengthMeter.className = `strength-meter strength-${strength}`;
        strengthText.textContent = strength.charAt(0).toUpperCase() + strength.slice(1);
    }

    // Event Listeners for Controls
    slider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
        generateAndDisplay();
    });

    [optUppercase, optLowercase, optNumbers, optSpecial].forEach(el => {
        el.addEventListener('change', generateAndDisplay);
    });

    optExclude.addEventListener('input', generateAndDisplay);

    btnRegenerate.addEventListener('click', () => {
        generateAndDisplay();
        // Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'regenerate_password', {
                'event_category': 'Password Generator'
            });
        }
    });

    btnCopy.addEventListener('click', () => {
        const text = outputEl.textContent;
        if (!text || text === 'Select at least one option') return;

        copyToClipboard(text).then(success => {
            if (success) {
                const originalHTML = btnCopy.innerHTML;
                btnCopy.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                btnCopy.classList.add('btn-success'); // Assuming we might want green, but primary works too or use inline style for simple feedback

                // Analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'copy_password', {
                        'event_category': 'Password Generator'
                    });
                }

                setTimeout(() => {
                    btnCopy.innerHTML = originalHTML;
                    btnCopy.classList.remove('btn-success');
                }, 2000);
            }
        });
    });

    // Initial check for slider value
    lengthVal.textContent = slider.value;
});
