document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const topicInput = document.getElementById('topicInput');
    const categorySelect = document.getElementById('categorySelect');
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
        cb.dispatchEvent(new Event('change'));
    });

    clearBtn.addEventListener('click', () => {
        topicInput.value = '';
        categorySelect.value = 'general';
        toneSelect.value = 'casual';
        outputContainer.innerHTML = `
            <div class="empty-state">
                <p>Fill out the form and click "Generate" to see platform-specific optimized posts here.</p>
            </div>
        `;
    });

    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        const category = categorySelect.value;
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
            const generatedContent = generatePlatformContent(platform, topic, category, tone);
            const platformCard = createPlatformCard(platform, generatedContent);
            outputContainer.appendChild(platformCard);
        });
    });

    // Smart Dictionary
    const categoryData = {
        general: {
            tags: ['#lifestyle', '#dailyvlog', '#life', '#explore', '#foryou', '#trending'],
            hook: ['Check this out: ', 'Life updates: ', 'Just sharing my thoughts on ']
        },
        photography: {
            tags: ['#photography', '#picoftheday', '#visualart', '#lensculture', '#photooftheday', '#artofvisuals'],
            hook: ['Capturing the beauty of ', 'Through the lens: ', 'Visuals that speak volumes about ']
        },
        tech: {
            tags: ['#coding', '#tech', '#software', '#developer', '#technology', '#innovation'],
            hook: ['Tech talk: ', 'Diving deep into the world of ', 'Latest updates on ']
        },
        business: {
            tags: ['#business', '#entrepreneur', '#marketing', '#success', '#mindset', '#growth'],
            hook: ['Business insights: ', 'Let\'s talk strategy for ', 'Scaling up with ']
        },
        education: {
            tags: ['#education', '#learning', '#knowledge', '#study', '#student', '#tips'],
            hook: ['Did you know? ', 'Today\'s learning: ', 'A quick guide to ']
        },
        fitness: {
            tags: ['#fitness', '#health', '#workout', '#gym', '#fitfam', '#wellness'],
            hook: ['Pushing limits with ', 'Fitness journey update: ', 'Staying healthy by focusing on ']
        },
        food: {
            tags: ['#foodie', '#foodporn', '#instafood', '#recipe', '#yummy', '#delicious'],
            hook: ['Tasting the magic of ', 'Recipe alert: ', 'Cravings satisfied with ']
        },
        travel: {
            tags: ['#travel', '#wanderlust', '#explore', '#adventure', '#travelphotography', '#vacation'],
            hook: ['Exploring new horizons: ', 'Travel diary: ', 'Wandering around ']
        },
        music: {
            tags: ['#music', '#artist', '#beats', '#song', '#musician', '#newmusic'],
            hook: ['Vibing to ', 'The rhythm of ', 'Musical notes on ']
        },
        comedy: {
            tags: ['#comedy', '#funny', '#memes', '#humor', '#lol', '#hilarious'],
            hook: ['You won\'t believe this: ', 'Just for laughs: ', 'The funny side of ']
        }
    };

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateHashtags(category, platform) {
        let tags = categoryData[category] ? [...categoryData[category].tags] : [...categoryData['general'].tags];

        if (platform === 'instagram') {
            tags.push('#instagood', '#viral');
        } else if (platform === 'youtube') {
            tags.push('#shorts', '#subscribe');
            tags = tags.slice(0, 5);
        } else if (platform === 'twitter' || platform === 'threads') {
            tags = tags.slice(0, 3);
        } else if (platform === 'linkedin') {
            tags.push('#professional', '#networking');
            tags = tags.slice(0, 5);
        } else if (platform === 'pinterest') {
            tags.push('#inspiration', '#ideas');
            tags = tags.slice(0, 6);
        }

        // Shuffle and deduplicate
        tags = [...new Set(tags)].sort(() => 0.5 - Math.random());
        return tags.join(' ');
    }

    function generateSmartContent(topic, category, tone) {
        const data = categoryData[category] || categoryData['general'];
        const hook = getRandomItem(data.hook);

        let prefix = '';
        let suffix = '';

        switch(tone) {
            case 'enthusiastic':
                prefix = '🚀 SO EXCITED to share this! \n\n';
                suffix = '\n\nDrop a 🔥 below if you agree!';
                break;
            case 'professional':
                prefix = 'Industry Insight: \n\n';
                suffix = '\n\nWhat are your thoughts on this? Let us connect in the comments.';
                break;
            case 'informative':
                prefix = '📌 Important update:\n\n';
                suffix = '\n\nSave this post for later reference!';
                break;
            case 'casual':
            default:
                prefix = 'Hey guys! 👋\n\n';
                suffix = '\n\nLet me know your thoughts!';
                break;
        }

        // Smart template assembly
        const body = `${hook}"${topic}". It's fascinating how much there is to explore here.`;

        return `${prefix}${body}${suffix}`;
    }

    function generatePlatformContent(platform, topic, category, tone) {
        let content = generateSmartContent(topic, category, tone);
        let hashtags = generateHashtags(category, platform);
        let finalOutput = '';

        switch(platform) {
            case 'instagram':
                finalOutput = content + '\n\n.\n.\n.\n' + hashtags;
                break;
            case 'facebook':
                finalOutput = content + '\n\nRead more here: [Insert Link]\n\n' + hashtags;
                break;
            case 'youtube':
                finalOutput = `Title Idea: The Ultimate Guide to ${topic}\n\n` +
                              `${content}\n\n` +
                              `🔔 Don't forget to subscribe for more!\n` +
                              `🔗 Links mentioned:\n- [Link 1]\n- [Link 2]\n\n` +
                              `Timestamps:\n0:00 - Intro\n1:00 - Main Topic\n\n` +
                              hashtags;
                break;
            case 'twitter':
                // Smart truncation avoiding cutting words
                let twText = content;
                if(twText.length > 200) {
                    twText = twText.substring(0, 197);
                    twText = twText.substring(0, Math.min(twText.length, twText.lastIndexOf(" "))) + '...';
                }
                finalOutput = twText + '\n\n' + hashtags;
                break;
            case 'threads':
                let thText = content;
                if(thText.length > 400) {
                    thText = thText.substring(0, 397);
                    thText = thText.substring(0, Math.min(thText.length, thText.lastIndexOf(" "))) + '...';
                }
                finalOutput = thText + '\n\n' + hashtags;
                break;
            case 'pinterest':
                finalOutput = `Pin Title: Beautiful ideas for ${topic}\n\n` +
                              `${content}\n\nClick the link to learn more!\n\n` +
                              hashtags;
                break;
            case 'linkedin':
                finalOutput = content.replace(/\n/g, '\n\n') + '\n\n' + hashtags;
                break;
            default:
                finalOutput = content + '\n\n' + hashtags;
        }

        return finalOutput;
    }

    function getPlatformIcon(platform) {
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

        // Modern Copy functionality
        const copyBtn = div.querySelector('.copy-btn');
        copyBtn.addEventListener('click', async (e) => {
            const targetId = e.target.getAttribute('data-target');
            const textArea = document.getElementById(targetId);
            const textToCopy = textArea.value;

            try {
                await navigator.clipboard.writeText(textToCopy);

                const originalText = e.target.textContent;
                e.target.textContent = 'Copied!';
                e.target.classList.add('btn-primary');
                e.target.classList.remove('btn-secondary');

                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.classList.remove('btn-primary');
                    e.target.classList.add('btn-secondary');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy. Please manually copy the text.');
            }
        });

        return div;
    }
});
