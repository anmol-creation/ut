document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const topicInput = document.getElementById('topicInput');
    const keywordInput = document.getElementById('keywordInput');
    const toneSelect = document.getElementById('toneSelect');
    const outputContainer = document.getElementById('outputContainer');
    const platformCheckboxes = document.querySelectorAll('.platform-cb');

    // Visual feedback for checkboxes
    platformCheckboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            const label = e.target.closest('.checkbox-label');
            if (e.target.checked) {
                label.style.borderColor = 'var(--color-primary)';
                label.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
            } else {
                label.style.borderColor = 'var(--color-border)';
                label.style.backgroundColor = 'var(--color-surface)';
            }
        });

        // Trigger initial state
        cb.dispatchEvent(new Event('change'));
    });

    clearBtn.addEventListener('click', () => {
        topicInput.value = '';
        keywordInput.value = '';
        toneSelect.value = 'casual';
        outputContainer.innerHTML = `
            <div class="empty-state">
                <p>Fill out the form and click "Generate" to see platform-specific optimized posts here.</p>
            </div>
        `;
    });

    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        const keywords = keywordInput.value.split(',').map(k => k.trim()).filter(k => k);
        const tone = toneSelect.value;

        const selectedPlatforms = Array.from(platformCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (!topic) {
            alert('Please enter a topic or base content.');
            return;
        }

        if (selectedPlatforms.length === 0) {
            alert('Please select at least one platform.');
            return;
        }

        outputContainer.innerHTML = ''; // Clear previous output

        selectedPlatforms.forEach(platform => {
            const generatedContent = generatePlatformContent(platform, topic, keywords, tone);
            const platformCard = createPlatformCard(platform, generatedContent);
            outputContainer.appendChild(platformCard);
        });
    });

    function generateHashtags(keywords, platform) {
        if (!keywords || keywords.length === 0) return '';

        // Clean keywords to make hashtags
        const baseTags = keywords.map(k => '#' + k.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());

        let platformTags = [...baseTags];

        // Add platform specific generic tags
        if (platform === 'instagram') {
            platformTags.push('#instagood', '#explorepage', '#viral');
            // Instagram allows up to 30, we'll give a solid block
            while(platformTags.length < 15 && baseTags.length > 0) {
                 // duplicate some base ones with variations for volume if needed, but simple for now
                 break;
            }
        } else if (platform === 'youtube') {
            platformTags.push('#shorts', '#youtube'); // Only keeping a few for YT
            platformTags = platformTags.slice(0, 5); // YouTube likes 3-5 tags best
        } else if (platform === 'twitter' || platform === 'threads') {
            platformTags = platformTags.slice(0, 3); // Keep it minimal
        } else if (platform === 'linkedin') {
            platformTags.push('#professional', '#networking');
            platformTags = platformTags.slice(0, 5);
        } else if (platform === 'pinterest') {
            platformTags.push('#inspiration', '#ideas');
        }

        // Deduplicate
        platformTags = [...new Set(platformTags)];

        return platformTags.join(' ');
    }

    function applyTone(text, tone, platform) {
        let prefix = '';
        let suffix = '';

        switch(tone) {
            case 'enthusiastic':
                prefix = '🚀 SO EXCITED to share this! \n\n';
                if(platform === 'instagram') suffix = '\n\nDrop a 🔥 below if you agree!';
                break;
            case 'professional':
                prefix = 'Industry Insight: \n\n';
                suffix = '\n\nWhat are your thoughts on this? Let us connect in the comments.';
                break;
            case 'informative':
                prefix = '📌 Did you know?\n\n';
                suffix = '\n\nSave this post for later!';
                break;
            case 'casual':
            default:
                prefix = 'Hey guys! 👋\n\n';
                break;
        }
        return prefix + text + suffix;
    }

    function generatePlatformContent(platform, baseText, keywords, tone) {
        let content = applyTone(baseText, tone, platform);
        let hashtags = generateHashtags(keywords, platform);
        let finalOutput = '';

        switch(platform) {
            case 'instagram':
                // Engaging, uses emojis, separated hashtags
                finalOutput = content + '\n\n.\n.\n.\n' + hashtags;
                break;
            case 'facebook':
                // Conversational, fewer tags, maybe a link placeholder
                finalOutput = content + '\n\nRead more here: [Insert Link]\n\n' + hashtags;
                break;
            case 'youtube':
                // Structured description
                finalOutput = `Title Idea: [Catchy Title based on ${keywords[0] || 'Topic'}]\n\n` +
                              `${content}\n\n` +
                              `🔔 Don't forget to subscribe for more!\n` +
                              `🔗 Links mentioned:\n- [Link 1]\n- [Link 2]\n\n` +
                              `Timestamps:\n0:00 - Intro\n1:00 - Main Topic\n\n` +
                              hashtags;
                break;
            case 'twitter':
                // Short, punchy, integrated tags if possible
                let twText = content;
                if(twText.length > 200) {
                    twText = twText.substring(0, 197) + '...';
                }
                finalOutput = twText + '\n\n' + hashtags;
                break;
            case 'threads':
                // Conversational, similar to twitter but slightly more relaxed
                let thText = content;
                if(thText.length > 400) {
                    thText = thText.substring(0, 397) + '...';
                }
                finalOutput = thText + '\n\n' + hashtags;
                break;
            case 'pinterest':
                // Keyword heavy, descriptive
                finalOutput = `Pin Title: Beautiful ideas for ${keywords[0] || 'your next project'}\n\n` +
                              `${content}\n\nClick the link to learn more!\n\n` +
                              hashtags;
                break;
            case 'linkedin':
                // Professional formatting
                finalOutput = content.replace(/\n/g, '\n\n') + '\n\n' + hashtags;
                break;
            default:
                finalOutput = content + '\n\n' + hashtags;
        }

        return finalOutput;
    }

    function getPlatformIcon(platform) {
        // Fallback text or simple emojis if custom SVG icons aren't available
        const icons = {
            instagram: '📸',
            facebook: '📘',
            youtube: '▶️',
            twitter: '🐦',
            pinterest: '📌',
            threads: '🧵',
            linkedin: '💼'
        };
        return icons[platform] || '📱';
    }

    function createPlatformCard(platform, content) {
        const charCount = content.length;
        const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

        const div = document.createElement('div');
        div.className = 'platform-result-card';
        div.innerHTML = `
            <div class="platform-header">
                <h3>${getPlatformIcon(platform)} ${platformName}</h3>
            </div>
            <div class="platform-body">
                <textarea class="generated-text" readonly id="res_${platform}">${content}</textarea>
                <div class="stats-bar">
                    <span>${charCount} Characters</span>
                    <span>${wordCount} Words</span>
                </div>
                <button class="btn btn-secondary copy-btn" data-target="res_${platform}">
                    Copy ${platformName} Post
                </button>
            </div>
        `;

        // Copy functionality
        const copyBtn = div.querySelector('.copy-btn');
        copyBtn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const textArea = document.getElementById(targetId);
            textArea.select();
            document.execCommand('copy');

            const originalText = e.target.textContent;
            e.target.textContent = 'Copied!';
            e.target.classList.add('btn-primary');
            e.target.classList.remove('btn-secondary');

            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.classList.remove('btn-primary');
                e.target.classList.add('btn-secondary');
            }, 2000);
        });

        return div;
    }
});
