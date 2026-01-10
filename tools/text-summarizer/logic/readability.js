/**
 * Readability Score (Flesch-Kincaid Reading Ease)
 */

export function calculateReadability(text) {
    if (!text || !text.trim()) return 0;

    const sentences = (text.match(/[^\.!\?]+[\.!\?]+("|')?(\s|$)/g) || []).length || 1;
    const words = (text.match(/\b\w+\b/g) || []).length || 1;
    const syllables = countSyllablesInText(text) || 1;

    // Flesch Reading Ease Formula
    // 206.835 - 1.015(total words / total sentences) - 84.6(total syllables / total words)
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));

    return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllablesInText(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    return words.reduce((acc, word) => acc + countSyllables(word), 0);
}

function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const matched = word.match(/[aeiouy]{1,2}/g);
    return matched ? matched.length : 1;
}
