import { convertImage } from '../logic/converter.js';

export function initUI() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectBtn = document.getElementById('select-files-btn');
    const landingView = document.getElementById('landing-view');
    const activeView = document.getElementById('active-view');
    const addMoreBtn = document.getElementById('add-more-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const fileListContainer = document.getElementById('file-list');
    const convertBtn = document.getElementById('convert-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const formatSelect = document.getElementById('format-select');
    const qualityGroup = document.getElementById('quality-group');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const maintainAspectCheckbox = document.getElementById('maintain-aspect');

    // State
    let filesState = []; // Array of { id, file, status, blob, url, originalUrl }
    let nextId = 1;

    // --- Event Listeners ---

    // File Selection
    selectBtn.addEventListener('click', () => fileInput.click());
    addMoreBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
        fileInput.value = ''; // Reset to allow same file selection
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // Reset / Clear
    clearAllBtn.addEventListener('click', () => {
        clearFiles();
        // If clear all is clicked in active view, we go back to landing if no files
        landingView.classList.remove('hidden');
        activeView.classList.add('hidden');
    });

    // Format Change - Toggle Quality Slider
    formatSelect.addEventListener('change', () => {
        const format = formatSelect.value;
        if (format === 'image/jpeg' || format === 'image/webp') {
            qualityGroup.classList.remove('hidden');
        } else {
            qualityGroup.classList.add('hidden');
        }
    });

    // Quality Slider
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });

    // Convert
    convertBtn.addEventListener('click', convertAll);

    // Download All
    downloadAllBtn.addEventListener('click', downloadAll);


    // --- Functions ---

    function handleFiles(fileList) {
        if (filesState.length === 0) {
            landingView.classList.add('hidden');
            activeView.classList.remove('hidden');
        }

        Array.from(fileList).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const fileObj = {
                id: nextId++,
                file: file,
                status: 'pending', // pending, processing, done, error
                blob: null,
                url: null,
                originalUrl: URL.createObjectURL(file)
            };
            filesState.push(fileObj);
        });

        renderFileList();

        // If this is the first file, auto-set resize inputs based on it?
        // Maybe not for batch processing as they might be different sizes.
        // We'll leave inputs blank (optional).
    }

    function clearFiles() {
        filesState.forEach(f => {
            if (f.url) URL.revokeObjectURL(f.url);
            if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
        });
        filesState = [];
        renderFileList();
        downloadAllBtn.classList.add('hidden');
    }

    function removeFile(id) {
        const index = filesState.findIndex(f => f.id === id);
        if (index !== -1) {
            const f = filesState[index];
            if (f.url) URL.revokeObjectURL(f.url);
            if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
            filesState.splice(index, 1);
            renderFileList();

            if (filesState.length === 0) {
                landingView.classList.remove('hidden');
                activeView.classList.add('hidden');
            }
        }
    }

    function renderFileList() {
        fileListContainer.innerHTML = '';

        filesState.forEach(f => {
            const item = document.createElement('div');
            item.className = 'file-item';

            let statusClass = `status-${f.status}`;
            let statusText = f.status.charAt(0).toUpperCase() + f.status.slice(1);
            if (f.status === 'done') statusText = 'Converted';

            const sizeText = f.blob ? formatSize(f.blob.size) : formatSize(f.file.size);

            item.innerHTML = `
                <div class="file-left">
                    <img src="${f.originalUrl}" class="file-preview-thumb" alt="Preview">
                    <div class="file-details">
                        <span class="file-name" title="${f.file.name}">${f.file.name}</span>
                        <span class="file-meta">${sizeText}</span>
                    </div>
                </div>
                <div class="file-right">
                    <span class="file-status ${statusClass}">${statusText}</span>
                    <button class="remove-btn" aria-label="Remove">&times;</button>
                </div>
            `;

            item.querySelector('.remove-btn').addEventListener('click', () => removeFile(f.id));

            fileListContainer.appendChild(item);
        });
    }

    async function convertAll() {
        if (filesState.length === 0) return;

        convertBtn.disabled = true;
        convertBtn.textContent = 'Converting...';

        const format = formatSelect.value;
        const quality = parseFloat(qualitySlider.value);
        const w = widthInput.value ? parseInt(widthInput.value) : null;
        const h = heightInput.value ? parseInt(heightInput.value) : null;
        const maintainAspect = maintainAspectCheckbox.checked;

        // Reset statuses for re-conversion
        filesState.forEach(f => {
            if (f.status !== 'pending') {
                 f.status = 'pending';
                 if (f.url) URL.revokeObjectURL(f.url);
                 f.url = null;
                 f.blob = null;
            }
        });
        renderFileList();

        // Process sequentially to avoid freezing UI too much (though async helps)
        for (const f of filesState) {
            f.status = 'processing';
            renderFileList();

            try {
                // Calculate dimensions per image if needed
                let targetW = w;
                let targetH = h;

                if (maintainAspect && (targetW || targetH)) {
                    // We need image dimensions. Load image to get them.
                    const img = await loadImage(f.originalUrl);
                    const aspect = img.width / img.height;

                    if (targetW && !targetH) {
                        targetH = Math.round(targetW / aspect);
                    } else if (!targetW && targetH) {
                        targetW = Math.round(targetH * aspect);
                    }
                }

                const blob = await convertImage(f.file, format, quality, targetW, targetH);
                f.blob = blob;
                f.url = URL.createObjectURL(blob);
                f.status = 'done';
            } catch (error) {
                console.error(error);
                f.status = 'error';
            }
            renderFileList();
        }

        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert All';

        // Show Download All if at least one success
        if (filesState.some(f => f.status === 'done')) {
            downloadAllBtn.classList.remove('hidden');
        }
    }

    async function downloadAll() {
        // Filter successfully converted files
        const doneFiles = filesState.filter(f => f.status === 'done' && f.blob);

        if (doneFiles.length === 0) return;

        // If 5 or fewer files, download directly
        if (doneFiles.length <= 5) {
            doneFiles.forEach(f => downloadSingle(f));
            return;
        }

        // If more than 5, download as ZIP
        let JSZip;
        try {
             const module = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm');
             JSZip = module.default;
        } catch (e) {
            console.error("Failed to load JSZip", e);
            alert("Failed to load ZIP library. Downloading files individually.");
            doneFiles.forEach(f => downloadSingle(f));
            return;
        }

        const zip = new JSZip();

        const format = formatSelect.value;
        let ext = format.split('/')[1];
        if (ext === 'jpeg') ext = 'jpg';

        doneFiles.forEach(f => {
            const originalName = f.file.name;
            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
            const newName = `${nameWithoutExt}.${ext}`;
            zip.file(newName, f.blob);
        });

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "converted_images.zip";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function downloadSingle(f) {
        const a = document.createElement('a');
        a.href = f.url;

        const format = formatSelect.value;
        let ext = format.split('/')[1];
        if (ext === 'jpeg') ext = 'jpg';

        const originalName = f.file.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        a.download = `${nameWithoutExt}.${ext}`;
        a.click();
    }

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    function formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
