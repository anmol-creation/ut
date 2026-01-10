export const state = {
    currentText: '',
    summaryLength: 'medium', // short, medium, long
    summaryFormat: 'paragraph', // paragraph, bullets
    excludeQuotes: false,
    excludeCitations: false,
    history: [],

    // Load history from local storage
    init() {
        const savedHistory = localStorage.getItem('ut_summarizer_history');
        if (savedHistory) {
            try {
                this.history = JSON.parse(savedHistory);
            } catch (e) {
                console.error('Failed to load history', e);
                this.history = [];
            }
        }
    },

    saveHistory(original, summary) {
        if (!original || !summary) return;

        // Don't save duplicates (basic check)
        if (this.history.length > 0 && this.history[0].original === original) return;

        const item = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            preview: original.substring(0, 50) + '...',
            original: original, // Store full text for restoring? Maybe too heavy. Let's store truncated.
            // Actually, for "Restore", we need the original text.
            // Limit history size to 5 to avoid quota issues.
        };

        // We will store the original text so user can reload it.
        // But let's limit the text length we save to avoid localStorage limits (5MB).
        if (original.length > 10000) {
             item.original = original.substring(0, 10000); // Truncate very long texts
        }

        this.history.unshift(item);
        if (this.history.length > 5) {
            this.history.pop();
        }

        localStorage.setItem('ut_summarizer_history', JSON.stringify(this.history));
    },

    clearHistory() {
        this.history = [];
        localStorage.removeItem('ut_summarizer_history');
    },

    setLength(len) {
        this.summaryLength = len;
    },

    setFormat(fmt) {
        this.summaryFormat = fmt;
    },

    setExcludeQuotes(val) {
        this.excludeQuotes = val;
    },

    setExcludeCitations(val) {
        this.excludeCitations = val;
    }
};
