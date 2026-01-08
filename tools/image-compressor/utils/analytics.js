// Analytics wrapper
export function trackEvent(action, params = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            'event_category': 'Image Compressor',
            ...params
        });
    }
}
