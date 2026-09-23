<?php
/**
 * Nevra Plastik - Diğer (Katkılı Kompaund & Formülasyonlar) Detay Sayfası
 */
$pageTitle = "Kompaund & Formülasyonlar | Diğer Polimerler | Nevra Plastik";
$pageDesc = "Nevra Plastik dolgulu kompaundlar, kalsitli ve cam elyaflı polimerler, müşteriye özel formülasyon detayları.";
include 'includes/header.php';
?>

  <main>
    
    <!-- Hero -->
    <section class="hero-section" style="padding-top: 12rem; padding-bottom: 4rem; background: var(--light-gray);">
      <div class="container text-center scroll-reveal">
        <span class="section-tag" data-translate-key="products_tag">Özel Reçeteler</span>
        <h1 class="hero-title" style="font-size: 3rem; margin-bottom: 1rem;">DİĞER ÜRÜNLER</h1>
        <p class="section-subtitle" style="margin-bottom: 0;" data-translate-key="compound_hero_sub">Laboratuvarımızda B2B iş ortaklarımızın makine ve kalıp yapısına özel olarak reçetelendirilen polimer formülleri.</p>
      </div>
    </section>

    <!-- Content & Specs -->
    <section style="background-color: var(--white); padding: 6rem 0;">
      <div class="container grid-2 align-center">
        
        <!-- Visual -->
        <div class="product-visual scroll-reveal">
          <div class="image-wrapper glass-effect" style="padding: 15px; border-radius: 20px;">
            <img src="assets/product-compound.png" alt="Dolgulu Kompaund Hammadde" class="product-img" style="border-radius: 12px; width: 100%;">
          </div>
        </div>

        <!-- Description & Technical Data -->
        <div class="product-content scroll-reveal">
          <span class="section-tag" data-translate-key="modal_specs">Teknik Özellikler</span>
          <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;" data-translate-key="compound_detail_title">Kompaund ve Özel Formülasyonlar</h2>
          <p class="about-text" data-translate-key="compound_detail_desc">
            Geri dönüştürülmüş PP ve PE matrislerine kalsiyum karbonat (kalsit), cam elyafı, talik veya mineral dolgular eklenerek üretilen yüksek performanslı özel kompaundlar ve terzi usulü formülasyonlar. Orijinal hammaddeye en yakın mekanik ve termal özellikleri sağlamak üzere AR-GE laboratuvarımızda geliştirilmiştir.
          </p>

          <table class="specs-table" style="margin-top: 2rem;">
            <tbody>
              <tr>
                <td class="spec-name" data-translate-key="spec_mfi">Eriyik Akış Hızı (MFI)</td>
                <td class="spec-value" data-translate-key="custom_mfi_val">Müşteri talebine ve reçeteye özel ayarlanır</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_density">Yoğunluk</td>
                <td class="spec-value">0.95 - 1.25 g/cm³ (Dolgu oranına bağlı)</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_color">Renk Seçenekleri</td>
                <td class="spec-value" data-translate-key="compound_color_val">Ral Kodları, Numune Eşleştirmeli Renkler, Siyah, Koyu Gri</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_usage">Önerilen Kullanım</td>
                <td class="spec-value" data-translate-key="compound_usage_val">Otomotiv Trim Aksamı, Yüksek Mukavemet Gerektiren Endüstriyel Gövdeler</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 3rem;">
            <a href="iletisim.php?purpose=quote&product=other" class="btn btn-primary" data-translate-key="modal_quote_btn">Bu Ürün İçin Teklif İste</a>
          </div>
        </div>

      </div>
    </section>

  </main>

<?php include 'includes/footer.php'; ?>
