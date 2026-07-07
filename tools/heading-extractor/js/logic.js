// Logic for Heading Extractor & Checker

document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('html-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const headingsOutput = document.getElementById('headings-output');
    const seoAlerts = document.getElementById('seo-alerts');

    function analyzeHTML() {
        const rawHTML = htmlInput.value.trim();

        if (!rawHTML) {
            headingsOutput.innerHTML = `<div class="empty-state text-center" style="padding: 3rem 1rem; color: var(--text-secondary); font-style: italic;">Please enter some HTML code.</div>`;
            seoAlerts.style.display = 'none';
            return;
        }

        // Use DOMParser to safely parse HTML without executing scripts
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHTML, 'text/html');

        // Query all headings in document order
        const headingNodes = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headings = Array.from(headingNodes).map(node => ({
            tag: node.tagName.toLowerCase(),
            level: parseInt(node.tagName.charAt(1)),
            text: node.textContent.trim().replace(/\s+/g, ' ') || '[Empty Heading]'
        }));

        renderHeadings(headings);
        checkSEO(headings);
    }

    function renderHeadings(headings) {
        if (headings.length === 0) {
            headingsOutput.innerHTML = `<div class="empty-state text-center" style="padding: 3rem 1rem; color: var(--text-secondary); font-style: italic;">No headings (H1-H6) found in the provided HTML.</div>`;
            return;
        }

        let html = '';
        headings.forEach(h => {
            const escapeText = h.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html += `
                <div class="heading-item indent-${h.tag}">
                    <span class="h-tag tag-${h.tag}">${h.tag.toUpperCase()}</span>
                    <span class="h-text">${escapeText}</span>
                </div>
            `;
        });

        headingsOutput.innerHTML = html;
    }

    function checkSEO(headings) {
        seoAlerts.innerHTML = '';
        seoAlerts.style.display = 'block';

        if (headings.length === 0) {
            addAlert('error', 'Your page has no headings. Headings are crucial for SEO and accessibility.');
            return;
        }

        const h1s = headings.filter(h => h.level === 1);

        // Check 1: Missing H1
        if (h1s.length === 0) {
            addAlert('error', 'Missing H1 tag. Every page should have exactly one H1 tag.');
        }
        // Check 2: Multiple H1s
        else if (h1s.length > 1) {
            addAlert('warning', `Multiple H1 tags found (${h1s.length}). It is generally recommended to have only one main H1 tag per page.`);
        } else {
            addAlert('success', 'Perfect! You have exactly one H1 tag.');
        }

        // Check 3: Skipped heading levels (e.g., H1 -> H3)
        let prevLevel = 0; // 0 means start of document
        let skippedCount = 0;

        headings.forEach(h => {
            if (prevLevel !== 0 && h.level > prevLevel + 1) {
                skippedCount++;
            }
            prevLevel = h.level;
        });

        if (skippedCount > 0) {
            addAlert('warning', `Skipped heading levels detected ${skippedCount} time(s). For example, jumping from H2 directly to H4. This breaks structural hierarchy.`);
        }

        // Check 4: Empty headings
        const emptyCount = headings.filter(h => h.text === '[Empty Heading]').length;
        if (emptyCount > 0) {
            addAlert('error', `Found ${emptyCount} empty heading tag(s). Remove empty tags as they confuse screen readers and search engines.`);
        }

        if (h1s.length === 1 && skippedCount === 0 && emptyCount === 0) {
            addAlert('success', 'Your heading structure looks excellent and SEO-compliant!');
        }
    }

    function addAlert(type, message) {
        let icon = '';
        if (type === 'error') icon = '❌';
        else if (type === 'warning') icon = '⚠️';
        else if (type === 'success') icon = '✅';

        seoAlerts.innerHTML += `
            <div class="seo-alert alert-${type}">
                <span>${icon}</span>
                <span>${message}</span>
            </div>
        `;
    }

    analyzeBtn.addEventListener('click', analyzeHTML);

    clearBtn.addEventListener('click', () => {
        htmlInput.value = '';
        headingsOutput.innerHTML = `<div class="empty-state text-center" style="padding: 3rem 1rem; color: var(--text-secondary); font-style: italic;">Extracted headings will appear here in a nested tree format.</div>`;
        seoAlerts.style.display = 'none';
        seoAlerts.innerHTML = '';
    });
});