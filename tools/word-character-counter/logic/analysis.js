// Text Analysis Logic

function analyzeText(text) {
    if (!text || !text.trim()) {
        return {
            uniqueWords: 0,
            avgLength: 0,
            longestWord: "-",
            shortestWord: "-"
        };
    }

    // Extract words
    const words = text.trim().match(/\S+/g) || [];

    if (words.length === 0) {
        return {
            uniqueWords: 0,
            avgLength: 0,
            longestWord: "-",
            shortestWord: "-"
        };
    }

    // Unique Words
    // Normalize to lowercase for uniqueness.
    // We want to remove punctuation but keep letters from any language.
    // Using \P{L} (capital P) means "not a letter". We replace non-letters with empty string.
    // Note: This requires the 'u' flag, but since we are doing replace on a string, we construct regex with 'u'.
    const uniqueSet = new Set(words.map(w => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")));
    const uniqueWords = uniqueSet.size;

    // Word Lengths
    let totalLength = 0;
    let longest = words[0];
    let shortest = words[0];

    words.forEach(word => {
        const len = [...word].length; // Unicode safe
        totalLength += len;

        if (len > [...longest].length) longest = word;
        if (len < [...shortest].length) shortest = word;
    });

    const avgLength = (totalLength / words.length).toFixed(1);

    return {
        uniqueWords,
        avgLength,
        longestWord: longest,
        shortestWord: shortest
    };
}

let previousTextAnalysis = null;

// Debounce analysis as it can be heavy for large texts
const runAnalysis = window.toolUtils.debounce((text) => {
    const results = analyzeText(text);
    window.toolState.updateAnalysis(results);
}, 300);

window.toolState.subscribe((state) => {
    if (state.text !== previousTextAnalysis) {
        previousTextAnalysis = state.text;
        runAnalysis(state.text);
    }
});
