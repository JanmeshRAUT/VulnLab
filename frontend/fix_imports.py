import os

SRC = r"e:\AS LAb\Modern_Ecommerce\frontend\src"
TARGET_IMPORT = "import { API_BASE } from '@/config';"

count = 0
for root, _, files in os.walk(SRC):
    for fname in files:
        if not fname.endswith((".tsx", ".ts", ".jsx", ".js")):
            continue
        
        fpath = os.path.join(root, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        has_import = False
        new_lines = []
        for line in lines:
            if TARGET_IMPORT in line:
                has_import = True
            else:
                new_lines.append(line)
                
        if has_import:
            new_lines.insert(0, TARGET_IMPORT + "\n")
            with open(fpath, "w", encoding="utf-8") as f:
                f.writelines(new_lines)
            count += 1
            print(f"Fixed: {fpath}")

print(f"Fixed {count} files.")
