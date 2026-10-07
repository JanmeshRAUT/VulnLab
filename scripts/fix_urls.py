import os
import re

frontend_src = 'e:/AS LAb/Modern_Ecommerce/frontend/src'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Single quotes: 'http://localhost:8000/api/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/...`
    content = re.sub(r"'http://localhost:8000(/.*?)'", r"`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}\1`", content)
    
    # 2. Double quotes: "http://localhost:8000/api/..." -> `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/...`
    content = re.sub(r'"http://localhost:8000(/.*?)"', r"`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}\1`", content)
    
    # 3. Backticks: `http://localhost:8000/api/...` 
    content = re.sub(r"(?<!\|\| ')http://localhost:8000(?=/)(?!')", r"${import.meta.env.VITE_API_URL || 'http://localhost:8000'}", content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {filepath}')
        return 1
    return 0

count = 0
for root, dirs, files in os.walk(frontend_src):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
            count += process_file(os.path.join(root, file))

print(f'Total files updated: {count}')
