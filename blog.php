<?php
$blogsFile = __DIR__ . '/api/data/blogs.json';
$blogs = [];
if (is_file($blogsFile)) {
    $decoded = json_decode(file_get_contents($blogsFile), true);
    if (is_array($decoded)) $blogs = $decoded;
}
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
$blog = null;
foreach ($blogs as $item) {
    if (($item['status'] ?? '') === 'active' && ($item['slug'] ?? '') === $slug) {
        $blog = $item;
        break;
    }
}
if (!$blog) {
    http_response_code(404);
}
function h($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}
function blog_topic_entity($tag) {
    $key = trim((string)$tag);
    $key = strtr($key, ['Ğ'=>'ğ','Ü'=>'ü','Ş'=>'ş','İ'=>'i','Ö'=>'ö','Ç'=>'ç']);
    $key = strtolower($key);
    $map = [
        'pp' => 'https://nevraplastik.com/urun-pp-moblen',
        'pe' => 'https://nevraplastik.com/urun-elteks',
        'plastik granül' => 'https://nevraplastik.com/urunler',
        'plastik hammadde' => 'https://nevraplastik.com/urunler',
        'hammadde' => 'https://nevraplastik.com/urunler',
        'geri dönüşüm' => 'https://nevraplastik.com/surdurulebilirlik',
        'kalite' => 'https://nevraplastik.com/kalite',
        'mfi' => 'https://nevraplastik.com/kalite'
    ];
    $entity = ["@type" => "Thing", "name" => $tag];
    if (isset($map[$key])) $entity["url"] = $map[$key];
    return $entity;
}
$title = $blog['meta_title_tr'] ?? ($blog['title_tr'] ?? 'Blog Yazısı Bulunamadı | Nevra Plastik');
$description = $blog['meta_description_tr'] ?? ($blog['excerpt_tr'] ?? 'Nevra Plastik teknik blog içeriği.');
$canonical = $blog ? 'https://nevraplastik.com/blog/' . rawurlencode($blog['slug']) : 'https://nevraplastik.com/blog';
$cover = $blog['cover_image'] ?? 'uploads/1782162829_2949_a685cf01-90a2-4c1a-b70b-37d38e13cce4.png';
$coverAbs = preg_match('~^https?://~', $cover) ? $cover : 'https://nevraplastik.com/' . ltrim($cover, '/');
?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <title><?= h($title) ?></title>
  <meta name="description" content="<?= h($description) ?>">
    <meta name="author" content="Nevra Plastik">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="<?= h($canonical) ?>">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="<?= h($canonical) ?>">
  <meta property="og:title" content="<?= h($title) ?>">
  <meta property="og:description" content="<?= h($description) ?>">
  <meta property="og:image" content="<?= h($coverAbs) ?>">
  <meta property="og:site_name" content="Nevra Plastik">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= h($title) ?>">
  <meta name="twitter:description" content="<?= h($description) ?>">
  <meta name="twitter:image" content="<?= h($coverAbs) ?>">

  <?php if ($blog): ?>
  <script type="application/ld+json">
  <?= json_encode([
      "@context" => "https://schema.org",
      "@type" => "BlogPosting",
      "headline" => $blog["title_tr"] ?? "",
      "description" => $description,
      "datePublished" => $blog["publish_date"] ?? "",
      "dateModified" => $blog["publish_date"] ?? "",
      "mainEntityOfPage" => $canonical,
      "image" => [$coverAbs],
      "author" => ["@id" => "https://nevraplastik.com/#organization"],
      "publisher" => ["@id" => "https://nevraplastik.com/#organization"],
      "isPartOf" => ["@id" => "https://nevraplastik.com/#website"],
      "inLanguage" => "tr-TR",
      "articleSection" => "Plastik Hammadde ve Geri Dönüşüm",
      "keywords" => implode(", ", $blog["tags"] ?? []),
      "about" => array_map('blog_topic_entity', $blog["tags"] ?? [])
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>
  </script>
  <script type="application/ld+json">
  <?= json_encode([
      "@context" => "https://schema.org",
      "@type" => "BreadcrumbList",
      "itemListElement" => [
          ["@type" => "ListItem", "position" => 1, "name" => "Anasayfa", "item" => "https://nevraplastik.com/"],
          ["@type" => "ListItem", "position" => 2, "name" => "Blog", "item" => "https://nevraplastik.com/blog"],
          ["@type" => "ListItem", "position" => 3, "name" => $blog["title_tr"] ?? "", "item" => $canonical]
      ]
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>
  </script>
  <?php endif; ?>


  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Custom Stylesheet -->
  <link rel="stylesheet" href="css/style.css?v=10.0">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/logo.svg">

  <!-- Fallback local database -->
  <script src="js/fallback-data.js?v=10.0" defer></script>
</head>
<body>

  <header class="main-header">
    <div class="container header-container">
      <a href="index.html" class="logo-link" aria-label="Nevra Plastik Anasayfa">
        <img src="uploads/1783198954_3487_nevra_gu_ncel_logo.svg" alt="Nevra Plastik Logo" class="logo-img" data-translate-key="img_logo">
      </a>

      <!-- Hamburger Menu Toggle (Desktop/Mobile) -->
      <button class="mobile-nav-toggle" aria-controls="primary-navigation" aria-expanded="false" aria-label="Menüyü Aç/Kapat">
        <span class="hamburger"></span>
      </button>

      <!-- Navigation Menu Drawer -->
      <nav id="primary-navigation" class="nav-menu">
        <ul class="nav-list">
          <li><a href="index.html" class="nav-link" data-translate-key="nav_home">Anasayfa</a></li>
          <li><a href="hakkimizda" class="nav-link" data-translate-key="nav_about">Hakkımızda</a></li>
          <li><a href="urunler" class="nav-link" data-translate-key="nav_products">Ürünler</a></li>
          <li><a href="makineler" class="nav-link" data-translate-key="nav_machines">Makineler</a></li>
          <li><a href="uretim-sureci" class="nav-link" data-translate-key="nav_process">Üretim Süreci</a></li>
          <li><a href="kalite" class="nav-link" data-translate-key="nav_quality">Kalite & Sertifikalar</a></li>
          <li><a href="surdurulebilirlik" class="nav-link" data-translate-key="nav_sustain">Sürdürülebilirlik</a></li>
          <li><a href="iletisim" class="nav-link" data-translate-key="nav_contact">İletişim</a></li>
          <li><a href="blog.html" class="nav-link active">Blog</a></li>
          <li><a href="sss.html" class="nav-link" data-translate-key="nav_faq">SSS</a></li>
        </ul>
      </nav>

      <!-- Header Action Elements -->
      <div class="header-actions">
        <!-- Language Switcher -->
        <button id="lang-switch-btn" class="lang-switch-btn" aria-label="Dili Değiştir / Switch Language">
          <span class="lang-text">EN</span>
        </button>
        <!-- Contact CTA Button -->
        <a href="iletisim" class="btn btn-primary btn-sm header-cta" id="header-quote-btn" data-translate-key="cta_quote">Teklif Talep Et</a>
      </div>
    </div>
  </header>

  <main id="blog-detail-root">
  <?php if ($blog): ?>
  <article>
    <header class="blog-detail-hero">
      <div class="container blog-detail-head">
        <a class="blog-back-link" href="blog.html">← Bloga Dön</a>
        <div class="blog-detail-meta">
          <time datetime="<?= h($blog['publish_date'] ?? '') ?>"><?= h($blog['publish_date'] ?? '') ?></time>
          <?php if (!empty($blog['featured'])): ?><span class="blog-featured-pill">Öne Çıkan</span><?php endif; ?>
        </div>
        <h1><?= h($blog['title_tr'] ?? '') ?></h1>
        <p><?= h($blog['excerpt_tr'] ?? '') ?></p>
        <div class="blog-tags">
          <?php foreach (($blog['tags'] ?? []) as $tag): ?><span><?= h($tag) ?></span><?php endforeach; ?>
        </div>
      </div>
    </header>
    <div class="container blog-detail-layout">
      <figure class="blog-detail-cover">
        <img src="<?= h($cover) ?>" alt="<?= h($blog['title_tr'] ?? '') ?>" width="1200" height="675" decoding="async">
      </figure>
      <div class="blog-article-content">
        <?php foreach (preg_split('/\R\s*\R/', (string)($blog['content_tr'] ?? '')) as $paragraph): ?>
          <?php if (trim($paragraph) !== ''): ?><p><?= h(trim($paragraph)) ?></p><?php endif; ?>
        <?php endforeach; ?>
        <?php if (!empty($blog['related_url'])): ?>
          <p class="blog-related-link"><a href="<?= h($blog['related_url']) ?>"><?= h($blog['related_label_tr'] ?? 'İlgili içeriği inceleyin') ?> <span aria-hidden="true">↗</span></a></p>
        <?php endif; ?>
      </div>
      <div class="blog-detail-cta">
        <div><span class="section-tag">Nevra Plastik</span><h2>Teknik bilgiye mi ihtiyacınız var?</h2><p>Ürün ve hammadde ihtiyaçlarınız için ekibimizle iletişime geçin.</p></div>
        <a class="btn btn-primary" href="iletisim">İletişime Geç</a>
      </div>
    </div>
  </article>
  <?php else: ?>
    <div class="container blog-not-found" style="margin-top:10rem;margin-bottom:6rem;">
      <span class="section-tag">Blog</span>
      <h1>Yazı bulunamadı.</h1>
      <p>Aradığınız içerik kaldırılmış veya bağlantı hatalı olabilir.</p>
      <a class="btn btn-primary" href="blog.html">Bloga Dön</a>
    </div>
  <?php endif; ?>
  </main>

  <!-- Footer Section -->
  <footer class="main-footer">
    <div class="container footer-grid grid-4">

      <!-- Column 1: Info -->
      <div class="footer-col">
        <img src="uploads/1783198954_3487_nevra_gu_ncel_logo.svg" alt="Nevra Plastik Logo" class="footer-logo" data-translate-key="img_logo">
        <p class="footer-about-text" data-translate-key="footer_about">
          2007 yılında kurulan Nevra Plastik, Sürdürülebilirlik ve kalite odaklı üretimi ile yüksek nitelikli geri dönüştürülmüş plastik hammadde tedarik etmektedir.
        </p>
        <div class="footer-socials">
          <a href="https://linkedin.com/company/nevraplastik" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Nevra Plastik LinkedIn" data-translate-key="social_linkedin">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a href="https://x.com/nevraplastik" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Nevra Plastik Twitter/X" data-translate-key="social_twitter">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://instagram.com/nevraplastik" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Nevra Plastik Instagram" data-translate-key="social_instagram">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
        </div>
      </div>

      <!-- Column 2: Fast Links -->
      <div class="footer-col">
        <h4 class="footer-title" data-translate-key="footer_links_title">Hızlı Menü</h4>
        <ul class="footer-links">
          <li><a href="index.html" data-translate-key="nav_home">Anasayfa</a></li>
          <li><a href="hakkimizda" data-translate-key="nav_about">Hakkımızda</a></li>
          <li><a href="urunler" data-translate-key="nav_products">Ürünler</a></li>
          <li><a href="makineler" data-translate-key="nav_machines">Makineler</a></li>
          <li><a href="uretim-sureci" data-translate-key="nav_process">Üretim Süreci</a></li>
          <li><a href="kalite" data-translate-key="nav_quality">Kalite & Sertifikalar</a></li>
          <li><a href="sss.html" data-translate-key="nav_faq">SSS</a></li>
        </ul>
      </div>

      <!-- Column 3: Products -->
      <div class="footer-col">
        <h4 class="footer-title" data-translate-key="footer_products_title">Ürün Grupları</h4>
        <ul class="footer-links">
          <li><a href="urun-pp-moblen">PP Moblen Granül</a></li>
          <li><a href="urun-elteks">Elteks PE Granül</a></li>
          <li><a href="urun-diger" data-translate-key="opt_compound">Kompaund & Özel Polimerler</a></li>
        </ul>
      </div>

      <!-- Column 4: Location -->
      <div class="footer-col">
        <h4 class="footer-title" data-translate-key="footer_contact_title">İletişim Bilgileri</h4>
        <ul class="footer-links-contact">
          <li class="contact-detail-item">
            <span class="contact-label" data-translate-key="info_address">Adres:</span>
            <span>Fevzi Çakmak Mah. 10636 Sk. No: 12 Karatay / KONYA</span>
          </li>
          <li class="contact-detail-item">
            <span class="contact-label" data-translate-key="info_phone">Telefon:</span>
            <a href="tel:+903323559656">+90 332 355 96 56</a>
          </li>
          <li class="contact-detail-item">
            <span class="contact-label" data-translate-key="info_email">E-posta:</span>
            <a href="mailto:info@nevraplastik.com">info@nevraplastik.com</a>
          </li>
        </ul>
      </div>

    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container footer-bottom-flex">
        <p class="copyright">&copy; 2026 Nevra Plastik. <span data-translate-key="copyright_text">Tüm Hakları Saklıdır.</span> | Designed by <a href="https://www.kncdesign.com.tr" target="_blank" rel="noopener noreferrer" style="color: #ff2700; font-weight: 600; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">KNC Creative</a></p>
        <p class="sustainable-signature">
          <span class="green-dot"></span> <span data-translate-key="foot_signature">Sürdürülebilir Gelecek İçin Döngüsel Çözümler</span>
        </p>
      </div>
    </div>
  </footer>

  <script src="https://unpkg.com/lenis@1.1.5/dist/lenis.min.js" defer></script>
  <script src="js/app.js?v=10.0" defer></script>
</body>
</html>
