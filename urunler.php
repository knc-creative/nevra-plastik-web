<?php
/**
 * Nevra Plastik - Ürünler (Products Page)
 */
$pageTitle = "Ürünlerimiz | Geri Dönüştürülmüş Plastik Hammadde Grupları";
$pageDesc = "Nevra Plastik PP Moblen Granül, Elteks PE ve özel kompaund hammadde kategorilerimiz.";
include 'includes/header.php';
?>

  <main>
    
    <!-- Subpage Hero -->
    <section class="hero-section" style="padding-top: 12rem; padding-bottom: 4rem; background: var(--light-gray);">
      <div class="container text-center scroll-reveal">
        <span class="section-tag" data-translate-key="products_tag">Hammadde Grupları</span>
        <h1 class="hero-title" style="font-size: 3rem; margin-bottom: 1rem;" data-translate-key="products_title">Geri Dönüştürülmüş Endüstriyel Çözümler</h1>
        <p class="section-subtitle" style="margin-bottom: 0;" data-translate-key="products_subtitle">Üretim standartlarınızı yükseltecek kararlı ve yüksek performanslı plastik hammaddelerimiz.</p>
      </div>
    </section>

    <!-- Product Grid -->
    <section class="products-section" style="background-color: var(--white); padding: 6rem 0;">
      <div class="container">
        
        <div class="products-grid grid-3">
          
          <!-- Category 1: PP Moblen -->
          <div class="product-card scroll-reveal">
            <div class="product-img-wrapper">
              <img src="assets/product-pp.png" alt="PP Moblen Granül" class="product-img">
            </div>
            <div class="product-card-content">
              <h3 class="product-card-title">PP MOBLEN GRANÜL</h3>
              <p class="product-card-desc" data-translate-key="prod_pp_short">Polipropilen bazlı, enjeksiyonluk ve ekstrüzyonluk sınıflarda, yüksek mukavemetli granül hammaddeler.</p>
              <a href="urun-pp-moblen.php" class="btn btn-outline btn-sm btn-full" data-translate-key="prod_view_details">Teknik Sayfayı İncele</a>
            </div>
          </div>

          <!-- Category 2: Elteks -->
          <div class="product-card scroll-reveal">
            <div class="product-img-wrapper">
              <img src="assets/product-pe.png" alt="Elteks PE Granül" class="product-img">
            </div>
            <div class="product-card-content">
              <h3 class="product-card-title">ELTEKS</h3>
              <p class="product-card-desc" data-translate-key="prod_pe_short">Alçak Yoğunluk (AYPE) ve Yüksek Yoğunluk (YYPE) polietilen granüller, şişirmelik ve film üretimlerine uygun.</p>
              <a href="urun-elteks.php" class="btn btn-outline btn-sm btn-full" data-translate-key="prod_view_details">Teknik Sayfayı İncele</a>
            </div>
          </div>

          <!-- Category 3: Diğer -->
          <div class="product-card scroll-reveal">
            <div class="product-img-wrapper">
              <img src="assets/product-compound.png" alt="Diğer polimerler" class="product-img">
            </div>
            <div class="product-card-content">
              <h3 class="product-card-title" data-translate-key="prod_compound_title">DİĞER</h3>
              <p class="product-card-desc" data-translate-key="prod_compound_short">Kalsiyum karbonat, cam elyafı veya mineral dolgularla mekanik özellikleri güçlendirilmiş mühendislik polimerleri.</p>
              <a href="urun-diger.php" class="btn btn-outline btn-sm btn-full" data-translate-key="prod_view_details">Teknik Sayfayı İncele</a>
            </div>
          </div>

        </div>

      </div>
    </section>

  </main>

<?php include 'includes/footer.php'; ?>
