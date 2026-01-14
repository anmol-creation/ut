
export function generatePassword(length, options) {
    const charset = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let chars = '';
    if (options.uppercase) chars += charset.uppercase;
    if (options.lowercase) chars += charset.lowercase;
    if (options.numbers) chars += charset.numbers;
    if (options.special) chars += charset.special;

    if (options.exclude) {
        // Escape special regex characters in the exclusion string
        const excludeRegex = new RegExp(`[${options.exclude.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
        chars = chars.replace(excludeRegex, '');
    }

    if (chars.length === 0) return ''; // No characters selected

    let password = '';
    const cryptoObj = window.crypto || window.msCrypto; // For checking availability, though modern browsers usually have it.

    // Fallback if no crypto (rare now but safety) or use Math.random for simplicity if not strict crypto requirement,
    // but prompt says "Security Tools" so better use crypto.getRandomValues

    if (cryptoObj && cryptoObj.getRandomValues) {
        const randomValues = new Uint32Array(length);
        cryptoObj.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            password += chars[randomValues[i] % chars.length];
        }
    } else {
        // Fallback
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }

    return password;
}
