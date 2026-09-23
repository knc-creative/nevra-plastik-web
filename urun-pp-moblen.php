<?php
/**
 * Nevra Plastik - PP Moblen Granül Detay Sayfası
 */
$pageTitle = "PP Moblen Granül | Polipropilen Hammadde | Nevra Plastik";
$pageDesc = "Nevra Plastik PP Moblen Granül teknik özellikleri, eriyik akış hızı (MFI) tabloları ve kullanım alanları.";
include 'includes/header.php';
?>

  <main>
    
    <!-- Hero -->
    <section class="hero-section" style="padding-top: 12rem; padding-bottom: 4rem; background: var(--light-gray);">
      <div class="container text-center scroll-reveal">
        <span class="section-tag" data-translate-key="products_tag">Polipropilen Matris</span>
        <h1 class="hero-title" style="font-size: 3rem; margin-bottom: 1rem;">PP MOBLEN GRANÜL</h1>
        <p class="section-subtitle" style="margin-bottom: 0;" data-translate-key="pp_hero_sub">Yüksek darbe mukavemeti ve kararlı eriyik akış özellikleri sunan polipropilen granül çözümlerimiz.</p>
      </div>
    </section>

    <!-- Content & Specs -->
    <section style="background-color: var(--white); padding: 6rem 0;">
      <div class="container grid-2 align-center">
        
        <!-- Visual -->
        <div class="product-visual scroll-reveal">
          <div class="image-wrapper glass-effect" style="padding: 15px; border-radius: 20px;">
            <img src="assets/product-pp.png" alt="PP Moblen Granül Hammadde" class="product-img" style="border-radius: 12px; width: 100%;">
          </div>
        </div>

        <!-- Description & Technical Data -->
        <div class="product-content scroll-reveal">
          <span class="section-tag" data-translate-key="modal_specs">Teknik Özellikler</span>
          <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;" data-translate-key="pp_detail_title">Polipropilen (PP) Granül Hammadde</h2>
          <p class="about-text" data-translate-key="pp_detail_desc">
            Nevra Plastik PP Moblen Granüllerimiz, yüksek darbe dayanımı ve mükemmel kimyasal direnç özellikleri ile üretilmektedir. Enjeksiyon kalıplama ve ekstrüzyon hatlarında güvenle kullanılabilir. Otomotiv, ambalaj, beyaz eşya ve bahçe mobilyaları gibi sanayi kollarında sıklıkla tercih edilen kararlı formülasyonlardır.
          </p>

          <table class="specs-table" style="margin-top: 2rem;">
            <tbody>
              <tr>
                <td class="spec-name" data-translate-key="spec_mfi">Eriyik Akış Hızı (MFI)</td>
                <td class="spec-value">10 - 25 g/10 min (230°C / 2.16 kg)</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_density">Yoğunluk</td>
                <td class="spec-value">0.90 - 0.92 g/cm³</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_color">Renk Seçenekleri</td>
                <td class="spec-value" data-translate-key="pp_color_val">Siyah, Beyaz, Gri ve Özel Renkler</td>
              </tr>
              <tr>
                <td class="spec-name" data-translate-key="spec_usage">Önerilen Kullanım</td>
                <td class="spec-value" data-translate-key="pp_usage_val">Plastik Kasa, Kova, Boru Ekleme Parçaları, Otomotiv Yan Sanayi</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 3rem;">
            <a href="iletisim.php?purpose=quote&product=pp" class="btn btn-primary" data-translate-key="modal_quote_btn">Bu Ürün İçin Teklif İste</a>
          </div>
        </div>

      </div>
    </section>

  </main>

<?php include 'includes/footer.php'; ?>
