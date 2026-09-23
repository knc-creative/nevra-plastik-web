import os

workspace_dir = "/Users/erenkonca/Desktop/nevra website"
lenis_tag = '<script src="https://unpkg.com/lenis@1.1.5/dist/lenis.min.js"></script>\n  '

for filename in os.listdir(workspace_dir):
    if filename.endswith(".html") and filename != "nevracms.html":
        filepath = os.path.join(workspace_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already injected
        if "lenis.min.js" in content:
            print(f"Lenis already injected in: {filename}")
            continue
            
        # Find where app.js is imported
        if "js/app.js" in content:
            # Inject before the js/app.js script tag
            # We match `<script src="js/app.js...`
            new_content = content.replace('<script src="js/app.js', lenis_tag + '<script src="js/app.js')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected Lenis in: {filename}")
        else:
            print(f"No app.js script tag found in: {filename}")
