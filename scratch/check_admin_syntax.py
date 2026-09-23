import re

filepath = "/Users/erenkonca/Desktop/nevra website/admin.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all script blocks
script_matches = [m.start() for m in re.finditer(r'<script>', content)]
if len(script_matches) < 2:
    print("Main script block not found!")
    import sys
    sys.exit(1)

# We want the script block starting around line 1258 (index 2 in the match list)
# Let's find the second script block
start_idx = script_matches[1] + len('<script>')
end_idx = content.find('</script>', start_idx)

script_content = content[start_idx:end_idx]
print(f"Extracted main script block of length {len(script_content)} characters.")

# Save to scratch/admin_script.js
with open("/Users/erenkonca/Desktop/nevra website/scratch/admin_script.js", 'w', encoding='utf-8') as f:
    f.write(script_content)

print("Saved script to scratch/admin_script.js for verification.")
