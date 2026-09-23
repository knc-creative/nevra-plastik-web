import os
import re

dir_path = '/Users/erenkonca/Desktop/nevra website'
html_files = [f for f in os.listdir(dir_path) if f.endswith('.html') and f != 'admin.html']

new_preloader_markup = """  <!-- Preloader Screen -->
  <div id="preloader">
    <!-- Staggered Layered Sheets (Corporate Colors) -->
    <div class="preloader-sheet sheet-green"></div>
    <div class="preloader-sheet sheet-blue"></div>
    <div class="preloader-sheet sheet-orange"></div>
    <div class="preloader-sheet sheet-main">
      <div class="preloader-container">
        <!-- Clean Official SVG Logo loaded via img to isolate CSS styles -->
        <img id="PreloaderLogo" src="uploads/1782162959_4446_nevra_gu_ncel_logo.svg" alt="Nevra Plastik Logo">
      </div>
    </div>
  </div>

  <style>
    /* Fixed parent viewport container */
    #preloader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99999;
      pointer-events: none;
      overflow: hidden;
    }
    
    /* Sheets styles with local transitions */
    .preloader-sheet {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: translateY(0);
      pointer-events: auto;
      transition: transform 0.6s cubic-bezier(0.85, 0, 0.15, 1);
    }

    .sheet-main { z-index: 99999; background: #ffffff; display: flex; align-items: center; justify-content: center; }
    .sheet-orange { z-index: 99998; background: #f68a35; }
    .sheet-blue { z-index: 99997; background: #3d71b7; }
    .sheet-green { z-index: 99996; background: #2fb14d; }

    #PreloaderLogo {
      width: 280px;
      height: auto;
      display: block;
      opacity: 0;
      transform: scale(0);
      animation: logo-scale-up 1.0s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes logo-scale-up {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .preloader-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 280px;
      height: 84px;
      overflow: visible;
    }

    /* Staggered layered sheets sliding up */
    #preloader.hide-up .sheet-main {
      transform: translateY(-100%);
      transition-delay: 0s;
    }
    #preloader.hide-up .sheet-orange {
      transform: translateY(-100%);
      transition-delay: 0.1s;
    }
    #preloader.hide-up .sheet-blue {
      transform: translateY(-100%);
      transition-delay: 0.2s;
    }
    #preloader.hide-up .sheet-green {
      transform: translateY(-100%);
      transition-delay: 0.3s;
    }
  </style>
"""

print(f"Injecting plain logo image scale preloader with corporate layers into {len(html_files)} HTML files...")

for file_name in sorted(html_files):
    file_path = os.path.join(dir_path, file_name)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Robust cleanup: replace everything from "<!-- Preloader Screen -->" to the first "<header" tag with "<header"
    cleaned_content, count = re.subn(r'<!-- Preloader Screen -->.*?<header', '<header', content, flags=re.DOTALL | re.IGNORECASE)
    
    if count > 0:
        print(f"  [Cleaned] Leftovers in {file_name}")
    else:
        cleaned_content = content
        
    # Search for <body ...>
    body_pattern = re.compile(r'(<body[^>]*>)', re.IGNORECASE)
    match = body_pattern.search(cleaned_content)
    if not match:
        print(f"  [Warning] Could not find <body> tag in {file_name}")
        continue
        
    body_tag = match.group(1)
    new_content = cleaned_content.replace(body_tag, f"{body_tag}\n{new_preloader_markup}")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"  [Injected] {file_name}")

print("\nFinished injection!")
