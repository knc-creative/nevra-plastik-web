import urllib.request
import json

try:
    # 1. Save certificate
    url_save = "http://localhost:8080/api/cms.php?action=save_certificate&local_session=1"
    payload = {
        "id": None,
        "icon": "🏅",
        "title_tr": "Test Belgesi TR",
        "title_en": "Test Document EN",
        "sub_tr": "Test Alt Bilgi",
        "sub_en": "Test Subtitle"
    }
    req = urllib.request.Request(
        url_save, 
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res_save = urllib.request.urlopen(req)
    save_data = json.loads(res_save.read().decode('utf-8'))
    print("Save Response:", save_data)
    
    # 2. Load and verify
    url_load = "http://localhost:8080/api/cms.php?action=load&local_session=1"
    res_load = urllib.request.urlopen(url_load)
    load_data = json.loads(res_load.read().decode('utf-8'))
    certs = load_data.get("certificates", [])
    print("Total Certificates after save:", len(certs))
    print("New Certificate found:", any(c.get("title_tr") == "Test Belgesi TR" for c in certs))
    
except Exception as e:
    print("Error during test:", e)
