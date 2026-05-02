// Isolated Analytics Logic

const Analytics = {
    trackEvent(eventName, params = {}) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        } else {
            console.log(`[Analytics Simulation] Event: ${eventName}`, params);
        }
    }
};

window.Analytics = Analytics;