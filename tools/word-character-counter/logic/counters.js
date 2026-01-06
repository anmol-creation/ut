// Core Counting Logic

function countWords(text) {
    if (!text) return 0;
    // Match one or more non-whitespace characters
    // Using simple regex for basic word counting, handling unicode
    const matches = text.trim().match(/\S+/g);
    return matches ? matches.length : 0;
}

function countChars(text) {
    // Unicode-aware length
    return [...text].length;
}

function countCharsNoSpace(text) {
    // Remove all whitespace and count
    const cleanText = text.replace(/\s/g, '');
    return [...cleanText].length;
}

function countSentences(text) {
    if (!text.trim()) return 0;
    // Split by . ! ? or Hindi Danda (|) followed by space or end of string
    // This is a basic approximation suitable for most general texts
    // U+0964 is Devangari Danda
    const matches = text.match(/[.!?\u0964]+(\s|$)/g);
    // If no punctuation found but text exists, count as 1 if it has words
    if (!matches && text.trim().length > 0) return 1;
    return matches ? matches.length : 0;
}

function countParagraphs(text) {
    if (!text.trim()) return 0;
    // Split by newlines that are not just empty lines
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    return paragraphs.length;
}

// React to state changes
window.toolState.subscribe((state) => {
    // We only calculate when text changes.
    // However, to avoid infinite loops, we should check if text actually changed compared to a cached version
    // Or just rely on the fact that updateText is the trigger.
    // Ideally, the 'notify' in store is generic.
    // In a real app we'd pass 'what changed'.
    // Here we will compute derived state whenever state changes,
    // BUT we must be careful not to call updateCounts if counts haven't changed to avoid loops if we were more complex.
    // For simplicity: The App Controller (app.js) or specific Logic glue code usually handles the flow "Text Changed -> Calc -> Update State".
    // So this file will just export the functions, and logic/counters.js will act as the "service".

    // Actually, let's make this file the "Service" that listens to text updates and updates counts.
    // To prevent loops: We need to know if 'text' changed.
    // Since the store is simple, let's just do the calculation.
});

// We need a mechanism to run these updates when text changes.
// We'll attach a listener specifically for this logic.

let previousText = null;

window.toolState.subscribe((state) => {
    if (state.text !== previousText) {
        previousText = state.text;

        const counts = {
            words: countWords(state.text),
            chars: countChars(state.text),
            charsNoSpace: countCharsNoSpace(state.text),
            sentences: countSentences(state.text),
            paragraphs: countParagraphs(state.text)
        };

        window.toolState.updateCounts(counts);
    }
});
