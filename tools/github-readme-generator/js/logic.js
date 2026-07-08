// Logic for GitHub README Generator

document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const nameInput = document.getElementById('name');
    const subtitleInput = document.getElementById('subtitle');

    const workingOnInput = document.getElementById('working-on');
    const learningInput = document.getElementById('learning');
    const askMeInput = document.getElementById('ask-me');
    const emailInput = document.getElementById('email');

    const skillsInput = document.getElementById('skills');

    const linkedInInput = document.getElementById('social-linkedin');
    const twitterInput = document.getElementById('social-twitter');
    const portfolioInput = document.getElementById('social-portfolio');

    const statsCheck = document.getElementById('github-stats');
    const githubUsernameGroup = document.getElementById('username-group');
    const githubUsernameInput = document.getElementById('github-username');

    // Actions
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputArea = document.getElementById('markdown-output');

    // Toggle username requirement based on stats checkbox
    statsCheck.addEventListener('change', () => {
        if (statsCheck.checked) {
            githubUsernameGroup.style.display = 'block';
        } else {
            githubUsernameGroup.style.display = 'none';
        }
        generateMarkdown();
    });

    function getBadgeUrl(skill) {
        // Map common skills to simple text badges using shields.io
        const color = '1e293b'; // Slate 800
        const encodedSkill = encodeURIComponent(skill);
        return `https://img.shields.io/badge/-${encodedSkill}-${color}?style=flat&logo=${encodedSkill.toLowerCase()}&logoColor=white`;
    }

    function generateMarkdown() {
        let md = '';

        // 1. Header
        const name = nameInput.value.trim();
        const subtitle = subtitleInput.value.trim();
        if (name) md += `<h1 align="center">${name}</h1>\n`;
        if (subtitle) md += `<h3 align="center">${subtitle}</h3>\n`;
        if (name || subtitle) md += `\n<hr>\n\n`;

        // 2. About Me
        const workingOn = workingOnInput.value.trim();
        const learning = learningInput.value.trim();
        const askMe = askMeInput.value.trim();
        const email = emailInput.value.trim();

        let hasAbout = workingOn || learning || askMe || email;
        if (hasAbout) {
            if (workingOn) md += `- 🔭 I’m currently working on **${workingOn}**\n`;
            if (learning) md += `- 🌱 I’m currently learning **${learning}**\n`;
            if (askMe) md += `- 💬 Ask me about **${askMe}**\n`;
            if (email) md += `- 📫 How to reach me: **${email}**\n`;
            md += `\n`;
        }

        // 3. Connect with me
        const linkedin = linkedInInput.value.trim();
        const twitter = twitterInput.value.trim();
        const portfolio = portfolioInput.value.trim();

        if (linkedin || twitter || portfolio) {
            md += `### 🤝 Connect with me:\n<p align="left">\n`;
            if (linkedin) {
                md += `<a href="https://linkedin.com/in/${linkedin}" target="blank"><img align="center" src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=flat&logo=linkedin&logoColor=white" alt="linkedin" height="30" /></a>\n`;
            }
            if (twitter) {
                md += `<a href="https://twitter.com/${twitter}" target="blank"><img align="center" src="https://img.shields.io/badge/-Twitter-%231DA1F2?style=flat&logo=twitter&logoColor=white" alt="twitter" height="30" /></a>\n`;
            }
            if (portfolio) {
                // Ensure protocol
                let url = portfolio.startsWith('http') ? portfolio : `https://${portfolio}`;
                md += `<a href="${url}" target="blank"><img align="center" src="https://img.shields.io/badge/-Portfolio-0f172a?style=flat&logo=vercel&logoColor=white" alt="portfolio" height="30" /></a>\n`;
            }
            md += `</p>\n\n`;
        }

        // 4. Skills
        const skillsRaw = skillsInput.value.trim();
        if (skillsRaw) {
            md += `### 🛠️ Languages and Tools:\n<p align="left">\n`;
            const skillsArr = skillsRaw.split(',').map(s => s.trim()).filter(s => s);
            skillsArr.forEach(skill => {
                md += `<img src="${getBadgeUrl(skill)}" alt="${skill}" height="30" />\n`;
            });
            md += `</p>\n\n`;
        }

        // 5. GitHub Stats
        if (statsCheck.checked) {
            const username = githubUsernameInput.value.trim();
            if (username) {
                md += `### 📊 GitHub Stats:\n<p align="center">\n`;
                // GitHub Stats Card
                md += `<img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true" alt="${username} stats" />\n`;
                // Top Languages Card
                md += `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=tokyonight&hide_border=true" alt="Top Languages" />\n`;
                md += `</p>\n`;
            } else {
                md += `<!-- Please enter your GitHub username in the generator to show stats -->\n`;
            }
        }

        if(!md.trim()) {
            outputArea.value = '<!-- Fill in the form on the left to generate your README markdown -->';
        } else {
            outputArea.value = md;
        }
    }

    // Auto-update
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', generateMarkdown);
    });

    generateBtn.addEventListener('click', generateMarkdown);

    clearBtn.addEventListener('click', () => {
        inputs.forEach(input => {
            if (input.type === 'checkbox') input.checked = true;
            else input.value = '';
        });
        githubUsernameGroup.style.display = 'block';
        generateMarkdown();
    });

    copyBtn.addEventListener('click', () => {
        if (outputArea.value && !outputArea.value.includes('Fill in the form')) {
            outputArea.select();
            navigator.clipboard.writeText(outputArea.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            });
        }
    });

    // Initial generation
    generateMarkdown();
});