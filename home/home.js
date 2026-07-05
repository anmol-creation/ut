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

    // Fetch and update dynamic visitor count
    const visitorCountElement = document.getElementById('dynamic-visitor-count');
    if (visitorCountElement) {
        fetch('https://api.counterapi.dev/v1/projectut_com/visits/up')
            .then(response => response.json())
            .then(data => {
                if (data && data.count) {
                    // Format the number with commas (e.g., 1,000)
                    visitorCountElement.textContent = data.count.toLocaleString();
                } else {
                    visitorCountElement.textContent = 'Unavailable';
                }
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
                visitorCountElement.textContent = 'Unavailable';
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
