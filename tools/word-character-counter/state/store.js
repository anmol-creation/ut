// Global State for the Tool
const state = {
    text: "",
    counts: {
        words: 0,
        chars: 0,
        charsNoSpace: 0,
        sentences: 0,
        paragraphs: 0
    },
    stats: {
        readingTime: 0, // in seconds
        speakingTime: 0 // in seconds
    },
    analysis: {
        uniqueWords: 0,
        avgLength: 0,
        longestWord: "-",
        shortestWord: "-"
    },
    settings: {
        theme: 'dark' // 'dark' or 'light'
    }
};

// Simple pub/sub system for reactivity
const listeners = [];

function subscribe(listener) {
    listeners.push(listener);
}

function notify() {
    listeners.forEach(listener => listener(state));
}

function updateText(newText) {
    state.text = newText;
    notify(); // Logic will listen to this and update counts
}

function updateCounts(newCounts) {
    state.counts = { ...state.counts, ...newCounts };
    notify(); // UI will listen to this
}

function updateStats(newStats) {
    state.stats = { ...state.stats, ...newStats };
    notify();
}

function updateAnalysis(newAnalysis) {
    state.analysis = { ...state.analysis, ...newAnalysis };
    notify();
}

// Expose to window for other modules
window.toolState = {
    state,
    subscribe,
    updateText,
    updateCounts,
    updateStats,
    updateAnalysis
};
