export const store = {
  originalImage: null, // Image object
  upscaledCanvas: null, // Canvas element
  settings: {
    scaleFactor: 2,
    outputFormat: 'image/jpeg',
    quality: 0.9,
    sharpen: false,
    removeNoise: false
  },
  isProcessing: false
};
