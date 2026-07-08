// Logic for XML Sitemap Generator

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const urlCountEl = document.getElementById('url-count');

    const changeFreqSelect = document.getElementById('changefreq');
    const prioritySelect = document.getElementById('priority');
    const includeDateCheck = document.getElementById('include-date');

    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const xmlOutput = document.getElementById('xml-output');

    urlInput.addEventListener('input', () => {
        const urls = getValidUrls(urlInput.value);
        urlCountEl.textContent = `${urls.length} URLs`;
    });

    function getValidUrls(text) {
        return text.split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0 && u.startsWith('http'));
    }

    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    }

    function generateSitemap() {
        const urls = getValidUrls(urlInput.value);

        if (urls.length === 0) {
            alert("Please enter at least one valid URL starting with http:// or https://");
            return;
        }

        const freq = changeFreqSelect.value;
        const prio = prioritySelect.value;
        const includeDate = includeDateCheck.checked;
        const today = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        urls.forEach(url => {
            xml += `  <url>\n`;
            xml += `    <loc>${escapeXml(url)}</loc>\n`;
            if (includeDate) {
                xml += `    <lastmod>${today}</lastmod>\n`;
            }
            xml += `    <changefreq>${freq}</changefreq>\n`;
            xml += `    <priority>${prio}</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;

        xmlOutput.value = xml;
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
    }

    generateBtn.addEventListener('click', generateSitemap);

    clearBtn.addEventListener('click', () => {
        urlInput.value = '';
        urlInput.dispatchEvent(new Event('input'));
        xmlOutput.value = '';
        copyBtn.disabled = true;
        downloadBtn.disabled = true;
    });

    copyBtn.addEventListener('click', () => {
        if (xmlOutput.value) {
            xmlOutput.select();
            navigator.clipboard.writeText(xmlOutput.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            });
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (!xmlOutput.value) return;

        const blob = new Blob([xmlOutput.value], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});