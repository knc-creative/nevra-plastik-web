import os

redirects = {
    "urun-detail-pp-black.html": "pp_100",
    "urun-detail-pp-gray.html": "pp_gri",
    "urun-detail-pp-color.html": "pp_renkli",
    "urun-detail-pe-hd.html": "pe_hd_opak",
    "urun-detail-pe-ld-trans.html": "pe_ld_seffaf",
    "urun-detail-pe-ld-black.html": "pe_ld_siyah",
    "urun-detail-pprc.html": "pprc_gri",
    "urun-detail-calcite.html": "pp_kalsit",
    "urun-detail-custom.html": "custom_mix"
}

for filename, product_id in redirects.items():
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already redirected to prevent duplicate script insertion
        if "urun-detay.html?id=" in content:
            print(f"{filename} is already redirected. Skipping.")
            continue
            
        redirect_js = f'\n  <script>window.location.href = "urun-detay.html?id={product_id}";</script>\n'
        
        # Insert right after <head>
        if "<head>" in content:
            new_content = content.replace("<head>", f"<head>{redirect_js}", 1)
        elif "<HEAD>" in content:
            new_content = content.replace("<HEAD>", f"<HEAD>{redirect_js}", 1)
        else:
            new_content = redirect_js + content
            
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added redirect to {filename} -> id={product_id}")
    else:
        print(f"{filename} not found.")
