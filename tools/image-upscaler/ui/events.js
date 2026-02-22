import { elements } from './elements.js';
import { store } from '../state/store.js';
import * as render from './render.js';
import { upscaleImage } from '../logic/upscale.js';
import { convertFormat } from '../logic/format.js';
import { loadImage, imageToDataURL } from '../utils/image-utils.js';
import { downloadImage } from '../utils/download-utils.js';

export function setupEvents() {
  // File Upload
  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    render.setLoading(true);
    try {
      const img = await loadImage(file);
      store.originalImage = img;

      // Reset state
      store.upscaledCanvas = null;

      // Show Tool View
      render.showTool();

      // Update Preview
      const dataUrl = imageToDataURL(img);
      render.updatePreview(dataUrl, dataUrl);

      // Initial upscale (1x just to init canvas?) No, wait for user.
      // But we show original in both slots initially.

    } catch (e) {
      console.error(e);
      render.showError('Failed to load image');
    } finally {
      render.setLoading(false);
    }
  };

  elements.fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

  elements.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.dropZone.classList.add('drag-over');
  });

  elements.dropZone.addEventListener('dragleave', () => {
    elements.dropZone.classList.remove('drag-over');
  });

  elements.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  elements.selectFilesBtn.addEventListener('click', () => elements.fileInput.click());

  // Settings
  elements.scaleRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      store.settings.scaleFactor = parseFloat(e.target.value);
    });
  });

  if (elements.customScaleInput) {
    elements.customScaleInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (val > 0) store.settings.scaleFactor = val / 100;
    });
  }

  elements.formatSelect.addEventListener('change', (e) => {
    store.settings.outputFormat = e.target.value;
    if (e.target.value === 'image/jpeg') {
        elements.qualitySlider.disabled = false;
        elements.qualitySlider.parentElement.style.opacity = 1;
    } else {
        elements.qualitySlider.disabled = true;
        elements.qualitySlider.parentElement.style.opacity = 0.5;
    }
  });

  elements.qualitySlider.addEventListener('input', (e) => {
    store.settings.quality = parseFloat(e.target.value);
    render.updateQualityValue(store.settings.quality);
  });

  elements.sharpenCheck.addEventListener('change', (e) => {
    store.settings.sharpen = e.target.checked;
  });

  elements.noiseCheck.addEventListener('change', (e) => {
    store.settings.removeNoise = e.target.checked;
  });

  // Actions
  elements.upscaleBtn.addEventListener('click', () => {
    if (!store.originalImage) return;

    render.setLoading(true);

    // Allow UI to update before blocking
    setTimeout(() => {
      try {
        const factor = store.settings.scaleFactor;
        const opts = {
          sharpen: store.settings.sharpen,
          removeNoise: store.settings.removeNoise
        };

        const canvas = upscaleImage(store.originalImage, factor, opts);
        store.upscaledCanvas = canvas;

        const dataUrl = canvas.toDataURL(store.settings.outputFormat, store.settings.quality);
        render.updatePreview(null, dataUrl); // Only update upscaled part
        render.updateMeta(canvas.width, canvas.height, store.settings.outputFormat);

      } catch (e) {
        console.error(e);
        render.showError('Upscaling failed: ' + e.message);
      } finally {
        render.setLoading(false);
      }
    }, 50);
  });

  elements.downloadBtn.addEventListener('click', async () => {
    if (!store.upscaledCanvas) {
        render.showError('Please upscale the image first.');
        return;
    }

    try {
      const blob = await convertFormat(store.upscaledCanvas, store.settings.outputFormat, store.settings.quality);
      const url = URL.createObjectURL(blob);
      const ext = store.settings.outputFormat.split('/')[1];
      downloadImage(url, `upscaled-image.${ext}`);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      render.showError('Download failed');
    }
  });

  elements.resetBtn.addEventListener('click', () => {
    store.originalImage = null;
    store.upscaledCanvas = null;
    render.showLanding();
  });

  // Slider Logic
  if (elements.comparisonContainer) {
    let isDragging = false;

    const updateSlider = (x) => {
        const rect = elements.comparisonContainer.getBoundingClientRect();
        let pos = (x - rect.left) / rect.width * 100;
        pos = Math.max(0, Math.min(100, pos));

        elements.comparisonOverlay.style.width = pos + '%';
        elements.sliderHandle.style.left = pos + '%';
    };

    const startDrag = (e) => {
        isDragging = true;
        updateSlider(e.clientX || e.touches[0].clientX);
    };

    const moveDrag = (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX || e.touches[0].clientX);
    };

    const endDrag = () => {
        isDragging = false;
    };

    elements.comparisonContainer.addEventListener('mousedown', startDrag);
    elements.comparisonContainer.addEventListener('touchstart', startDrag);

    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag);

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
  }
}
