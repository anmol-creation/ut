// Logic for Image Alt Text Checker

document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('html-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultsOutput = document.getElementById('results-output');
    const statsBadge = document.getElementById('stats-badge');

    function analyzeHTML() {
        const rawHTML = htmlInput.value.trim();

        if (!rawHTML) {
            resultsOutput.innerHTML = `<div class="empty-state text-center" style="padding: 3rem 1rem; color: var(--text-secondary); font-style: italic;">Please enter some HTML code.</div>`;
            statsBadge.style.display = 'none';
            return;
        }

        // Use DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHTML, 'text/html');

        const imgNodes = doc.querySelectorAll('img');

        if (imgNodes.length === 0) {
            resultsOutput.innerHTML = `<div class="empty-state text-center" style="padding: 3rem 1rem; color: var(--text-secondary); font-style: italic;">No &lt;img&gt; tags found in the provided HTML.</div>`;
            statsBadge.style.display = 'none';
            return;
        }

        let issuesCount = 0;
        let html = '';

        imgNodes.forEach((img, index) => {
            const src = img.getAttribute('src') || '[No src attribute]';
            const hasAlt = img.hasAttribute('alt');
            const altText = img.getAttribute('alt');

            let status = '';
            let labelClass = '';
            let itemClass = '';
            let altDisplay = '';

            if (!hasAlt) {
                status = 'Missing Alt Attribute';
                labelClass = 'label-error';
                itemClass = 'error';
                altDisplay = '<i>None (Attribute completely missing)</i>';
                issuesCount++;
            } else if (altText.trim() === '') {
                status = 'Empty Alt Attribute';
                labelClass = 'label-warning';
                itemClass = 'warning';
                altDisplay = '<i>Empty string (alt="")</i>';
                // Technically an empty alt is valid for decorative images, but we flag it as a warning for SEO review.
                issuesCount++;
            } else {
                status = 'Good';
                labelClass = 'label-success';
                itemClass = 'success';
                altDisplay = escapeHtml(altText);
            }

            html += `
                <div class="img-item ${itemClass}">
                    <div class="img-src"><strong>Src:</strong> ${escapeHtml(src)}</div>
                    <div>
                        <span class="status-label ${labelClass}">${status}</span>
                        <span class="img-alt">${altDisplay}</span>
                    </div>
                </div>
            `;
        });

        resultsOutput.innerHTML = html;

        // Update Stats Badge
        statsBadge.style.display = 'block';
        if (issuesCount > 0) {
            statsBadge.textContent = `${issuesCount} Issue${issuesCount > 1 ? 's' : ''} Found`;
            statsBadge.className = 'stats-badge';
        } else {
            statsBadge.textContent = 'Perfect!';
            statsBadge.className = 'stats-badge success';
        }
    }

    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    analyzeBtn.addEventListener('click', analyzeHTML);

    clearBtn.addEventListener('click', () => {
        htmlInput.value = '';
        resultsOutput.innerHTML = `<div class="empty-state text-center" style="padding: 3rem 1rem; color: var(--text-secondary); font-style: italic;">Image tags and their alt attributes will be listed here.</div>`;
        statsBadge.style.display = 'none';
    });
});