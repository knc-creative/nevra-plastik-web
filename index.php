<?php
/**
 * Nevra Plastik - Anasayfa (Home)
 */
$pageTitle = "Nevra Plastik | Geri Dönüştürülmüş Plastik Hammadde Üreticisi";
$pageDesc = "Nevra Plastik, 2007 yılından bu yana lisanslı, çevre standartlarına uygun ve tamamen izlenebilir üretim süreçleriyle yüksek kaliteli geri dönüştürülmüş plastik hammaddeler üretmektedir.";
include 'includes/header.php';
?>

  <main>
    
    <!-- Hero Section -->
    <section class="hero-section" id="home">
      <div class="container hero-container grid-2">
        <div class="hero-content">
          <span class="hero-tagline scroll-reveal" data-translate-key="hero_tagline">2007'den Beri Sürdürülebilir Gelecek</span>
          <h1 class="hero-title scroll-reveal" data-translate-key="hero_title">Bugünün Atıklarını, Yarının Değerine Dönüştürüyoruz.</h1>
          <p class="hero-description scroll-reveal" data-translate-key="hero_desc">
            Nevra Plastik, 2007 yılından bu yana lisanslı, çevre standartlarına uygun ve tamamen izlenebilir üretim süreçleriyle yüksek kaliteli geri dönüştürülmüş plastik hammaddeler üretmektedir.
          </p>
          <div class="hero-actions scroll-reveal">
            <a href="urunler.php" class="btn btn-primary" data-translate-key="cta_explore">Ürünleri İncele</a>
            <a href="iletisim.php?purpose=quote" class="btn btn-secondary" data-translate-key="cta_quote_long">Teklif Talep Et</a>
          </div>
        </div>
        <div class="hero-visual scroll-reveal">
          <div class="image-wrapper glass-effect">
            <img src="uploads/1782162829_2949_a685cf01-90a2-4c1a-b70b-37d38e13cce4.png" alt="Nevra Plastik Geri Dönüştürülmüş Plastik Granülleri" class="hero-img">
          </div>
        </div>
      </div>
    </section>

    <!-- Hakkımızda Bölümü (Özet) -->
    <section class="about-section" id="hakkimizda">
      <div class="container grid-2 align-center">
        <div class="about-visual scroll-reveal">
          <div class="image-wrapper decorative-border">
            <img src="uploads/1784066104_1444_hakk_m_zda-nevra.png" alt="Nevra Plastik Modern Üretim Tesisi" class="about-img">
          </div>
        </div>
        <div class="about-content scroll-reveal">
          <span class="section-tag" data-translate-key="about_tag">Biz Kimiz?</span>
          <h2 class="section-title" data-translate-key="about_title">Değer Katan Geri Dönüşüm, Güvenilir Hammadde</h2>
          <p class="about-text" data-translate-key="about_desc_1">
            Nevra Plastik, 2007 yılında Konya'da kurulmuş olup, endüstriyel ve evsel plastik atıkları yeniden ekonomiye kazandırarak yüksek kalitede geri dönüştürülmüş polimer hammaddeler üretmektedir. Sektördeki 19 yıllık uzmanlığımızla, plastik üreticilerine çevre dostu, ekonomik ve standart kalitede sürdürülebilir hammaddeler temin ediyoruz.
          </p>
          <div class="about-values">
            <div class="value-item">
              <span class="value-number" data-count="19">0</span>
              <span class="value-label" data-translate-key="val_years">Yıllık Tecrübe</span>
            </div>
            <div class="value-item">
              <span class="value-number" data-count="15000">0</span>
              <span class="value-label" data-translate-key="val_capacity">Yıllık Kapasite (Ton)</span>
            </div>
            <div class="value-item">
              <span class="value-number" data-count="100">%0</span>
              <span class="value-label" data-translate-key="val_trace">İzlenebilir Süreç</span>
            </div>
          </div>
          <div style="margin-top: 2.5rem;">
            <a href="hakkimizda.php" class="btn btn-primary" data-translate-key="read_more">Kurumsal Detaylar</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Ürün Grupları (Özet) -->
    <section class="products-section" id="urunler">
      <div class="container">
        <div class="section-header text-center scroll-reveal">
          <span class="section-tag" data-translate-key="products_tag">Geniş Ürün Yelpazesi</span>
          <h2 class="section-title" data-translate-key="products_title">Geri Dönüştürülmüş Endüstriyel Çözümler</h2>
          <p class="section-subtitle" data-translate-key="products_subtitle">Üretim standartlarınızı yükseltecek kararlı ve yüksek performanslı plastik hammaddelerimiz.</p>
        </div>

        <div class="products-grid grid-3">
          
          <!-- Product Card 1: PP Moblen -->
          <div class="product-card scroll-reveal">
            <div class="product-img-wrapper">
              <img src="assets/product-pp.png" alt="PP Moblen Granül" class="product-img">
            </div>
            <div class="product-card-content">
              <h3 class="product-card-title">PP MOBLEN GRANÜL</h3>
              <p class="product-card-desc" data-translate-key="prod_pp_short">Polipropilen bazlı, enjeksiyonluk ve ekstrüzyonluk sınıflarda, yüksek mukavemetli granül hammaddeler.</p>
              <a href="urun-pp-moblen.php" class="btn btn-outline btn-sm btn-full" data-translate-key="prod_view_details">Detayları İncele</a>
            </div>
          </div>

          <!-- Product Card 2: Elteks -->
          <div class="product-card scroll-reveal">
            <div class="product-img-wrapper">
              <img src="assets/product-pe.png" alt="Elteks PE Granül" class="product-img">
            </div>
            <div class="product-card-content">
              <h3 class="product-card-title">ELTEKS</h3>
              <p class="product-card-desc" data-translate-key="prod_pe_short">Alçak Yoğunluk (AYPE) ve Yüksek Yoğunluk (YYPE) polietilen granüller, şişirmelik ve film üretimlerine uygun.</p>
              <a href="urun-elteks.php" class="btn btn-outline btn-sm btn-full" data-translate-key="prod_view_details">Detayları İncele</a>
            </div>
          </div>

          <!-- Product Card 3: Diğer -->
          <div class="product-card scroll-reveal">
            <div class="product-img-wrapper">
              <img src="assets/product-compound.png" alt="Mühendislik polimerleri ve kompaundlar" class="product-img">
            </div>
            <div class="product-card-content">
              <h3 class="product-card-title" data-translate-key="prod_compound_title">DİĞER</h3>
              <p class="product-card-desc" data-translate-key="prod_compound_short">Kalsiyum karbonat, cam elyafı veya mineral dolgularla mekanik özellikleri güçlendirilmiş mühendislik polimerleri.</p>
              <a href="urun-diger.php" class="btn btn-outline btn-sm btn-full" data-translate-key="prod_view_details">Detayları İncele</a>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Üretim Süreci (Teaser) -->
    <section class="process-section" id="surec">
      <div class="container text-center">
        <div class="section-header scroll-reveal">
          <span class="section-tag" data-translate-key="process_tag">Adım Adım Geri Kazanım</span>
          <h2 class="section-title" data-translate-key="process_title">Modern ve Şeffaf Üretim Süreci</h2>
          <p class="section-subtitle" data-translate-key="process_subtitle">Atıkların en yüksek saflıkta granüle dönüştürülmesini sağlayan ileri teknoloji aşamalarımız.</p>
        </div>

        <div class="scroll-reveal" style="margin-top: 2rem;">
          <a href="uretim-sureci.php" class="btn btn-primary" data-translate-key="explore_process">Üretim Aşamalarını İncele</a>
        </div>
      </div>
    </section>

    <!-- Sürdürülebilirlik Bölümü (Özet) -->
    <section class="sustainability-section" id="surdurulebilirlik">
      <div class="container text-center">
        <div class="sustain-content scroll-reveal">
          <span class="section-tag invert" data-translate-key="sustain_tag">Döngüsel Ekonomi</span>
          <h2 class="section-title text-white" data-translate-key="sustain_title">Sürdürülebilir Bir Geleceğin İnşası</h2>
          <p class="section-subtitle text-light-gray" data-translate-key="sustain_subtitle">Geri dönüştürülmüş hammadde kullanarak karbon ayak izinizi azaltıyor, doğayı koruyoruz.</p>
        </div>

        <div class="sustain-stats grid-4">
          <!-- Stat 1 -->
          <div class="stat-card glass-effect scroll-reveal">
            <span class="stat-number" data-count="15000">0</span>
            <h4 class="stat-label" data-translate-key="stat_lbl_1">Yıllık Geri Kazanım (Ton)</h4>
            <p class="stat-desc" data-translate-key="stat_desc_1">Her yıl binlerce ton plastik atığı toplayıp katma değerli hammaddeye dönüştürüyoruz.</p>
          </div>
          <!-- Stat 2 -->
          <div class="stat-card glass-effect scroll-reveal">
            <span class="stat-number" data-count="80">%0</span>
            <h4 class="stat-label" data-translate-key="stat_lbl_2">Karbon Tasarrufu</h4>
            <p class="stat-desc" data-translate-key="stat_desc_2">Orijinal polimere kıyasla üretim süreçlerimizde karbon salınımını %80 oranında düşürüyoruz.</p>
          </div>
          <!-- Stat 3 -->
          <div class="stat-card glass-effect scroll-reveal">
            <span class="stat-number" data-count="65">%0</span>
            <h4 class="stat-label" data-translate-key="stat_lbl_3">Enerji Verimliliği</h4>
            <p class="stat-desc" data-translate-key="stat_desc_3">Orijinal plastik üretimine oranla %65 daha az enerji tüketerek elektrik tasarrufu sağlıyoruz.</p>
          </div>
          <!-- Stat 4 -->
          <div class="stat-card glass-effect scroll-reveal">
            <span class="stat-number" data-count="100">%0</span>
            <h4 class="stat-label" data-translate-key="stat_lbl_4">Döngüsel Katkı</h4>
            <p class="stat-desc" data-translate-key="stat_desc_4">Doğal kaynakların korunmasını destekleyen, %100 geri dönüştürülebilir B2B ürünleri.</p>
          </div>
        </div>

        <div style="margin-top: 3rem;">
          <a href="surdurulebilirlik.php" class="btn btn-primary" data-translate-key="read_sustain">Sürdürülebilirlik Vizyonumuz</a>
        </div>
      </div>
    </section>

    <!-- B2B CTA Bölümü -->
    <section class="trust-section text-center" style="background-color: var(--light-gray); padding: 5rem 0;">
      <div class="container scroll-reveal">
        <h2 class="section-title" data-translate-key="contact_title">Projeniz İçin Doğru Hammaddeyi Birlikte Belirleyelim</h2>
        <p class="section-subtitle" style="margin-bottom: 2.5rem;" data-translate-key="contact_subtitle">Teknik uzmanlarımız, uygulama alanınıza en uygun granül formülasyonunu oluşturmak için hazır.</p>
        <a href="iletisim.php" class="btn btn-primary" data-translate-key="cta_quote_long">Bize Ulaşın / Teklif İsteyin</a>
      </div>
    </section>

  </main>

<?php include 'includes/footer.php'; ?>
