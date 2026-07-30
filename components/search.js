// List of all tools available for search
const TOOLS_DATABASE = [
    { title: 'Grammar Checker', url: '/tools/grammar-checker/index.html', desc: 'Correct grammar, spelling, and style errors instantly.', tags: ['text', 'writing', 'spell', 'english'] },
    { title: 'Text Summarizer', url: '/tools/text-summarizer/index.html', desc: 'Summarize text, extract keywords, and check readability.', tags: ['text', 'summary', 'ai', 'writing'] },
    { title: 'Text Formatter', url: '/tools/text-formatter/index.html', desc: 'Format, clean, and transform your text instantly.', tags: ['text', 'clean', 'format', 'tools'] },
    { title: 'Text Case Converter', url: '/tools/text-case-converter/index.html', desc: 'Convert text into uppercase, lowercase, title case, and more.', tags: ['text', 'case', 'upper', 'lower', 'capitalize'] },
    { title: 'Word & Character Counter', url: '/tools/word-character-counter/index.html', desc: 'Count words, characters, spaces, and sentences in real time.', tags: ['text', 'count', 'length', 'seo'] },

    { title: 'Image Format Converter', url: '/tools/image-format-converter/index.html', desc: 'Convert images to JPEG, PNG, GIF, BMP, TIFF, WebP.', tags: ['image', 'convert', 'format', 'png', 'jpg'] },
    { title: 'Image Background Remover', url: '/tools/image-background-remover/index.html', desc: 'Remove image backgrounds automatically with private AI.', tags: ['image', 'bg', 'remove', 'transparent', 'ai'] },
    { title: 'Image Compressor', url: '/tools/image-compressor/index.html', desc: 'Compress images without losing quality.', tags: ['image', 'compress', 'size', 'reduce'] },
    { title: 'Compress Image to KB', url: '/tools/compress-image-to-kb/index.html', desc: 'Resize photos to exactly 10KB, 20KB, 50KB for forms.', tags: ['image', 'compress', 'size', 'kb', 'form', 'signature'] },
    { title: 'Image Upscaler', url: '/tools/image-upscaler/index.html', desc: 'Enlarge images up to 8x without losing quality.', tags: ['image', 'upscale', 'enlarge', 'resize', 'enhance'] },
    { title: 'Image to Text (OCR)', url: '/tools/image-to-text-converter/index.html', desc: 'Extract English & Hindi text from images privately.', tags: ['image', 'ocr', 'text', 'extract', 'scan'] },

    { title: 'Meta Tag Generator', url: '/tools/meta-tag-generator/index.html', desc: 'Generate SEO meta tags and preview Google SERP snippets.', tags: ['seo', 'meta', 'tags', 'google', 'search'] },
    { title: 'Robots.txt Generator', url: '/tools/robots-txt-generator/index.html', desc: 'Easily create robots.txt files.', tags: ['seo', 'robots', 'crawler'] },
    { title: 'Schema Markup Generator', url: '/tools/schema-markup-generator/index.html', desc: 'Generate valid JSON-LD structured data.', tags: ['seo', 'schema', 'json', 'rich snippets'] },
    { title: 'XML Sitemap Generator', url: '/tools/xml-sitemap-generator/index.html', desc: 'Create sitemap.xml files from URL lists.', tags: ['seo', 'sitemap', 'xml'] },
    { title: 'SEO Slug Generator', url: '/tools/slug-generator/index.html', desc: 'Convert article titles into clean, SEO-friendly URLs.', tags: ['seo', 'slug', 'url', 'clean'] },
    { title: 'Keyword Density Checker', url: '/tools/keyword-density-checker/index.html', desc: 'Analyze your content for optimal keyword usage.', tags: ['seo', 'keyword', 'density', 'analyze'] },
    { title: 'Heading Extractor', url: '/tools/heading-extractor/index.html', desc: 'Check HTML heading hierarchy for SEO.', tags: ['seo', 'h1', 'heading', 'extract'] },
    { title: 'Image Alt Text Checker', url: '/tools/image-alt-checker/index.html', desc: 'Find missing alt attributes in your HTML.', tags: ['seo', 'image', 'alt', 'check'] },

    { title: 'URL Encoder / Decoder', url: '/tools/url-encoder-decoder/index.html', desc: 'Encode or decode URLs to handle special characters safely.', tags: ['web', 'url', 'encode', 'decode'] },
    { title: 'UTM Link Builder', url: '/tools/utm-link-builder/index.html', desc: 'Create custom tracking URLs for your campaigns.', tags: ['web', 'utm', 'marketing', 'track'] },
    { title: 'QR Code Generator', url: '/tools/qr-code-generator/index.html', desc: 'Generate custom QR codes for URLs, text, and Wi-Fi instantly.', tags: ['web', 'qr', 'code', 'generate'] },

    { title: 'Social Media SEO Post Generator', url: '/tools/social-media-seo-generator/index.html', desc: 'Generate optimized social media posts and hashtags.', tags: ['social', 'seo', 'instagram', 'youtube', 'hashtags'] },
    { title: 'Stock Media SEO Generator', url: '/tools/stock-media-seo-generator/index.html', desc: 'Generate optimized titles, tags, and descriptions for stock photos & videos.', tags: ['social', 'stock', 'photo', 'video', 'shutterstock', 'tags'] },
    { title: 'Social Media Hashtag Generator', url: '/tools/hashtag-generator/index.html', desc: 'Generate trending hashtags for Instagram, TikTok & YouTube.', tags: ['social', 'hashtag', 'generate'] },
    { title: 'LinkedIn Headline Generator', url: '/tools/linkedin-headline-generator/index.html', desc: 'Create SEO-optimized headlines for professional profiles.', tags: ['social', 'linkedin', 'profile', 'headline'] },
    { title: 'Product Description Optimizer', url: '/tools/product-description-optimizer/index.html', desc: 'Create SEO-friendly descriptions for Gumroad & Etsy.', tags: ['social', 'product', 'ecommerce', 'description'] },
    { title: 'GitHub README Generator', url: '/tools/github-readme-generator/index.html', desc: 'Generate professional README files for your repos.', tags: ['dev', 'github', 'readme', 'markdown'] },

    { title: 'Age Calculator', url: '/tools/age-calculator/index.html', desc: 'Calculate age precisely.', tags: ['calc', 'age', 'date'] },
    { title: 'BMI Calculator', url: '/tools/bmi-calculator/index.html', desc: 'Calculate Body Mass Index.', tags: ['calc', 'bmi', 'health'] },

    { title: 'Password Generator', url: '/tools/password-generator/index.html', desc: 'Generate strong and unique passwords to secure your accounts.', tags: ['security', 'password', 'generate', 'strong'] }
];

