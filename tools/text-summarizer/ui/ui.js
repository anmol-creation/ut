import { state } from '../state/state.js';
import { Summarizer } from '../logic/summarizer.js';
import { extractKeywords } from '../logic/keywords.js';
import { calculateReadability } from '../logic/readability.js';

const summarizer = new Summarizer();

export function initUI() {
    const landingView = document.getElementById('landing-view');
    const toolUi = document.getElementById('tool-ui');
    const startBtn = document.getElementById('start-tool-btn');
    const inputText = document.getElementById('input-text');
    const inputStats = document.getElementById('input-stats');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');

    // URL Input
    const inputUrl = document.getElementById('input-url');
    const fetchUrlBtn = document.getElementById('fetch-url-btn');

    const fileUpload = document.getElementById('file-upload');
    const summarizeBtn = document.getElementById('summarize-btn');
    const outputContainer = document.getElementById('output-container');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Length Buttons
    const lengthBtns = document.querySelectorAll('[data-length]');

    // Format Radios
    const formatRadios = document.querySelectorAll('input[name="format"]');

    // Exclusions
    const excludeQuotes = document.getElementById('exclude-quotes');
    const excludeCitations = document.getElementById('exclude-citations');

    // Stats Elements
    const analysisPanel = document.getElementById('analysis-panel');
    const keywordsPanel = document.getElementById('keywords-panel');
    const readabilityScoreEl = document.getElementById('readability-score');
    const readabilityLabelEl = document.getElementById('readability-label');
    const reductionEl = document.getElementById('reduction-percentage');
    const keywordsListEl = document.getElementById('keywords-list');

    // History
    const historyListEl = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // Switch to Tool UI
    startBtn.addEventListener('click', () => {
        landingView.classList.add('hidden');
        toolUi.classList.remove('hidden');
    });

    // Input Stats Update
    inputText.addEventListener('input', () => {
        updateInputStats(inputText.value);
        state.currentText = inputText.value;
    });

    function updateInputStats(text) {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        inputStats.textContent = `${words} words | ${chars} chars`;
    }

    // Paste
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputText.value = text;
            updateInputStats(text);
            state.currentText = text;
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    });

    // Clear
    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        inputUrl.value = '';
        state.currentText = '';
        updateInputStats('');
        outputContainer.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-slate-600">
                <svg class="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p>Summary will appear here...</p>
            </div>
        `;
        analysisPanel.classList.add('hidden');
        keywordsPanel.classList.add('hidden');
    });

    // Fetch URL
    fetchUrlBtn.addEventListener('click', async () => {
        const url = inputUrl.value.trim();
        if (!url) return;

        fetchUrlBtn.textContent = 'Fetching...';
        fetchUrlBtn.disabled = true;

        try {
            // Note: Direct fetching usually fails due to CORS.
            // This is a basic implementation. In a real scenario, a proxy would be needed.
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const text = await response.text();

            // Very basic HTML text extraction
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const extractedText = doc.body.textContent || '';

            inputText.value = extractedText.trim();
            state.currentText = extractedText.trim();
            updateInputStats(extractedText);
            fetchUrlBtn.textContent = 'Success';
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Could not fetch URL directly (likely due to CORS security). Please copy and paste the text manually.');
            fetchUrlBtn.textContent = 'Failed';
        }

        setTimeout(() => {
            fetchUrlBtn.textContent = 'Fetch';
            fetchUrlBtn.disabled = false;
        }, 2000);
    });

    // File Upload
    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            inputText.value = e.target.result;
            state.currentText = e.target.result;
            updateInputStats(state.currentText);
        };
        reader.readAsText(file);
    });

    // Length Selection
    lengthBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset styles
            lengthBtns.forEach(b => {
                b.classList.remove('bg-indigo-600', 'text-white');
                b.classList.add('text-slate-400');
            });
            // Set active
            btn.classList.remove('text-slate-400');
            btn.classList.add('bg-indigo-600', 'text-white');
            state.setLength(btn.dataset.length);
        });
    });

    // Format Selection
    formatRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.setFormat(e.target.value);
            // Update visual indicators
            document.querySelectorAll('.format-indicator').forEach(el => el.classList.remove('opacity-100'));
            document.querySelectorAll('.format-indicator').forEach(el => el.classList.add('opacity-0'));

            const activeIndicator = e.target.parentElement.querySelector('.format-indicator');
            activeIndicator.classList.remove('opacity-0');
            activeIndicator.classList.add('opacity-100');
        });
    });

    // Exclusion Toggles
    excludeQuotes.addEventListener('change', (e) => {
        state.setExcludeQuotes(e.target.checked);
    });

    excludeCitations.addEventListener('change', (e) => {
        state.setExcludeCitations(e.target.checked);
    });

    // Summarize Action
    summarizeBtn.addEventListener('click', () => {
        const text = state.currentText;
        if (!text || !text.trim()) {
            alert('Please enter some text to summarize.');
            return;
        }

        // Logic
        const sentences = summarizer.summarize(text, state.summaryLength, {
            excludeQuotes: state.excludeQuotes,
            excludeCitations: state.excludeCitations
        });
        const keywords = extractKeywords(text);
        const readability = calculateReadability(text);

        // Display Output
        renderOutput(sentences, state.summaryFormat);
        renderAnalysis(text, sentences.join(' '), readability, keywords);

        // Save History
        state.saveHistory(text, sentences.join(' '));
        renderHistory();
    });

    function renderOutput(sentences, format) {
        if (!sentences.length) {
            outputContainer.innerHTML = '<p class="text-slate-500 italic">Could not generate a summary. The text might be too short.</p>';
            return;
        }

        // Clear previous content
        outputContainer.innerHTML = '';

        if (format === 'bullets') {
            const ul = document.createElement('ul');
            ul.className = 'list-disc pl-5 space-y-2';
            sentences.forEach(s => {
                const li = document.createElement('li');
                li.textContent = s;
                ul.appendChild(li);
            });
            outputContainer.appendChild(ul);
        } else {
            sentences.forEach(s => {
                const p = document.createElement('p');
                p.className = 'mb-2';
                p.textContent = s;
                outputContainer.appendChild(p);
            });
        }
    }

    function renderAnalysis(original, summary, readability, keywords) {
        analysisPanel.classList.remove('hidden');
        keywordsPanel.classList.remove('hidden');

        // Readability
        readabilityScoreEl.textContent = readability;
        if (readability > 80) readabilityLabelEl.textContent = 'Easy';
        else if (readability > 60) readabilityLabelEl.textContent = 'Standard';
        else if (readability > 30) readabilityLabelEl.textContent = 'Difficult';
        else readabilityLabelEl.textContent = 'Very Hard';

        // Reduction
        const origLen = original.length;
        const sumLen = summary.length;
        const reduction = Math.round(((origLen - sumLen) / origLen) * 100);
        reductionEl.textContent = (reduction > 0 ? reduction : 0) + '%';

        // Keywords
        keywordsListEl.innerHTML = keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('');
    }

    // Copy
    copyBtn.addEventListener('click', () => {
        if (!outputContainer.textContent) return;
        navigator.clipboard.writeText(outputContainer.innerText)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = 'Copied!';
                setTimeout(() => copyBtn.innerHTML = originalText, 2000);
            });
    });

    // Download
    downloadBtn.addEventListener('click', () => {
        if (!outputContainer.textContent) return;
        const blob = new Blob([outputContainer.innerText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Render History
    function renderHistory() {
        historyListEl.innerHTML = '';
        if (state.history.length === 0) {
            historyListEl.innerHTML = '<p class="text-slate-500 text-sm col-span-full">No history yet.</p>';
            return;
        }

        state.history.forEach((item) => {
            const el = document.createElement('div');
            el.className = 'bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-colors cursor-pointer group';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'flex justify-between items-start mb-2';

            const dateSpan = document.createElement('span');
            dateSpan.className = 'text-xs text-slate-500';
            dateSpan.textContent = item.date;

            const loadBtn = document.createElement('button');
            loadBtn.className = 'text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity';
            loadBtn.textContent = 'Load';

            headerDiv.appendChild(dateSpan);
            headerDiv.appendChild(loadBtn);

            const previewP = document.createElement('p');
            previewP.className = 'text-sm text-slate-300 line-clamp-2';
            previewP.textContent = item.preview;

            el.appendChild(headerDiv);
            el.appendChild(previewP);

            el.addEventListener('click', () => {
                inputText.value = item.original;
                state.currentText = item.original;
                updateInputStats(item.original);
                // Trigger summary automatically? Maybe just load it.
                // Let's scroll up
                document.getElementById('tool-ui').scrollIntoView({ behavior: 'smooth' });
            });
            historyListEl.appendChild(el);
        });
    }

    // Clear History
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Clear all history?')) {
            state.clearHistory();
            renderHistory();
        }
    });

    // Initial render
    state.init();
    renderHistory();
}
