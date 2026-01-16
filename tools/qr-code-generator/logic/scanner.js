/**
 * logic/scanner.js
 * Wrapper for html5-qrcode library.
 */

let html5QrCode;

/**
 * Starts the QR Code scanner.
 * @param {string} elementId - The ID of the HTML element to render the scanner in.
 * @param {function} onScanSuccess - Callback when a QR code is successfully scanned.
 * @param {function} onScanFailure - Callback when scanning fails (optional).
 */
export const startScanner = async (elementId, onScanSuccess, onScanFailure) => {
    // If scanner is already running, stop it first (though UI should handle this)
    if (html5QrCode) {
        await stopScanner();
    }

    html5QrCode = new Html5Qrcode(elementId);

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // Prefer back camera
    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            onScanFailure
        );
        return true;
    } catch (err) {
        console.error("Error starting scanner", err);
        return false;
    }
};

/**
 * Stops the QR Code scanner.
 */
export const stopScanner = async () => {
    if (html5QrCode) {
        try {
            await html5QrCode.stop();
            html5QrCode.clear();
            html5QrCode = null;
        } catch (err) {
            console.error("Failed to stop scanner", err);
        }
    }
};
