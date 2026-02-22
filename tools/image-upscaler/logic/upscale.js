export function upscaleImage(img, scaleFactor, options = {}) {
  const { sharpen = false, removeNoise = false } = options;

  const targetWidth = Math.round(img.width * scaleFactor);
  const targetHeight = Math.round(img.height * scaleFactor);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  // Use high quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw the image scaled
  if (removeNoise) {
     // Simple noise reduction simulation: slight blur before scaling up or after
     ctx.filter = 'blur(0.5px)';
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  ctx.filter = 'none'; // Reset filter

  if (sharpen) {
    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const pixels = imageData.data;
    const w = targetWidth;
    const h = targetHeight;

    // Create a copy to read from while writing to 'pixels'
    // Actually we need a source buffer to read from
    const src = new Uint8ClampedArray(pixels);

    // Sharpen Kernel:
    //  0 -1  0
    // -1  5 -1
    //  0 -1  0
    const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    const side = 3;
    const halfSide = 1;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dstOff = (y * w + x) * 4;

        let r = 0, g = 0, b = 0;

        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = y + cy - halfSide;
            const scx = x + cx - halfSide;

            if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
              const srcOff = (scy * w + scx) * 4;
              const wt = weights[cy * side + cx];

              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
            }
          }
        }

        pixels[dstOff] = r;
        pixels[dstOff + 1] = g;
        pixels[dstOff + 2] = b;
        // Alpha remains unchanged
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}
