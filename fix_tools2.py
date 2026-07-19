import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove duplicate site footer block entirely
    content = re.sub(r'<footer class="site-footer">.*?</footer>', '', content, flags=re.DOTALL)

    # 2. Add global footer and load-components if missing
    if 'class="global-footer-container"' not in content:
        content = content.replace('</body>', '    <footer class="global-footer-container"></footer>\n</body>')
    if 'load-components.js' not in content:
        content = content.replace('</body>', '    <script src="../../load-components.js"></script>\n</body>')

    # 3. Remove counter fetch script correctly without leaving orphaned tags or braces
    def script_repl(match):
        script_body = match.group(0)
        if 'api.counterapi.dev' in script_body or 'Visitor Counter logic' in script_body or 'Visitor counter functionality' in script_body:
            return ''
        return script_body

    content = re.sub(r'<script\b[^>]*>.*?</script>', script_repl, content, flags=re.DOTALL)

    # 4. We will NOT touch the ad containers. The codebase already had them where they needed to be.
    # We only need to fix files that COMPLETELY MISS the ad container.
    # If the file has NO ad-container, we can inject one before </main>.
    if 'class="ad-container"' not in content and '</main>' in content:
        content = content.replace('</main>', '    <div class="ad-container"><!-- Ad will be placed here --></div>\n</main>')

    # 5. Fix absolute links to manifest.json
    content = content.replace('href="/manifest.json"', 'href="../manifest.json"')
    # And other absolute links to tools
    content = content.replace('href="/tools/', 'href="../tools/')

    # 6. Re-add missing SEO tags
    if 'word-character-counter' in filepath and 'canonical' not in content:
        content = content.replace('</head>', '    <link rel="canonical" href="https://projectut.com/tools/word-character-counter/">\n</head>')
    if 'text-case-converter' in filepath and 'canonical' not in content:
        content = content.replace('</head>', '    <link rel="canonical" href="https://projectut.com/tools/text-case-converter/">\n</head>')
    if 'image-compressor' in filepath and 'canonical' not in content:
        content = content.replace('</head>', '    <link rel="canonical" href="https://projectut.com/tools/image-compressor/">\n</head>')
    if 'tools/index.html' in filepath and 'canonical' not in content:
        content = content.replace('</head>', '    <meta name="description" content="A comprehensive directory of free, private, and client-side web tools for developers, writers, and creators.">\n    <link rel="canonical" href="https://projectut.com/tools/">\n</head>')

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('tools'):
    for file in files:
        if file.endswith('index.html'):
            process_file(os.path.join(root, file))
