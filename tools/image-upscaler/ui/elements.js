export const elements = {};

export function initElements() {
  elements.landingView = document.getElementById('landing-view');
  elements.toolView = document.getElementById('tool-view');

  elements.dropZone = document.getElementById('drop-zone');
  elements.fileInput = document.getElementById('file-input');
  elements.selectFilesBtn = document.getElementById('select-files-btn');

  // Settings
  elements.scaleRadios = document.querySelectorAll('input[name="scale-factor"]');
  elements.customScaleInput = document.getElementById('custom-scale');
  elements.formatSelect = document.getElementById('format-select');
  elements.qualitySlider = document.getElementById('quality-slider');
  elements.qualityValue = document.getElementById('quality-value');
  elements.sharpenCheck = document.getElementById('sharpen-check');
  elements.noiseCheck = document.getElementById('noise-check');

  // Actions
  elements.upscaleBtn = document.getElementById('upscale-btn');
  elements.downloadBtn = document.getElementById('download-btn');
  elements.resetBtn = document.getElementById('reset-btn');

  // Preview
  elements.comparisonContainer = document.getElementById('comparison-container');
  elements.originalPreview = document.getElementById('original-preview');
  elements.upscaledPreview = document.getElementById('upscaled-preview');
  elements.comparisonOverlay = document.getElementById('comparison-overlay');
  elements.sliderHandle = document.getElementById('slider-handle');

  elements.loadingOverlay = document.getElementById('loading-overlay');
  elements.resultMeta = document.getElementById('result-meta');

  elements.errorMsg = document.getElementById('error-message');
}
