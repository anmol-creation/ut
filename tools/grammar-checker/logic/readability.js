export const Readability = {
    analyze: (text) => {
        if (!text.trim()) {
            return {
                score: 0,
                sentences: 0,
                avgWordLen: 0,
                level: "N/A"
            };
        }

        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.match(/\b\w+\b/g) || [];
        const syllables = countSyllablesInText(words);

        const numSentences = sentences.length || 1;
        const numWords = words.length || 1;

        // Flesch-Kincaid Grade Level
        // 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
        const avgWordsPerSentence = numWords / numSentences;
        const avgSyllablesPerWord = syllables / numWords;

        let score = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
        score = Math.max(0, Math.min(score, 100)); // Clamp roughly

        let level = "Easy";
        if (score > 12) level = "Very Hard (Academic)";
        else if (score > 10) level = "Hard";
        else if (score > 8) level = "Average";
        else if (score > 5) level = "Fairly Easy";
        else level = "Easy";

        return {
            score: score.toFixed(1),
            sentences: numSentences,
            avgWordLen: (words.join('').length / numWords).toFixed(1),
            level: level
        };
    }
};

function countSyllablesInText(words) {
    let count = 0;
    words.forEach(word => {
        count += countSyllables(word);
    });
    return count;
}

function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}
