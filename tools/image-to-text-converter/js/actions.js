// Output actions logic (Copy, Download)

const Actions = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        const copyBtn = document.getElementById('copy-btn');
        const downloadBtn = document.getElementById('download-btn');
        const textOutput = document.getElementById('text-output');

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(textOutput.value);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
                Analytics.trackEvent('copy_text', { tool: 'image_to_text' });
            } catch (err) {
                console.error('Failed to copy!', err);
                alert('Failed to copy text. Please select manually.');
            }
        });

        downloadBtn.addEventListener('click', () => {
            const text = textOutput.value;
            if (!text) return;

            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `extracted_text_${new Date().getTime()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            Analytics.trackEvent('download_text', { tool: 'image_to_text' });
        });
    }
};

window.Actions = Actions;