import { initHandlers } from './logic/handlers.js';
import { trackEvent } from './utils/analytics.js';

document.addEventListener('DOMContentLoaded', () => {
    initHandlers();
    trackEvent('page_view');
    console.log('Image Compressor initialized');
});
