// Common misspellings and simple grammar rules
export const commonTypos = {
    "teh": "the",
    "recieve": "receive",
    "adress": "address",
    "occured": "occurred",
    "seperate": "separate",
    "definately": "definitely",
    "until": "until",
    "wierd": "weird",
    "accomodate": "accommodate",
    "thier": "their",
    "wich": "which",
    "goverment": "government",
    "pharoah": "pharaoh",
    "pubicly": "publicly",
    "knowlege": "knowledge",
    "will": "will", // sometimes mistakenly flagged if logic is wrong, just testing
    "alot": "a lot",
    "becuase": "because",
    "dont": "don't",
    "cant": "can't",
    "wont": "won't",
    "shouldnt": "shouldn't",
    "couldnt": "couldn't",
    "im": "I'm",
    "ive": "I've",
    "id": "I'd",
    "its": "it's" // Simple check, context aware is harder
};

// Regex-based rules
export const rules = [
    {
        id: "passive-voice",
        // Simple passive voice detection: form of "to be" + past participle (ed)
        // This is very rough and will have false positives/negatives
        regex: /\b(am|is|are|was|were|be|been|being)\s+(\w+ed)\b/gi,
        type: "style",
        message: "Passive voice detected.",
        suggestion: "Consider active voice."
    },
    {
        id: "very-adverb",
        regex: /\bvery\s+(\w+)\b/gi,
        type: "style",
        message: "Weak intensifier.",
        suggestion: "Use a stronger word (e.g., 'furious' instead of 'very angry')."
    },
    {
        id: "double-space",
        regex: /[ ]{2,}/g,
        type: "grammar",
        message: "Double space found.",
        suggestion: " " // Replace with single space
    },
    {
        id: "sentence-start-lower",
        regex: /(?:^|[.!?]\s+)([a-z])/g,
        type: "grammar",
        message: "Sentence should start with a capital letter.",
        suggestion: (match) => match.toUpperCase()
    },
    {
        id: "repeating-words",
        regex: /\b(\w+)\s+\1\b/gi,
        type: "grammar",
        message: "Repeated word.",
        suggestion: "$1"
    },
    {
        id: "comma-splice",
        // Very basic check for comma splices or run-ons with "however"
        regex: /, however,/gi,
        type: "grammar",
        message: "Weak transition.",
        suggestion: "; however,"
    },
    {
        id: "adverbs-ly",
        regex: /\b(\w+ly)\b/gi,
        type: "style",
        message: "Adverb usage.",
        suggestion: "Try to use a stronger verb."
    }
];

export const complexWords = [
    "utilize", "facilitate", "implement", "methodology"
];
