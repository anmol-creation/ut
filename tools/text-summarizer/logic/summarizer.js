/**
 * Simple Extractive Summarizer
 * Based on sentence ranking by word frequency.
 */

import { getStopWords } from '../utils/text-utils.js';

export class Summarizer {
    constructor() {
        this.stopWords = getStopWords();
    }

    /**
     * Summarizes the text.
     * @param {string} text - The input text.
     * @param {string} lengthMode - 'short', 'medium', 'long'.
     * @returns {Array<string>} - Array of selected sentences.
     */
    summarize(text, lengthMode = 'medium') {
        if (!text || !text.trim()) return [];

        const sentences = this.getSentences(text);
        if (sentences.length === 0) return [];

        // If text is short, return as is (but split)
        if (sentences.length <= 3) return sentences;

        const wordFreq = this.calculateWordFrequencies(sentences);
        const sentenceScores = this.scoreSentences(sentences, wordFreq);

        // Determine number of sentences to keep
        let ratio = 0.3; // medium default
        if (lengthMode === 'short') ratio = 0.15;
        if (lengthMode === 'long') ratio = 0.5;

        // Ensure at least 1 sentence or min 3 if possible
        let count = Math.max(1, Math.ceil(sentences.length * ratio));
        if (sentences.length > 5 && count < 3) count = 3;

        // Sort by score
        const sortedSentences = [...sentenceScores].sort((a, b) => b.score - a.score);
        const topSentences = sortedSentences.slice(0, count);

        // Sort back by original index to maintain flow
        const result = topSentences
            .sort((a, b) => a.index - b.index)
            .map(s => s.text);

        return result;
    }

    getSentences(text) {
        // Basic sentence splitting: punctuation followed by space or end of string
        // Handles . ! ? ...
        return text.match(/[^\.!\?]+[\.!\?]+("|')?(\s|$)/g) || [text];
    }

    calculateWordFrequencies(sentences) {
        const freqs = {};
        sentences.forEach(sentence => {
            const words = sentence.toLowerCase().match(/\b\w+\b/g);
            if (words) {
                words.forEach(word => {
                    if (!this.stopWords.has(word) && isNaN(word)) {
                        freqs[word] = (freqs[word] || 0) + 1;
                    }
                });
            }
        });
        return freqs;
    }

    scoreSentences(sentences, wordFreq) {
        return sentences.map((text, index) => {
            const words = text.toLowerCase().match(/\b\w+\b/g) || [];
            let score = 0;
            words.forEach(word => {
                if (wordFreq[word]) {
                    score += wordFreq[word];
                }
            });
            // Normalize by length to avoid favoring long sentences excessively
            // But we don't want super short ones either.
            if (words.length > 0) {
                 score = score / Math.pow(words.length, 0.5);
            }
            return { text: text.trim(), score, index };
        });
    }
}
