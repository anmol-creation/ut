// Logic for Slug Generator

const STOP_WORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"
]);

document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title-input');
    const slugOutput = document.getElementById('slug-output');
    const copyBtn = document.getElementById('copy-btn');

    // Options
    const removeStopWordsCheck = document.getElementById('remove-stop-words');
    const removeNumbersCheck = document.getElementById('remove-numbers');
    const separatorSelect = document.getElementById('separator');

    function generateSlug() {
        let text = titleInput.value.trim();

        if (!text) {
            slugOutput.textContent = 'your-seo-friendly-slug-will-appear-here';
            slugOutput.style.color = 'var(--text-secondary)';
            return;
        }

        // Convert to lowercase
        text = text.toLowerCase();

        // Option: Remove Numbers
        if (removeNumbersCheck.checked) {
            text = text.replace(/[0-9]/g, '');
        }

        // Remove apostrophes completely so "don't" becomes "dont" instead of "don-t"
        text = text.replace(/['']/g, '');

        // Replace non-alphanumeric characters with spaces (Unicode aware)
        text = text.replace(/[^\p{L}\p{N}]+/gu, ' ');

        // Split into words
        let words = text.split(/\s+/).filter(w => w.length > 0);

        // Option: Remove Stop Words
        if (removeStopWordsCheck.checked) {
            words = words.filter(word => !STOP_WORDS.has(word));
        }

        // Join with separator
        const separator = separatorSelect.value;
        const slug = words.join(separator);

        if (slug) {
            slugOutput.textContent = slug;
            slugOutput.style.color = '#10b981'; // Green
        } else {
            slugOutput.textContent = 'invalid-input';
            slugOutput.style.color = '#ef4444'; // Red
        }
    }

    // Event Listeners
    titleInput.addEventListener('input', generateSlug);
    removeStopWordsCheck.addEventListener('change', generateSlug);
    removeNumbersCheck.addEventListener('change', generateSlug);
    separatorSelect.addEventListener('change', generateSlug);

    copyBtn.addEventListener('click', () => {
        const textToCopy = slugOutput.textContent;
        if (textToCopy && textToCopy !== 'your-seo-friendly-slug-will-appear-here' && textToCopy !== 'invalid-input') {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.style.backgroundColor = '#10b981';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.backgroundColor = '';
                }, 2000);
            });
        }
    });
});