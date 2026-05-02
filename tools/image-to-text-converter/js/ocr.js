// Tesseract.js Integration for OCR Logic

const OCR = {
    async extractText(file, lang) {
        if (!file) return;

        UI.setLoadingState(true);
        UI.updateProgress('Initializing Engine...', 0.1);

        try {
            // Tesseract handles the worker creation via CDN script included in HTML
            const result = await Tesseract.recognize(
                file,
                lang,
                {
                    logger: m => {
                        // m.status is a string like "recognizing text", m.progress is 0 to 1
                        if (m.status === 'recognizing text') {
                            UI.updateProgress('Extracting Text...', m.progress);
                        } else if (m.status === 'loading tesseract core') {
                            UI.updateProgress('Loading OCR Core...', m.progress);
                        } else if (m.status === 'loading language traineddata') {
                            UI.updateProgress(`Loading ${lang} Data...`, m.progress);
                        }
                    }
                }
            );

            UI.updateProgress('Complete!', 1);
            UI.setResultText(result.data.text);

            // Track successful extraction
            Analytics.trackEvent('ocr_success', { language: lang });

        } catch (error) {
            console.error('OCR Error:', error);
            alert('An error occurred during text extraction. Please try again or use a clearer image.');
            UI.resetProgress();
            Analytics.trackEvent('ocr_error', { error: error.message });
        } finally {
            UI.setLoadingState(false);
        }
    }
};

window.OCR = OCR;