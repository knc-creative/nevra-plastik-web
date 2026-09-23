import os
import re

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

new_preloader_block = """<!-- Preloader Screen -->
  <div id="preloader">
    <!-- Concentric Motion Spinner Container -->
    <div class="preloader-motion-wrapper">
      <div class="preloader-spinner-outer"></div>
      <div class="preloader-spinner-inner"></div>
      <div class="preloader-logo-box">
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
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
      pointer-events: auto;
    }
    
    #preloader.hide-up {
      opacity: 0;
      pointer-events: none;
    }

    /* Concentric Motion Spinner Layout */
    .preloader-motion-wrapper {
      position: relative;
      width: 220px;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preloader-spinner-outer {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: #2fb14d;   /* Corporate Green */
      border-bottom-color: #3d71b7;/* Corporate Blue */
      animation: preloader-spin-clockwise 2.0s linear infinite;
    }

    .preloader-spinner-inner {
      position: absolute;
      width: 190px;
      height: 190px;
      border-radius: 50%;
      border: 3px solid transparent;
      border-left-color: #f68a35;  /* Corporate Orange */
      border-right-color: #f68a35; /* Corporate Orange */
      animation: preloader-spin-counter 1.5s linear infinite;
    }

    .preloader-logo-box {
      position: absolute;
      width: 140px;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }

    #PreloaderLogo {
      width: 120px;
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

    @keyframes preloader-spin-clockwise {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes preloader-spin-counter {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
  </style>"""

for filename in os.listdir(workspace_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(workspace_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Regex to match the preloader screen block and its inline style block
        pattern = r"<!-- Preloader Screen -->.*?<\/style>"
        new_content, count = re.subn(pattern, new_preloader_block, content, flags=re.DOTALL)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated preloader in: {filename}")
        else:
            print(f"No preloader pattern found in: {filename}")
