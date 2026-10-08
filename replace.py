import os

files = [
    'frontend/src/pages/lab7/index.tsx',
    'frontend/src/pages/lab6/index.tsx',
    'frontend/src/pages/lab5/Sub2.tsx',
    'frontend/src/pages/lab5/Sub1.tsx',
    'frontend/src/pages/lab4/Sub2.tsx',
    'frontend/src/pages/lab4/Sub1.tsx',
    'frontend/src/pages/lab3/Sub2.tsx',
    'frontend/src/pages/lab3/Sub1.tsx',
    'frontend/src/pages/lab2/Sub5.tsx',
    'frontend/src/pages/lab2/Sub2.tsx',
]

for f in files:
    path = os.path.join('e:\\AS LAb\\Modern_Ecommerce', f.replace('/', '\\'))
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content.replace(
        "{ withCredentials: true }",
        "{ withCredentials: true, headers: { 'X-Variant-Session-ID': existing } }"
    )
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(new_content)

print('Done')
