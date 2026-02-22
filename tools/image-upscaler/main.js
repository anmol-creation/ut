import { initElements } from './ui/elements.js';
import { setupEvents } from './ui/events.js';

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    setupEvents();

    // Theme toggle if present
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });

        // Init theme
        const saved = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
    }
});
