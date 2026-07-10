export const elements = {
    // Views
    landingView: document.getElementById('landing-view'),
    toolView: document.getElementById('tool-view'),

    // Inputs
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('file-input'),
    selectFilesBtn: document.getElementById('select-files-btn'),

    // UI Elements
    resetBtn: document.getElementById('reset-btn'),
    downloadBtn: document.getElementById('download-btn'),
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    errorMessage: document.getElementById('error-message'),

    // Previews
    comparisonContainer: document.getElementById('comparison-container'),
    originalPreview: document.getElementById('original-preview'),
    resultPreview: document.getElementById('result-preview'),
    comparisonOverlay: document.getElementById('comparison-overlay'),
    sliderHandle: document.getElementById('slider-handle'),
    resultMeta: document.getElementById('result-meta')
};

export function initElements() {
    if (!elements.landingView) console.error("DOM Elements not found. Check HTML IDs.");
}
