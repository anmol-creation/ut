// Main Initialization

document.addEventListener('DOMContentLoaded', () => {
    // Initialize sub-modules
    UI.init();
    Actions.init();

    // Bind the primary action
    const extractBtn = document.getElementById('extract-btn');
    const languageSelect = document.getElementById('language-select');

    extractBtn.addEventListener('click', () => {
        const file = window.currentImageFile;
        const lang = languageSelect.value;
        if (file) {
            Analytics.trackEvent('ocr_start', { language: lang });
            OCR.extractText(file, lang);
        }
    });


});

