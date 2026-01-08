// State management
export const state = {
    files: [], // Array of file objects with status, originalFile, compressedBlob, etc.
    settings: {
        mode: 'auto', // 'auto' or 'manual'
        quality: 0.8, // 0 to 1
        preserveMetadata: false
    },
    processing: false
};

export function addFile(file) {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    state.files.push({
        id,
        file,
        status: 'pending', // pending, processing, done, error
        compressedBlob: null,
        originalSize: file.size,
        compressedSize: 0
    });
    return id;
}

export function updateFileStatus(id, status, data = {}) {
    const fileIndex = state.files.findIndex(f => f.id === id);
    if (fileIndex !== -1) {
        state.files[fileIndex] = { ...state.files[fileIndex], status, ...data };
    }
}

export function removeFile(id) {
    state.files = state.files.filter(f => f.id !== id);
}

export function clearFiles() {
    state.files = [];
}

export function updateSettings(key, value) {
    state.settings[key] = value;
}
