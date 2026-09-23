import json
import re

# 1. Update api/data/products.json
products_file = 'api/data/products.json'
try:
    with open(products_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    for prod in products:
        prod['detail_url'] = ''
        
    with open(products_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print("Successfully updated api/data/products.json")
except Exception as e:
    print("Error updating products.json:", e)

# 2. Update js/fallback-data.js
fallback_file = 'js/fallback-data.js'
try:
    with open(fallback_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace detail_url: "..." with detail_url: ""
    updated_content = re.sub(r'detail_url:\s*"[^"]*"', 'detail_url: ""', content)
    
    with open(fallback_file, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print("Successfully updated js/fallback-data.js")
except Exception as e:
    print("Error updating fallback-data.js:", e)
