import json
import re

# 1. Update api/data/certificates.json
certs_file = 'api/data/certificates.json'
try:
    with open(certs_file, 'r', encoding='utf-8') as f:
        certs = json.load(f)
        
    for c in certs:
        if 'document_image' not in c:
            c['document_image'] = ''
            
    with open(certs_file, 'w', encoding='utf-8') as f:
        json.dump(certs, f, indent=2, ensure_ascii=False)
    print("Successfully updated certificates.json")
except Exception as e:
    print("Error updating certificates.json:", e)

# 2. Update js/fallback-data.js
fallback_file = 'js/fallback-data.js'
try:
    with open(fallback_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # We want to add 'document_image: "",' inside fallbackCertificates block
    # Let's target:
    # id: "cert_X", ..., status: "active" -> status: "active", document_image: ""
    updated_content = re.sub(
        r'(id:\s*"cert_\d+",[^}]+status:\s*"active"\s*)',
        r'\1,    document_image: ""\n  ',
        content
    )
    
    with open(fallback_file, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print("Successfully updated fallback-data.js")
except Exception as e:
    print("Error updating fallback-data.js:", e)
