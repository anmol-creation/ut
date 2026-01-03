document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference, default to dark
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        body.setAttribute('data-theme', 'light');
    } else {
        // Default is dark, so no attribute or specific 'dark' attribute depending on CSS impl
        // Here our CSS uses [data-theme="light"] for light mode, so default (no attr) is dark.
        body.removeAttribute('data-theme');
    }

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'light') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});
