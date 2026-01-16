/**
 * Formats the input data into a string compatible with QR Code standards.
 * @param {string} type - The type of input (url, text, email, phone, sms, wifi).
 * @param {object} data - The data object containing fields relevant to the type.
 * @returns {string} The formatted string.
 */
export const formatData = (type, data) => {
    switch (type) {
        case 'url':
            return data.url;
        case 'text':
            return data.text;
        case 'email':
            return `mailto:${data.email}`;
        case 'phone':
            return `tel:${data.phone}`;
        case 'sms':
            return `smsto:${data.phone}:${data.message || ''}`;
        case 'wifi':
            // WIFI:T:WPA;S:MyNetwork;P:MyPassword;;
            // H: hidden (true/false) - optional, not included in basic prompt but good to know
            const encryption = data.encryption || 'nopass';
            const pass = data.password || '';
            return `WIFI:T:${encryption};S:${data.ssid};P:${pass};;`;
        default:
            return data.text || '';
    }
};

/**
 * Generates a QR code in the specified container.
 * @param {HTMLElement} containerElement - The DOM element to render the QR code into.
 * @param {string} text - The encoded text to generate.
 * @param {object} options - Customization options (size, color, correction level).
 */
export const generateQRCode = (containerElement, text, options) => {
    // Clear previous QR code
    containerElement.innerHTML = '';

    if (!text) return false;

    // Default options
    // QRCode library expects CorrectLevel as integer or constant.
    // QRCode.CorrectLevel.L = 1, M = 0, Q = 3, H = 2 (approx, depending on lib version)
    // We will trust the library is loaded globally.

    const correctLevelMap = {
        'L': QRCode.CorrectLevel.L,
        'M': QRCode.CorrectLevel.M,
        'Q': QRCode.CorrectLevel.Q,
        'H': QRCode.CorrectLevel.H
    };

    const config = {
        text: text,
        width: parseInt(options.width) || 256,
        height: parseInt(options.height) || 256,
        colorDark : options.colorDark || "#000000",
        colorLight : options.colorLight || "#ffffff",
        correctLevel : correctLevelMap[options.correctLevel] || QRCode.CorrectLevel.H
    };

    try {
        new QRCode(containerElement, config);
        return true;
    } catch (e) {
        console.error("QR Generation failed", e);
        return false;
    }
};
