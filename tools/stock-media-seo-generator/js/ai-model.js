// Handles loading TensorFlow MobileNet and running inference
class AIModelHandler {
    constructor(elements, callbacks) {
        this.progressContainer = elements.progressContainer;
        this.progressBar = elements.progressBar;
        this.statusText = elements.statusText;

        this.onModelLoaded = callbacks.onModelLoaded;

        this.model = null;
        this.isLoaded = false;
        this.isLoading = false;
    }

    async loadModel() {
        if (this.isLoaded || this.isLoading) return;
        this.isLoading = true;

        this.progressContainer.classList.remove('hidden');
        this.updateProgress(10, 'Initializing TensorFlow.js...');

        try {
            // Check if tf is available
            if (typeof tf === 'undefined' || typeof mobilenet === 'undefined') {
                throw new Error("TensorFlow.js or MobileNet not loaded from CDN.");
            }

            await tf.ready();
            this.updateProgress(40, 'Downloading AI Model (~5MB)...');

            // Load the MobileNet model
            this.model = await mobilenet.load({version: 2, alpha: 1.0});

            this.updateProgress(100, 'Model Loaded Successfully!');
            this.isLoaded = true;
            this.isLoading = false;

            setTimeout(() => {
                this.progressContainer.classList.add('hidden');
                if (this.onModelLoaded) this.onModelLoaded();
            }, 500);

        } catch (error) {
            console.error("Error loading model:", error);
            this.updateProgress(100, 'Failed to load model. Check console.');
            this.progressBar.style.backgroundColor = 'var(--error-color, #ef4444)';
            this.isLoading = false;
        }
    }

    updateProgress(percent, text) {
        this.progressBar.style.width = `${percent}%`;
        this.statusText.textContent = text;
    }

    async predict(imageElement) {
        if (!this.isLoaded || !this.model) {
            throw new Error("Model is not loaded yet.");
        }

        this.progressContainer.classList.remove('hidden');
        this.updateProgress(50, 'Analyzing media...');

        try {
            // MobileNet predict returns array of {className, probability}
            const predictions = await this.model.classify(imageElement, 5); // get top 5 classes
            this.updateProgress(100, 'Analysis complete!');

            setTimeout(() => {
                this.progressContainer.classList.add('hidden');
            }, 300);

            return predictions;
        } catch (error) {
            console.error("Error predicting:", error);
            this.progressContainer.classList.add('hidden');
            throw error;
        }
    }
}
