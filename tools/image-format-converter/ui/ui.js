import { convertImage } from '../logic/converter.js';

export function initUI() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectBtn = document.getElementById('select-files-btn');
    const landingView = document.getElementById('landing-view');
    const activeView = document.getElementById('active-view');
    const resetBtn = document.getElementById('reset-btn');
    const imagePreview = document.getElementById('image-preview');
    const originalInfo = document.getElementById('original-info');
    const convertBtn = document.getElementById('convert-btn');
    const resultArea = document.getElementById('result-area');
    const resultInfo = document.getElementById('result-info');
    const downloadLink = document.getElementById('download-link');
    const formatSelect = document.getElementById('format-select');
    const qualityGroup = document.getElementById('quality-group');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const maintainAspectCheckbox = document.getElementById('maintain-aspect');

    let currentFile = null;
    let aspectRatio = 0;

    // File Selection
    selectBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Reset
    resetBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        landingView.classList.remove('hidden');
        activeView.classList.add('hidden');
        resultArea.classList.add('hidden');
    });

    // Format Change - Toggle Quality Slider
    formatSelect.addEventListener('change', () => {
        const format = formatSelect.value;
        if (format === 'image/jpeg' || format === 'image/webp') {
            qualityGroup.classList.remove('hidden');
        } else {
            qualityGroup.classList.add('hidden');
        }
    });

    // Quality Slider
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });

    // Resize Logic
    widthInput.addEventListener('input', () => {
        if (maintainAspectCheckbox.checked && aspectRatio) {
            heightInput.value = Math.round(widthInput.value / aspectRatio);
        }
    });

    heightInput.addEventListener('input', () => {
        if (maintainAspectCheckbox.checked && aspectRatio) {
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        }
    });

    // Convert
    convertBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        convertBtn.disabled = true;
        convertBtn.textContent = 'Converting...';

        try {
            const format = formatSelect.value;
            const quality = parseFloat(qualitySlider.value);
            const w = widthInput.value ? parseInt(widthInput.value) : null;
            const h = heightInput.value ? parseInt(heightInput.value) : null;

            const blob = await convertImage(currentFile, format, quality, w, h);

            showResult(blob, format);
        } catch (error) {
            console.error(error);
            alert('Conversion failed: ' + error.message);
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert Image';
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        currentFile = file;
        landingView.classList.add('hidden');
        activeView.classList.remove('hidden');
        resultArea.classList.add('hidden'); // Hide previous result

        // Load preview
        const url = URL.createObjectURL(file);
        imagePreview.src = url;
        imagePreview.onload = () => {
            originalInfo.textContent = `Original: ${file.name} (${formatSize(file.size)}) - ${imagePreview.naturalWidth}x${imagePreview.naturalHeight}`;
            aspectRatio = imagePreview.naturalWidth / imagePreview.naturalHeight;

            // Set default resize values
            widthInput.value = imagePreview.naturalWidth;
            heightInput.value = imagePreview.naturalHeight;
        };
    }

    function showResult(blob, format) {
        resultArea.classList.remove('hidden');

        const url = URL.createObjectURL(blob);
        downloadLink.href = url;

        // Determine extension
        let ext = format.split('/')[1];
        if (ext === 'jpeg') ext = 'jpg';

        // Rename logic
        const originalName = currentFile.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        downloadLink.download = `${nameWithoutExt}-converted.${ext}`;

        resultInfo.textContent = `Size: ${formatSize(blob.size)}`;

        // Scroll to result
        resultArea.scrollIntoView({ behavior: 'smooth' });
    }

    function formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
