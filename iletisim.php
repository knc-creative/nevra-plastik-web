<?php
/**
 * Nevra Plastik - İletişim (Contact)
 */
$pageTitle = "İletişim | Bize Ulaşın | Nevra Plastik";
$pageDesc = "Nevra Plastik Konya fabrikası iletişim bilgileri, harita konumu ve B2B fiyat teklifi talep formu.";
include 'includes/header.php';

// Retrieve URL parameters for smart pre-selection
$purpose = isset($_GET['purpose']) ? trim($_GET['purpose']) : 'general';
$product = isset($_GET['product']) ? trim($_GET['product']) : 'pp';
?>

  <main>
    
    <!-- Subpage Hero -->
    <section class="hero-section" style="padding-top: 12rem; padding-bottom: 4rem; background: var(--light-gray);">
      <div class="container text-center scroll-reveal">
        <span class="section-tag" data-translate-key="contact_tag">İrtibat</span>
        <h1 class="hero-title" style="font-size: 3rem; margin-bottom: 1rem;" data-translate-key="contact_title">Projeniz İçin Doğru Hammaddeyi Birlikte Belirleyelim</h1>
        <p class="section-subtitle" style="margin-bottom: 0;" data-translate-key="contact_hero_sub">Nevra Plastik teknik kadrosu, ihtiyaçlarınıza özel çözümler üretmek için hizmetinizdedir.</p>
      </div>
    </section>

    <!-- Main Contact Grid -->
    <section class="contact-section" style="background-color: var(--white); padding: 6rem 0;">
      <div class="container grid-2">
        
        <!-- Left: Details & Map -->
        <div class="contact-info-block scroll-reveal">
          <div>
            <h2 class="section-title" style="font-size: 1.85rem; margin-bottom: 2rem;" data-translate-key="contact_details_title">Nevra Plastik İletişim Bilgileri</h2>
            
            <div class="info-items">
              <!-- Telefon -->
              <div class="info-item">
                <div class="info-icon-wrapper" style="color: var(--primary);">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 01-4.5-4.5c-.155-.44.01-1.04.386-1.322l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.107a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <span class="info-label" data-translate-key="info_phone">Telefon</span>
                  <a href="tel:+903323559656" class="info-value">+90 332 355 96 56</a>
                </div>
              </div>

              <!-- E-posta -->
              <div class="info-item">
                <div class="info-icon-wrapper" style="color: var(--primary);">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <span class="info-label" data-translate-key="info_email">E-posta</span>
                  <a href="mailto:info@nevraplastik.com" class="info-value">info@nevraplastik.com</a>
                </div>
              </div>

              <!-- Adres -->
              <div class="info-item">
                <div class="info-icon-wrapper" style="color: var(--primary);">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <span class="info-label" data-translate-key="info_address">Adres</span>
                  <address class="info-value address-style">
                    Tatlıcak Mah. Vatan Sanayi Sitesi,<br>Işıldak Sk. No:30/32, 42050 Karatay / KONYA
                  </address>
                </div>
              </div>
            </div>
          </div>

          <!-- Maps Embed -->
          <div class="map-wrapper decorative-border" style="margin-top: 2rem;">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5142.704870307394!2d32.56357907727235!3d37.86966857196174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d09bb60603f3cf%3A0xe5f5b01672b8b4ea!2sNevra%20Plastik!5e1!3m2!1str!2str!4v1784064493476!5m2!1str!2str" 
              width="100%" 
              height="300" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              title="Nevra Plastik Harita Konumu">
            </iframe>
          </div>
        </div>

        <!-- Right: Glassmorphic Form -->
        <div class="contact-form-block glass-effect scroll-reveal">
          
          <!-- Form Toggle -->
          <div class="form-toggle-wrapper">
            <button type="button" class="form-toggle-btn <?php echo ($purpose === 'general') ? 'active' : ''; ?>" id="toggle-general" data-translate-key="form_toggle_general">Genel İletişim</button>
            <button type="button" class="form-toggle-btn <?php echo ($purpose === 'quote') ? 'active' : ''; ?>" id="toggle-quote" data-translate-key="form_toggle_quote">Hammadde Teklifi Al</button>
          </div>

          <!-- Main Form -->
          <form action="api/contact.php" method="POST" id="corporate-form" class="corporate-form">
            <input type="hidden" name="csrf_token" id="csrf_token" value="">
            <input type="hidden" name="form_purpose" id="form-purpose" value="<?php echo htmlspecialchars($purpose); ?>">

            <!-- Honeypot Anti-Spam protection (hidden from humans) -->
            <div style="display: none !important;">
              <input type="text" name="website_hp" id="website_hp" tabindex="-1" autocomplete="off">
            </div>

            <div class="form-grid">
              
              <!-- Ad Soyad -->
              <div class="form-group">
                <label for="form-name"><span data-translate-key="form_name">Ad Soyad</span> <span class="required">*</span></label>
                <input type="text" name="name" id="form-name" placeholder="Örn: Ahmet Yılmaz" required autocomplete="name">
                <span class="error-msg" data-translate-key="err_name">Lütfen adınızı ve soyadınızı giriniz.</span>
              </div>

              <!-- Şirket Adı -->
              <div class="form-group">
                <label for="form-company"><span data-translate-key="form_company">Şirket Adı</span> <span class="required">*</span></label>
                <input type="text" name="company" id="form-company" placeholder="Örn: Nevra Plastik A.Ş." required autocomplete="organization">
                <span class="error-msg" data-translate-key="err_company">Lütfen şirket adını giriniz.</span>
              </div>

              <!-- E-posta -->
              <div class="form-group">
                <label for="form-email"><span data-translate-key="form_email">E-posta</span> <span class="required">*</span></label>
                <input type="email" name="email" id="form-email" placeholder="ahmet@sirketiniz.com" required autocomplete="email">
                <span class="error-msg" data-translate-key="err_email">Lütfen geçerli bir e-posta adresi giriniz.</span>
              </div>

              <!-- Telefon -->
              <div class="form-group">
                <label for="form-phone"><span data-translate-key="form_phone">Telefon</span> <span class="required">*</span></label>
                <input type="tel" name="phone" id="form-phone" placeholder="0555 123 45 67" required autocomplete="tel">
                <span class="error-msg" data-translate-key="err_phone">Lütfen geçerli bir telefon numarası giriniz.</span>
              </div>

              <!-- Product Dropdown (Quote Mode) -->
              <div class="form-group full-width quote-only" style="display: <?php echo ($purpose === 'quote') ? 'flex' : 'none'; ?>;">
                <label for="form-product" data-translate-key="form_product">Talep Edilen Hammadde</label>
                <select name="product" id="form-product">
                  <option value="pp" <?php echo ($product === 'pp') ? 'selected' : ''; ?> data-translate-key="opt_pp_moblen">PP Moblen Granül</option>
                  <option value="pe" <?php echo ($product === 'pe') ? 'selected' : ''; ?> data-translate-key="opt_elteks">Elteks PE Granül</option>
                  <option value="other" <?php echo ($product === 'other' || $product === 'compound' || $product === 'custom') ? 'selected' : ''; ?> data-translate-key="opt_other">Diğer (Kompaund & Formülasyon)</option>
                </select>
              </div>

              <!-- Monthly Quantity (Quote Mode) -->
              <div class="form-group full-width quote-only" style="display: <?php echo ($purpose === 'quote') ? 'flex' : 'none'; ?>;">
                <label for="form-quantity" data-translate-key="form_qty">Tahmini Aylık Tüketim Miktarı (Ton)</label>
                <input type="number" name="quantity" id="form-quantity" min="0" step="any" placeholder="Örn: 10">
              </div>

              <!-- Mesaj -->
              <div class="form-group full-width">
                <label for="form-message"><span data-translate-key="form_message">Mesajınız / Teknik Talepleriniz</span> <span class="required">*</span></label>
                <textarea name="message" id="form-message" rows="4" placeholder="Talebinizi, teknik şartlarınızı veya sormak istediklerinizi buraya yazabilirsiniz..." required></textarea>
                <span class="error-msg" data-translate-key="err_message">Lütfen bir mesaj yazınız.</span>
              </div>

            </div>

            <!-- KVKK Checkbox -->
            <div class="form-checkbox">
              <input type="checkbox" name="kvkk" id="form-kvkk" required>
              <label for="form-kvkk" class="checkbox-label">
                <span data-translate-key="form_kvkk_text">Nevra Plastik Kişisel Verilerin Korunması Politikasını okudum ve kabul ediyorum.</span> <span class="required">*</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-full submit-btn" id="form-submit-btn" data-translate-key="form_submit">Mesajı Gönder</button>

            <!-- Form Alert Box -->
            <div class="form-alert" id="form-alert-box" style="display: none;">
              <span class="alert-message"></span>
            </div>
          </form>

        </div>

      </div>
    </section>

  </main>

<?php include 'includes/footer.php'; ?>
