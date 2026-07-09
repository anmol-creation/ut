// Logic for Age Calculator

document.addEventListener('DOMContentLoaded', () => {
    const dobInput = document.getElementById('dob');
    const targetDateInput = document.getElementById('target-date');
    const calculateBtn = document.getElementById('calculate-btn');

    const resultBox = document.getElementById('result-box');
    const extraStats = document.getElementById('extra-stats');

    const nextBdayEl = document.getElementById('next-bday');
    const totalMonthsEl = document.getElementById('total-months');
    const totalWeeksEl = document.getElementById('total-weeks');
    const totalDaysEl = document.getElementById('total-days');

    // Set today as default target date
    const today = new Date();
    targetDateInput.value = today.toISOString().split('T')[0];

    function calculateAge() {
        const dobVal = dobInput.value;
        const targetVal = targetDateInput.value;

        if (!dobVal) {
            alert('Please select your Date of Birth.');
            return;
        }

        const dob = new Date(dobVal);
        const target = new Date(targetVal);

        if (dob > target) {
            resultBox.innerHTML = `<div class="empty-state text-center" style="color: #ef4444;">Date of birth cannot be after the target date.</div>`;
            extraStats.style.display = 'none';
            return;
        }

        // Exact Age Calculation
        let years = target.getFullYear() - dob.getFullYear();
        let months = target.getMonth() - dob.getMonth();
        let days = target.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            // Get days in previous month
            const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Total Stats
        const timeDiff = target.getTime() - dob.getTime();
        const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const tMonths = (years * 12) + months;

        // Next Birthday Calculation (relative to target date)
        const nextBday = new Date(dob);
        nextBday.setFullYear(target.getFullYear());
        if (nextBday < target && (nextBday.getMonth() !== target.getMonth() || nextBday.getDate() !== target.getDate())) {
            nextBday.setFullYear(target.getFullYear() + 1);
        }

        const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

        // Render Results
        let ageStr = `<div class="main-age">${years} Years</div>`;
        ageStr += `<div class="sub-age">${months} Months, ${days} Days</div>`;
        resultBox.innerHTML = ageStr;

        if (daysToNextBday === 0) {
            nextBdayEl.textContent = "Happy Birthday! 🎉";
            nextBdayEl.style.color = "#10b981";
        } else {
            nextBdayEl.textContent = `${daysToNextBday} Days`;
            nextBdayEl.style.color = "var(--text-primary)";
        }

        totalMonthsEl.textContent = tMonths.toLocaleString();
        totalWeeksEl.textContent = totalWeeks.toLocaleString();
        totalDaysEl.textContent = totalDays.toLocaleString();

        extraStats.style.display = 'grid';
    }

    calculateBtn.addEventListener('click', calculateAge);

    // Auto calculate if valid
    dobInput.addEventListener('change', () => {
        if (dobInput.value) calculateAge();
    });

    targetDateInput.addEventListener('change', () => {
        if (dobInput.value) calculateAge();
    });
});