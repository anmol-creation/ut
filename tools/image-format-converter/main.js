import { initUI } from './ui/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    initUI();

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        body.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'light') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});

// Update icons based on theme
function updateThemeIcons() {
    const isLight = (document.body.getAttribute('data-theme') === 'light' || document.documentElement.getAttribute('data-theme') === 'light');
    const moonIcons = document.querySelectorAll('.icon-moon');
    const sunIcons = document.querySelectorAll('.icon-sun');

    moonIcons.forEach(icon => icon.style.display = isLight ? 'none' : 'inline');
    sunIcons.forEach(icon => icon.style.display = isLight ? 'inline' : 'none');
}

// Initial call
updateThemeIcons();

// Observe theme changes
const observer = new MutationObserver(updateThemeIcons);
observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] }); observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
