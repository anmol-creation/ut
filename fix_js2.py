with open('tools/image-to-text-converter/js/main.js', 'r') as f:
    content = f.read()

# Remove `fetchVisitorCount();`
content = content.replace('    // Visitor counter dynamic loading (required by global rules)\n    fetchVisitorCount();', '')

# Remove `// Dynamic Visitor Counter for Footer` block entirely
import re
content = re.sub(r'// Dynamic Visitor Counter for Footer\s*async function fetchVisitorCount\(\) \{.*\}\s*$', '', content, flags=re.DOTALL)

with open('tools/image-to-text-converter/js/main.js', 'w') as f:
    f.write(content)
