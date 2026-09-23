import os

workspace_dir = "/Users/erenkonca/Desktop/nevra website"

old_footer = """    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container footer-bottom-flex">
        <p class="copyright">&copy; 2026 Nevra Plastik. <span data-translate-key="copyright_text">Tüm Hakları Saklıdır.</span></p>
        <p class="sustainable-signature">
          <span class="green-dot"></span> <span data-translate-key="foot_signature">Sürdürülebilir Gelecek İçin Döngüsel Çözümler</span>
        </p>
      </div>
    </div>"""

new_footer = """    <!-- Footer Bottom -->
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

old_footer_no_comment = """    <div class="footer-bottom">
      <div class="container footer-bottom-flex">
        <p class="copyright">&copy; 2026 Nevra Plastik. <span data-translate-key="copyright_text">Tüm Hakları Saklıdır.</span></p>
        <p class="sustainable-signature">
          <span class="green-dot"></span> <span data-translate-key="foot_signature">Sürdürülebilir Gelecek İçin Döngüsel Çözümler</span>
        </p>
      </div>
    </div>"""

new_footer_no_comment = """    <div class="footer-bottom">
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

old_footer_alt = """    <!-- Copyright -->
    <div class="footer-bottom">
      <div class="container footer-bottom-container">
        <p class="copyright-text" data-translate-key="footer_copy">&copy; 2026 Nevra Plastik. Tüm Hakları Saklıdır.</p>
      </div>
    </div>"""

new_footer_alt = """    <!-- Copyright -->
    <div class="footer-bottom">
      <div class="container footer-bottom-container" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; justify-content: center; text-align: center;">
        <p class="copyright-text" data-translate-key="footer_copy" style="margin: 0;">&copy; 2026 Nevra Plastik. Tüm Hakları Saklıdır.</p>
        <div style="display: flex; justify-content: center; align-items: center; font-size: 0.8rem; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.5rem; width: 100%; max-width: 400px; color: rgba(255, 255, 255, 0.4); font-weight: 500; letter-spacing: 0.03em;">
          <span>Designed with ❤️ by </span>
          <a href="#" style="color: #2fb14d; font-weight: 700; text-decoration: none; margin-left: 0.25rem; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">KNC Creative</a>
        </div>
      </div>
    </div>"""

for filename in os.listdir(workspace_dir):
    if filename.endswith(".html") and filename != "nevracms.html":
        filepath = os.path.join(workspace_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already injected
        if "KNC Creative" in content:
            print(f"Credit already injected in: {filename}")
            continue
            
        if old_footer in content:
            new_content = content.replace(old_footer, new_footer)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected KNC Creative credit in: {filename}")
        elif old_footer_no_comment in content:
            new_content = content.replace(old_footer_no_comment, new_footer_no_comment)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected KNC Creative credit (no comment format) in: {filename}")
        elif old_footer_alt in content:
            new_content = content.replace(old_footer_alt, new_footer_alt)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected KNC Creative credit (alt format) in: {filename}")
        else:
            print(f"Footer match failed in: {filename}")
