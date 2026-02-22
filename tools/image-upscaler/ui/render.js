import { elements } from './elements.js';

export function showLanding() {
  if (elements.landingView) elements.landingView.classList.remove('hidden');
  if (elements.toolView) elements.toolView.classList.add('hidden');
}

export function showTool() {
  if (elements.landingView) elements.landingView.classList.add('hidden');
  if (elements.toolView) elements.toolView.classList.remove('hidden');
}

export function setLoading(isLoading) {
  if (elements.loadingOverlay) {
    if (isLoading) {
      elements.loadingOverlay.classList.remove('hidden');
    } else {
      elements.loadingOverlay.classList.add('hidden');
    }
  }
  if (elements.upscaleBtn) elements.upscaleBtn.disabled = isLoading;
}

export function updatePreview(originalUrl, upscaledUrl) {
  if (elements.originalPreview) elements.originalPreview.src = originalUrl;

  if (elements.upscaledPreview) {
    elements.upscaledPreview.src = upscaledUrl || originalUrl;
  }

  if (elements.comparisonContainer) elements.comparisonContainer.classList.remove('hidden');

  // Reset slider position to center
  if (elements.comparisonOverlay) elements.comparisonOverlay.style.width = '50%';
  if (elements.sliderHandle) elements.sliderHandle.style.left = '50%';
}

export function updateMeta(width, height, format) {
  if (elements.resultMeta) {
    elements.resultMeta.textContent = `Result: ${width}x${height} (${format ? format.toUpperCase().replace('IMAGE/', '') : ''})`;
  }
}

export function updateQualityValue(val) {
  if (elements.qualityValue) {
    elements.qualityValue.textContent = Math.round(val * 100) + '%';
  }
}

export function showError(msg) {
  if (elements.errorMsg) {
    elements.errorMsg.textContent = msg;
    elements.errorMsg.classList.remove('hidden');
    setTimeout(() => {
      elements.errorMsg.classList.add('hidden');
    }, 5000);
  } else {
    alert(msg);
  }
}
