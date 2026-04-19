// Compressor Logic

/**
 * Compresses an image to be under a target size in KB.
 * Uses a binary search approach on JPEG quality, and optionally resizes if quality isn't enough.
 *
 * @param {File} file - Original image file
 * @param {number} targetKB - Target max size in KB
 * @param {function} onProgress - Callback for progress updates
 * @returns {Promise<Blob>} - Resolves with the compressed image Blob
 */
async function compressImageToKB(file, targetKB, onProgress = null) {
    const targetBytes = targetKB * 1024;

    // If the original file is already smaller than the target, return it as a Blob
    if (file.size <= targetBytes) {
        return file;
    }

    const image = await createImageBitmap(file);
    let width = image.width;
    let height = image.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Helper to attempt compression with given dimensions and quality
    const tryCompress = (w, h, q) => {
        return new Promise((resolve) => {
            canvas.width = w;
            canvas.height = h;
            // Fill white background in case of transparent PNGs converted to JPEG
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(image, 0, 0, w, h);
            canvas.toBlob(resolve, 'image/jpeg', q);
        });
    };

    let minQ = 0.01;
    let maxQ = 1.0;
    let bestBlob = null;
    let currentBlob = null;

    // Step 1: Binary search on Quality (keeping original dimensions)
    let iterations = 0;
    const maxIterations = 8;

    while (iterations < maxIterations) {
        let q = (minQ + maxQ) / 2;
        currentBlob = await tryCompress(width, height, q);

        if (onProgress) onProgress(`Adjusting quality...`);

        if (currentBlob.size <= targetBytes) {
            // Valid compression found, try to get higher quality
            bestBlob = currentBlob;
            minQ = q;
        } else {
            // Still too large, reduce quality
            maxQ = q;
        }
        iterations++;
    }

    // Step 2: If quality adjustment alone wasn't enough (even at minQ), we must resize dimensions
    if (!bestBlob || bestBlob.size > targetBytes) {
        let scale = 0.9;
        let scaleIterations = 0;
        const maxScaleIterations = 10;

        // Use a low but reasonable quality for resizing attempts
        const fixedQ = 0.5;

        while (scaleIterations < maxScaleIterations) {
            let newW = Math.max(10, Math.floor(width * scale));
            let newH = Math.max(10, Math.floor(height * scale));

            if (onProgress) onProgress(`Resizing dimensions...`);

            currentBlob = await tryCompress(newW, newH, fixedQ);

            if (currentBlob.size <= targetBytes) {
                bestBlob = currentBlob;
                break; // Found a size that works
            }

            // Reduce scale faster to ensure we hit the target
            scale -= 0.1;
            scaleIterations++;
        }
    }

    // Fallback if somehow still too large (extreme case)
    if (!bestBlob) {
        bestBlob = await tryCompress(width * 0.1, height * 0.1, 0.1);
    }

    return bestBlob;
}