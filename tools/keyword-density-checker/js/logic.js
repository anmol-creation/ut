// Logic for Keyword Density Checker

const STOP_WORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
]);

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const ignoreStopWordsCheck = document.getElementById('ignore-stop-words');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultsBody = document.getElementById('results-body');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const densityWarning = document.getElementById('density-warning');

    // Stats
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const readTimeEl = document.getElementById('reading-time');

    let currentNgram = 1;

    // Update basic stats on input
    textInput.addEventListener('input', () => {
        const text = textInput.value;
        const charCount = text.length;
        charCountEl.textContent = charCount;

        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        wordCountEl.textContent = words.length;

        // Reading time (avg 200 words per minute)
        const minutes = Math.max(1, Math.ceil(words.length / 200));
        readTimeEl.textContent = words.length === 0 ? '0m' : `${minutes}m`;
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const view = btn.dataset.view;
            currentNgram = parseInt(view.split('-')[0]);

            if (textInput.value.trim().length > 0) {
                analyzeText();
            }
        });
    });

    analyzeBtn.addEventListener('click', analyzeText);

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        textInput.dispatchEvent(new Event('input'));
        resultsBody.innerHTML = '<tr><td colspan="3" class="text-center empty-state">Enter text and click Analyze to see results.</td></tr>';
        densityWarning.style.display = 'none';
    });

    function getWords(text) {
        // Lowercase and remove punctuation, keeping Unicode letters/numbers
        return text.toLowerCase()
                   .replace(/[^\p{L}\p{N}\s]/gu, '') // Keep letters, numbers, and spaces
                   .split(/\s+/)
                   .filter(w => w.length > 0);
    }

    function analyzeText() {
        const text = textInput.value.trim();
        if (!text) {
            resultsBody.innerHTML = '<tr><td colspan="3" class="text-center empty-state">Please enter some text to analyze.</td></tr>';
            densityWarning.style.display = 'none';
            return;
        }

        let words = getWords(text);
        const totalWords = words.length;

        if (totalWords === 0) {
             resultsBody.innerHTML = '<tr><td colspan="3" class="text-center empty-state">No valid words found in the text.</td></tr>';
             return;
        }

        const ignoreStopWords = ignoreStopWordsCheck.checked;

        // Generate n-grams
        const ngrams = [];
        for (let i = 0; i <= words.length - currentNgram; i++) {
            const phraseWords = words.slice(i, i + currentNgram);

            // If ignoring stop words, skip ngrams that are entirely stop words (for 1-word)
            // or start/end with stop words (for multi-word, optional but common practice)
            if (ignoreStopWords) {
                if (currentNgram === 1) {
                    if (STOP_WORDS.has(phraseWords[0])) continue;
                } else {
                    // Simple heuristic: don't count phrases that start or end with a stop word to avoid "of the", "in a" etc.
                    if (STOP_WORDS.has(phraseWords[0]) || STOP_WORDS.has(phraseWords[currentNgram-1])) continue;
                }
            }

            ngrams.push(phraseWords.join(' '));
        }

        // Count frequencies
        const counts = {};
        ngrams.forEach(ngram => {
            counts[ngram] = (counts[ngram] || 0) + 1;
        });

        // Calculate total possible phrases for accurate density calculation
        // Total valid words minus (N - 1) gives total possible N-word phrases
        const totalPhrases = Math.max(1, totalWords - currentNgram + 1);

        // Sort by frequency
        const sorted = Object.entries(counts)
            .map(([phrase, count]) => {
                const density = (count / totalPhrases) * 100;
                return { phrase, count, density };
            })
            .sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase));

        renderResults(sorted.slice(0, 50)); // Show top 50
    }

    function renderResults(results) {
        if (results.length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="3" class="text-center empty-state">No valid phrases found based on current settings.</td></tr>';
            densityWarning.style.display = 'none';
            return;
        }

        let html = '';
        let hasWarning = false;

        results.forEach(({ phrase, count, density }) => {
            const densityStr = density.toFixed(2);

            // Determine warning level
            let barClass = '';
            if (currentNgram === 1 && density > 3.0) {
                barClass = density > 5.0 ? 'danger' : 'warning';
                hasWarning = true;
            } else if (currentNgram > 1 && density > 2.0) {
                 barClass = 'warning';
            }

            html += `
                <tr>
                    <td><strong>${escapeHtml(phrase)}</strong></td>
                    <td>${count}</td>
                    <td>
                        <div class="density-bar-container">
                            <span class="density-value">${densityStr}%</span>
                            <div class="density-bar-bg">
                                <div class="density-bar-fill ${barClass}" style="width: ${Math.min(density * 10, 100)}%"></div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        resultsBody.innerHTML = html;
        densityWarning.style.display = hasWarning ? 'flex' : 'none';
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
});