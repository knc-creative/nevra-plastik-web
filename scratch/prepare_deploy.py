import os
import shutil
import zipfile

workspace_dir = "/Users/erenkonca/Desktop/nevra website"
deploy_dir = os.path.join(workspace_dir, "deploy_v2")
temp_dir = os.path.join(deploy_dir, "nevra-site")

# Remove existing deploy folder to start fresh
if os.path.exists(deploy_dir):
    shutil.rmtree(deploy_dir)

os.makedirs(temp_dir, exist_ok=True)

# 1. Copy all HTML, XML, and TXT files from workspace root
print("Copying HTML, XML, and TXT files...")
for filename in os.listdir(workspace_dir):
    if filename.endswith(".html") or filename in ["robots.txt", "sitemap.xml"]:
        shutil.copy2(
            os.path.join(workspace_dir, filename),
            os.path.join(temp_dir, filename)
        )

# 2. Copy necessary folders recursively
folders_to_copy = ["api", "assets", "css", "js", "uploads"]
for folder in folders_to_copy:
    src_folder = os.path.join(workspace_dir, folder)
    if os.path.exists(src_folder):
        print(f"Copying {folder} folder...")
        dest_folder = os.path.join(temp_dir, folder)
        # Custom copytree to exclude .DS_Store files
        shutil.copytree(
            src_folder,
            dest_folder,
            ignore=shutil.ignore_patterns(".DS_Store", "*.pyc", "__pycache__")
        )

# 3. Create production .htaccess file inside deploy package
print("Creating production .htaccess file...")
htaccess_content = """# JSON veritabanı dosyalarına doğrudan tarayıcı erişimini engelle
<FilesMatch "\\.(json)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# PHP ve dizinlerin dışarıdan doğrudan listelenmesini engelle
Options -Indexes

# HTTPS yönlendirmesi (SSL aktifse) ve Temiz URL yönlendirmeleri
RewriteEngine On

# HTTPS yönlendirmesi (En başta olmalıdır)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# admin.html veya /admin çağrılarını engelle (404 döndür)
RewriteRule ^admin(\\.html)?$ - [R=404,L]

# Doğrudan .html ile biten istekleri temiz URL'e yönlendir (301 Yönlendirmesi)
RewriteCond %{THE_REQUEST} \\s/+(.+?)\\.html[\\s?] [NC]
RewriteRule ^ /%1 [R=301,L]

# Uzantısız URL isteklerini arka planda .html dosyasına eşle
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L,QSA]
"""


with open(os.path.join(temp_dir, ".htaccess"), "w", encoding="utf-8") as f:
    f.write(htaccess_content)

# 4. Zip the contents of nevra-site folder
zip_filepath = os.path.join(deploy_dir, "nevra-site-v2.zip")
print(f"Zipping contents into {zip_filepath}...")

with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            file_path = os.path.join(root, file)
            # Make the path relative to temp_dir so it extracts correctly in public_html
            arcname = os.path.relpath(file_path, temp_dir)
            zipf.write(file_path, arcname)

# 5. Clean up temporary unzipped folder
print("Cleaning up temporary folders...")
shutil.rmtree(temp_dir)

print("Deploy package prepared successfully!")
