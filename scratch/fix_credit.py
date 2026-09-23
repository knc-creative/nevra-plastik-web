import os

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

# Target main injected footer layout
main_injected = """    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-flex">
          <p class="copyright">&copy; 2026 Nevra Plastik. <span data-translate-key="copyright_text">Tüm Hakları Saklıdır.</span></p>
          <p class="sustainable-signature">
            <span class="green-dot"></span> <span data-translate-key="foot_signature">Sürdürülebilir Gelecek İçin Döngüsel Çözümler</span>
          </p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; font-size: 0.8rem; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.75rem; margin-top: 0.75rem; color: rgba(255, 255, 255, 0.4); font-weight: 500; letter-spacing: 0.03em;">
          <span>Designed with ❤️ by </span>
          <a href="#" style="color: #2fb14d; font-weight: 700; text-decoration: none; margin-left: 0.25rem; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">KNC Creative</a>
        </div>
      </div>
    </div>"""

main_replacement = """    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container footer-bottom-flex">
        <p class="copyright">&copy; 2026 Nevra Plastik. <span data-translate-key="copyright_text">Tüm Hakları Saklıdır.</span> | Designed by <a href="#" style="color: #2fb14d; font-weight: 600; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">KNC Creative</a></p>
        <p class="sustainable-signature">
          <span class="green-dot"></span> <span data-translate-key="foot_signature">Sürdürülebilir Gelecek İçin Döngüsel Çözümler</span>
        </p>
      </div>
    </div>"""

# Target no comment injected footer layout
no_comment_injected = """    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-flex">
          <p class="copyright">&copy; 2026 Nevra Plastik. <span data-translate-key="copyright_text">Tüm Hakları Saklıdır.</span></p>
          <p class="sustainable-signature">
            <span class="green-dot"></span> <span data-translate-key="foot_signature">Sürdürülebilir Gelecek İçin Döngüsel Çözümler</span>
          </p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; font-size: 0.8rem; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.75rem; margin-top: 0.75rem; color: rgba(255, 255, 255, 0.4); font-weight: 500; letter-spacing: 0.03em;">
          <span>Designed with ❤️ by </span>
          <a href="#" style="color: #2fb14d; font-weight: 700; text-decoration: none; margin-left: 0.25rem; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">KNC Creative</a>
        </div>
      </div>
    </div>"""

no_comment_replacement = """    <div class="footer-bottom">
      <div class="container footer-bottom-flex">
        <p class="copyright">&copy; 2026 Nevra Plastik. <span data-translate-key="copyright_text">Tüm Hakları Saklıdır.</span> | Designed by <a href="#" style="color: #2fb14d; font-weight: 600; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">KNC Creative</a></p>
        <p class="sustainable-signature">
          <span class="green-dot"></span> <span data-translate-key="foot_signature">Sürdürülebilir Gelecek İçin Döngüsel Çözümler</span>
        </p>
      </div>
    </div>"""

# Target alternative injected footer layout
alt_injected = """    <!-- Copyright -->
    <div class="footer-bottom">
      <div class="container footer-bottom-container" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; justify-content: center; text-align: center;">
        <p class="copyright-text" data-translate-key="footer_copy" style="margin: 0;">&copy; 2026 Nevra Plastik. Tüm Hakları Saklıdır.</p>
        <div style="display: flex; justify-content: center; align-items: center; font-size: 0.8rem; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.5rem; width: 100%; max-width: 400px; color: rgba(255, 255, 255, 0.4); font-weight: 500; letter-spacing: 0.03em;">
          <span>Designed with ❤️ by </span>
          <a href="#" style="color: #2fb14d; font-weight: 700; text-decoration: none; margin-left: 0.25rem; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">KNC Creative</a>
        </div>
      </div>
    </div>"""

alt_replacement = """    <!-- Copyright -->
    <div class="footer-bottom">
      <div class="container footer-bottom-container" style="display: flex; justify-content: center; text-align: center;">
        <p class="copyright-text" data-translate-key="footer_copy" style="margin: 0;">&copy; 2026 Nevra Plastik. Tüm Hakları Saklıdır. | Designed by <a href="#" style="color: #2fb14d; font-weight: 600; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">KNC Creative</a></p>
      </div>
    </div>"""

for filename in os.listdir(workspace_dir):
    if filename.endswith(".html") and filename != "nevracms.html":
        filepath = os.path.join(workspace_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        modified = False
        if main_injected in content:
            content = content.replace(main_injected, main_replacement)
            modified = True
        elif no_comment_injected in content:
            content = content.replace(no_comment_injected, no_comment_replacement)
            modified = True
        elif alt_injected in content:
            content = content.replace(alt_injected, alt_replacement)
            modified = True
            
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed credit layout in: {filename}")
        else:
            print(f"No changes needed or matched in: {filename}")
