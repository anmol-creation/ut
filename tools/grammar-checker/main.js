import { Checker } from './logic/checker.js';
import { Readability } from './logic/readability.js';
import { Display } from './ui/display.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startBtn = document.getElementById('start-tool-btn');
    const landingView = document.getElementById('landing-view');
    const toolUi = document.getElementById('tool-ui');

    const inputText = document.getElementById('input-text');
    const checkBtn = document.getElementById('check-btn');
    const outputContainer = document.getElementById('output-container');
    const errorCountSpan = document.getElementById('error-count');

    const inputStats = document.getElementById('input-stats');
    const clearBtn = document.getElementById('clear-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const copyResultBtn = document.getElementById('copy-result-btn');

    // Stats elements
    const statReadability = document.getElementById('stat-readability');
    const statSentences = document.getElementById('stat-sentences');
    const statAvgLen = document.getElementById('stat-avg-len');
    const analysisStats = document.getElementById('analysis-stats');

    // UI Toggle
    startBtn.addEventListener('click', () => {
        landingView.classList.add('hidden');
        toolUi.classList.remove('hidden');
    });

    // Input Handling
    inputText.addEventListener('input', () => {
        updateInputStats();
    });

    function updateInputStats() {
        const text = inputText.value;
        const words = text.match(/\b\w+\b/g) || [];
        inputStats.textContent = `${words.length} words | ${text.length} chars`;
    }

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputText.value = text;
            updateInputStats();
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputContainer.innerHTML = '<div class="h-full flex flex-col items-center justify-center text-slate-600"><p>Analysis results will appear here...</p></div>';
        updateInputStats();
        errorCountSpan.textContent = "0 Errors";
        analysisStats.classList.add('hidden');
    });

    // Core Logic
    checkBtn.addEventListener('click', () => {
        const text = inputText.value;
        if (!text.trim()) return;

        // 1. Analyze Grammar
        const issues = Checker.analyze(text);

        // 2. Render Highlights
        Display.render(text, issues, outputContainer);

        // 3. Analyze Readability
        const readability = Readability.analyze(text);

        // 4. Update Stats
        errorCountSpan.textContent = `${issues.length} Issue${issues.length !== 1 ? 's' : ''}`;

        statReadability.textContent = readability.score;
        statSentences.textContent = readability.sentences;
        statAvgLen.textContent = readability.avgWordLen;
        analysisStats.classList.remove('hidden');
    });

    // Copy Result
    copyResultBtn.addEventListener('click', () => {
        const text = outputContainer.innerText; // Getting textContent might lose formatting, innerText handles newlines better usually
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyResultBtn.textContent;
            copyResultBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyResultBtn.textContent = originalText;
            }, 2000);
        });
    });

    // File Upload
    const fileUpload = document.getElementById('file-upload');
    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            inputText.value = e.target.result;
            updateInputStats();
        };
        reader.readAsText(file);
    });

    // Initialize stats
    updateInputStats();
});
