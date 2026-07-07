// Logic for Product Description Optimizer

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('product-name');
    const typeSelect = document.getElementById('product-type');
    const audienceInput = document.getElementById('target-audience');
    const problemInput = document.getElementById('core-problem');
    const featuresInput = document.getElementById('features');
    const includesInput = document.getElementById('whats-included');

    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputArea = document.getElementById('description-output');

    const tabBtns = document.querySelectorAll('.tab-btn');
    let currentFormat = 'gumroad';

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFormat = btn.dataset.format;
            if (nameInput.value) {
                generateDescription();
            }
        });
    });

    function getKeywords(type) {
        if (type === 'digital') {
            return ["instant download", "digital download", "template", "printable", "best", "easy to use"];
        } else if (type === 'course') {
            return ["online course", "masterclass", "tutorial", "step-by-step", "learn", "guide"];
        } else {
            return ["handmade", "high quality", "custom", "unique gift", "best", "premium"];
        }
    }

    function generateDescription() {
        const name = nameInput.value.trim();
        const type = typeSelect.value;
        const audience = audienceInput.value.trim();
        const problem = problemInput.value.trim();

        if (!name || !audience || !problem) {
            alert("Please fill in the Product Name, Target Audience, and Core Problem.");
            return;
        }

        const features = featuresInput.value.trim().split(',').map(s => s.trim()).filter(s => s);
        const includes = includesInput.value.trim().split(',').map(s => s.trim()).filter(s => s);
        const keywords = getKeywords(type);

        let desc = "";

        if (currentFormat === 'gumroad') {
            // Gumroad / Shopify Format: Clean, direct, benefit-driven
            desc += `🚀 Introducing the ultimate ${name}\n\n`;
            desc += `Are you a ${audience} struggling with ${problem.toLowerCase()}? `;
            desc += `Get ready to transform your workflow with this premium ${keywords[0]} ${keywords[2] || 'product'}.\n\n`;

            desc += `✨ WHY YOU NEED THIS\n`;
            desc += `----------------------------------------\n`;
            desc += `This is the ${keywords[4] || 'best'} solution designed specifically for ${audience}. `;
            desc += `It instantly helps you solve the problem of ${problem.toLowerCase()} so you can save time and achieve your goals faster.\n\n`;

            if (features.length > 0) {
                desc += `🔥 TOP FEATURES\n`;
                desc += `----------------------------------------\n`;
                features.forEach(f => {
                    desc += `✅ ${f}\n`;
                });
                desc += `\n`;
            }

            if (includes.length > 0) {
                desc += `📦 WHAT'S INCLUDED (${keywords[1]})\n`;
                desc += `----------------------------------------\n`;
                includes.forEach(i => {
                    desc += `👉 ${i}\n`;
                });
                desc += `\n`;
            }

            desc += `👇 Click "I want this!" to get instant access today!`;

        } else if (currentFormat === 'etsy') {
            // Etsy Format: Keyword stuffed at top, emotional appeal, clear instructions
            desc += `[TITLE IDEA: ${name} | ${audience} ${keywords[0]} | ${keywords[2]} for ${problem.split(' ')[0]} | ${keywords[3]}]\n\n`;

            desc += `Welcome! Looking for the perfect ${keywords[0]} to help with ${problem.toLowerCase()}? You found it! This ${name} is specially created for ${audience}.\n\n`;

            desc += `IMPORTANT: This is a ${keywords[1]}. No physical item will be shipped.\n\n`;

            if (features.length > 0) {
                desc += `🌟 FEATURES & BENEFITS:\n`;
                features.forEach(f => {
                    desc += `- ${f}\n`;
                });
                desc += `\n`;
            }

            if (includes.length > 0) {
                desc += `📁 WHAT YOU WILL RECEIVE:\n`;
                includes.forEach(i => {
                    desc += `✔ ${i}\n`;
                });
                desc += `\n`;
            }

            desc += `HOW TO USE:\n`;
            desc += `1. Purchase the listing.\n`;
            desc += `2. Download the files instantly from your purchases page.\n`;
            desc += `3. Enjoy your new ${keywords[2] || 'item'}!\n\n`;

            desc += `Tags (for Etsy SEO):\n`;
            const tags = [name.split(' ')[0], audience.split(' ')[0], ...keywords].join(', ');
            desc += `${tags}\n`;
        }

        outputArea.value = desc;
    }

    generateBtn.addEventListener('click', generateDescription);

    clearBtn.addEventListener('click', () => {
        nameInput.value = '';
        audienceInput.value = '';
        problemInput.value = '';
        featuresInput.value = '';
        includesInput.value = '';
        typeSelect.value = 'digital';
        outputArea.value = '';
    });

    copyBtn.addEventListener('click', () => {
        if (outputArea.value && !outputArea.value.includes('Fill in your product')) {
            outputArea.select();
            navigator.clipboard.writeText(outputArea.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            });
        }
    });
});