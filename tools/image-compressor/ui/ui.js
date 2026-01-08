import { state, removeFile } from '../state/state.js';

export function updateUIState() {
    const landingView = document.getElementById('landing-view');
    const activeView = document.getElementById('active-view');
    const downloadAllBtn = document.getElementById('download-all-btn');

    if (state.files.length > 0) {
        landingView.classList.add('hidden');
        activeView.classList.remove('hidden');
    } else {
        landingView.classList.remove('hidden');
        activeView.classList.add('hidden');
    }

    const allDone = state.files.length > 0 && state.files.every(f => f.status === 'done');
    if (allDone) {
        downloadAllBtn.classList.remove('hidden');
    } else {
        downloadAllBtn.classList.add('hidden');
    }
}

export function renderFileList() {
    const listContainer = document.getElementById('file-list');
    listContainer.innerHTML = '';

    state.files.forEach(fileObj => {
        const item = document.createElement('div');
        item.className = 'file-item';

        // Preview
        const img = document.createElement('img');
        img.className = 'file-preview';
        img.src = URL.createObjectURL(fileObj.file); // Note: This might leak memory if not revoked, but for simplicity we keep it until removal.
        // Ideally we should revoke these when file is removed or page unloaded.

        const details = document.createElement('div');
        details.className = 'file-details';

        const name = document.createElement('div');
        name.className = 'file-name';
        name.textContent = fileObj.file.name;

        const sizeInfo = document.createElement('div');
        sizeInfo.className = 'file-size';
        let sizeText = formatSize(fileObj.originalSize);

        if (fileObj.status === 'done') {
            const savings = Math.round(((fileObj.originalSize - fileObj.compressedSize) / fileObj.originalSize) * 100);
            sizeText += ` → ${formatSize(fileObj.compressedSize)} (-${savings}%)`;
        } else if (fileObj.status === 'processing') {
             sizeText += ' - Compressing...';
        } else if (fileObj.status === 'error') {
             sizeText += ' - Error';
        }

        sizeInfo.textContent = sizeText;

        details.appendChild(name);
        details.appendChild(sizeInfo);

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '10px';
        actions.style.alignItems = 'center';

        if (fileObj.status === 'done') {
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn btn-secondary'; // Small button style
            downloadBtn.style.padding = '4px 8px';
            downloadBtn.style.fontSize = '0.8rem';
            downloadBtn.textContent = '↓';
            downloadBtn.title = 'Download';
            downloadBtn.onclick = () => {
                const url = URL.createObjectURL(fileObj.compressedBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `compressed-${fileObj.file.name}`; // Or keep original name depending on requirement
                a.click();
                URL.revokeObjectURL(url);
            };
            actions.appendChild(downloadBtn);
        }

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-secondary';
        removeBtn.style.padding = '4px 8px';
        removeBtn.style.fontSize = '0.8rem';
        removeBtn.textContent = '✕';
        removeBtn.title = 'Remove';
        removeBtn.onclick = () => {
            removeFile(fileObj.id);
            renderFileList();
            updateUIState();
        };
        actions.appendChild(removeBtn);

        const leftSide = document.createElement('div');
        leftSide.className = 'file-info';
        leftSide.appendChild(img);
        leftSide.appendChild(details);

        item.appendChild(leftSide);
        item.appendChild(actions);

        listContainer.appendChild(item);
    });
}

function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
