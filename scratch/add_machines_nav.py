import os

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

for filename in os.listdir(workspace_dir):
    if filename.endswith(".html") and filename != "admin.html":
        filepath = os.path.join(workspace_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Update Header navigation
        header_modified = False
        
        # Match standard inactive link
        target_inactive = '<li><a href="urunler.html" class="nav-link" data-translate-key="nav_products">Ürünler</a></li>'
        # Match active link
        target_active = '<li><a href="urunler.html" class="nav-link active" data-translate-key="nav_products">Ürünler</a></li>'
        
        if target_inactive in content:
            if "makineler.html" not in content:
                # If current file is makineler.html, then makineler nav link should be active. Otherwise urunler active check or general inactive.
                if filename == "makineler.html":
                    replacement = target_inactive + '\n          <li><a href="makineler.html" class="nav-link active" data-translate-key="nav_machines">Makineler</a></li>'
                else:
                    replacement = target_inactive + '\n          <li><a href="makineler.html" class="nav-link" data-translate-key="nav_machines">Makineler</a></li>'
                content = content.replace(target_inactive, replacement)
                header_modified = True
                
        elif target_active in content:
            if "makineler.html" not in content:
                if filename == "makineler.html":
                    replacement = target_active + '\n          <li><a href="makineler.html" class="nav-link active" data-translate-key="nav_machines">Makineler</a></li>'
                else:
                    replacement = target_active + '\n          <li><a href="makineler.html" class="nav-link" data-translate-key="nav_machines">Makineler</a></li>'
                content = content.replace(target_active, replacement)
                header_modified = True
        
        # 2. Update Footer navigation
        footer_modified = False
        target_footer = '<li><a href="urunler.html" data-translate-key="nav_products">Ürünler</a></li>'
        if target_footer in content and 'href="makineler.html"' not in content:
            replacement_footer = target_footer + '\n          <li><a href="makineler.html" data-translate-key="nav_machines">Makineler</a></li>'
            content = content.replace(target_footer, replacement_footer)
            footer_modified = True
            
        if header_modified or footer_modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Successfully added Makineler links in: {filename} (header={header_modified}, footer={footer_modified})")
        else:
            print(f"Skipped / Already updated: {filename}")
