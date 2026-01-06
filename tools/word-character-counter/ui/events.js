// Event Listeners Setup

function initEvents() {
    // Navigation
    document.getElementById('launch-tool-btn').addEventListener('click', () => {
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('tool-ui').classList.remove('hidden');
        // Focus input
        setTimeout(() => document.getElementById('text-input').focus(), 100);
    });

    document.getElementById('back-to-landing').addEventListener('click', () => {
        document.getElementById('tool-ui').classList.add('hidden');
        document.getElementById('landing-page').classList.remove('hidden');
    });

    // Theme
    document.getElementById('theme-toggle').addEventListener('click', () => {
        window.toolTheme.toggleTheme();
    });

    // Input
    const textInput = document.getElementById('text-input');
    textInput.addEventListener('input', (e) => {
        window.toolState.updateText(e.target.value);
    });

    // Actions
    document.getElementById('copy-text-btn').addEventListener('click', () => {
        const text = textInput.value;
        if (text) {
            navigator.clipboard.writeText(text);
            showFeedback('copy-text-btn', 'Copied!');
        }
    });

    document.getElementById('clear-text-btn').addEventListener('click', () => {
        textInput.value = '';
        window.toolState.updateText('');
        textInput.focus();
    });

    // Modifiers
    document.querySelectorAll('.btn-utility').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            const currentText = window.toolState.state.text;
            let newText = currentText;

            if (action === 'trim') {
                newText = window.toolModifiers.trimWhitespace(currentText);
            } else if (action === 'remove-extra-spaces') {
                newText = window.toolModifiers.removeExtraSpaces(currentText);
            } else if (action === 'remove-empty-lines') {
                newText = window.toolModifiers.removeEmptyLines(currentText);
            }

            if (newText !== currentText) {
                textInput.value = newText;
                window.toolState.updateText(newText);
            }
        });
    });

    // Copy Stats
    document.getElementById('copy-stats-btn').addEventListener('click', () => {
        const s = window.toolState.state;
        const statsText = `
Word Count: ${s.counts.words}
Character Count: ${s.counts.chars}
Characters (no spaces): ${s.counts.charsNoSpace}
Sentences: ${s.counts.sentences}
Paragraphs: ${s.counts.paragraphs}
Reading Time: ${window.toolUtils.formatTime(s.stats.readingTime)}
Speaking Time: ${window.toolUtils.formatTime(s.stats.speakingTime)}
Unique Words: ${s.analysis.uniqueWords}
Avg Word Length: ${s.analysis.avgLength}
Longest Word: ${s.analysis.longestWord}
Shortest Word: ${s.analysis.shortestWord}
        `.trim();

        navigator.clipboard.writeText(statsText);
        showFeedback('copy-stats-btn', 'Stats Copied!');
    });
}

function showFeedback(btnId, message) {
    const btn = document.getElementById(btnId);
    const originalText = btn.innerText;
    btn.innerText = message;
    setTimeout(() => {
        btn.innerText = originalText;
    }, 2000);
}

// Expose
window.toolEvents = {
    initEvents
};
