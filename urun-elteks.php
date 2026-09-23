<?php
/**
 * Nevra Plastik - Elteks PE Granül Detay Sayfası
 */
$pageTitle = "Elteks PE Granül | Polietilen Hammadde | Nevra Plastik";
$pageDesc = "Nevra Plastik Elteks PE Granül teknik özellikleri, film ve şişirme tip MFI tablosu ve kullanım alanları.";
include 'includes/header.php';
?>

  <main>
    
    <!-- Hero -->
    <section class="hero-section" style="padding-top: 12rem; padding-bottom: 4rem; background: var(--light-gray);">
      <div class="container text-center scroll-reveal">
        <span class="section-tag" data-translate-key="products_tag">Polietilen Matris</span>
        <h1 class="hero-title" style="font-size: 3rem; margin-bottom: 1rem;">ELTEKS</h1>
        <p class="section-subtitle" style="margin-bottom: 0;" data-translate-key="pe_hero_sub">Yüksek gerilme mukavemeti ve esneklik sunan Alçak Yoğunluklu (AYPE) ve Yüksek Yoğunluklu (YYPE) polietilen granüllerimiz.</p>
      </div>
    </section>

    <!-- Content & Specs -->
    <section style="background-color: var(--white); padding: 6rem 0;">
      <div class="container grid-2 align-center">
        
        <!-- Visual -->
        <div class="product-visual scroll-reveal">
          <div class="image-wrapper glass-effect" style="padding: 15px; border-radius: 20px;">
            <img src="assets/product-pe.png" alt="Elteks PE Granül Hammadde" class="product-img" style="border-radius: 12px; width: 100%;">
          </div>
        </div>

        <!-- Description & Technical Data -->
        <div class="product-content scroll-reveal">
          <span class="section-tag" data-translate-key="modal_specs">Teknik Özellikler</span>
          <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;" data-translate-key="pe_detail_title">Elteks (PE) Granül Hammadde</h2>
          <p class="about-text" data-translate-key="pe_detail_desc">
            Yüksek Yoğunluklu (YYPE / HDPE) ve Alçak Yoğunluklu (AYPE / LDPE) polietilen granüllerimiz, mükemmel esneklik ve yüksek gerilme direnci sunar. Ekstrüzyon, şişirme ve film hatları için özel elenmiş ve yıkanmış temiz hammaddelerden homojenize edilerek üretilir.
          </p>

          <table class="specs-table" style="margin-top: 2rem;">
            <tbody>
              <tr>
                <td class="spec-name" data-translate-key="spec_mfi">Eriyik Akış Hızı (MFI)</td>
                <td class="spec-value">0.1 - 2.5 g/10 min (190°C / 2.16 kg)</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_density">Yoğunluk</td>
                <td class="spec-value">0.92 - 0.96 g/cm³</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_color">Renk Seçenekleri</td>
                <td class="spec-value" data-translate-key="pe_color_val">Siyah, Mavi, Şeffaf ve Naturel</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_usage">Önerilen Kullanım</td>
                <td class="spec-value" data-translate-key="pe_usage_val">Altyapı Boruları, Damla Sulama Boruları, Çöp Torbaları, Plastik Şişeler</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 3rem;">
            <a href="iletisim.php?purpose=quote&product=pe" class="btn btn-primary" data-translate-key="modal_quote_btn">Bu Ürün İçin Teklif İste</a>
          </div>
        </div>

      </div>
    </section>

  </main>

<?php include 'includes/footer.php'; ?>
