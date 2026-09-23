import urllib.request
import json

try:
    url = "http://localhost:8080/api/cms.php?action=load&local_session=1"
    response = urllib.request.urlopen(url)
    data = json.loads(response.read().decode('utf-8'))
    print("API Status:", data.get("status"))
    print("Keys in response:", list(data.keys()))
    print("Certificates list in response:", data.get("certificates"))
except Exception as e:
    print("Error fetching load action:", e)
