import os
import sys
import glob

# Ensure macOS user packages are in sys.path
py_ver = f"{sys.version_info.major}.{sys.version_info.minor}"
user_site = os.path.expanduser(f"~/Library/Python/{py_ver}/lib/python/site-packages")
if os.path.exists(user_site) and user_site not in sys.path:
    sys.path.append(user_site)

# Ensure Pillow is installed
try:
    from PIL import Image
except ImportError:
    print("Pillow is not installed. Installing it via pip...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def optimize_image(filepath):
    try:
        # Load image
        img = Image.open(filepath)
        orig_width, orig_height = img.size
        
        # Determine maximum size
        max_size = 1000
        if orig_width > max_size or orig_height > max_size:
            # Calculate new size keeping aspect ratio
            if orig_width > orig_height:
                new_width = max_size
                new_height = int(orig_height * (max_size / orig_width))
            else:
                new_height = max_size
                new_width = int(orig_width * (max_size / orig_height))
                
            print(f"Resizing {os.path.basename(filepath)}: {orig_width}x{orig_height} -> {new_width}x{new_height}")
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Save image back to the same path with optimization
        ext = os.path.splitext(filepath)[1].lower()
        if ext in ['.jpg', '.jpeg']:
            img.save(filepath, 'JPEG', quality=80, optimize=True)
        elif ext == '.png':
            img.save(filepath, 'PNG', optimize=True)
        elif ext == '.webp':
            img.save(filepath, 'WEBP', quality=80)
            
        new_size = os.path.getsize(filepath)
        print(f"Optimized {os.path.basename(filepath)}: {new_size / 1024:.1f} KB")
        return True
    except Exception as e:
        print(f"Error optimizing {filepath}: {e}")
        return False

def main():
    uploads_dir = os.path.join(os.getcwd(), 'uploads')
    if not os.path.exists(uploads_dir):
        print("Uploads directory not found.")
        return
        
    image_patterns = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG', '*.WEBP']
    files_to_process = []
    for pattern in image_patterns:
        files_to_process.extend(glob.glob(os.path.join(uploads_dir, pattern)))
        
    files_to_process = list(set(files_to_process)) # remove duplicates
    print(f"Found {len(files_to_process)} images to optimize.")
    
    success_count = 0
    for filepath in files_to_process:
        if optimize_image(filepath):
            success_count += 1
            
    print(f"Optimization completed. Successfully optimized {success_count}/{len(files_to_process)} images.")

if __name__ == '__main__':
    main()
