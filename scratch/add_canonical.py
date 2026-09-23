import os

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

html_files = [f for f in os.listdir(workspace_dir) if f.endswith(".html") and f != "nevracms.html"]

for filename in html_files:
    filepath = os.path.join(workspace_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if canonical already exists
    if 'rel="canonical"' in content or "rel='canonical'" in content:
        print(f"Canonical already exists in: {filename}")
        continue
        
    # Determine canonical URL
    if filename == "index.html":
        canonical_url = "https://nevraplastik.com/"
    else:
        canonical_url = f"https://nevraplastik.com/{filename}"
        
    canonical_tag = f'  <link rel="canonical" href="{canonical_url}">\n'
    
    # Insert right before </head>
    if '</head>' in content:
        new_content = content.replace('</head>', f'{canonical_tag}</head>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added canonical to: {filename} -> {canonical_url}")
    else:
        print(f"Could not find </head> in: {filename}")
