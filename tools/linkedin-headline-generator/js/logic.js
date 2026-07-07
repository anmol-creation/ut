// Logic for LinkedIn Headline Generator

document.addEventListener('DOMContentLoaded', () => {
    const jobRoleInput = document.getElementById('job-role');
    const skillsInput = document.getElementById('core-skills');
    const industryInput = document.getElementById('industry-niche');
    const valuePropInput = document.getElementById('value-prop');
    const toneSelect = document.getElementById('tone-select');

    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const container = document.getElementById('headlines-container');

    function generateHeadlines() {
        const job = jobRoleInput.value.trim();
        const skillsRaw = skillsInput.value.trim();

        if (!job || !skillsRaw) {
            alert("Please enter both your Job Role and Core Skills.");
            return;
        }

        const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s);
        const industry = industryInput.value.trim();
        const valueProp = valuePropInput.value.trim();
        const tone = toneSelect.value;

        // Ensure we have at least 1-3 skills for formatting
        const s1 = skills[0] || '';
        const s2 = skills[1] || '';
        const s3 = skills[2] || '';

        const skillStrPipe = skills.slice(0, 3).join(' | ');
        const skillStrSlash = skills.slice(0, 3).join(' / ');

        let templates = [];

        if (tone === 'professional') {
            templates.push(`${job} | ${skillStrPipe}`);
            if (industry) templates.push(`${job} in ${industry} | ${skillStrPipe}`);
            if (valueProp) templates.push(`${job} | ${valueProp}`);
            templates.push(`${job} | Specializing in ${s1}${s2 ? ' & ' + s2 : ''}`);
            if (industry && valueProp) templates.push(`${job} (${industry}) | ${valueProp}`);
        }
        else if (tone === 'creator') {
            if (valueProp) {
                templates.push(`${job} 🚀 | ${valueProp}`);
                templates.push(`I help ${industry || 'businesses'} ${valueProp.toLowerCase()} | ${job}`);
                templates.push(`${job} | Building things with ${s1} & ${s2} | ${valueProp}`);
            } else {
                templates.push(`${job} | Passionate about ${s1} & ${s2}`);
                templates.push(`Creating impact through ${s1} | ${job}`);
                templates.push(`${job} 💡 | ${skillStrPipe}`);
            }
            templates.push(`${job} ➔ ${s1} Enthusiast ➔ Lifelong Learner`);
        }
        else if (tone === 'keyword') {
            templates.push(`${job} | ${skills.join(' | ')}`);
            if (industry) templates.push(`${job} | ${industry} | ${skillStrPipe}`);
            templates.push(`${job} - ${s1} - ${s2} - ${s3}`);
            templates.push(`${s1} & ${s2} Developer | ${job}`);
            templates.push(`Expert ${job} | ${skills.join(' • ')}`);
        }

        // Render
        container.innerHTML = '';

        // Remove exact duplicates
        const uniqueHeadlines = [...new Set(templates)].filter(h => h && h.length > 5);

        uniqueHeadlines.forEach(hl => {
            const card = document.createElement('div');
            card.className = 'headline-card';

            const textSpan = document.createElement('div');
            textSpan.className = 'headline-text';
            textSpan.textContent = hl;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'headline-actions';

            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn-copy';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(hl).then(() => {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                });
            };

            actionsDiv.appendChild(copyBtn);
            card.appendChild(textSpan);
            card.appendChild(actionsDiv);
            container.appendChild(card);
        });
    }

    generateBtn.addEventListener('click', generateHeadlines);

    clearBtn.addEventListener('click', () => {
        jobRoleInput.value = '';
        skillsInput.value = '';
        industryInput.value = '';
        valuePropInput.value = '';
        toneSelect.value = 'professional';

        container.innerHTML = `
            <div class="empty-state">
                Fill in your details and click Generate to see your new LinkedIn headlines here.
            </div>
        `;
    });
});