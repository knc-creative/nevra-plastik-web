import os
import re

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

for filename in os.listdir(workspace_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(workspace_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace v=... with v=8.3
        new_content = re.sub(r'css/style\.css\?v=[0-9.]+', 'css/style.css?v=8.3', content)
        new_content = re.sub(r'js/app\.js\?v=[0-9.]+', 'js/app.js?v=8.3', new_content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Bumped version to v=8.3 in: {filename}")
        else:
            print(f"No match or already updated in: {filename}")
