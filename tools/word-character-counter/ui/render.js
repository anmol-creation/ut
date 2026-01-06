// DOM Rendering based on State

function render(state) {
    // Primary Stats
    updateElement('stat-words', state.counts.words);
    updateElement('stat-chars', state.counts.chars);

    // Secondary Stats
    updateElement('stat-chars-no-space', state.counts.charsNoSpace);
    updateElement('stat-sentences', state.counts.sentences);
    updateElement('stat-paragraphs', state.counts.paragraphs);

    // Time Stats
    updateElement('stat-reading-time', window.toolUtils.formatTime(state.stats.readingTime));
    updateElement('stat-speaking-time', window.toolUtils.formatTime(state.stats.speakingTime));

    // Analysis
    updateElement('stat-unique', state.analysis.uniqueWords);
    updateElement('stat-avg-len', state.analysis.avgLength);
    updateElement('stat-longest', state.analysis.longestWord, true);
    updateElement('stat-shortest', state.analysis.shortestWord, true);
}

function updateElement(id, value, isTitle = false) {
    const el = document.getElementById(id);
    if (el) {
        if (el.innerText !== String(value)) {
            el.innerText = value;
        }
        if (isTitle) {
            el.title = value;
        }
    }
}

// Subscribe to store
window.toolState.subscribe(render);

// Expose
window.toolRender = {
    render
};
