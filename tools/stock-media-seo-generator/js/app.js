document.addEventListener('DOMContentLoaded', () => {
    // 1. UI Navigation (Landing -> Tool)
    const landingPage = document.getElementById('landing-page');
    const toolUi = document.getElementById('tool-ui');
    const launchBtn = document.getElementById('launch-tool-btn');
    const backBtn = document.getElementById('back-to-landing');

    launchBtn.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        toolUi.classList.remove('hidden');
        // Trigger model load when tool is launched
        aiHandler.loadModel();
    });

    backBtn.addEventListener('click', () => {
        toolUi.classList.add('hidden');
        landingPage.classList.remove('hidden');
    });

    // 2. Initialize Handlers
    const mediaElements = {
        dropZone: document.getElementById('drop-zone'),
        fileInput: document.getElementById('file-input'),
        dropZoneContent: document.querySelector('.drop-zone-content'),
        previewContainer: document.getElementById('preview-container'),
        imagePreview: document.getElementById('image-preview'),
        videoPreview: document.getElementById('video-preview'),
        mediaCanvas: document.getElementById('media-canvas')
    };

    const generateBtn = document.getElementById('generate-btn');
    const clearMediaBtn = document.getElementById('clear-media-btn');

    const mediaHandler = new MediaHandler(mediaElements, {
        onMediaReady: () => {
            clearMediaBtn.classList.remove('hidden');
            checkReadyState();
        },
        onClear: () => {
            clearMediaBtn.classList.add('hidden');
            generateBtn.disabled = true;
            clearOutputs();
        }
    });

    const aiElements = {
        progressContainer: document.getElementById('progress-container'),
        progressBar: document.getElementById('progress-bar'),
        statusText: document.getElementById('status-text')
    };

    const aiHandler = new AIModelHandler(aiElements, {
        onModelLoaded: () => {
            checkReadyState();
        }
    });

    const tagEngine = new TagEngine();

    function checkReadyState() {
        if (aiHandler.isLoaded && mediaHandler.getMediaElementForAI()) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    }

    clearMediaBtn.addEventListener('click', () => {
        mediaHandler.clear();
    });

    // 3. Generate Logic
    const outputTitle = document.getElementById('output-title');
    const outputDesc = document.getElementById('output-desc');
    const outputTags = document.getElementById('output-tags');
    const tagCount = document.getElementById('tag-count');

    const copyTitleBtn = document.getElementById('copy-title-btn');
    const copyDescBtn = document.getElementById('copy-desc-btn');
    const copyTagsBtn = document.getElementById('copy-tags-btn');

    generateBtn.addEventListener('click', async () => {
        try {
            generateBtn.disabled = true;
            generateBtn.textContent = 'Analyzing...';

            const mediaElement = mediaHandler.getMediaElementForAI();
            const predictions = await aiHandler.predict(mediaElement);

            console.log("AI Predictions:", predictions);

            const seoData = tagEngine.generateSEO(predictions);

            outputTitle.value = seoData.title;
            outputDesc.value = seoData.description;
            outputTags.value = seoData.tags;

            const numTags = seoData.tags.split(',').length;
            tagCount.textContent = `${numTags} / 50 Tags`;

            copyTitleBtn.disabled = false;
            copyDescBtn.disabled = false;
            copyTagsBtn.disabled = false;

        } catch (error) {
            alert('An error occurred during analysis. Please try again.');
        } finally {
            generateBtn.textContent = 'Generate SEO Data';
            generateBtn.disabled = false;
        }
    });

    function clearOutputs() {
        outputTitle.value = '';
        outputDesc.value = '';
        outputTags.value = '';
        tagCount.textContent = '0 / 50 Tags';

        copyTitleBtn.disabled = true;
        copyDescBtn.disabled = true;
        copyTagsBtn.disabled = true;
    }

    // 4. Copy Functionality (Prefer navigator.clipboard)
    const copyToClipboard = async (text, btnElement) => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }

            const originalText = btnElement.textContent;
            btnElement.textContent = 'Copied!';
            btnElement.classList.add('btn-success');
            setTimeout(() => {
                btnElement.textContent = originalText;
                btnElement.classList.remove('btn-success');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
            alert('Failed to copy text.');
        }
    };

    copyTitleBtn.addEventListener('click', () => copyToClipboard(outputTitle.value, copyTitleBtn));
    copyDescBtn.addEventListener('click', () => copyToClipboard(outputDesc.value, copyDescBtn));
    copyTagsBtn.addEventListener('click', () => copyToClipboard(outputTags.value, copyTagsBtn));
});
