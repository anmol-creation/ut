// Logic for Meta Tag Generator & SERP Simulator

document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const urlInput = document.getElementById('page-url');
    const titleInput = document.getElementById('page-title');
    const descInput = document.getElementById('page-description');
    const keywordsInput = document.getElementById('page-keywords');
    const authorInput = document.getElementById('author-name');

    // Counters & Progress
    const urlCount = document.getElementById('url-count');
    const titleCount = document.getElementById('title-count');
    const descCount = document.getElementById('desc-count');
    const titleProgress = document.getElementById('title-progress');
    const descProgress = document.getElementById('desc-progress');

    // Previews (Desktop)
    const prevUrlDesktop = document.getElementById('preview-url-desktop');
    const prevTitleDesktop = document.getElementById('preview-title-desktop');
    const prevDescDesktop = document.getElementById('preview-desc-desktop');

    // Previews (Mobile)
    const prevUrlMobile = document.getElementById('preview-url-mobile');
    const prevSitenameMobile = document.getElementById('preview-sitename-mobile');
    const prevTitleMobile = document.getElementById('preview-title-mobile');
    const prevDescMobile = document.getElementById('preview-desc-mobile');

    // Code Output
    const codeOutput = document.getElementById('meta-code-output');

    // Buttons
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Limits (General SEO Best Practices)
    const LIMITS = {
        title: { optimal: 60, max: 65 },
        desc: { optimal: 155, max: 160 }
    };

    // Default Preview Texts
    const DEFAULTS = {
        url: 'https://www.example.com/page',
        sitename: 'example.com',
        title: 'Your Page Title Will Appear Here - Max 60 Characters',
        desc: 'This is how your meta description will look in Google search results. Make it descriptive and engaging to increase your click-through rate.'
    };

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const view = btn.dataset.view;
            document.getElementById('desktop-preview').classList.remove('view-active');
            document.getElementById('mobile-preview').classList.remove('view-active');

            document.getElementById(`${view}-preview`).classList.add('view-active');
        });
    });

    // Event Listeners for real-time updates
    urlInput.addEventListener('input', updateUrlPreview);
    titleInput.addEventListener('input', updateTitlePreview);
    descInput.addEventListener('input', updateDescPreview);
    keywordsInput.addEventListener('input', generateCode);
    authorInput.addEventListener('input', generateCode);

    generateBtn.addEventListener('click', generateCode);

    clearBtn.addEventListener('click', () => {
        urlInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        keywordsInput.value = '';
        authorInput.value = '';

        updateUrlPreview();
        updateTitlePreview();
        updateDescPreview();
        generateCode();
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = codeOutput.textContent;
        if(textToCopy && !textToCopy.includes('Fill the form')) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            });
        }
    });

    function extractDomain(url) {
        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            return urlObj.hostname.replace('www.', '');
        } catch (e) {
            return url; // fallback
        }
    }

    function updateUrlPreview() {
        const url = urlInput.value.trim();
        urlCount.textContent = url.length;

        if (url) {
            prevUrlDesktop.textContent = url;
            prevUrlMobile.textContent = url;
            prevSitenameMobile.textContent = extractDomain(url);
        } else {
            prevUrlDesktop.textContent = DEFAULTS.url;
            prevUrlMobile.textContent = DEFAULTS.url;
            prevSitenameMobile.textContent = DEFAULTS.sitename;
        }
        generateCode();
    }

    function updateTitlePreview() {
        const title = titleInput.value;
        const len = title.length;

        titleCount.textContent = `${len}/${LIMITS.title.optimal}`;

        // Update Progress Bar
        const percent = Math.min((len / LIMITS.title.max) * 100, 100);
        titleProgress.style.width = `${percent}%`;

        titleProgress.className = 'progress-fill';
        titleCount.className = 'char-count';

        if (len > LIMITS.title.optimal && len <= LIMITS.title.max) {
            titleProgress.classList.add('warning');
            titleCount.classList.add('warning');
        } else if (len > LIMITS.title.max) {
            titleProgress.classList.add('error');
            titleCount.classList.add('error');
        }

        // Update Text
        const displayText = title.trim() || DEFAULTS.title;
        prevTitleDesktop.textContent = displayText;
        prevTitleMobile.textContent = displayText;

        generateCode();
    }

    function updateDescPreview() {
        const desc = descInput.value;
        const len = desc.length;

        descCount.textContent = `${len}/${LIMITS.desc.optimal}`;

        // Update Progress Bar
        const percent = Math.min((len / LIMITS.desc.max) * 100, 100);
        descProgress.style.width = `${percent}%`;

        descProgress.className = 'progress-fill';
        descCount.className = 'char-count';

        if (len > LIMITS.desc.optimal && len <= LIMITS.desc.max) {
            descProgress.classList.add('warning');
            descCount.classList.add('warning');
        } else if (len > LIMITS.desc.max) {
            descProgress.classList.add('error');
            descCount.classList.add('error');
        }

        // Update Text
        const displayText = desc.trim() || DEFAULTS.desc;
        prevDescDesktop.textContent = displayText;
        prevDescMobile.textContent = displayText;

        generateCode();
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function generateCode() {
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        const keywords = keywordsInput.value.trim();
        const author = authorInput.value.trim();
        const url = urlInput.value.trim();

        if (!title && !desc && !keywords && !author) {
            codeOutput.innerHTML = '&lt;!-- Fill the form to generate meta tags --&gt;';
            return;
        }

        let html = '';

        if (title) {
            html += `<title>${escapeHtml(title)}</title>\n`;
            html += `<meta property="og:title" content="${escapeHtml(title)}">\n`;
            html += `<meta name="twitter:title" content="${escapeHtml(title)}">\n`;
        }

        if (desc) {
            html += `<meta name="description" content="${escapeHtml(desc)}">\n`;
            html += `<meta property="og:description" content="${escapeHtml(desc)}">\n`;
            html += `<meta name="twitter:description" content="${escapeHtml(desc)}">\n`;
        }

        if (keywords) {
            html += `<meta name="keywords" content="${escapeHtml(keywords)}">\n`;
        }

        if (author) {
            html += `<meta name="author" content="${escapeHtml(author)}">\n`;
        }

        if (url) {
            html += `<link rel="canonical" href="${escapeHtml(url)}">\n`;
            html += `<meta property="og:url" content="${escapeHtml(url)}">\n`;
        }

        // Default additions for a complete snippet
        if (title || desc) {
            html += `<meta property="og:type" content="website">\n`;
            html += `<meta name="twitter:card" content="summary_large_image">\n`;
            html += `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
        }

        codeOutput.textContent = html;
    }
});
