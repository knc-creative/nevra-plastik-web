import os
import re
import time
import random
import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

def parse_js_var(js_content, var_name):
    pattern = rf"(?:const|let|var)\s+{var_name}\s*=\s*([\[{{].*?)(?:;\s*(?:const|let|var|$)|\Z)"
    match = re.search(pattern, js_content, re.DOTALL)
    if not match:
        raise ValueError(f"Variable {var_name} not found in JS content")
    
    raw_val = match.group(1).strip()
    raw_val = re.sub(r'//.*', '', raw_val)
    
    pattern_str = r'("(?:[^"\\]|\\.)*")|(\'(?:[^\'\\]|\\.)*\')'
    def repl_string(m):
        double_quoted = m.group(1)
        single_quoted = m.group(2)
        if double_quoted:
            return double_quoted
        else:
            content = single_quoted[1:-1]
            content = content.replace("\\'", "'")
            content = content.replace('"', '\\"')
            return f'"{content}"'
        
    raw_val = re.sub(pattern_str, repl_string, raw_val)
    raw_val = re.sub(r'([{,]\s*)(\w+)\s*:', r'\1"\2":', raw_val)
    raw_val = re.sub(r'^\s*(\w+)\s*:', r'"\1":', raw_val, flags=re.MULTILINE)
    raw_val = re.sub(r',\s*([\]}])', r'\1', raw_val)
    
    if raw_val.endswith(';'):
        raw_val = raw_val[:-1].strip()
        
    return json.loads(raw_val)

