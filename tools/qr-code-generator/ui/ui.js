import { generateQRCode, formatData } from '../logic/generator.js';
import { startScanner, stopScanner } from '../logic/scanner.js';

// DOM Elements
const landingPage = document.getElementById('landing-page');
const toolContainer = document.getElementById('tool-container');
const startBtn = document.getElementById('start-btn');
const tabGenerate = document.getElementById('tab-generate');
const tabScan = document.getElementById('tab-scan');
const panelGenerate = document.getElementById('panel-generate');
const panelScan = document.getElementById('panel-scan');

// Generation Elements
const inputTypeSelect = document.getElementById('input-type');
const inputFieldsContainer = document.getElementById('input-fields');
const generateBtn = document.getElementById('generate-btn');
const qrOutput = document.getElementById('qr-output');
const downloadBtn = document.getElementById('download-btn');

// Scanner Elements
const scanResult = document.getElementById('scan-result');
const startScanBtn = document.getElementById('start-scan-btn');
const stopScanBtn = document.getElementById('stop-scan-btn');

// State
let currentType = 'url';

// Input Field Templates
const inputTemplates = {
    url: `<div class="input-group"><label>URL</label><input type="url" id="inp-url" placeholder="https://example.com"></div>`,
    text: `<div class="input-group"><label>Text</label><textarea id="inp-text" rows="3" placeholder="Enter your text"></textarea></div>`,
    email: `<div class="input-group"><label>Email</label><input type="email" id="inp-email" placeholder="name@example.com"></div>`,
    phone: `<div class="input-group"><label>Phone Number</label><input type="tel" id="inp-phone" placeholder="+1234567890"></div>`,
    sms: `
        <div class="input-group"><label>Phone Number</label><input type="tel" id="inp-phone" placeholder="+1234567890"></div>
        <div class="input-group"><label>Message</label><textarea id="inp-message" rows="2" placeholder="Your message"></textarea></div>
    `,
    wifi: `
        <div class="input-group"><label>Network SSID</label><input type="text" id="inp-ssid" placeholder="Network Name"></div>
        <div class="input-group"><label>Password</label><input type="text" id="inp-password" placeholder="Password"></div>
        <div class="input-group"><label>Encryption</label>
            <select id="inp-encryption">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
            </select>
        </div>
    `
};

// Functions
const showTool = () => {
    landingPage.classList.add('hidden');
    toolContainer.classList.remove('hidden');
    renderInputFields('url'); // Default
};

const switchTab = (tab) => {
    if (tab === 'generate') {
        tabGenerate.classList.add('active', 'border-indigo-500', 'text-indigo-400');
        tabGenerate.classList.remove('border-transparent', 'text-gray-400');
        tabScan.classList.remove('active', 'border-indigo-500', 'text-indigo-400');
        tabScan.classList.add('border-transparent', 'text-gray-400');
        panelGenerate.classList.remove('hidden');
        panelScan.classList.add('hidden');
        stopScanner(); // Ensure scanner is stopped
    } else {
        tabScan.classList.add('active', 'border-indigo-500', 'text-indigo-400');
        tabScan.classList.remove('border-transparent', 'text-gray-400');
        tabGenerate.classList.remove('active', 'border-indigo-500', 'text-indigo-400');
        tabGenerate.classList.add('border-transparent', 'text-gray-400');
        panelScan.classList.remove('hidden');
        panelGenerate.classList.add('hidden');
    }
};

const renderInputFields = (type) => {
    currentType = type;
    inputFieldsContainer.innerHTML = inputTemplates[type] || inputTemplates.text;
};

const getInputData = () => {
    const data = {};
    if (currentType === 'url') data.url = document.getElementById('inp-url').value;
    else if (currentType === 'text') data.text = document.getElementById('inp-text').value;
    else if (currentType === 'email') data.email = document.getElementById('inp-email').value;
    else if (currentType === 'phone') data.phone = document.getElementById('inp-phone').value;
    else if (currentType === 'sms') {
        data.phone = document.getElementById('inp-phone').value;
        data.message = document.getElementById('inp-message').value;
    }
    else if (currentType === 'wifi') {
        data.ssid = document.getElementById('inp-ssid').value;
        data.password = document.getElementById('inp-password').value;
        data.encryption = document.getElementById('inp-encryption').value;
    }
    return data;
};

const handleGenerate = () => {
    const data = getInputData();
    const text = formatData(currentType, data);

    if (!text) {
        alert("Please enter valid data.");
        return;
    }

    const options = {
        width: document.getElementById('opt-size').value,
        height: document.getElementById('opt-size').value,
        colorDark: document.getElementById('opt-color-dark').value,
        colorLight: document.getElementById('opt-color-light').value,
        correctLevel: document.getElementById('opt-ecc').value
    };

    generateQRCode(qrOutput, text, options);

    // Show download button
    downloadBtn.classList.remove('hidden');
};

const handleDownload = () => {
    const img = qrOutput.querySelector('img');
    if (img && img.src) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const handleScanSuccess = (decodedText, decodedResult) => {
    scanResult.innerHTML = `
        <div class="p-4 bg-green-900/20 border border-green-500 rounded text-green-200 break-all">
            <strong>Found:</strong> ${decodedText}
        </div>
    `;
    // Optional: Stop scanning after success if desired, or let it continue.
    // Usually user wants to copy or visit.
};

const handleScanFailure = (error) => {
    // console.warn(`Code scan error = ${error}`);
};

const toggleScanner = async () => {
    if (startScanBtn.classList.contains('hidden')) {
        // Stop
        await stopScanner();
        startScanBtn.classList.remove('hidden');
        stopScanBtn.classList.add('hidden');
    } else {
        // Start
        const success = await startScanner('reader', handleScanSuccess, handleScanFailure);
        if (success) {
            startScanBtn.classList.add('hidden');
            stopScanBtn.classList.remove('hidden');
            scanResult.innerHTML = '';
        } else {
            alert("Could not access camera. Please ensure you have granted permission.");
        }
    }
};

// Event Listeners
startBtn.addEventListener('click', showTool);
tabGenerate.addEventListener('click', () => switchTab('generate'));
tabScan.addEventListener('click', () => switchTab('scan'));
inputTypeSelect.addEventListener('change', (e) => renderInputFields(e.target.value));
generateBtn.addEventListener('click', handleGenerate);
downloadBtn.addEventListener('click', handleDownload);
startScanBtn.addEventListener('click', toggleScanner);
stopScanBtn.addEventListener('click', toggleScanner);

// Initialize
renderInputFields('url');
