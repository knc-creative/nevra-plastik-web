<?php
/**
 * Nevra Plastik Header File
 */
$activePage = basename($_SERVER['PHP_SELF'], ".php");
?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="<?php echo isset($pageDesc) ? $pageDesc : 'Nevra Plastik, 2007 yılından bu yana lisanslı ve yüksek kaliteli geri dönüştürülmüş PP ve PE plastik hammadde üretimi yapmaktadır.'; ?>">
  <meta name="keywords" content="Nevra Plastik, geri dönüştürülmüş hammadde, PP granül, PE granül, plastik geri dönüşüm, B2B hammadde, polipropilen, polietilen, kompaund, sürdürülebilir plastik">
  <meta name="author" content="Nevra Plastik">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.nevraplastik.com/<?php echo basename($_SERVER['PHP_SELF']); ?>">
  <meta property="og:title" content="<?php echo isset($pageTitle) ? $pageTitle : 'Nevra Plastik | Geri Dönüştürülmüş Plastik'; ?>">
  <meta property="og:description" content="<?php echo isset($pageDesc) ? $pageDesc : '2007\'den beri çevre standartlarına uygun, yüksek kaliteli ve izlenebilir plastik granüller üretiyoruz.'; ?>">
  <meta property="og:image" content="uploads/1782162829_2949_a685cf01-90a2-4c1a-b70b-37d38e13cce4.png">

  <title><?php echo isset($pageTitle) ? $pageTitle : 'Nevra Plastik | Geri Dönüştürülmüş Plastik Hammadde Üreticisi'; ?></title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Custom Stylesheet -->
  <link rel="stylesheet" href="css/style.css">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/logo.svg">
</head>
<body>

  <!-- Header Section -->
  <header class="main-header">
    <div class="container header-container">
      <a href="index.php" class="logo-link" aria-label="Nevra Plastik Anasayfa">
        <img src="uploads/1783198954_3487_nevra_gu_ncel_logo.svg" alt="Nevra Plastik Logo" class="logo-img">
      </a>
      
      <!-- Hamburger Menu Toggle (Desktop/Mobile) -->
      <button class="mobile-nav-toggle" aria-controls="primary-navigation" aria-expanded="false" aria-label="Menüyü Aç/Kapat">
        <span class="hamburger"></span>
      </button>

      <!-- Navigation Menu Drawer -->
      <nav id="primary-navigation" class="nav-menu">
        <ul class="nav-list">
          <li><a href="index.php" class="nav-link <?php echo ($activePage === 'index') ? 'active' : ''; ?>" data-translate-key="nav_home">Anasayfa</a></li>
          <li><a href="hakkimizda.php" class="nav-link <?php echo ($activePage === 'hakkimizda') ? 'active' : ''; ?>" data-translate-key="nav_about">Hakkımızda</a></li>
          <li><a href="urunler.php" class="nav-link <?php echo (strpos($activePage, 'urun') === 0) ? 'active' : ''; ?>" data-translate-key="nav_products">Ürünler</a></li>
          <li><a href="uretim-sureci.php" class="nav-link <?php echo ($activePage === 'uretim-sureci') ? 'active' : ''; ?>" data-translate-key="nav_process">Üretim Süreci</a></li>
          <li><a href="kalite.php" class="nav-link <?php echo ($activePage === 'kalite') ? 'active' : ''; ?>" data-translate-key="nav_quality">Kalite & Sertifikalar</a></li>
          <li><a href="surdurulebilirlik.php" class="nav-link <?php echo ($activePage === 'surdurulebilirlik') ? 'active' : ''; ?>" data-translate-key="nav_sustain">Sürdürülebilirlik</a></li>
          <li><a href="iletisim.php" class="nav-link <?php echo ($activePage === 'iletisim') ? 'active' : ''; ?>" data-translate-key="nav_contact">İletişim</a></li>
        </ul>
      </nav>

      <!-- Header Action Elements (Aligns left of Hamburger toggle) -->
      <div class="header-actions">
        <!-- Language Switcher -->
        <button id="lang-switch-btn" class="lang-switch-btn" aria-label="Dili Değiştir / Switch Language">
          <span class="lang-text">EN</span>
        </button>
        <!-- Contact CTA Button -->
        <a href="iletisim.php" class="btn btn-primary btn-sm header-cta" id="header-quote-btn" data-translate-key="cta_quote">Teklif Talep Et</a>
      </div>
    </div>
  </header>
