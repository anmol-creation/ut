export function upscaleImage(img, scaleFactor, options = {}) {
  const { sharpen = false, removeNoise = false } = options;

  // 1. Denoise if requested (on original size)
  let currentImg = img;
  if (removeNoise) {
    // Simple noise reduction simulation: slight blur before scaling up
    // This reduces noise amplification
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.filter = 'blur(0.5px)';
    tCtx.drawImage(img, 0, 0);
    currentImg = tempCanvas;
  }

  // 2. Stepped Upscaling
  // To get better results than a single bi-cubic interpolation,
  // we scale up in steps of max 2x.
  // For example, 4x: 1 -> 2 -> 4
  // 8x: 1 -> 2 -> 4 -> 8

  let currentWidth = currentImg.width;
  let currentHeight = currentImg.height;
  let currentScale = 1;

  let canvas = document.createElement('canvas');
  canvas.width = currentWidth;
  canvas.height = currentHeight;
  let ctx = canvas.getContext('2d');

  // Draw initial image
  ctx.drawImage(currentImg, 0, 0);

  // Iterate until we reach target scale
  while (currentScale < scaleFactor) {
    // Determine next step scale (max 2x step)
    const nextScaleTotal = Math.min(scaleFactor, currentScale * 2);
    const stepFactor = nextScaleTotal / currentScale;

    const newWidth = Math.round(currentImg.width * nextScaleTotal);
    const newHeight = Math.round(currentImg.height * nextScaleTotal);

    const newCanvas = document.createElement('canvas');
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;
    const nCtx = newCanvas.getContext('2d');

    // Enable high quality smoothing
    nCtx.imageSmoothingEnabled = true;
    nCtx.imageSmoothingQuality = 'high';

    // Draw current canvas scaled onto new canvas
    nCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

    // Update state
    canvas = newCanvas;
    ctx = nCtx;
    currentWidth = newWidth;
    currentHeight = newHeight;
    currentScale = nextScaleTotal;
  }

  // 3. Sharpening (Post-processing on final image)
  if (sharpen) {
    const imageData = ctx.getImageData(0, 0, currentWidth, currentHeight);
    const pixels = imageData.data;
    const w = currentWidth;
    const h = currentHeight;

    // Use a separate buffer for source pixels to avoid reading modified values
    // Using Uint8ClampedArray ensures valid pixel values (0-255)
    const src = new Uint8ClampedArray(pixels);

    // Sharpen Kernel (Standard Laplcian):
    //  0 -1  0
    // -1  5 -1
    //  0 -1  0
    // This kernel effectively adds (Original - Smoothed) back to Original.

    // Optimization: Skip borders (1px) to avoid boundary checks inside loop
    for (let y = 1; y < h - 1; y++) {
      // Pre-calculate row offset
      const rowOff = y * w;
      const prevRowOff = (y - 1) * w;
      const nextRowOff = (y + 1) * w;

      for (let x = 1; x < w - 1; x++) {
        const i = (rowOff + x) * 4;

        // Neighbor indices
        const top = (prevRowOff + x) * 4;
        const bottom = (nextRowOff + x) * 4;
        const left = (rowOff + (x - 1)) * 4;
        const right = (rowOff + (x + 1)) * 4;

        // Apply Kernel for R, G, B
        // Center * 5 - (Top + Bottom + Left + Right)

        // Red
        pixels[i] = (src[i] * 5) - (src[top] + src[bottom] + src[left] + src[right]);

        // Green
        pixels[i + 1] = (src[i + 1] * 5) - (src[top + 1] + src[bottom + 1] + src[left + 1] + src[right + 1]);

        // Blue
        pixels[i + 2] = (src[i + 2] * 5) - (src[top + 2] + src[bottom + 2] + src[left + 2] + src[right + 2]);

        // Alpha (i+3) remains unchanged
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}
