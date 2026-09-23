<?php
/**
 * Nevra Plastik - Üretim Süreci (Production Process)
 */
$pageTitle = "Üretim Süreci | Nevra Plastik Geri Dönüşüm Teknolojileri";
$pageDesc = "Nevra Plastik'in şeffaf, izlenebilir ve ileri teknoloji geri dönüşüm aşamaları.";
include 'includes/header.php';
?>

  <main>
    
    <!-- Subpage Hero -->
    <section class="hero-section" style="padding-top: 12rem; padding-bottom: 4rem; background: var(--light-gray);">
      <div class="container text-center scroll-reveal">
        <span class="section-tag" data-translate-key="process_tag">Teknoloji</span>
        <h1 class="hero-title" style="font-size: 3rem; margin-bottom: 1rem;" data-translate-key="process_title">Modern ve Şeffaf Üretim Süreci</h1>
        <p class="section-subtitle" style="margin-bottom: 0;" data-translate-key="process_hero_sub">Atık plastikten yüksek performanslı polimer granüle uzanan izlenebilir ve yüksek teknolojili yolculuğumuz.</p>
      </div>
    </section>

    <!-- Timeline Content -->
    <section class="process-section" style="background-color: var(--white); padding: 6rem 0;">
      <div class="container">
        
        <div class="process-timeline">
          
          <!-- Step 1 -->
          <div class="process-step glass-effect scroll-reveal">
            <div class="step-number-box">
              <span class="step-num">01</span>
            </div>
            <div class="step-content">
              <h3 class="step-title" data-translate-key="step_1_title">Atık Toplama</h3>
              <p class="step-desc" data-translate-key="step_1_desc">Lisanslı araçlarımızla, endüstriyel ve evsel kaynaklı yüksek kaliteli plastik atıkları kaynağından topluyoruz.</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="process-step glass-effect scroll-reveal">
            <div class="step-number-box">
              <span class="step-num">02</span>
            </div>
            <div class="step-content">
              <h3 class="step-title" data-translate-key="step_2_title">Ayrıştırma</h3>
              <p class="step-desc" data-translate-key="step_2_desc">Toplanan atıkları polimer türlerine (PP, PE) ve renklerine göre hassasiyetle sınıflandırıyoruz.</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="process-step glass-effect scroll-reveal">
            <div class="step-number-box">
              <span class="step-num">03</span>
            </div>
            <div class="step-content">
              <h3 class="step-title" data-translate-key="step_3_title">Yıkama</h3>
              <p class="step-desc" data-translate-key="step_3_desc">Ayrıştırılan plastikler, tüm organik ve inorganik kirleticilerden arındırılmak üzere yoğun yıkama hatlarından geçer.</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="process-step glass-effect scroll-reveal">
            <div class="step-number-box">
              <span class="step-num">04</span>
            </div>
            <div class="step-content">
              <h3 class="step-title" data-translate-key="step_4_title">Kırma</h3>
              <p class="step-desc" data-translate-key="step_4_desc">Temizlenen hammaddeler kırma makinelerinde küçük çapaklar (flake) haline getirilerek bir sonraki aşamaya hazır hale getirilir.</p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="process-step glass-effect scroll-reveal">
            <div class="step-number-box">
              <span class="step-num">05</span>
            </div>
            <div class="step-content">
              <h3 class="step-title" data-translate-key="step_5_title">Ekstrüzyon</h3>
              <p class="step-desc" data-translate-key="step_5_desc">Eritilen çapaklar, gaz giderme üniteli ve çift filtreli ekstrüderlerimizde eriyik filtrelemesinden geçerek homojenleştirilir.</p>
            </div>
          </div>

          <!-- Step 6 -->
          <div class="process-step glass-effect scroll-reveal">
            <div class="step-number-box">
              <span class="step-num">06</span>
            </div>
            <div class="step-content">
              <h3 class="step-title" data-translate-key="step_6_title">Granül Üretimi</h3>
              <p class="step-desc" data-translate-key="step_6_desc">Sualtı kesim sistemiyle standart boyutlarda kesilen granüller kurutulup elenir ve kalite onayının ardından ambalajlanır.</p>
            </div>
          </div>

        </div>

      </div>
    </section>

  </main>

<?php include 'includes/footer.php'; ?>
