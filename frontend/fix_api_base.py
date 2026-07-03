"""Replace all inline VITE_API_URL patterns with the centralized API_BASE import."""
import os, re

SRC = r"e:\AS LAb\Modern_Ecommerce\frontend\src"

# Pattern to match: ${import.meta.env.VITE_API_URL || 'http://localhost:8000'}
PATTERN = re.compile(
    r"""\$\{import\.meta\.env\.VITE_API_URL\s*\|\|\s*['"]http://localhost:8000['"]\}"""
)

IMPORT_LINE = "import { API_BASE } from '@/config';\n"
REPLACEMENT = "${API_BASE}"

count = 0
for root, _, files in os.walk(SRC):
    for fname in files:
        if not fname.endswith((".tsx", ".ts", ".jsx", ".js")):
            continue
        if fname == "config.ts":
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()

        if not PATTERN.search(content):
            continue

        new_content = PATTERN.sub(REPLACEMENT, content)

        # Add the import if not already present
        if "import { API_BASE }" not in new_content:
            # Insert after the last existing import
            lines = new_content.split("\n")
            last_import_idx = -1
            for i, line in enumerate(lines):
                if line.strip().startswith("import "):
                    last_import_idx = i
            if last_import_idx >= 0:
                lines.insert(last_import_idx + 1, IMPORT_LINE.rstrip())
            else:
                lines.insert(0, IMPORT_LINE.rstrip())
            new_content = "\n".join(lines)

        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        count += 1
        print(f"  Updated: {fpath}")

print(f"\nDone! Updated {count} files.")
