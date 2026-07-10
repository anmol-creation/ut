import { elements } from './elements.js';

let currentFile = null;
let currentResultBlob = null;
let currentObjectURLs = []; // Keep track to revoke later

export function setupEvents() {
    // File Input
    elements.selectFilesBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);

    // Drag & Drop
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
        if (e.dataTransfer.files.length > 0) {
            elements.fileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: elements.fileInput });
        }
    });

    // Navigation
    elements.resetBtn.addEventListener('click', resetTool);

    // Download
    elements.downloadBtn.addEventListener('click', downloadResult);

    // Comparison Slider
    setupComparisonSlider();
}

async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file (JPG, PNG, WebP).');
        return;
    }

    currentFile = file;
    elements.errorMessage.classList.add('hidden');

    // Switch View
    elements.landingView.classList.add('hidden');
    elements.toolView.classList.remove('hidden');

    // Load original image preview
    const objectURL = URL.createObjectURL(file);
    currentObjectURLs.push(objectURL);
    elements.originalPreview.src = objectURL;

    // Hide comparison and show loading
    elements.comparisonContainer.classList.add('hidden');
    elements.loadingOverlay.classList.remove('hidden');
    elements.loadingText.innerHTML = 'Processing...<br><span style="font-size: 0.8em; opacity: 0.8;">Removing background using AI...</span>';

    // Process image
    await processImage(file, objectURL);
}

async function processImage(file, originalURL) {
    try {
        if (typeof imglyRemoveBackground === 'undefined') {
            throw new Error("Background removal library not loaded.");
        }

        elements.loadingText.innerHTML = 'Processing...<br><span style="font-size: 0.8em; opacity: 0.8;">First run downloads a ~20MB AI model. Please be patient.</span>';

        // imgly-background-removal configuration
        const config = {
            progress: (key, current, total) => {
                if (total) {
                    const percent = Math.round((current / total) * 100);
                    elements.loadingText.innerHTML = `Downloading AI Model... ${percent}%`;
                } else if (key === 'compute:inference') {
                     elements.loadingText.innerHTML = 'Removing Background...';
                }
            }
        };

        const resultBlob = await imglyRemoveBackground(originalURL, config);
        currentResultBlob = resultBlob;

        const resultURL = URL.createObjectURL(resultBlob);
        currentObjectURLs.push(resultURL);

        elements.resultPreview.src = resultURL;

        elements.resultPreview.onload = () => {
             elements.loadingOverlay.classList.add('hidden');
             elements.comparisonContainer.classList.remove('hidden');
             resetSlider();
             updateMeta(file, resultBlob);
        };

    } catch (error) {
        console.error("Background removal error:", error);
        elements.loadingOverlay.classList.add('hidden');
        showError("Failed to remove background. " + (error.message || "Please try a different image."));
    }
}


function setupComparisonSlider() {
    let isDown = false;

    const startInteraction = (e) => {
        isDown = true;
        updateSlider(e);
    };

    const stopInteraction = () => {
        isDown = false;
    };

    const moveInteraction = (e) => {
        if (!isDown) return;
        updateSlider(e);
    };

    elements.comparisonContainer.addEventListener('mousedown', startInteraction);
    elements.comparisonContainer.addEventListener('touchstart', (e) => startInteraction(e.touches[0]), {passive: true});

    window.addEventListener('mouseup', stopInteraction);
    window.addEventListener('touchend', stopInteraction);

    window.addEventListener('mousemove', moveInteraction);
    window.addEventListener('touchmove', (e) => moveInteraction(e.touches[0]), {passive: true});
}

function updateSlider(e) {
    if (!elements.comparisonContainer || elements.comparisonContainer.classList.contains('hidden')) return;

    const rect = elements.comparisonContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;

    // Bound check
    x = Math.max(0, Math.min(x, rect.width));

    const percentage = (x / rect.width) * 100;

    elements.sliderHandle.style.left = `${percentage}%`;
    elements.comparisonOverlay.style.width = `${percentage}%`;
}

function resetSlider() {
    elements.sliderHandle.style.left = '50%';
    elements.comparisonOverlay.style.width = '50%';
}

function updateMeta(originalFile, resultBlob) {
    const origSize = (originalFile.size / 1024 / 1024).toFixed(2);
    const resultSize = (resultBlob.size / 1024 / 1024).toFixed(2);
    elements.resultMeta.textContent = `Original: ${origSize} MB | Result: ${resultSize} MB`;
}

function downloadResult() {
    if (!currentResultBlob) return;

    const url = URL.createObjectURL(currentResultBlob);
    const a = document.createElement('a');
    a.href = url;

    const origName = currentFile.name;
    const dotIndex = origName.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? origName.substring(0, dotIndex) : origName;
    a.download = `${baseName}_bg_removed.png`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetTool() {
    currentFile = null;
    currentResultBlob = null;
    elements.fileInput.value = '';
    elements.errorMessage.classList.add('hidden');

    // Revoke old URLs to free memory
    currentObjectURLs.forEach(url => URL.revokeObjectURL(url));
    currentObjectURLs = [];

    elements.originalPreview.src = '';
    elements.resultPreview.src = '';

    elements.toolView.classList.add('hidden');
    elements.landingView.classList.remove('hidden');
}

function showError(msg) {
    elements.errorMessage.textContent = msg;
    elements.errorMessage.classList.remove('hidden');
}
