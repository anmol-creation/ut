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

    // Visitor counter dynamic loading (required by global rules)
    fetchVisitorCount();
});

// Dynamic Visitor Counter for Footer
async function fetchVisitorCount() {
    try {
        const namespace = 'projectut_com';
        const name = 'visits';
        const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/${name}/up`);
        if (response.ok) {
            const data = await response.json();
            const counterElement = document.getElementById('dynamic-visitor-count');
            if (counterElement) {
                counterElement.textContent = `| Total Users: ${data.count.toLocaleString()}+`;
            }
        }
    } catch (error) {
        console.error('Failed to fetch visitor count', error);
        // Silently fail, let the UI just show standard text
    }
}