function initGlobalSearch(rootPrefix) {
    const searchBtn = document.getElementById('global-search-btn');
    const searchModal = document.getElementById('global-search-modal');
    const closeBtn = document.getElementById('close-search-btn');
    const searchInput = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('global-search-results');

    if (!searchBtn || !searchModal) return;

    // Open Search Modal
    searchBtn.addEventListener('click', () => {
        searchModal.classList.remove('hidden');
        searchInput.value = '';
        renderResults([]); // clear previous
        setTimeout(() => searchInput.focus(), 50);
    });

    // Close Search Modal
    const closeModal = () => {
        searchModal.classList.add('hidden');
    };

    closeBtn.addEventListener('click', closeModal);
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeModal();
    });

    // Handle Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            renderResults([]);
            return;
        }

        const results = TOOLS_DATABASE.filter(tool => {
            const inTitle = tool.title.toLowerCase().includes(query);
            const inDesc = tool.desc.toLowerCase().includes(query);
            const inTags = tool.tags.some(tag => tag.toLowerCase().includes(query));
            return inTitle || inDesc || inTags;
        });

        renderResults(results);
    });

    function renderResults(results) {
        resultsContainer.innerHTML = '';

        if (results.length === 0 && searchInput.value.trim().length >= 2) {
            resultsContainer.innerHTML = '<li class="no-results">No tools found matching your search.</li>';
            return;
        }

        results.forEach(tool => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            // Adjust URL based on current depth
            // tool.url starts with /tools/, so we strip the leading slash and prepend rootPrefix
            a.href = rootPrefix + tool.url.substring(1);

            a.innerHTML = `
                <span class="result-title">${tool.title}</span>
                <span class="result-desc">${tool.desc}</span>
            `;

            a.addEventListener('click', () => closeModal());

            li.appendChild(a);
            resultsContainer.appendChild(li);
        });
    }
}