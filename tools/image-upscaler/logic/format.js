export function convertFormat(canvas, format, quality = 0.92) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob failed'));
          return;
        }
        resolve(blob);
      }, format, quality);
    } catch (e) {
      reject(e);
    }
  });
}
