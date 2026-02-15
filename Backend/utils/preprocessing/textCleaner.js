const DEFAULT_OPTIONS = {
    normalizeSpaces: true,
    normalizeNewlines: true,
    toLowerCase: false,
    removeStopwords: false
};

const STOPWORDS = new Set([
    "the", "is", "at", "which", "on", "in", "and", "or", "a", "an", "to"
]);

export function cleanText(text, options = {}) {

    const config = { ...DEFAULT_OPTIONS, ...options };

    if (!text || typeof text !== "string") {
        throw new Error("Invalid text input");
    }

    let processed = text;

    if (config.normalizeNewlines) {
        processed = processed.replace(/\r\n/g, "\n");
    }

    if (config.normalizeSpaces) {
        processed = processed.replace(/[ \t]+/g, " ");
    }

    if (config.toLowerCase) {
        processed = processed.toLowerCase();
    }

    if (config.removeStopwords) {
        processed = processed
            .split(" ")
            .filter(word => !STOPWORDS.has(word))
            .join(" ");
    }

    return processed.trim();
}
