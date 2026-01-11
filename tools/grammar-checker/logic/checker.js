import { rules, commonTypos, complexWords } from './rules.js';

export const Checker = {
    analyze: (text) => {
        let issues = [];

        // 1. Check Typos (Basic Dictionary)
        const words = text.split(/\b/);
        let currentIndex = 0;

        // Note: Splitting by \b keeps delimiters, so we iterate carefully
        // Or simpler: match words with regex and check indices
        const wordRegex = /\b(\w+)\b/g;
        let match;
        while ((match = wordRegex.exec(text)) !== null) {
            const word = match[0];
            const lowerWord = word.toLowerCase();
            const start = match.index;
            const end = match.index + word.length;

            if (commonTypos[lowerWord]) {
                issues.push({
                    start,
                    end,
                    type: "spelling",
                    text: word,
                    suggestion: commonTypos[lowerWord]
                });
            } else if (complexWords.includes(lowerWord)) {
                issues.push({
                    start,
                    end,
                    type: "style",
                    text: word,
                    suggestion: "Simplify?"
                });
            }
        }

        // 2. Run Rules (Regex)
        rules.forEach(rule => {
            let ruleMatch;
            // Reset lastIndex for global regex
            rule.regex.lastIndex = 0;
            while ((ruleMatch = rule.regex.exec(text)) !== null) {
                const start = ruleMatch.index;
                const end = start + ruleMatch[0].length;

                // If this range overlaps with an existing issue, skip or merge
                // For simplicity, we'll just push it and handle overlap in display logic or CSS
                issues.push({
                    start,
                    end,
                    type: rule.type,
                    text: ruleMatch[0],
                    suggestion: typeof rule.suggestion === 'function' ? rule.suggestion(ruleMatch[0]) : rule.suggestion,
                    message: rule.message
                });
            }
        });

        // Sort issues by start index
        issues.sort((a, b) => a.start - b.start);

        // Filter overlapping issues (prefer spelling > grammar > style)
        // Simple strategy: if overlap, keep the first one or the more "severe" one.
        // We'll just filter out ones that start before the previous one ends.
        const filteredIssues = [];
        let lastEnd = -1;

        for (const issue of issues) {
            if (issue.start >= lastEnd) {
                filteredIssues.push(issue);
                lastEnd = issue.end;
            }
        }

        return filteredIssues;
    }
};
