// Logic for UTM Link Builder

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('utm-form');
    const urlInput = document.getElementById('url-input');
    const sourceInput = document.getElementById('utm-source');
    const mediumInput = document.getElementById('utm-medium');
    const campaignInput = document.getElementById('utm-campaign');
    const termInput = document.getElementById('utm-term');
    const contentInput = document.getElementById('utm-content');

    const outputArea = document.getElementById('generated-url');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    function generateUTM() {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        let baseUrl = urlInput.value.trim();

        // Ensure protocol exists
        if (baseUrl && !/^https?:\/\//i.test(baseUrl)) {
            baseUrl = 'https://' + baseUrl;
        }

        try {
            const url = new URL(baseUrl);

            const params = new URLSearchParams(url.search);

            const source = sourceInput.value.trim();
            const medium = mediumInput.value.trim();
            const campaign = campaignInput.value.trim();
            const term = termInput.value.trim();
            const content = contentInput.value.trim();

            if (source) params.set('utm_source', source);
            if (medium) params.set('utm_medium', medium);
            if (campaign) params.set('utm_campaign', campaign);
            if (term) params.set('utm_term', term);
            if (content) params.set('utm_content', content);

            // Reconstruct URL carefully preserving hash if any
            const searchString = params.toString();
            const hash = url.hash;

            // Rebuild
            let finalUrl = `${url.origin}${url.pathname}`;
            if (searchString) finalUrl += `?${searchString}`;
            if (hash) finalUrl += hash;

            outputArea.value = finalUrl;
            copyBtn.disabled = false;

        } catch (e) {
            outputArea.value = "Invalid Website URL. Please enter a valid URL like https://www.example.com";
            copyBtn.disabled = true;
        }
    }

    form.addEventListener('submit', generateUTM);

    // Auto-generate on input changes after first generation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (!copyBtn.disabled && outputArea.value) {
                // If it's already generated and valid, keep auto-updating
                if(urlInput.value && sourceInput.value && mediumInput.value && campaignInput.value) {
                     generateUTM();
                }
            }
        });
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
        outputArea.value = '';
        copyBtn.disabled = true;
    });

    copyBtn.addEventListener('click', () => {
        if (outputArea.value) {
            outputArea.select();
            navigator.clipboard.writeText(outputArea.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            });
        }
    });
});