// Logic for Hashtag Generator

document.addEventListener('DOMContentLoaded', () => {
    const keywordInput = document.getElementById('keyword-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultsSection = document.getElementById('results-section');
    const tagsContainer = document.getElementById('tags-container');
    const finalOutput = document.getElementById('final-output');
    const tagCountEl = document.getElementById('tag-count');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    let currentTags = [];
    let selectedTags = new Set();

    // The database is loaded from database.js into window
    const DB = window.HASHTAG_DB || {};
    const GENERIC = window.GENERIC_TAGS || [];

    function generateTags() {
        const query = keywordInput.value.trim().toLowerCase();

        if (!query) {
            alert("Please enter a keyword first.");
            return;
        }

        // 1. Direct Match in DB
        let rawTags = [];
        if (DB[query]) {
            rawTags = [...DB[query]];
        } else {
            // 2. Partial Match
            let found = false;
            for (const key in DB) {
                if (key.includes(query) || query.includes(key)) {
                    rawTags = [...DB[key]];
                    found = true;
                    break;
                }
            }

            // 3. Fallback: Add query itself + generic tags
            if (!found) {
                const cleanQuery = query.replace(/[^a-z0-9]/g, '');
                rawTags = [cleanQuery, `${cleanQuery}life`, `${cleanQuery}lover`, ...GENERIC];
            }
        }

        // Format tags with #
        currentTags = rawTags.map(tag => `#${tag}`);

        // Always select the first 15 by default to save user time
        selectedTags.clear();
        currentTags.slice(0, 15).forEach(t => selectedTags.add(t));

        renderTags();
        updateOutput();
        resultsSection.style.display = 'block';
    }

    function renderTags() {
        tagsContainer.innerHTML = '';

        currentTags.forEach(tag => {
            const pill = document.createElement('div');
            pill.className = `hashtag-pill ${selectedTags.has(tag) ? 'selected' : ''}`;
            pill.textContent = tag;

            pill.addEventListener('click', () => {
                if (selectedTags.has(tag)) {
                    selectedTags.delete(tag);
                    pill.classList.remove('selected');
                } else {
                    selectedTags.add(tag);
                    pill.classList.add('selected');
                }
                updateOutput();
            });

            tagsContainer.appendChild(pill);
        });
    }

    function updateOutput() {
        const selectedArr = Array.from(selectedTags);
        tagCountEl.textContent = `${selectedArr.length} tags selected`;
        finalOutput.value = selectedArr.join(' ');

        if (selectedArr.length === 0) {
            copyBtn.disabled = true;
            finalOutput.placeholder = "Select tags above to build your list...";
        } else {
            copyBtn.disabled = false;
        }
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateTags);

    keywordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateTags();
    });

    clearBtn.addEventListener('click', () => {
        selectedTags.clear();
        renderTags();
        updateOutput();
    });

    copyBtn.addEventListener('click', () => {
        if (finalOutput.value) {
            finalOutput.select();
            navigator.clipboard.writeText(finalOutput.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            });
        }
    });
});