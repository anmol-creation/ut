// UI Event Handlers and DOM Manipulation

const UI = {
    elements: {
        landingPage: document.getElementById('landing-page'),
        toolUi: document.getElementById('tool-ui'),
        launchBtn: document.getElementById('launch-tool-btn'),
        backBtn: document.getElementById('back-to-landing'),

        dropZone: document.getElementById('drop-zone'),
        dropZoneContent: document.querySelector('.drop-zone-content'),
        fileInput: document.getElementById('file-input'),
        imagePreview: document.getElementById('image-preview'),

        extractBtn: document.getElementById('extract-btn'),
        clearImgBtn: document.getElementById('clear-img-btn'),

        progressContainer: document.getElementById('progress-container'),
        progressBar: document.getElementById('progress-bar'),
        statusText: document.getElementById('status-text'),

        textOutput: document.getElementById('text-output'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        clearTextBtn: document.getElementById('clear-text-btn'),

        languageSelect: document.getElementById('language-select')
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Navigation
        this.elements.launchBtn.addEventListener('click', () => this.toggleView(true));
        this.elements.backBtn.addEventListener('click', () => this.toggleView(false));

        // Drag & Drop
        this.elements.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.add('dragover');
        });

        this.elements.dropZone.addEventListener('dragleave', () => {
            this.elements.dropZone.classList.remove('dragover');
        });

        this.elements.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                this.handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        // File Input
        this.elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        // Clear Image
        this.elements.clearImgBtn.addEventListener('click', () => this.resetImageInput());

        // Output text interactions to enable/disable buttons
        this.elements.textOutput.addEventListener('input', () => this.updateOutputButtons());
        this.elements.clearTextBtn.addEventListener('click', () => {
            this.elements.textOutput.value = '';
            this.updateOutputButtons();
        });
    },

    toggleView(showTool) {
        if (showTool) {
            this.elements.landingPage.classList.add('hidden');
            this.elements.toolUi.classList.remove('hidden');
        } else {
            this.elements.toolUi.classList.add('hidden');
            this.elements.landingPage.classList.remove('hidden');
        }
    },

    handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (PNG, JPEG, WebP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.imagePreview.src = e.target.result;
            this.elements.imagePreview.classList.remove('hidden');
            this.elements.dropZoneContent.classList.add('hidden');

            this.elements.extractBtn.disabled = false;
            this.elements.clearImgBtn.classList.remove('hidden');

            // Store the current file for OCR processing
            window.currentImageFile = file;
        };
        reader.readAsDataURL(file);
    },

    resetImageInput() {
        this.elements.imagePreview.src = '';
        this.elements.imagePreview.classList.add('hidden');
        this.elements.dropZoneContent.classList.remove('hidden');
        this.elements.fileInput.value = '';

        this.elements.extractBtn.disabled = true;
        this.elements.clearImgBtn.classList.add('hidden');

        window.currentImageFile = null;
        this.resetProgress();
    },

    updateProgress(status, progress) {
        this.elements.progressContainer.classList.remove('hidden');
        this.elements.statusText.textContent = status;
        this.elements.progressBar.style.width = `${progress * 100}%`;
    },

    resetProgress() {
        this.elements.progressContainer.classList.add('hidden');
        this.elements.progressBar.style.width = '0%';
        this.elements.statusText.textContent = 'Ready';
    },

    setResultText(text) {
        this.elements.textOutput.value = text;
        this.updateOutputButtons();
    },

    updateOutputButtons() {
        const hasText = this.elements.textOutput.value.trim().length > 0;
        this.elements.copyBtn.disabled = !hasText;
        this.elements.downloadBtn.disabled = !hasText;
        this.elements.clearTextBtn.disabled = !hasText;
    },

    setLoadingState(isLoading) {
        this.elements.extractBtn.disabled = isLoading;
        this.elements.clearImgBtn.disabled = isLoading;
        this.elements.languageSelect.disabled = isLoading;
        if(isLoading) {
            this.elements.extractBtn.textContent = 'Processing...';
        } else {
            this.elements.extractBtn.textContent = 'Extract Text';
        }
    }
};

window.UI = UI;