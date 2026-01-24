import { encodeBMP, encodeTIFF } from './encoders.js';

/**
 * Converts an image file to the specified format.
 * @param {File} file - The source image file.
 * @param {string} format - The MIME type of the target format (e.g., 'image/png').
 * @param {number} quality - Quality for lossy formats (0 to 1).
 * @param {number|null} targetWidth - Optional target width.
 * @param {number|null} targetHeight - Optional target height.
 * @returns {Promise<Blob>} - The converted image as a Blob.
 */
export async function convertImage(file, format, quality = 0.9, targetWidth, targetHeight) {
    const img = await loadImage(file);

    let width = img.width;
    let height = img.height;

    if (targetWidth && targetHeight) {
        width = parseInt(targetWidth);
        height = parseInt(targetHeight);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Handle transparency for formats that don't support it
    if (format === 'image/jpeg' || format === 'image/bmp') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    // Custom Encoders
    if (format === 'image/bmp') {
        const imageData = ctx.getImageData(0, 0, width, height);
        return encodeBMP(width, height, imageData.data);
    } else if (format === 'image/tiff') {
        const imageData = ctx.getImageData(0, 0, width, height);
        return encodeTIFF(width, height, imageData.data);
    }

    // Native Browser Support (PNG, JPEG, WebP, GIF)
    return new Promise((resolve, reject) => {
        try {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Conversion failed'));
                    return;
                }
                resolve(blob);
            }, format, quality);
        } catch (e) {
            reject(e);
        }
    });
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}
