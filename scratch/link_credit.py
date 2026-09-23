import os

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

old_anchor = '| Designed by <a href="#" style="color: #2fb14d; font-weight: 600; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity=\'0.8\'" onmouseout="this.style.opacity=\'1\'">KNC Creative</a>'
new_anchor = '| Designed by <a href="https://www.kncdesign.com.tr" target="_blank" rel="noopener noreferrer" style="color: #ff2700; font-weight: 600; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity=\'0.8\'" onmouseout="this.style.opacity=\'1\'">KNC Creative</a>'

for filename in os.listdir(workspace_dir):
    if filename.endswith(".html") and filename != "nevracms.html":
        filepath = os.path.join(workspace_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if old_anchor in content:
            new_content = content.replace(old_anchor, new_anchor)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated KNC Creative link in: {filename}")
        else:
            print(f"Target signature not found in: {filename}")
