// Handles Image and Video uploads, file parsing, and displaying previews
class MediaHandler {
    constructor(elements, callbacks) {
        this.dropZone = elements.dropZone;
        this.fileInput = elements.fileInput;
        this.dropZoneContent = elements.dropZoneContent;
        this.previewContainer = elements.previewContainer;
        this.imagePreview = elements.imagePreview;
        this.videoPreview = elements.videoPreview;
        this.mediaCanvas = elements.mediaCanvas;

        this.onMediaReady = callbacks.onMediaReady;
        this.onClear = callbacks.onClear;

        this.currentMediaType = null; // 'image' or 'video'
        this.currentMediaElement = null;

        this.initEventListeners();
    }

    initEventListeners() {
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });

        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('dragover');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('dragover');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                this.handleFile(e.dataTransfer.files[0]);
            }
        });
    }

    handleFile(file) {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            alert('Please upload a valid image or video file.');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        this.dropZoneContent.classList.add('hidden');
        this.previewContainer.classList.remove('hidden');

        if (file.type.startsWith('image/')) {
            this.currentMediaType = 'image';
            this.videoPreview.classList.add('hidden');
            this.imagePreview.classList.remove('hidden');
            this.imagePreview.src = objectUrl;

            this.imagePreview.onload = () => {
                this.currentMediaElement = this.imagePreview;
                if (this.onMediaReady) this.onMediaReady();
            };
        } else if (file.type.startsWith('video/')) {
            this.currentMediaType = 'video';
            this.imagePreview.classList.add('hidden');
            this.videoPreview.classList.remove('hidden');
            this.videoPreview.src = objectUrl;

            this.videoPreview.onloadeddata = () => {
                // Seek to 1 second in or middle to get a good frame
                const targetTime = Math.min(1.0, this.videoPreview.duration / 2);
                this.videoPreview.currentTime = targetTime;
            };

            this.videoPreview.onseeked = () => {
                this.extractVideoFrame();
            };
        }
    }

    extractVideoFrame() {
        // Draw current video frame to canvas to use for AI inference
        const canvas = this.mediaCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = this.videoPreview.videoWidth;
        canvas.height = this.videoPreview.videoHeight;
        ctx.drawImage(this.videoPreview, 0, 0, canvas.width, canvas.height);

        this.currentMediaElement = canvas;
        if (this.onMediaReady) this.onMediaReady();
    }

    getMediaElementForAI() {
        return this.currentMediaElement;
    }

    clear() {
        this.fileInput.value = '';
        if (this.imagePreview.src) URL.revokeObjectURL(this.imagePreview.src);
        if (this.videoPreview.src) URL.revokeObjectURL(this.videoPreview.src);

        this.imagePreview.src = '';
        this.videoPreview.src = '';
        this.currentMediaType = null;
        this.currentMediaElement = null;

        this.previewContainer.classList.add('hidden');
        this.imagePreview.classList.add('hidden');
        this.videoPreview.classList.add('hidden');
        this.dropZoneContent.classList.remove('hidden');

        if (this.onClear) this.onClear();
    }
}
