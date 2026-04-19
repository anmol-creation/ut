// App State and UI Initialization
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startBtn = document.getElementById('start-tool-btn');
    const landingView = document.getElementById('landing-view');
    const activeView = document.getElementById('active-view');

    const uploadZone = document.getElementById('upload-zone');
    const imageInput = document.getElementById('image-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const originalSize = document.getElementById('original-size');
    const originalDimensions = document.getElementById('original-dimensions');
    const changeImageBtn = document.getElementById('change-image-btn');

    const settingsPanel = document.getElementById('settings-panel');
    const customSizeInputGroup = document.getElementById('custom-size-input-group');
    const customKbInput = document.getElementById('custom-kb');
    const targetSizeRadios = document.querySelectorAll('input[name="target_size"]');

    const compressBtn = document.getElementById('compress-btn');

    const resultPanel = document.getElementById('result-panel');
    const resultSize = document.getElementById('result-size');
    const resultSaved = document.getElementById('result-saved');
    const resultDimensions = document.getElementById('result-dimensions');
    const downloadBtn = document.getElementById('download-btn');
    const compressAgainBtn = document.getElementById('compress-again-btn');
    const compressionStatus = document.getElementById('compression-status');

    const errorContainer = document.getElementById('error-container');

    // State
    let currentFile = null;
    let compressedBlob = null;
    let originalImageObj = new Image();

    // -- App Flow Logic -- //

    // Transition to Active View
    startBtn.addEventListener('click', () => {
        landingView.classList.add('hidden');
        activeView.classList.remove('hidden');
    });

    // Preset Radio Button Logic
    targetSizeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Update active styling on parent labels
            document.querySelectorAll('.preset-label').forEach(label => label.classList.remove('active'));
            e.target.closest('.preset-label').classList.add('active');

            // Toggle Custom Input visibility
            if (e.target.value === 'custom') {
                customSizeInputGroup.style.display = 'block';
            } else {
                customSizeInputGroup.style.display = 'none';
                customKbInput.value = e.target.value; // Sync custom input just in case
            }
        });
    });

    // File Upload Handling
    const handleFileSelect = (file) => {
        if (!isImage(file)) {
            showError("Please select a valid image file (JPG, PNG, WEBP).");
            return;
        }

        hideError();
        currentFile = file;

        // Reset panels
        resultPanel.classList.add('hidden');
        compressedBlob = null;

        // Show preview and settings
        const objectUrl = URL.createObjectURL(file);
        imagePreview.src = objectUrl;
        originalSize.textContent = `Size: ${formatBytes(file.size)}`;

        // Get dimensions
        originalImageObj.onload = () => {
            originalDimensions.textContent = `Dimensions: ${originalImageObj.width} x ${originalImageObj.height}`;
            uploadZone.classList.add('hidden');
            imagePreviewContainer.classList.remove('hidden');
            settingsPanel.classList.remove('hidden');
        };
        originalImageObj.src = objectUrl;
    };

    // Upload Events
    uploadZone.addEventListener('click', () => imageInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelect(e.target.files[0]);
        }
    });

    // Change Image
    changeImageBtn.addEventListener('click', () => {
        imageInput.value = '';
        currentFile = null;
        imagePreviewContainer.classList.add('hidden');
        settingsPanel.classList.add('hidden');
        resultPanel.classList.add('hidden');
        uploadZone.classList.remove('hidden');
    });

    // Compression Action
    compressBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        let targetKB;
        const selectedRadio = document.querySelector('input[name="target_size"]:checked');

        if (selectedRadio.value === 'custom') {
            targetKB = parseFloat(customKbInput.value);
            if (!targetKB || targetKB <= 0) {
                showError("Please enter a valid target size in KB.");
                return;
            }
        } else {
            targetKB = parseFloat(selectedRadio.value);
        }

        hideError();

        // Update UI state
        compressBtn.disabled = true;
        compressBtn.textContent = 'Compressing...';
        compressionStatus.textContent = 'Processing...';
        compressionStatus.className = 'status-badge processing';

        try {
            compressedBlob = await compressImageToKB(currentFile, targetKB, (msg) => {
                 compressionStatus.textContent = msg;
            });

            // Handle Success
            const savedPercentage = ((1 - (compressedBlob.size / currentFile.size)) * 100).toFixed(1);

            // Get new dimensions
            const imgBitmap = await createImageBitmap(compressedBlob);

            resultSize.textContent = formatBytes(compressedBlob.size);
            resultSaved.textContent = savedPercentage > 0 ? `${savedPercentage}% smaller` : 'Size maintained';
            resultDimensions.textContent = `${imgBitmap.width} x ${imgBitmap.height}`;

            compressionStatus.textContent = 'Success!';
            compressionStatus.className = 'status-badge success';

            resultPanel.classList.remove('hidden');

            // Scroll to result
            resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            showError("An error occurred during compression. Please try again.");
            console.error("Compression error:", error);
            compressionStatus.textContent = 'Failed';
            compressionStatus.className = 'status-badge error';
        } finally {
            compressBtn.disabled = false;
            compressBtn.textContent = 'Compress Image';
        }
    });

    // Download Action
    downloadBtn.addEventListener('click', () => {
        if (!compressedBlob) return;

        // Create filename (e.g., image_10kb.jpg)
        const originalName = currentFile.name.replace(/\.[^/.]+$/, ""); // strip extension
        const targetStr = document.querySelector('input[name="target_size"]:checked').value === 'custom'
            ? customKbInput.value
            : document.querySelector('input[name="target_size"]:checked').value;

        const fileName = `${originalName}_${targetStr}kb.jpg`; // Force jpg as compressor outputs jpg

        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    });

    // Compress Another Image Action
    compressAgainBtn.addEventListener('click', () => {
        changeImageBtn.click(); // Reuse existing reset logic
    });

    // Helpers
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }

    function hideError() {
        errorContainer.classList.add('hidden');
    }
});