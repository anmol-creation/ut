import { initElements } from './ui/elements.js';
import { setupEvents } from './ui/events.js';

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    setupEvents();

    // Theme toggle
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcons();
        });

        // Init theme
        const saved = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
    }

    updateThemeIcons();
});

// Update icons based on theme
function updateThemeIcons() {
    const isLight = (document.body.getAttribute('data-theme') === 'light' || document.documentElement.getAttribute('data-theme') === 'light');
    const moonIcons = document.querySelectorAll('.icon-moon');
    const sunIcons = document.querySelectorAll('.icon-sun');

    moonIcons.forEach(icon => icon.style.display = isLight ? 'none' : 'inline');
    sunIcons.forEach(icon => icon.style.display = isLight ? 'inline' : 'none');
}

// Observe theme changes
const observer = new MutationObserver(updateThemeIcons);
observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
