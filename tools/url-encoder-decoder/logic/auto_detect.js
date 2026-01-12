
import { decodeURL } from './encoder.js';

export const autoDetect = (input) => {
    if (!input) return 'encode'; // Default to encode if empty

    // Check if input contains % followed by two hex digits (standard URL encoding)
    // and if decoding it changes the string.
    const urlEncodedPattern = /%[0-9A-Fa-f]{2}/;

    if (urlEncodedPattern.test(input)) {
        try {
            const decoded = decodeURL(input);
            if (decoded !== input) {
                return 'decode';
            }
        } catch (e) {
            // If decoding fails, it's not a valid encoded string, so probably needs encoding
            return 'encode';
        }
    }

    return 'encode';
};
