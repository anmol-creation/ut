// Logic for BMI Calculator

document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const unitGroups = document.querySelectorAll('.unit-group');

    // Metric Inputs
    const weightKg = document.getElementById('weight-kg');
    const heightCm = document.getElementById('height-cm');

    // Imperial Inputs
    const weightLbs = document.getElementById('weight-lbs');
    const heightFt = document.getElementById('height-ft');
    const heightIn = document.getElementById('height-in');

    const calculateBtn = document.getElementById('calculate-btn');
    const resultBox = document.getElementById('result-box');
    const scaleInfo = document.getElementById('scale-info');

    let currentUnit = 'metric';

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            unitGroups.forEach(g => g.classList.remove('active'));
            document.getElementById(`${btn.dataset.unit}-inputs`).classList.add('active');

            currentUnit = btn.dataset.unit;

            // Clear result when switching
            resetOutput();
        });
    });

    function resetOutput() {
        resultBox.innerHTML = `<div class="empty-state text-center" style="color: var(--text-secondary); font-style: italic;">Enter your height and weight to see your BMI result.</div>`;
        resultBox.className = 'bmi-result-box';
        scaleInfo.style.display = 'none';
    }

    function calculateBMI() {
        let weight, height, bmi;

        if (currentUnit === 'metric') {
            const w = parseFloat(weightKg.value);
            const h = parseFloat(heightCm.value);

            if (!w || !h || w <= 0 || h <= 0) {
                alert("Please enter valid weight and height.");
                return;
            }

            // BMI = kg / (m * m)
            const hMeters = h / 100;
            bmi = w / (hMeters * hMeters);

        } else {
            const w = parseFloat(weightLbs.value);
            const f = parseFloat(heightFt.value);
            const i = parseFloat(heightIn.value) || 0;

            if (!w || !f || w <= 0 || f <= 0) {
                alert("Please enter valid weight and height.");
                return;
            }

            // BMI = (lbs / (in * in)) * 703
            const totalInches = (f * 12) + i;
            bmi = (w / (totalInches * totalInches)) * 703;
        }

        renderResult(bmi);
    }

    function renderResult(bmi) {
        const bmiVal = bmi.toFixed(1);
        let category = '';
        let colorClass = '';
        let boxClass = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            colorClass = 'cat-underweight';
            boxClass = 'box-underweight';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal weight';
            colorClass = 'cat-normal';
            boxClass = 'box-normal';
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'Overweight';
            colorClass = 'cat-overweight';
            boxClass = 'box-overweight';
        } else {
            category = 'Obesity';
            colorClass = 'cat-obese';
            boxClass = 'box-obese';
        }

        resultBox.className = `bmi-result-box ${boxClass}`;
        resultBox.innerHTML = `
            <div class="main-bmi ${colorClass}">${bmiVal}</div>
            <div class="sub-category ${colorClass}">${category}</div>
        `;

        scaleInfo.style.display = 'block';
    }

    calculateBtn.addEventListener('click', calculateBMI);

    // Enter key support
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateBMI();
        });
    });
});