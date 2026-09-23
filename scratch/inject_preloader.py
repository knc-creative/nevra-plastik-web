import os

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

old_logo_tag = 'data-translate-key="img_logo"'
new_logo_tag = 'data-translate-key="img_preloader_logo"'

for filename in os.listdir(workspace_dir):
    if filename.endswith(".html") and filename != "nevracms.html":
        filepath = os.path.join(workspace_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Target only the PreloaderLogo image tag translation key
        if 'id="PreloaderLogo"' in content:
            # Replace the data-translate-key inside the PreloaderLogo element specifically
            # We can find the line with PreloaderLogo and replace img_logo with img_preloader_logo
            lines = content.split('\n')
            for idx, line in enumerate(lines):
                if 'id="PreloaderLogo"' in line and 'data-translate-key="img_logo"' in line:
                    lines[idx] = line.replace('data-translate-key="img_logo"', 'data-translate-key="img_preloader_logo"')
                    print(f"Updated preloader logo key in: {filename}")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines))
        else:
            print(f"Preloader Logo tag not found in: {filename}")
