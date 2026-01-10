/**
 * Keyword Extractor
 */
import { getStopWords } from '../utils/text-utils.js';

export function extractKeywords(text, count = 10) {
    if (!text) return [];

    const stopWords = getStopWords();
    const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];

    const freqs = {};
    words.forEach(word => {
        if (!stopWords.has(word)) {
            freqs[word] = (freqs[word] || 0) + 1;
        }
    });

    return Object.entries(freqs)
        .sort((a, b) => b[1] - a[1]) // Sort by count desc
        .slice(0, count)
        .map(entry => entry[0]);
}
