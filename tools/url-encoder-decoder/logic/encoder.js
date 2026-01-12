
export const encodeURL = (input) => {
    try {
        return encodeURIComponent(input);
    } catch (e) {
        throw new Error("Failed to encode URL.");
    }
};

export const decodeURL = (input) => {
    try {
        return decodeURIComponent(input);
    } catch (e) {
        throw new Error("Failed to decode URL. Input might be invalid.");
    }
};
