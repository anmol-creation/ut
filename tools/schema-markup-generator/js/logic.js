// Logic for Schema Markup Generator

document.addEventListener('DOMContentLoaded', () => {
    const typeSelect = document.getElementById('schema-type');
    const forms = document.querySelectorAll('.schema-form');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputArea = document.getElementById('schema-output');

    // Toggle forms
    typeSelect.addEventListener('change', () => {
        forms.forEach(f => f.classList.remove('active'));
        document.getElementById(`form-${typeSelect.value}`).classList.add('active');
        outputArea.value = '';
    });

    // FAQ dynamic logic
    const faqContainer = document.getElementById('faq-container');
    const addFaqBtn = document.getElementById('add-faq-btn');

    function createFaqItem() {
        const div = document.createElement('div');
        div.className = 'faq-item';
        div.innerHTML = `
            <button class="btn-remove-faq" title="Remove Question">×</button>
            <div class="form-group required">
                <label>Question</label>
                <input type="text" class="w-full faq-q" placeholder="What is Project UT?">
            </div>
            <div class="form-group required" style="margin-bottom:0;">
                <label>Answer</label>
                <textarea class="w-full faq-a" rows="2" placeholder="It is a collection of free online utility tools."></textarea>
            </div>
        `;

        div.querySelector('.btn-remove-faq').addEventListener('click', () => {
            div.remove();
        });

        return div;
    }

    addFaqBtn.addEventListener('click', () => {
        faqContainer.appendChild(createFaqItem());
    });

    // Add one FAQ by default
    faqContainer.appendChild(createFaqItem());

    // Generator Logic
    function generateSchema() {
        const type = typeSelect.value;
        let schema = {};

        if (type === 'article') {
            const url = document.getElementById('art-url').value.trim();
            const headline = document.getElementById('art-headline').value.trim();
            const image = document.getElementById('art-image').value.trim();
            const author = document.getElementById('art-author').value.trim();
            const datePublished = document.getElementById('art-date').value;

            if (!url || !headline) {
                alert("Article URL and Headline are required.");
                return;
            }

            schema = {
                "@context": "https://schema.org",
                "@type": "Article",
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": url
                },
                "headline": headline
            };

            if (image) schema.image = [image];
            if (datePublished) schema.datePublished = datePublished;
            if (author) {
                schema.author = {
                    "@type": "Person",
                    "name": author
                };
            }
        }
        else if (type === 'faq') {
            const items = faqContainer.querySelectorAll('.faq-item');
            const mainEntity = [];

            items.forEach(item => {
                const q = item.querySelector('.faq-q').value.trim();
                const a = item.querySelector('.faq-a').value.trim();
                if (q && a) {
                    mainEntity.push({
                        "@type": "Question",
                        "name": q,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": a
                        }
                    });
                }
            });

            if (mainEntity.length === 0) {
                alert("Please add at least one valid Question and Answer.");
                return;
            }

            schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": mainEntity
            };
        }
        else if (type === 'local') {
            const name = document.getElementById('loc-name').value.trim();
            const image = document.getElementById('loc-image').value.trim();
            const phone = document.getElementById('loc-phone').value.trim();
            const street = document.getElementById('loc-street').value.trim();
            const city = document.getElementById('loc-city').value.trim();
            const zip = document.getElementById('loc-zip').value.trim();
            const country = document.getElementById('loc-country').value.trim();

            if (!name) {
                alert("Business Name is required.");
                return;
            }

            schema = {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": name
            };

            if (image) schema.image = image;
            if (phone) schema.telephone = phone;

            if (street || city || zip || country) {
                schema.address = {
                    "@type": "PostalAddress",
                    "streetAddress": street,
                    "addressLocality": city,
                    "postalCode": zip,
                    "addressCountry": country
                };
            }
        }

        const scriptTag = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
        outputArea.value = scriptTag;
    }

    generateBtn.addEventListener('click', generateSchema);

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