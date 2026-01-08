// Compression logic using Canvas API

export async function compressImage(file, settings) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            // Calculate new dimensions (if we were resizing, but we are just compressing for now)
            // Ideally we could resize if the image is massive to save more, but "auto" might implies just quality.
            // Let's stick to original dimensions for now unless we add resize feature.
            const width = img.width;
            const height = img.height;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Determine format and quality
            let format = file.type;
            let quality = settings.quality;

            // Auto logic
            if (settings.mode === 'auto') {
                // For JPEG/WebP, 0.75 or 0.8 is usually a good "auto" balance
                quality = 0.8;
                // We could switch PNG to WebP for better compression in Auto mode,
                // but usually users expect same format unless specified.
                // However, PNG lossless compression in canvas is limited.
                // If it's PNG, canvas toBlob(..., 'image/png') ignores quality.
                // So for PNG 'auto', maybe we can't do much with just canvas unless we convert to WebP?
                // Or maybe we just return the original if we can't compress?

                // Let's try to maintain format.
                if (format === 'image/png') {
                    // Canvas PNG is always 100% quality (lossless) but might differ in filter/zlib level depending on browser.
                    // Often it results in larger file size than optimized PNG.
                    // So for PNG, we might suggest WebP or JPEG if transparency check passes?
                    // For now, let's keep it simple. If it's PNG, we might not gain much size reduction.
                }
            } else {
                 // Manual mode uses the slider value (0.1 - 1.0)
            }

            // Fallback for PNG which ignores quality param in some browsers/specs
            // If the user wants compression on PNG, converting to WebP is the best browser-native way
            // But we must respect file type unless we add a "convert" option.

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Compression failed'));
                    return;
                }

                // If the compressed blob is larger than original, return original (unless we stripped metadata and that was the goal, but usually size matters)
                if (blob.size > file.size && settings.mode === 'auto') {
                     // resolve(file); // Return original
                     // Actually, let's return the blob if it's what we produced, but maybe flag it?
                     // Or just return original to be safe.
                     resolve(file);
                } else {
                    resolve(blob);
                }
            }, format, quality);
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };

        img.src = url;
    });
}
