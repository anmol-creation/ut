// Script to dynamically load global header and footer components
document.addEventListener('DOMContentLoaded', () => {
    // Determine the root path prefix based on the current URL depth
    const pathDepth = window.location.pathname.split('/').filter(Boolean).length;
    // Assuming root is at depth 0 or 1 (e.g., / or /index.html). If in /tools/tool-name/, depth is 2 or 3.
    // A simple heuristic: if URL contains '/tools/', we need to go up.
    let rootPrefix = '';
    if (window.location.pathname.includes('/tools/')) {
        const parts = window.location.pathname.split('/');
        const toolsIndex = parts.indexOf('tools');
        const depthAfterTools = parts.length - toolsIndex - 1;
        // if path ends in .html, it counts as a part.
        // e.g., /tools/index.html -> depth 1 -> ../
        // e.g., /tools/tool-name/index.html -> depth 2 -> ../../
        const pathIsDirectory = window.location.pathname.endsWith('/');
        const effectiveDepth = window.location.pathname.endsWith('.html') ? depthAfterTools - 1 : depthAfterTools;

        for (let i = 0; i <= effectiveDepth; i++) {
             rootPrefix += '../';
        }
    }

    // Load Header
    const headerContainer = document.querySelector('.global-header-container');
    if (headerContainer) {
        fetch(rootPrefix + 'components/header.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(html => {
                // Prepend header content so it sits above any existing inner content (like language selectors)
                headerContainer.insertAdjacentHTML('afterbegin', html);

                // Adjust links based on current depth
                if (rootPrefix) {
                    const links = headerContainer.querySelectorAll('a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.startsWith('/')) {
                            // Convert absolute path to relative path based on rootPrefix
                            link.setAttribute('href', rootPrefix + href.substring(1));
                        }
                    });
                }

                // Initialize Mobile Menu Toggle
                const menuBtn = document.getElementById('mobile-menu-btn');
                const navLinks = document.getElementById('global-nav-links');
                if (menuBtn && navLinks) {
                    menuBtn.addEventListener('click', () => {
                        navLinks.classList.toggle('active');
                    });
                }
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Load Footer
    const footerContainer = document.querySelector('.global-footer-container');
    if (footerContainer) {
        fetch(rootPrefix + 'components/footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;

                 // Adjust links based on current depth
                 if (rootPrefix) {
                    const links = footerContainer.querySelectorAll('a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.startsWith('/')) {
                            // Convert absolute path to relative path based on rootPrefix
                            link.setAttribute('href', rootPrefix + href.substring(1));
                        }
                    });
                }

                // Initialize Visitor Counter
                initVisitorCounter();
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});

function initVisitorCounter() {
    const counterElement = document.getElementById('dynamic-visitor-count');
    if (counterElement) {
        fetch('https://api.counterapi.dev/v1/projectut_com/visits/up')
            .then(response => response.json())
            .then(data => {
                if (data && data.count) {
                    counterElement.textContent = data.count.toLocaleString();
                } else {
                    counterElement.textContent = 'Unavailable';
                }
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
                counterElement.textContent = 'Unavailable';
            });
    }
}
