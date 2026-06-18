import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace variations of white backgrounds
    new_content = re.sub(r'background:\s*white;?', 'background: var(--card);', content)
    new_content = re.sub(r'background:\s*#f8fafc;?', 'background: var(--card);', new_content)
    new_content = re.sub(r'background:\s*#ffffff;?', 'background: var(--card);', new_content)
    new_content = re.sub(r'background:\s*#fff;?', 'background: var(--card);', new_content)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('.'):
    for f in files:
        if f.endswith('.js') or f.endswith('.html'):
            if 'node_modules' in root or '.git' in root:
                continue
            fix_file(os.path.join(root, f))

print("Done")
