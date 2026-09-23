import os
import re
import subprocess

html_path = "/Users/erenkonca/Desktop/nevra website/nevracms.html"
js_temp_path = "/Users/erenkonca/Desktop/nevra website/scratch/nevracms_script.js"

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Find all script blocks
scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html_content, re.DOTALL)

# Combine them all into one JS content
js_content = "\n".join(scripts)

# Save to temporary JS file
os.makedirs(os.path.dirname(js_temp_path), exist_ok=True)
with open(js_temp_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Saved JS code to scratch/nevracms_script.js. Running syntax check...")

# Run node -c
result = subprocess.run(["node", "-c", js_temp_path], capture_output=True, text=True)

if result.returncode == 0:
    print("SUCCESS: No JS syntax errors found!")
else:
    print("SYNTAX ERROR FOUND:")
    print(result.stderr)