def init_database():
    data_dir = os.path.join(os.getcwd(), 'api', 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        
    products_file = os.path.join(data_dir, 'products.json')
    categories_file = os.path.join(data_dir, 'categories.json')
    translations_file = os.path.join(data_dir, 'translations.json')
    
    if not os.path.exists(products_file) or not os.path.exists(categories_file) or not os.path.exists(translations_file):
        fallback_file = os.path.join(os.getcwd(), 'js', 'fallback-data.js')
        if os.path.exists(fallback_file):
            print("Seeding database JSON files from fallback-data.js...")
            try:
                with open(fallback_file, 'r', encoding='utf-8') as f:
                    js_content = f.read()
                
                if not os.path.exists(categories_file):
                    categories = parse_js_var(js_content, 'fallbackCategories')
                    with open(categories_file, 'w', encoding='utf-8') as f_out:
                        json.dump(categories, f_out, indent=2, ensure_ascii=False)
                        
                if not os.path.exists(products_file):
                    products = parse_js_var(js_content, 'fallbackProducts')
                    with open(products_file, 'w', encoding='utf-8') as f_out:
                        json.dump(products, f_out, indent=2, ensure_ascii=False)
                        
                if not os.path.exists(translations_file):
                    translations = parse_js_var(js_content, 'fallbackTranslations')
                    with open(translations_file, 'w', encoding='utf-8') as f_out:
                        json.dump(translations, f_out, indent=2, ensure_ascii=False)
                print("Seeding completed successfully.")
            except Exception as e:
                print(f"Error seeding database: {e}")

def update_fallback_data_js():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, 'api', 'data')
    fallback_file = os.path.join(base_dir, 'js', 'fallback-data.js')

    def read_json_file(filename, default):
        p = os.path.join(data_dir, filename)
        if os.path.exists(p):
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        return default

    products = read_json_file('products.json', [])
    categories = read_json_file('categories.json', [])
    machines = read_json_file('machines.json', [])
    certificates = read_json_file('certificates.json', [])
    translations = read_json_file('translations.json', {})

    content = f"""/* ==========================================================================
   Nevra Plastik - Local Static Fallback Database Data (Auto-Generated)
   ========================================================================== */

const fallbackCategories = {json.dumps(categories, indent=2, ensure_ascii=False)};

const fallbackProducts = {json.dumps(products, indent=2, ensure_ascii=False)};

const fallbackMachines = {json.dumps(machines, indent=2, ensure_ascii=False)};

const fallbackCertificates = {json.dumps(certificates, indent=2, ensure_ascii=False)};

const fallbackTranslations = {json.dumps(translations, indent=2, ensure_ascii=False)};
"""

    try:
        with open(fallback_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print("fallback-data.js synchronized successfully from server.py!")
    except Exception as e:
        print(f"Error synchronizing fallback-data.js: {e}")

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status_code=200, headers=None):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=UTF-8')
        if headers:
            for k, v in headers.items():
                self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def handle_cms_request(self, action, id_param, body_data=None):
        data_dir = os.path.join(os.getcwd(), 'api', 'data')
        products_file = os.path.join(data_dir, 'products.json')
        categories_file = os.path.join(data_dir, 'categories.json')
        translations_file = os.path.join(data_dir, 'translations.json')
        machines_file = os.path.join(data_dir, 'machines.json')
        contacts_file = os.path.join(data_dir, 'contacts.json')
        certificates_file = os.path.join(data_dir, 'certificates.json')
        
        query_params = parse_qs(urlparse(self.path).query)
        local_session = query_params.get('local_session', [''])[0] == '1'
        cookie_header = self.headers.get('Cookie', '')
        logged_in = 'admin_session=1' in cookie_header or local_session
        
        def check_auth():
            if not logged_in:
                self.send_json({"status": "error", "message": "Unauthorized access. Please log in first."}, 401)
                return False
            return True

        if action == 'check_session':
            self.send_json({
                "logged_in": logged_in,
                "username": "admin" if logged_in else None
            })
            
        elif action == 'login':
            user = ""
            password = ""
            if body_data:
                try:
                    data = json.loads(body_data.decode('utf-8'))
                    user = data.get('username', '')
                    password = data.get('password', '')
                except:
                    from urllib.parse import parse_qs as parse_form
                    form_data = parse_form(body_data.decode('utf-8'))
                    user = form_data.get('username', [''])[0]
                    password = form_data.get('password', [''])[0]
            
            db_user = "admin"
            db_pass = "admin123"
            creds_file = os.path.join(data_dir, 'credentials.json')
            if os.path.exists(creds_file):
                try:
                    with open(creds_file, 'r', encoding='utf-8') as f:
                        creds = json.load(f)
                    db_user = creds.get("username", "admin")
                    db_pass = creds.get("password", "admin123")
                except:
                    pass

            if user == db_user and password == db_pass:
                self.send_json(
                    {"status": "success", "message": "Logged in successfully."},
                    headers={"Set-Cookie": "admin_session=1; Path=/; HttpOnly"}
                )
            else:
                self.send_json({"status": "error", "message": "Invalid username or password."}, 400)
                
        elif action == 'logout':
            self.send_json(
                {"status": "success", "message": "Logged out successfully."},
                headers={"Set-Cookie": "admin_session=0; Max-Age=0; Path=/"}
            )
            
        elif action == 'load':
            try:
                with open(products_file, 'r', encoding='utf-8') as f:
                    products = json.load(f)
                with open(categories_file, 'r', encoding='utf-8') as f:
                    categories = json.load(f)
                with open(translations_file, 'r', encoding='utf-8') as f:
                    translations = json.load(f)
                machines = []
                if os.path.exists(machines_file):
                    with open(machines_file, 'r', encoding='utf-8') as f:
                        machines = json.load(f)
                contacts = []
                if logged_in and os.path.exists(contacts_file):
                    with open(contacts_file, 'r', encoding='utf-8') as f:
                        contacts = json.load(f)
                certificates = []
                if os.path.exists(certificates_file):
                    with open(certificates_file, 'r', encoding='utf-8') as f:
                        certificates = json.load(f)
                self.send_json({
                    "status": "success",
                    "products": products,
                    "categories": categories,
                    "translations": translations,
                    "machines": machines,
                    "contacts": contacts,
                    "certificates": certificates
                })
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'save_product':
            if not check_auth(): return
            if not id_param or not body_data:
                self.send_json({"status": "error", "message": "Invalid data or missing ID parameter."}, 400)
                return
            try:
                new_prod = json.loads(body_data.decode('utf-8'))
                with open(products_file, 'r', encoding='utf-8') as f:
                    products = json.load(f)
                
                found = False
                for idx, prod in enumerate(products):
                    if prod.get('id') == id_param:
                        products[idx] = {**new_prod, "id": id_param}
                        found = True
                        break
                if not found:
                    products.append({**new_prod, "id": id_param})
                    
                with open(products_file, 'w', encoding='utf-8') as f:
                    json.dump(products, f, indent=2, ensure_ascii=False)
                update_fallback_data_js()
                self.send_json({"status": "success", "message": "Product saved successfully."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'delete_product':
            if not check_auth(): return
            if not id_param:
                self.send_json({"status": "error", "message": "Missing ID parameter."}, 400)
                return
            try:
                with open(products_file, 'r', encoding='utf-8') as f:
                    products = json.load(f)
                
                initial_count = len(products)
                products = [p for p in products if p.get('id') != id_param]
                
                if len(products) == initial_count:
                    self.send_json({"status": "error", "message": "Product not found."}, 404)
                else:
                    with open(products_file, 'w', encoding='utf-8') as f:
                        json.dump(products, f, indent=2, ensure_ascii=False)
                    update_fallback_data_js()
                    self.send_json({"status": "success", "message": "Product deleted successfully."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'reorder_products':
            if not check_auth(): return
            if not body_data:
                self.send_json({"status": "error", "message": "Geçersiz sıralama verisi."}, 400)
                return
            try:
                new_order_ids = json.loads(body_data.decode('utf-8'))
                if not isinstance(new_order_ids, list):
                    self.send_json({"status": "error", "message": "Geçersiz sıralama verisi."}, 400)
                    return
                
                with open(products_file, 'r', encoding='utf-8') as f:
                    products = json.load(f)
                
                ordered_products = []
                for pid in new_order_ids:
                    for p in products:
                        if p.get('id') == pid:
                            ordered_products.append(p)
                            break
                
                for p in products:
                    if p.get('id') not in new_order_ids:
                        ordered_products.append(p)
                
                with open(products_file, 'w', encoding='utf-8') as f:
                    json.dump(ordered_products, f, indent=2, ensure_ascii=False)
                
                update_fallback_data_js()
                self.send_json({"status": "success", "message": "Ürün sıralaması başarıyla güncellendi."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'save_category':
            if not check_auth(): return
            if not id_param or not body_data:
                self.send_json({"status": "error", "message": "Invalid data or missing ID parameter."}, 400)
                return
            try:
                new_cat = json.loads(body_data.decode('utf-8'))
                with open(categories_file, 'r', encoding='utf-8') as f:
                    categories = json.load(f)
                
                found = False
                for idx, cat in enumerate(categories):
                    if cat.get('id') == id_param:
                        categories[idx] = {**new_cat, "id": id_param}
                        found = True
                        break
                if not found:
                    categories.append({**new_cat, "id": id_param})
                    
                with open(categories_file, 'w', encoding='utf-8') as f:
                    json.dump(categories, f, indent=2, ensure_ascii=False)
                update_fallback_data_js()
                self.send_json({"status": "success", "message": "Category saved successfully."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'delete_category':
            if not check_auth(): return
            if not id_param:
                self.send_json({"status": "error", "message": "Missing ID parameter."}, 400)
                return
            try:
                with open(categories_file, 'r', encoding='utf-8') as f:
                    categories = json.load(f)
                
                initial_count = len(categories)
                categories = [c for c in categories if c.get('id') != id_param]
                
                if len(categories) == initial_count:
                    self.send_json({"status": "error", "message": "Category not found."}, 404)
                else:
                    with open(categories_file, 'w', encoding='utf-8') as f:
                        json.dump(categories, f, indent=2, ensure_ascii=False)
                    update_fallback_data_js()
                    self.send_json({"status": "success", "message": "Category deleted successfully."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'save_translations':
            if not check_auth(): return
            if not body_data:
                self.send_json({"status": "error", "message": "Invalid translation payload structure."}, 400)
                return
            try:
                new_trans = json.loads(body_data.decode('utf-8'))
                if 'tr' not in new_trans or 'en' not in new_trans:
                    self.send_json({"status": "error", "message": "Invalid translation payload structure."}, 400)
                    return
                
                # Backend Protection: Read existing data and merge missing keys
                if os.path.exists(translations_file):
                    try:
                        with open(translations_file, 'r', encoding='utf-8') as f:
                            existing = json.load(f)
                        if existing and 'tr' in existing and 'en' in existing:
                            for key, val in existing['tr'].items():
                                if key not in new_trans['tr']:
                                    new_trans['tr'][key] = val
                            for key, val in existing['en'].items():
                                if key not in new_trans['en']:
                                    new_trans['en'][key] = val
                    except Exception as merge_err:
                        print("Error merging translations on backend:", merge_err)

                with open(translations_file, 'w', encoding='utf-8') as f:
                    json.dump(new_trans, f, indent=2, ensure_ascii=False)
                update_fallback_data_js()
                self.send_json({"status": "success", "message": "Translations and site text saved successfully."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'save_machine':
            if not check_auth(): return
            if not id_param or not body_data:
                self.send_json({"status": "error", "message": "Invalid data or missing ID parameter."}, 400)
                return
            try:
                new_mach = json.loads(body_data.decode('utf-8'))
                with open(machines_file, 'r', encoding='utf-8') as f:
                    machines = json.load(f)
                
                found = False
                for idx, mach in enumerate(machines):
                    if mach.get('id') == id_param:
                        machines[idx] = {**new_mach, "id": id_param}
                        found = True
                        break
                if not found:
                    machines.append({**new_mach, "id": id_param})
                    
                with open(machines_file, 'w', encoding='utf-8') as f:
                    json.dump(machines, f, indent=2, ensure_ascii=False)
                update_fallback_data_js()
                self.send_json({"status": "success", "message": "Machine saved successfully."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'delete_machine':
            if not check_auth(): return
            if not id_param:
                self.send_json({"status": "error", "message": "Missing ID parameter."}, 400)
                return
            try:
                with open(machines_file, 'r', encoding='utf-8') as f:
                    machines = json.load(f)
                
                initial_count = len(machines)
                machines = [m for m in machines if m.get('id') != id_param]
                
                if len(machines) == initial_count:
                    self.send_json({"status": "error", "message": "Machine not found."}, 404)
                else:
                    with open(machines_file, 'w', encoding='utf-8') as f:
                        json.dump(machines, f, indent=2, ensure_ascii=False)
                    update_fallback_data_js()
                    self.send_json({"status": "success", "message": "Machine deleted successfully."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'delete_contact':
            if not check_auth(): return
            if not id_param:
                self.send_json({"status": "error", "message": "Missing ID parameter."}, 400)
                return
            try:
                with open(contacts_file, 'r', encoding='utf-8') as f:
                    contacts = json.load(f)
                
                initial_count = len(contacts)
                contacts = [c for c in contacts if c.get('id') != id_param]
                
                if len(contacts) == initial_count:
                    self.send_json({"status": "error", "message": "Contact submission not found."}, 404)
                else:
                    with open(contacts_file, 'w', encoding='utf-8') as f:
                        json.dump(contacts, f, indent=2, ensure_ascii=False)
                    self.send_json({"status": "success", "message": "Contact submission deleted successfully."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'change_password':
            if not check_auth(): return
            if not body_data:
                self.send_json({"status": "error", "message": "Invalid data payload."}, 400)
                return
            try:
                payload = json.loads(body_data.decode('utf-8'))
                current_pass = payload.get("current_password", "")
                new_pass = payload.get("new_password", "")
                
                creds_file = os.path.join(data_dir, 'credentials.json')
                
                if os.path.exists(creds_file):
                    with open(creds_file, 'r', encoding='utf-8') as f:
                        creds = json.load(f)
                    db_pass = creds.get("password", "admin123")
                    db_user = creds.get("username", "admin")
                else:
                    db_pass = "admin123"
                    db_user = "admin"
                    
                if current_pass != db_pass:
                    self.send_json({"status": "error", "message": "Mevcut şifre hatalı."}, 400)
                    return
                    
                if len(new_pass) < 4:
                    self.send_json({"status": "error", "message": "Yeni şifre en az 4 karakter olmalıdır."}, 400)
                    return
                    
                new_creds = {
                    "username": db_user,
                    "password": new_pass
                }
                
                with open(creds_file, 'w', encoding='utf-8') as f:
                    json.dump(new_creds, f, indent=2, ensure_ascii=False)
                    
                self.send_json({"status": "success", "message": "Şifreniz başarıyla değiştirildi."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif action == 'save_certificate':
            if not check_auth(): return
            if not body_data:
                self.send_json({"status": "error", "message": "Invalid data."}, 400)
                return
            try:
                new_cert = json.loads(body_data.decode('utf-8'))
                if not new_cert.get('title_tr') or not new_cert.get('title_en'):
                    self.send_json({"status": "error", "message": "Geçersiz sertifika verisi."}, 400)
                    return

                certs = []
                if os.path.exists(certificates_file):
                    with open(certificates_file, 'r', encoding='utf-8') as f:
                        certs = json.load(f)

                cert_id = new_cert.get('id')
                if not cert_id:
                    import time
                    cert_id = 'cert_' + str(int(time.time() * 1000))
                    new_cert['id'] = cert_id
                    certs.append(new_cert)
                else:
                    found = False
                    for idx, c in enumerate(certs):
                        if c.get('id') == cert_id:
                            certs[idx] = new_cert
                            found = True
                            break
                    if not found:
                        certs.append(new_cert)

                with open(certificates_file, 'w', encoding='utf-8') as f:
                    json.dump(certs, f, indent=2, ensure_ascii=False)
                update_fallback_data_js()
                self.send_json({"status": "success", "message": "Sertifika başarıyla kaydedildi.", "id": cert_id})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)

        elif action == 'delete_certificate':
            if not check_auth(): return
            if not id_param:
                self.send_json({"status": "error", "message": "Missing ID parameter."}, 400)
                return
            try:
                certs = []
                if os.path.exists(certificates_file):
                    with open(certificates_file, 'r', encoding='utf-8') as f:
                        certs = json.load(f)

                new_certs = [c for c in certs if c.get('id') != id_param]
                if len(new_certs) == len(certs):
                    self.send_json({"status": "error", "message": "Sertifika bulunamadı."}, 404)
                else:
                    with open(certificates_file, 'w', encoding='utf-8') as f:
                        json.dump(new_certs, f, indent=2, ensure_ascii=False)
                    update_fallback_data_js()
                    self.send_json({"status": "success", "message": "Sertifika başarıyla silindi."})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)

        else:
            self.send_json({"status": "error", "message": f"Action {action} not supported"}, 400)

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        if path == '/api/cms.php':
            query_params = parse_qs(parsed_url.query)
            action = query_params.get('action', [None])[0]
            id_param = query_params.get('id', [None])[0]
            self.handle_cms_request(action, id_param)
        else:
            # Clean URL fallback (e.g. /nevracms -> /nevracms.html)
            clean_path = path.strip('/')
            base_dir = os.path.dirname(os.path.abspath(__file__))
            if clean_path:
                potential_file = os.path.join(base_dir, clean_path + '.html')
                if os.path.exists(potential_file):
                    self.path = '/' + clean_path + '.html' + ('?' + parsed_url.query if parsed_url.query else '')
            super().do_GET()
            
    def do_HEAD(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        clean_path = path.strip('/')
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if clean_path:
            potential_file = os.path.join(base_dir, clean_path + '.html')
            if os.path.exists(potential_file):
                self.path = '/' + clean_path + '.html' + ('?' + parsed_url.query if parsed_url.query else '')
        super().do_HEAD()

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        if path == '/api/cms.php':
            query_params = parse_qs(parsed_url.query)
            action = query_params.get('action', [None])[0]
            id_param = query_params.get('id', [None])[0]
            
            content_length = int(self.headers.get('Content-Length', 0))
            body_data = self.rfile.read(content_length)
            self.handle_cms_request(action, id_param, body_data)
            
        elif path == '/api/upload.php':
            try:
                content_type = self.headers.get('Content-Type', '')
                if 'boundary=' not in content_type:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "Invalid Content-Type. Must be multipart/form-data."}).encode('utf-8'))
                    return
                
                boundary = content_type.split("boundary=")[1].encode('utf-8')
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                
                parts = body.split(b'--' + boundary)
                file_saved = False
                relative_url = ""
                
                for part in parts:
                    if b'name="file"' in part:
                        filename_match = re.search(rb'filename="([^"]+)"', part)
                        filename = "uploaded_file.png"
                        if filename_match:
                            filename = filename_match.group(1).decode('utf-8', errors='ignore')
                            filename = os.path.basename(filename)
                            filename = preg_replace_filename(filename)
                        
                        header_end = part.find(b'\r\n\r\n')
                        if header_end != -1:
                            file_data = part[header_end + 4:]
                            if file_data.endswith(b'\r\n'):
                                file_data = file_data[:-2]
                            
                            unique_name = f"{int(time.time())}_{random.randint(1000, 9999)}_{filename}"
                            
                            uploads_dir = os.path.join(os.getcwd(), 'uploads')
                            if not os.path.exists(uploads_dir):
                                os.makedirs(uploads_dir)
                                
                            filepath = os.path.join(uploads_dir, unique_name)
                            with open(filepath, 'wb') as f:
                                f.write(file_data)
                                
                            try:
                                from PIL import Image
                                img = Image.open(filepath)
                                w, h = img.size
                                max_sz = 1000
                                if w > max_sz or h > max_sz:
                                    if w > h:
                                        nw = max_sz
                                        nh = int(h * (max_sz / w))
                                    else:
                                        nh = max_sz
                                        nw = int(w * (max_sz / h))
                                    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
                                
                                ext = os.path.splitext(unique_name)[1].lower()
                                if ext in ['.jpg', '.jpeg']:
                                    img.save(filepath, 'JPEG', quality=80, optimize=True)
                                elif ext == '.png':
                                    img.save(filepath, 'PNG', optimize=True)
                                elif ext == '.webp':
                                    img.save(filepath, 'WEBP', quality=80)
                            except Exception as opt_err:
                                print(f"Local upload optimization failed: {opt_err}")
                            
                            relative_url = f"uploads/{unique_name}"
                            file_saved = True
                            break
                
                if file_saved:
                    self.send_json({
                        "status": "success",
                        "message": "File uploaded successfully locally.",
                        "url": relative_url
                    })
                else:
                    self.send_json({"status": "error", "message": "No file field found in form data."}, 400)
                    
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
                
        elif path == '/api/contact.php':
            try:
                content_type = self.headers.get('Content-Type', '')
                content_length = int(self.headers.get('Content-Length', 0))
                body_data = self.rfile.read(content_length)
                
                form_fields = {}
                if 'boundary=' in content_type:
                    boundary = content_type.split("boundary=")[1].encode('utf-8')
                    parts = body_data.split(b'--' + boundary)
                    for part in parts:
                        if b'name=' in part:
                            name_match = re.search(rb'name="([^"]+)"', part)
                            if name_match:
                                field_name = name_match.group(1).decode('utf-8', errors='ignore')
                                header_end = part.find(b'\r\n\r\n')
                                if header_end != -1:
                                    field_val = part[header_end + 4:]
                                    if field_val.endswith(b'\r\n'):
                                        field_val = field_val[:-2]
                                    form_fields[field_name] = field_val.decode('utf-8', errors='ignore').strip()
                else:
                    from urllib.parse import parse_qs as parse_form
                    parsed_form = parse_form(body_data.decode('utf-8', errors='ignore'))
                    for k, v in parsed_form.items():
                        if v:
                            form_fields[k] = v[0]
                
                # Honeypot Check
                if form_fields.get('website_hp'):
                    self.send_json({
                        "success": True,
                        "message": "Your price quote request has been received." if form_fields.get('purpose') == 'quote' else "Your message has been sent successfully."
                    })
                    return

                # Save submission to contacts.json
                data_dir = os.path.join(os.getcwd(), 'api', 'data')
                contacts_file = os.path.join(data_dir, 'contacts.json')
                contacts = []
                if os.path.exists(contacts_file):
                    with open(contacts_file, 'r', encoding='utf-8') as f:
                        contacts = json.load(f)
                
                submission = {
                    "id": f"contact_{int(time.time() * 1000)}",
                    "date": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "purpose": form_fields.get("purpose", "general"),
                    "name": form_fields.get("name", ""),
                    "company": form_fields.get("company", ""),
                    "email": form_fields.get("email", ""),
                    "phone": form_fields.get("phone", ""),
                    "product": form_fields.get("product", ""),
                    "qty": form_fields.get("qty", ""),
                    "machine": form_fields.get("machine", ""),
                    "capacity": form_fields.get("capacity", ""),
                    "message": form_fields.get("message", ""),
                    "lang": form_fields.get("lang", "tr")
                }
                
                contacts.append(submission)
                with open(contacts_file, 'w', encoding='utf-8') as f:
                    json.dump(contacts, f, indent=2, ensure_ascii=False)
                
                is_en = form_fields.get("lang", "tr") == "en"
                success_msg = "Your message has been sent successfully. We will get back to you shortly." if is_en else "Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz."
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": success_msg
                }, ensure_ascii=False).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": False,
                    "message": str(e)
                }).encode('utf-8'))
        else:
            super().do_POST()

def preg_replace_filename(filename):
    return re.sub(r'[^a-zA-Z0-9\._-]', '_', filename)

if __name__ == '__main__':
    # Initialize the local JSON databases
    init_database()
    
    port = 8090
    server_address = ('', port)
    httpd = HTTPServer(server_address, CustomHTTPRequestHandler)
    print(f"Custom dev server running on port {port} with upload & CMS simulator...")
    httpd.serve_forever()
