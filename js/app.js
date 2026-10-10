/* ==========================================================================
   Nevra Plastik - Multi-Page JS Logic
   Author: Antigravity AI
   ========================================================================== */

// Force scroll to top on reload/refresh and prevent browser restoring scroll position
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Preloader start tracking
const preloaderStartTime = Date.now();

// Hide preloader helper
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader && !preloader.classList.contains("hide-up")) {
    const elapsedTime = Date.now() - preloaderStartTime;
    const minDelay = window.innerWidth <= 768 ? 250 : 650;
    const remainingTime = Math.max(0, minDelay - elapsedTime);
    
    setTimeout(() => {
      preloader.classList.add("hide-up");
      setTimeout(() => {
        preloader.remove();
      }, 1000);
    }, remainingTime);
  }
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  hidePreloader();
});

// Safety fallback: auto-dismiss preloader after 1.5 seconds max
setTimeout(hidePreloader, window.innerWidth <= 768 ? 900 : 1200);

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  let currentLang = localStorage.getItem('nevra_lang') || 'tr';
  // Native scrolling is intentionally used for better performance and stability.
  window.lenis = null;

  // ------------------------------------------------------------------------
  // 1. Navigation & Sticky Header
  // ------------------------------------------------------------------------
  const header = document.querySelector('.main-header');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Nav Toggle Drawer & Alignment
  const navList = navMenu ? navMenu.querySelector('.nav-list') : null;

  function adjustMenuAlignment() {
    if (!navMenu || !mobileNavToggle || !navList) return;
    
    const toggleRect = mobileNavToggle.getBoundingClientRect();
    const actionsElement = document.querySelector('.header-actions');
    const hasOpenMenu = header && header.classList.contains('nav-open');
    
    // Determine shift value dynamically based on screen width
    let shiftVal = 40;
    if (window.innerWidth < 768) {
      shiftVal = 20;
    } else if (window.innerWidth < 1024) {
      shiftVal = 30;
    }
    
    document.documentElement.style.setProperty('--header-shift', `${shiftVal}px`);
    
    if (actionsElement) {
      const actionsRect = actionsElement.getBoundingClientRect();
      // Reconstruct original unshifted right coordinate if menu is already open
      const actionsRightNormal = hasOpenMenu ? (actionsRect.right + shiftVal) : actionsRect.right;
      const actionsRightShifted = actionsRightNormal - shiftVal;
      const toggleLeft = toggleRect.left;
      
      // Calculate midpoint between shifted actions and toggle button
      const midpointX = actionsRightShifted + (toggleLeft - actionsRightShifted) / 2;
      let drawerWidth = window.innerWidth - midpointX;
      
      // Enforce bounds (minWidth ensures X button is covered, maxWidth ensures safe container limits)
      const minWidth = window.innerWidth >= 1024 ? 360 : (window.innerWidth >= 768 ? 320 : Math.min(300, window.innerWidth));
      const maxWidth = window.innerWidth >= 480 ? 550 : window.innerWidth;
      drawerWidth = Math.max(minWidth, Math.min(maxWidth, drawerWidth));
      
      document.documentElement.style.setProperty('--drawer-width', `${drawerWidth}px`);
      
      // Align navList padding-left with the toggle button (X button lines) on desktop
      if (window.innerWidth >= 1024) {
        const finalLeft = window.innerWidth - drawerWidth;
        const relativeLeft = toggleRect.left - finalLeft;
        // Icon offset is +8px, drawer padding is -40px: total offset is -32px
        const targetPadding = relativeLeft - 32;
        navList.style.paddingLeft = `${Math.max(0, targetPadding)}px`;
      } else {
        navList.style.paddingLeft = '';
      }
    } else {
      document.documentElement.style.setProperty('--drawer-width', '300px');
      navList.style.paddingLeft = '';
    }
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
      document.body.classList.toggle('nav-open-lock', !isExpanded);
      if (header) {
        header.classList.toggle('nav-open');
      }
      
      // Delay slightly to calculate correct layout rectangles during transitions
      setTimeout(adjustMenuAlignment, 50);
    });
  }

  // Initialize and bind events
  adjustMenuAlignment();
  let navResizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(navResizeRaf);
    navResizeRaf = requestAnimationFrame(adjustMenuAlignment);
  });

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNavToggle) {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
      if (navMenu) {
        navMenu.classList.remove('open');
      }
      if (header) {
        header.classList.remove('nav-open');
      }
      document.body.classList.remove('nav-open-lock');
    });
  });

  // Close Mobile Menu on Click Outside
  document.addEventListener('click', (event) => {
    if (!navMenu || !navMenu.classList.contains('open')) return;
    
    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedToggle = mobileNavToggle && mobileNavToggle.contains(event.target);
    
    if (!clickedInsideMenu && !clickedToggle) {
      if (mobileNavToggle) {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
      if (navMenu) {
        navMenu.classList.remove('open');
      }
      if (header) {
        header.classList.remove('nav-open');
      }
      document.body.classList.remove('nav-open-lock');
    }
  });

  // Keyboard safety: Escape always closes the navigation drawer.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !navMenu || !navMenu.classList.contains('open')) return;
    navMenu.classList.remove('open');
    if (mobileNavToggle) {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavToggle.focus();
    }
    if (header) header.classList.remove('nav-open');
    document.body.classList.remove('nav-open-lock');
  });

  // FAQ Teaser Accordion Handler
  const faqTeaserItems = document.querySelectorAll('.faq-teaser-item');
  faqTeaserItems.forEach(item => {
    const btn = item.querySelector('.faq-teaser-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqTeaserItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-teaser-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });
      if (isActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Keep Blog available across all legacy page headers/footers.
  if (navList && !navList.querySelector('a[href="/blog"], a[href="blog"]')) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="/blog" class="nav-link" data-auto-blog-link="1">Blog</a>';
    const faqLink = navList.querySelector('a[href="/sss"], a[href="/sss"], a[href="sss"]');
    if (faqLink && faqLink.parentElement) {
      navList.insertBefore(li, faqLink.parentElement);
    } else {
      navList.appendChild(li);
    }
  }
  document.querySelectorAll('.footer-links').forEach(list => {
    if (!list.querySelector('a[href="/blog"], a[href="blog"]')) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="/blog" data-auto-blog-link="1">Blog</a>';
      list.appendChild(li);
    }
  });

  // ------------------------------------------------------------------------
  // 2. Scroll Reveal Animations (Intersection Observer)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
        
        // Add reveal-done class after reveal transition completes
        let delayMs = 800; // default transition duration is 0.8s (800ms)
        if (entry.target.style.transitionDelay) {
          const delaySecs = parseFloat(entry.target.style.transitionDelay);
          if (!isNaN(delaySecs)) {
            delayMs += (delaySecs * 1000);
          }
        }
        setTimeout(() => {
          entry.target.classList.add('reveal-done');
        }, delayMs);
      }
    });
  }, {
    root: null,
    threshold: 0.01,
    rootMargin: '0px 0px 150px 0px'
  });

  window.initializeScrollReveal = function() {
    document.querySelectorAll('.scroll-reveal:not(.active)').forEach(el => {
      revealObserver.observe(el);
    });
  };
  window.initializeScrollReveal();

  let translationsLoaded = false;
  const pendingAnimationTargets = new Set();

  // ------------------------------------------------------------------------
  // 3. Counter Animation for About values and Sustainability metrics
  // ------------------------------------------------------------------------
  function animateCounter(target) {
    if (!translationsLoaded) {
      pendingAnimationTargets.add(target);
      return;
    }
    if (target.classList.contains('counted')) return;
    target.classList.add('counted');
    const targetCount = parseInt(target.getAttribute('data-count'), 10);
    if (isNaN(targetCount)) return;
    
    let startCount = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const stepValue = Math.ceil(targetCount / steps);
    
    // Save symbols
    const originalText = target.textContent || "";
    const hasPlus = originalText.includes('+');
    const hasPercent = originalText.includes('%');
    const hasK = originalText.includes('K');

    const timer = setInterval(() => {
      startCount += stepValue;
      if (startCount >= targetCount) {
        startCount = targetCount;
        clearInterval(timer);
      }
      
      let displayVal = "";
      if (hasK) {
        displayVal = (startCount / 1000).toFixed(0) + "K";
      } else {
        displayVal = startCount.toLocaleString('tr-TR');
      }

      if (hasPercent) displayVal = `%${displayVal}`;
      if (hasPlus) displayVal = `${displayVal}+`;
      
      target.textContent = displayVal;
    }, intervalTime);
  }

  // Observe containers to start all counts simultaneously in a section
  const counterContainers = document.querySelectorAll('.sustain-stats, .about-values');
  
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const counters = container.querySelectorAll('.stat-number, .value-number');
        counters.forEach(counter => {
          animateCounter(counter);
        });
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.1 });

  counterContainers.forEach(container => {
    countObserver.observe(container);
  });

  // Fallback for any counters not inside standard containers
  const allCounters = document.querySelectorAll('.stat-number, .value-number');
  allCounters.forEach(counter => {
    if (!counter.closest('.sustain-stats') && !counter.closest('.about-values')) {
      const singleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      singleObserver.observe(counter);
    }
  });

  // ------------------------------------------------------------------------
  // 4. B2B Contact Form Toggling
  // ------------------------------------------------------------------------
  const btnGeneral = document.getElementById('toggle-general');
  const btnQuote = document.getElementById('toggle-quote');
  const btnMachineQuote = document.getElementById('toggle-machine-quote');
  const formPurpose = document.getElementById('form-purpose');
  const quoteFields = document.querySelectorAll('.quote-only');
  const machineQuoteFields = document.querySelectorAll('.machine-quote-only');
  const submitBtn = document.getElementById('form-submit-btn');

  function setFormMode(mode) {
    if (!formPurpose) return; // Not on contact page
    
    if (btnGeneral) btnGeneral.classList.remove('active');
    if (btnQuote) btnQuote.classList.remove('active');
    if (btnMachineQuote) btnMachineQuote.classList.remove('active');
    
    if (mode === 'quote') {
      if (btnQuote) btnQuote.classList.add('active');
      formPurpose.value = 'quote';
      quoteFields.forEach(field => field.style.display = 'flex');
      machineQuoteFields.forEach(field => field.style.display = 'none');
      
      const isEnglish = currentLang === 'en';
      submitBtn.textContent = isEnglish ? 'Get Raw Material Offer' : 'Hammadde Fiyat Teklifi Al';
      submitBtn.setAttribute('data-translate-key', 'form_submit_quote');
    } else if (mode === 'quote_machine') {
      if (btnMachineQuote) btnMachineQuote.classList.add('active');
      formPurpose.value = 'quote_machine';
      quoteFields.forEach(field => field.style.display = 'none');
      machineQuoteFields.forEach(field => field.style.display = 'flex');
      
      const isEnglish = currentLang === 'en';
      submitBtn.textContent = isEnglish ? 'Get Machinery Offer' : 'Makine Fiyat Teklifi Al';
      submitBtn.setAttribute('data-translate-key', 'form_submit_machine_quote');
    } else {
      if (btnGeneral) btnGeneral.classList.add('active');
      formPurpose.value = 'general';
      quoteFields.forEach(field => field.style.display = 'none');
      machineQuoteFields.forEach(field => field.style.display = 'none');
      
      const isEnglish = currentLang === 'en';
      submitBtn.textContent = isEnglish ? 'Send Message' : 'Mesajı Gönder';
      submitBtn.setAttribute('data-translate-key', 'form_submit');
    }
  }

  if (btnGeneral && btnQuote) {
    btnGeneral.addEventListener('click', () => setFormMode('general'));
    btnQuote.addEventListener('click', () => setFormMode('quote'));
    if (btnMachineQuote) {
      btnMachineQuote.addEventListener('click', () => setFormMode('quote_machine'));
    }
  }

  // ------------------------------------------------------------------------
  // 5. Smart Query Parameter Handler (Multi-page form populating)
  // ------------------------------------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const paramPurpose = urlParams.get('purpose');
  const paramProduct = urlParams.get('product');
  const paramSpec = urlParams.get('spec');

  if (paramPurpose) {
    setFormMode(paramPurpose);
  }
  if (paramProduct) {
    const productSelect = document.getElementById('form-product');
    if (productSelect) {
      productSelect.value = paramProduct;
    }
  }
  const paramMachine = urlParams.get('machine');
  if (paramMachine) {
    const machineSelect = document.getElementById('form-machine');
    if (machineSelect) {
      machineSelect.value = paramMachine;
    }
  }
  if (paramSpec) {
    const messageInput = document.getElementById('form-message');
    if (messageInput) {
      messageInput.value = `Talep Detayı: ${decodeURIComponent(paramSpec)} ürünü hakkında fiyat teklifi ve teknik bilgi almak istiyoruz.\n\n`;
    }
  }

  // ------------------------------------------------------------------------
  // 6. Form Submission (AJAX & Validation)
  // ------------------------------------------------------------------------
  const form = document.getElementById('corporate-form');
  const alertBox = document.getElementById('form-alert-box');
  const alertText = alertBox ? alertBox.querySelector('.alert-message') : null;

  if (form) {
    // Generate secure CSRF token
    const dummyToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const csrfInput = document.getElementById('csrf_token');
    if (csrfInput) csrfInput.value = dummyToken;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      alertBox.style.display = 'none';
      alertBox.className = 'form-alert';

      const kvkkCheckbox = document.getElementById('form-kvkk');
      if (!kvkkCheckbox.checked) {
        showFormAlert(
          currentLang === 'en' 
            ? 'You must accept the Privacy Policy/KVKK consent to proceed.' 
            : 'Devam etmek için KVKK onay kutusunu işaretlemelisiniz.', 
          'error'
        );
        return;
      }

      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = currentLang === 'en' ? 'Processing...' : 'Gönderiliyor...';

      const formData = new FormData(form);
      formData.append('lang', currentLang);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showFormAlert(result.message, 'success');
          form.reset();
          setFormMode('general');
        } else {
          showFormAlert(result.message || (currentLang === 'en' ? 'An error occurred. Please try again.' : 'Bir hata oluştu. Lütfen tekrar deneyin.'), 'error');
        }
      } catch (error) {
        console.error('Submission error:', error);
        showFormAlert(
          currentLang === 'en'
            ? 'Connection error. Please check your network and try again.'
            : 'Bağlantı hatası. Lütfen internetinizi kontrol edip tekrar deneyin.', 
          'error'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  function showFormAlert(message, type) {
    if (!alertBox || !alertText) return;
    alertBox.style.display = 'block';
    alertBox.classList.add(type);
    alertText.textContent = message;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ------------------------------------------------------------------------
  // 7. TR / EN Translation Engine with LocalStorage Persistence
  // ------------------------------------------------------------------------
  const langSwitchBtn = document.getElementById('lang-switch-btn');
  const langTextSpan = langSwitchBtn ? langSwitchBtn.querySelector('.lang-text') : null;
  
  // Retrieve saved language or default to 'tr'
  currentLang = localStorage.getItem('nevra_lang') || 'tr';

  const translations = {
    tr: {
      nav_home: 'Anasayfa',
      nav_about: 'Hakkımızda',
      nav_products: 'Ürünler',
      nav_machines: 'Makineler',
      nav_process: 'Üretim Süreci',
      nav_quality: 'Kalite & Sertifikalar',
      nav_sustain: 'Sürdürülebilirlik',
      nav_faq: 'SSS',
      nav_contact: 'İletişim',
      faq_tag: 'Sıkça Sorulanlar',
      faq_title: 'Sık Sorulan Sorular',
      faq_subtitle: 'Ürünler, kalite, üretim ve sipariş süreçleri hakkında en çok merak edilen konular.',
      faq_cta_btn: 'Tüm Soruları Gör',
      cta_quote: 'Teklif Talep Et',
      back_to_catalog: 'Ürün Kataloğuna Dön',
      cta_quote_long: 'Teklif Talep Et',
      cta_explore: 'Ürünleri İncele',
      
      hero_tagline: "2007'den Beri Sürdürülebilir Gelecek",
      hero_title: 'Bugünün Atıklarını, Yarının Değerine Dönüştürüyoruz.',
      hero_desc: 'Nevra Plastik, 2007 yılından bu yana lisanslı, çevre standartlarına uygun ve tamamen izlenebilir üretim süreçleriyle yüksek kaliteli geri dönüştürülmüş plastik hammaddeler üretmektedir.',
      
      about_tag: 'Biz Kimiz?',
      about_title: 'Değer Katan Geri Dönüşüm, Güvenilir Hammadde',
      about_hero_sub: 'Nevra Plastik, 2007 yılından bu yana çevre standartlarına uygun, yüksek kaliteli geri dönüştürülmüş plastik hammaddeler üretmektedir.',
      about_history_title: "2007'den Beri Güven ve Sürdürülebilirlik",
      about_desc_1: 'Nevra Plastik, 2007 yılında Konya\'da kurulmuş olup, endüstriyel ve evsel plastik atıkları yeniden ekonomiye kazandırarak yüksek kalitede geri dönüştürülmüş polimer hammaddeler üretmektedir. Sektördeki 19 yıllık uzmanlığımızla, plastik üreticilerine çevre dostu, ekonomik ve standart kalitede sürdürülebilir hammaddeler temin ediyoruz.',
      about_desc_2: 'Modern makine parkurumuz, uzman kadromuz ve Çevre, Şehircilik ve İklim Değişikliği Bakanlığı onaylı lisanslarımız ile atıkları kaynağından nihai ürüne kadar tam izlenebilirlik sistemiyle işliyoruz. Nevra Plastik, iş ortakları için sadece bir hammadde tedarikçisi değil, yeşil dönüşüm yolculuklarında uzun vadeli ve güvenilir bir B2B çözüm ortağıdır.',
      about_desc_3: 'Geri kazandırdığımız her ton plastik ile doğal kaynaklarımızın tüketimini azaltıyor, petrol ithalatı bağımlılığını düşürüyor ve gelecek nesillere daha yaşanabilir bir çevre bırakma vizyonuyla çalışıyoruz. Çevreye duyarlılığımız ve kalitemiz, ulusal ve uluslararası geçerliliğe sahip sertifikalarımızla tescillenmiştir.',
      val_years: 'Yıllık Tecrübe',
      val_capacity: 'Yıllık Kapasite (Ton)',
      val_trace: 'İzlenebilir Süreç',
      read_more: 'Kurumsal Detaylar',
      values_tag: 'Değerlerimiz',
      values_title: 'Nevra Plastik Kurumsal İlkeleri',
      val_title_1: 'Çevreye Duyarlılık',
      val_text_1: 'Tüm üretim süreçlerimizde doğal kaynakları koruyor, döngüsel ekonomiye %100 katkı sağlıyoruz.',
      val_title_2: 'Kalite Standartları',
      val_text_2: 'Müşterilerimizin üretim hatlarında aksama olmaması için tolerans limitleri düşük, kararlı polimerler üretiyoruz.',
      val_title_3: 'Uzun Vadeli İş Ortaklığı',
      val_text_3: 'B2B müşterilerimiz için sadece bir hammadde satıcısı değil, yeşil sanayi dönüşümlerinde stratejik ortağız.',
      
      process_tag: 'Adım Adım Geri Kazanım',
      process_title: 'Modern ve Şeffaf Üretim Süreci',
      process_subtitle: 'Atıkların en yüksek saflıkta granüle dönüştürülmesini sağlayan ileri teknoloji aşamalarımız.',
      process_hero_sub: 'Atık plastikten yüksek performanslı polimer granüle uzanan izlenebilir ve yüksek teknolojili yolculuğumuz.',
      explore_process: 'Üretim Aşamalarını İncele',
      step_1_title: 'Atık Toplama',
      step_1_desc: 'Lisanslı araçlarımızla, endüstriyel ve evsel kaynaklı yüksek kaliteli plastik atıkları kaynağından topluyoruz.',
      step_2_title: 'Ayrıştırma',
      step_2_desc: 'Toplanan atıkları polimer türlerine (PP, PE) ve renklerine göre hassasiyetle sınıflandırıyoruz.',
      step_3_title: 'Yıkama',
      step_3_desc: 'Ayrıştırılan plastikler, tüm organik ve inorganik kirleticilerden arındırılmak üzere yoğun yıkama hatlarından geçer.',
      step_4_title: 'Kırma',
      step_4_desc: 'Temizlenen hammaddeler kırma makinelerinde küçük çapaklar (flake) haline getirilerek bir sonraki aşamaya hazır hale getirilir.',
      step_5_title: 'Ekstrüzyon',
      step_5_desc: 'Eritilen çapaklar, gaz giderme üniteli ve çift filtreli ekstrüderlerimizde eriyik filtrelemesinden geçerek homojenleştirilir.',
      step_6_title: 'Granül Üretimi',
      step_6_desc: 'Sualtı kesim sistemiyle standart boyutlarda kesilen granüller kurutulup elenir ve kalite onayının ardından ambalajlanır.',
      
      products_tag: 'Geniş Ürün Yelpazesi',
      products_title: 'Geri Dönüştürülmüş Endüstriyel Çözümler',
      products_subtitle: 'Üretim standartlarınızı yükseltecek kararlı ve yüksek performanslı plastik hammaddelerimiz.',
      prod_pp_short: 'Polipropilen bazlı, enjeksiyonluk ve ekstrüzyonluk sınıflarda, yüksek mukavemetli granül hammaddeler.',
      prod_pe_short: 'Alçak Yoğunluk (AYPE) ve Yüksek Yoğunluk (YYPE) polietilen granüller, şişirmelik ve film üretimlerine uygun.',
      prod_pprc_title: 'PPR-C GRANÜL',
      prod_pprc_short: 'Sıcak-soğuk su boruları, sıhhi tesisat ek parçaları ve altyapı boru grupları için random kopolimer granüller.',
      prod_compound_title: 'ÖZEL KOMPAUNDLAR',
      prod_compound_short: 'Kalsiyum karbonat, cam elyafı veya mineral dolgularla mekanik özellikleri güçlendirilmiş mühendislik polimerleri.',
      prod_view_details: 'Detayları İncele',
      pp_hero_sub: 'Yüksek darbe mukavemeti ve kararlı eriyik akış özellikleri sunan polipropilen granül çözümlerimiz.',
      pp_detail_title: 'Polipropilen (PP) Granül Hammadde',
      pp_detail_desc: 'Nevra Plastik PP Moblen Granüllerimiz, yüksek darbe dayanımı ve mükemmel kimyasal direnç özellikleri ile üretilmektedir. Enjeksiyon kalıplama ve ekstrüzyon hatlarında güvenle kullanılabilir. Otomotiv, ambalaj, beyaz eşya ve bahçe mobilyaları gibi sanayi kollarında sıklıkla tercih edilen kararlı formülasyonlardır.',
      pe_hero_sub: 'Yüksek gerilme mukavemeti ve esneklik sunan Alçak Yoğunluklu (AYPE) ve Yüksek Yoğunluklu (YYPE) polietilen granüllerimiz.',
      pe_detail_title: 'Elteks (PE) Granül Hammadde',
      pe_detail_desc: 'Yüksek Yoğunluklu (YYPE / HDPE) ve Alçak Yoğunluklu (AYPE / LDPE) polietilen granüllerimiz, mükemmel esneklik ve yüksek gerilme direnci sunar. Ekstrüzyon, şişirme ve film hatları için özel elenmiş ve yıkanmış temiz hammaddelerden homojenize edilerek üretilir.',
      compound_hero_sub: 'Laboratuvarımızda B2B iş ortaklarımızın makine ve kalıp yapısına özel olarak reçetelendirilen polimer formülleri.',
      compound_detail_title: 'Kompaund ve Özel Formülasyonlar',
      compound_detail_desc: 'Geri dönüştürülmüş PP ve PE matrislerine kalsiyum karbonat (kalsit), cam elyafı, talik veya mineral dolgular eklenerek üretilen yüksek performanslı özel kompaundlar ve terzi usulü formülasyonlar. Orijinal hammaddeye en yakın mekanik ve termal özellikleri sağlamak üzere AR-GE laboratuvarımızda geliştirilmiştir.',
      pprc_detail_title: 'PPR-C Random Kopolimer Granül',
      pprc_hero_sub: 'Sıcak ve soğuk su boruları, sıhhi tesisat ek parçaları için üstün termal kararlılığa sahip PP-R hammaddeler.',
      pprc_title: 'Nevra PPR-C',
      pprc_subtitle: 'Random Kopolimer PP',
      pprc_green_title: 'Nevra PPR-C Yeşil',
      pprc_green_desc: 'Yüksek sıcaklık ve basınç dayanımı sunan, sıhhi tesisat ve sıcak-soğuk su borusu üretimine uygun yeşil granül.',
      pprc_gray_title: 'Nevra PPR-C Gri',
      pprc_gray_desc: 'Sıhhi tesisat ekleme parçaları (fittings), vana gövdeleri ve gri renkli boru ekstrüzyonu için ideal hammadde.',
      pprc_white_title: 'Nevra PPR-C Beyaz',
      pprc_white_desc: 'Bina içi temiz su dağıtım hatları ve beyaz renkli ek parçalar için pürüzsüz yüzey ve üstün kararlılık sunan reçete.',
      gf30_title: 'Cam Elyaf Takviyeli PP',
      gf30_desc: '%30 cam elyaf dolgusuyla yüksek gerilme ve bükülme direnci sunan, otomotiv ve beyaz eşya parçalarına özel kompaund.',
      
      quality_tag: 'Güvence',
      quality_title: 'Bakanlık Onaylı ve İzlenebilir Kalite Kontrolü',
      quality_hero_sub: 'Nevra Plastik güvencesiyle, her sevkıyatımızda standart ve kararlı hammadde kalitesi sunuyoruz.',
      quality_docs_tag: 'Belgelerimiz',
      quality_docs_title: 'Uluslararası Tescil ve Lisanslar',
      quality_lab_title: 'Kalite Kontrol Laboratuvarımız',
      quality_desc_1: 'Geri dönüştürülmüş plastik üretiminde en önemli unsurun kararlı kalite olduğunun bilincindeyiz. Bu doğrultuda, tesisimize giren her atık partisi ve çıkan her ürün grubu kendi kalite kontrol laboratuvarımızda test edilmektedir.',
      quality_desc_2: 'MFI (Eriyik Akış Hızı) testi, yoğunluk testi, nem analizi ve kül oranı belirleme testleri ile nihai ürünlerin endüstriyel standartları sağladığından emin oluyoruz. Üretim sürecimiz tamamen izlenebilir olup, her sevkiyata özel teknik analiz sertifikası (COA) düzenlenmektedir.',
      qual_item_1: 'T.C. Çevre ve Şehircilik Bakanlığı Lisansı',
      qual_item_2: 'Parti Bazlı MFI ve Yoğunluk Raporlama',
      qual_item_3: 'RoHS ve REACH Standartlarına Uygunluk Kontrolleri',
      qual_item_4: 'ISO 9001:2015 Kalite Yönetim Sistemi',
      cert_1: 'Çevre İzin Lisans Belgesi',
      cert_1_sub: 'Bakanlık Geri Kazanım Lisansı',
      cert_2: 'ISO 9001:2015',
      cert_3: 'ISO 14001:2015',
      cert_2_sub: 'Kalite Yönetim Sertifikası',
      cert_3_sub: 'Çevre Yönetim Sertifikası',
      cert_4: 'Tescil Belgesi',
      cert_4_sub: 'Nevra Marka Tescili',
      
      sustain_tag: 'Döngüsel Ekonomi',
      sustain_title: 'Sürdürülebilir Bir Geleceğin İnşası',
      sustain_subtitle: 'Geri dönüştürülmüş hammadde kullanarak karbon ayak izinizi azaltıyor, doğayı koruyoruz.',
      sustain_hero_sub: 'Doğal kaynakları koruma bilinciyle geri dönüştürülmüş hammadde üretiyor, karbon salınımını azaltıyoruz.',
      stat_lbl_1: 'Yıllık Geri Kazanım (Ton)',
      stat_val_1: '15000',
      stat_desc_1: 'Her yıl binlerce ton plastik atığı toplayıp katma değerli hammaddeye dönüştürüyoruz.',
      stat_lbl_2: 'Karbon Tasarrufu',
      stat_val_2: '80',
      stat_desc_2: 'Orijinal polimere kıyasla üretim süreçlerimizde karbon salınımını %80 oranında düşürüyoruz.',
      stat_lbl_3: 'Enerji Verimliliği',
      stat_val_3: '65',
      stat_desc_3: 'Orijinal plastik üretimine oranla %65 daha az enerji tüketerek elektrik tasarrufu sağlıyoruz.',
      stat_lbl_4: 'Döngüsel Katkı',
      stat_val_4: '100',
      stat_desc_4: 'Doğal kaynakların korunmasını destekleyen, %100 geri dönüştürülebilir B2B ürünleri.',
      about_stat_1: '19',
      about_stat_2: '15000',
      about_stat_3: '100',
      sustain_banner_title: 'Gelecek Nesillere Temiz Bir Dünya',
      sustain_banner_desc: 'Nevra Plastik olarak, sıfır atık hedeflerinize ve karbon azaltım taahhütlerinize yüksek kaliteli B2B polimerlerimizle doğrudan katkı sağlıyoruz.',
      read_sustain: 'Sürdürülebilirlik Vizyonumuz',
      
      contact_tag: 'Bizimle İletişime Geçin',
      contact_title: 'Projeniz İçin Doğru Hammaddeyi Birlikte Belirleyelim',
      contact_subtitle: 'Teknik uzmanlarımız, uygulama alanınıza en uygun granül formülasyonunu oluşturmak için hazır.',
      contact_hero_sub: 'Nevra Plastik teknik kadrosu, ihtiyaçlarınıza özel çözümler üretmek için hizmetinizdedir.',
      contact_details_title: 'Nevra Plastik İletişim Bilgileri',
      info_phone: 'Telefon',
      info_email: 'E-posta',
      info_address: 'Adres',
      
      form_toggle_general: 'Genel İletişim',
      form_toggle_quote: 'Hammadde Teklifi Al',
      form_toggle_machine_quote: 'Makine Teklifi Al',
      form_name: 'Ad Soyad',
      form_company: 'Şirket Adı',
      form_email: 'E-posta',
      form_phone: 'Telefon',
      form_product: 'Talep Edilen Hammadde',
      form_qty: 'Tahmini Aylık Tüketim Miktarı (Ton)',
      form_machine: 'Talep Edilen Makine',
      form_capacity: 'Talep Edilen Kapasite / Adet',
      form_message: 'Mesajınız / Teknik Talepleriniz',
      form_kvkk_text: 'Nevra Plastik Kişisel Verilerin Korunması Politikasını okudum ve kabul ediyorum.',
      form_submit: 'Mesajı Gönder',
      form_submit_quote: 'Hammadde Fiyat Teklifi Al',
      form_submit_machine_quote: 'Makine Fiyat Teklifi Al',
      opt_pp_moblen: 'PP Moblen Granül',
      opt_elteks: 'Elteks PE Granül',
      opt_pprc: 'PPR-C Granül',
      opt_other: 'Özel Kompaundlar (Diğer)',
      opt_balya_press: 'Yatay Balya Presi',
      opt_yikama_havuzu: 'Yatay Çapak Yıkama Havuzu',
      opt_karistirme_mixeri: 'Granül Karıştırma Mikseri',
      opt_other_machine: 'Diğer Makine / Ekipman',
      
      err_name: 'Lütfen adınızı ve soyadınızı giriniz.',
      err_company: 'Lütfen şirket adını giriniz.',
      err_email: 'Lütfen geçerli bir e-posta adresi giriniz.',
      err_phone: 'Lütfen geçerli bir telefon numarası giriniz.',
      err_message: 'Lütfen bir mesaj yazınız.',
      
      footer_about: '2007 yılında kurulan Nevra Plastik, sürdürülebilirlik ve kalite odaklı üretimi ile yüksek nitelikli geri dönüştürülmüş plastik hammadde tedarik etmektedir.',
      footer_links_title: 'Hızlı Menü',
      footer_products_title: 'Ürün Grupları',
      footer_contact_title: 'İletişim Bilgileri',
      copyright_text: 'Tüm Hakları Saklıdır.',
      foot_signature: 'Sürdürülebilir Gelecek İçin Döngüsel Çözümler',
      
      modal_specs: 'Teknik Özellikler',
      spec_mfi: 'Eriyik Akış Hızı (MFI)',
      spec_density: 'Yoğunluk',
      spec_color: 'Renk Seçenekleri',
      spec_usage: 'Önerilen Kullanım',
      modal_quote_btn: 'Bu Ürün İçin Teklif İste',
      
      pp_color_val: 'Siyah, Beyaz, Gri ve Özel Renkler',
      pp_usage_val: 'Plastik Kasa, Kova, Boru Ekleme Parçaları, Otomotiv Yan Sanayi',
      pe_color_val: 'Siyah, Mavi, Şeffaf ve Naturel',
      pe_usage_val: 'Altyapı Boruları, Damla Sulama Boruları, Çöp Torbaları, Plastik Şişeler',
      custom_mfi_val: 'Müşteri talebine ve reçeteye özel ayarlanır',
      compound_color_val: 'Ral Kodları, Numune Eşleştirmeli Renkler, Siyah, Koyu Gri',
      compound_usage_val: 'Otomotiv Trim Aksamı, Yüksek Mukavemet Gerektiren Endüstriyel Gövdeler',
      
      color_black: 'Siyah',
      color_gray: 'Gri',
      color_colored: 'Renkli',
      color_trans: 'Şeffaf / Naturel',
      color_pprc_val: 'Yeşil, Gri, Beyaz',
      color_calcite_val: 'Siyah, Koyu Gri',
      color_custom_val: 'İsteğe Bağlı',
      
      // PP-100 Siyah
      pp_100_title: 'Nevra PP-100 Siyah',
      pp_100_subtitle: 'Siyah Enjeksiyonluk PP',
      pp_100_desc: 'Nevra PP-100, geri dönüştürülmüş polipropilen bazlı yüksek darbe mukavemetli enjeksiyonluk siyah hammadde sınıfımızdır. Mükemmel akışkanlığı, yüksek mekanik kararlılığı ve düşük bükülme (warpage) özellikleri ile endüstriyel kalıplama prosesleri için optimize edilmiştir.',
      pp_100_usage: 'Plastik saksı, taşıma kasaları, kova, otomotiv aksamları, tampon ve çamurluk koruyucular, endüstriyel gövdeler.',
      
      // PP-200 Gri
      pp_200_title: 'Nevra PP-200 Gri',
      pp_200_subtitle: 'Gri Ekstrüzyonluk PP',
      pp_200_desc: 'Nevra PP-200, yüksek eriyik mukavemeti ve kararlılığı sunan gri polipropilen hammaddemizdir. Ekstrüzyon ve enjeksiyon prosesleri için geliştirilmiş olup, kimyasal dayanımı ve mukavemeti yüksek profil, boru ve ek parça üretimlerinde mükemmel performans sağlar.',
      pp_200_usage: 'Plastik boru ek parçaları (fittings), kablo kanalları, sızdırmazlık contaları, profil ekstrüzyonu ve sanayi tipi borular.',
      
      // PP-300 Renkli
      pp_300_title: 'Nevra PP-300 Renkli',
      pp_300_subtitle: 'Renkli Genel Amaçlı PP',
      pp_300_desc: 'Nevra PP-300, genel amaçlı plastik enjeksiyon uygulamaları için özel renk eşleştirmeleriyle üretilen ekonomik ve yüksek performanslı polipropilen granülümüzdür. Geniş renk yelpazesi ve kolay işlenebilirlik özellikleri ile üretim maliyetlerinizi optimize eder.',
      pp_300_usage: 'Askı, ev gereçleri, mutfak eşyaları, plastik oyuncaklar, mandal, temizlik kovaları ve genel enjeksiyon ürünleri.',
      
      // PE-HD Siyah
      pe_hd_title: 'Nevra PE-HD Siyah',
      pe_hd_subtitle: 'Siyah Yüksek Yoğunluklu PE (HDPE)',
      pe_hd_desc: 'Nevra PE-HD, altyapı ve boru ekstrüzyonu için geliştirilmiş, yüksek mukavemetli ve yüksek yoğunluklu polietilen hammaddemizdir. Çevresel gerilmeli çatlama direncine (ESCR) ve üstün darbe dayanımına sahiptir.',
      pe_hd_usage: 'Altyapı boruları, damla sulama boruları, koruge borular, şişirmelik bidon ve plastik şişe gövdeleri.',
      
      // PE-LD Şeffaf
      pe_ld_trans_title: 'Nevra PE-LD Şeffaf/Naturel',
      pe_ld_trans_subtitle: 'Şeffaf Film Dereceli AYPE',
      pe_ld_trans_desc: 'Nevra PE-LD Şeffaf, yüksek kaliteli geri dönüştürülmüş endüstriyel ambalaj atıklarından elde edilen, şeffaf film ekstrüzyonuna uygun alçak yoğunluklu polietilen hammaddedir. Mükemmel esneklik, yırtılma direnci ve optimum şeffaflık sağlar.',
      pe_ld_trans_usage: 'Endüstriyel naylon film, shrink rulo, sera örtüleri, ambalaj poşetleri ve balonlu naylon (patpat) imalatı.',
      
      // PE-LD Siyah
      pe_ld_black_title: 'Nevra PE-LD Siyah',
      pe_ld_black_subtitle: 'Siyah Esnek AYPE',
      pe_ld_black_desc: 'Nevra PE-LD Siyah, geri dönüştürülmüş alçak yoğunluklu polietilenden mamul, yüksek esneklik ve optimum gerilme mukavemeti sunan siyah granülümüzdür. Geniş bir ekstrüzyon işleme penceresine sahip olup, özellikle esneklik gerektiren ürünlerde kararlılık sağlar.',
      pe_ld_black_usage: 'Damla sulama boruları, kablo kılıfları, çöp torbaları, inşaat naylonu ve esnek plastik aparatlar.',
      
      // PPR-C
      pprc_title: 'Nevra PPR-C',
      pprc_subtitle: 'Random Kopolimer PP',
      pprc_desc: 'Nevra PPR-C, yüksek moleküler ağırlıklı ve sıcaklık dayanımlı polipropilen random kopolimer granüldür. Özellikle sıcak ve soğuk su tesisat boruları ile yüksek basınç ve sıcaklık dayanımı gerektiren sıhhi tesisat ek parçaları için mükemmel termal ve kimyasal kararlılığa sahiptir.',
      pprc_usage: 'Sıcak-soğuk sıhhi tesisat boruları, yüksek ısı dayanımlı vana ve fittings gövdeleri, endüstriyel boru hatları.',
      
      // PP-Calcite
      calcite_title: 'Nevra PP-Calcite Compound',
      calcite_subtitle: 'Kalsit Katkılı PP Kompaund',
      calcite_desc: 'Nevra PP-Calcite, yüksek saflıkta mikronize kalsiyum karbonat (kalsit) katkısı ile mekanik dayanımı, ısı dayanımı ve boyutsal kararlılığı güçlendirilmiş mühendislik kompaundumuzdur. Kalıp çekmesini azaltır, rijitliği artırır ve üretim döngü sürelerini kısaltır.',
      calcite_usage: 'Otomotiv trim aksamları, elektrik-elektronik plastik gövdeleri, ev aletleri şaseleri, bükülme direnci yüksek ince cidarlı kalıplamalar.',
      
      // Custom-Mix
      custom_title: 'Nevra Custom-Mix',
      custom_subtitle: 'Özel Müşteri Formülasyonları',
      custom_desc: 'Nevra Custom-Mix, iş ortaklarımızın spesifik mukavemet, esneklik, eriyik akış hızı (MFI), dolgu cinsi (kalsit, talk, cam elyafı) ve renk taleplerine uygun olarak AR-GE laboratuvarımızda özel olarak formüle edilen kompaundlardır.',
      custom_usage: 'Müşterinin özel kalıp, ürün tasarımı ve makine hız gereksinimlerine göre tüm plastik imalat sektörleri.'
    ,
      img_logo: 'assets/logo.svg',
      img_hero: 'assets/hero-bg.png',
      img_about: 'assets/facility.webp',
      img_sustain: 'assets/facility.webp',
      img_quality: 'assets/facility.webp'
    },
    en: {
      nav_home: 'Home',
      nav_about: 'About Us',
      nav_products: 'Products',
      nav_machines: 'Machinery',
      nav_process: 'Production Process',
      nav_quality: 'Quality & Certificates',
      nav_sustain: 'Sustainability',
      nav_faq: 'FAQ',
      nav_contact: 'Contact',
      faq_tag: 'Frequently Asked Questions',
      faq_title: 'Frequently Asked Questions',
      faq_subtitle: 'Most asked questions about products, quality, production, and ordering processes.',
      faq_cta_btn: 'View All Questions',
      cta_quote: 'Request Quote',
      back_to_catalog: 'Back to Product Catalog',
      cta_quote_long: 'Request Quote',
      cta_explore: 'Explore Products',
      
      hero_tagline: 'Sustainable Future Since 2007',
      hero_title: "Transforming Today's Waste into Tomorrow's Value.",
      hero_desc: 'Since 2007, Nevra Plastik has been producing high-quality recycled plastic raw materials with licensed, environmentally friendly, and fully traceable processes.',
      
      about_tag: 'Who We Are',
      about_title: 'Value-Adding Recycling, Reliable Raw Material',
      about_hero_sub: 'Since 2007, Nevra Plastik has been producing high-quality recycled plastic raw materials with licensed and environmentally friendly processes.',
      about_history_title: 'Trust and Sustainability Since 2007',
      about_desc_1: 'Nevra Plastik was established in Konya in 2007, returning industrial and domestic plastic waste to the economy by manufacturing high-quality recycled polymer raw materials. With our 19 years of expertise, we provide eco-friendly, economical, and standard-quality sustainable raw materials to plastic manufacturers.',
      about_desc_2: 'With our modern machinery, expert staff, and licenses approved by the Ministry of Environment, Urbanization, and Climate Change, we process waste from source to final product under a full traceability system. Nevra Plastik is not just a supplier, but a long-term and reliable solution partner in the green transition.',
      about_desc_3: 'With every ton of plastic we recover, we reduce natural resource consumption, lower oil import dependency, and work with the vision of leaving a more livable environment for future generations. Our environmental awareness and quality are certified by national and international standards.',
      val_years: 'Years of Experience',
      val_capacity: 'Annual Capacity (Tons)',
      val_trace: 'Traceable Process',
      read_more: 'Corporate Details',
      values_tag: 'Our Values',
      values_title: 'Nevra Plastik Corporate Principles',
      val_title_1: 'Environmental Awareness',
      val_text_1: 'We protect natural resources in all our production processes and contribute 100% to the circular economy.',
      val_title_2: 'Quality Standards',
      val_text_2: 'We produce stable polymers with low tolerance limits to prevent any disruptions in our customers\' production lines.',
      val_title_3: 'Long-term Partnership',
      val_text_3: 'We are not just a raw material seller to our B2B customers, but a strategic partner in their green industrial transition.',
      
      process_tag: 'Step by Step Recovery',
      process_title: 'Modern and Transparent Production Process',
      process_subtitle: 'Our advanced technology phases that ensure waste is converted into granules of the highest purity.',
      process_hero_sub: 'Our traceable and high-technology journey from waste plastic to high-performance polymer granules.',
      explore_process: 'Examine Production Phases',
      step_1_title: 'Waste Collection',
      step_1_desc: 'We collect high-quality industrial and domestic plastic waste from the source with our licensed vehicles.',
      step_2_title: 'Sorting',
      step_2_desc: 'We sort collected waste according to polymer types (PP, PE) and colors with high precision.',
      step_3_title: 'Washing',
      step_3_desc: 'Sorted plastics pass through intensive washing lines to be cleaned of all organic and inorganic impurities.',
      step_4_title: 'Crushing',
      step_4_desc: 'Cleaned raw materials are crushed into small flakes in grinding machines, preparing them for the next stage.',
      step_5_title: 'Extrusion',
      step_5_desc: 'Melted flakes are homogenized in our twin-filter extruders with degassing units, passing through melt filtration.',
      step_6_title: 'Granule Production',
      step_6_desc: 'Granules cut to standard sizes by underwater cutting system are dried, sieved, and packed after quality approval.',
      
      products_tag: 'Wide Product Range',
      products_title: 'Recycled Industrial Solutions',
      products_subtitle: 'Our stable and high-performance plastic raw materials that will raise your production standards.',
      prod_pp_short: 'Polypropylene-based granule raw materials with high strength, available in injection molding and extrusion grades.',
      prod_pe_short: 'Low-Density (LDPE) and High-Density (HDPE) polyethylene granules suitable for blow molding and film production.',
      prod_pprc_title: 'PPR-C GRANULE',
      prod_pprc_short: 'Random copolymer granules for hot-cold water pipes, sanitary fittings, and infrastructure piping groups.',
      prod_compound_title: 'SPECIAL COMPOUNDS',
      prod_compound_short: 'Engineering polymers reinforced with calcium carbonate, glass fiber, or custom mineral additives.',
      prod_view_details: 'Review Details',
      pp_hero_sub: 'Our polypropylene granule solutions offering high impact strength and stable melt flow properties.',
      pp_detail_title: 'Polypropylene (PP) Granule Raw Material',
      pp_detail_desc: 'Our PP Moblen Granules are produced with high impact strength and excellent chemical resistance properties. Safe to use in injection molding and extrusion lines. They are stable formulations highly preferred in industrial sectors like automotive, packaging, home appliances, and garden furniture.',
      pe_hero_sub: 'Our Low-Density (LDPE) and High-Density (HDPE) polyethylene granules offering high tensile strength and flexibility.',
      pe_detail_title: 'Elteks (PE) Granule Raw Material',
      pe_detail_desc: 'Our HDPE and LDPE polyethylene granules offer excellent flexibility and high tensile strength. They are produced by homogenizing clean raw materials that are specially sieved and washed for extrusion, blow molding, and film lines.',
      compound_hero_sub: 'Polymer formulas developed in our laboratory custom-tailored for the machinery and mold specifications of our B2B partners.',
      compound_detail_title: 'Compounds and Special Formulations',
      compound_detail_desc: 'High-performance custom compounds and tailor-made formulations produced by adding calcium carbonate (calcite), glass fiber, talc, or mineral fillers to recycled PP and PE matrices. Developed in our R&D laboratory to provide mechanical and thermal properties closest to virgin raw materials.',
      pprc_detail_title: 'PPR-C Random Copolymer Granule',
      pprc_hero_sub: 'PP-R raw materials with superior thermal stability for hot and cold plumbing pipes and sanitary fittings.',
      pprc_title: 'Nevra PPR-C',
      pprc_subtitle: 'Random Copolymer PP',
      pprc_green_title: 'Nevra PPR-C Green',
      pprc_green_desc: 'Green granule offering high temperature and pressure resistance, suitable for plumbing and hot-cold water pipe production.',
      pprc_gray_title: 'Nevra PPR-C Gray',
      pprc_gray_desc: 'Ideal raw material for sanitary pipe fittings, valve bodies, and gray pipe extrusion.',
      pprc_white_title: 'Nevra PPR-C White',
      pprc_white_desc: 'Recipe offering smooth surface and superior stability for indoor clean water distribution lines and white fittings.',
      gf30_title: 'Glass Fiber Reinforced PP',
      gf30_desc: 'Special compound offering high tensile and flexural strength with 30% glass fiber loading, tailored for automotive and appliance parts.',
      
      quality_tag: 'Assurance',
      quality_title: 'Ministry Approved & Traceable Quality Control',
      quality_hero_sub: 'With the assurance of Nevra Plastik, we offer standard and stable raw material quality in every shipment.',
      quality_docs_tag: 'Our Certificates',
      quality_docs_title: 'International Registrations & Licenses',
      quality_lab_title: 'Our Quality Control Laboratory',
      quality_desc_1: 'We are aware that stable quality is the most crucial aspect of recycled plastic production. Accordingly, every batch of waste entering our facility and every product group leaving is tested in our quality control laboratory.',
      quality_desc_2: 'We ensure that final products meet industrial standards through MFI (Melt Flow Index) test, density test, moisture analysis, and ash content determination. Our process is fully traceable, and a technical analysis certificate (COA) is issued for each shipment.',
      qual_item_1: 'Ministry of Environment and Urbanization License',
      qual_item_2: 'Batch-based MFI and Density Reporting',
      qual_item_3: 'RoHS and REACH Compliance Controls',
      qual_item_4: 'ISO 9001:2015 Quality Management System',
      cert_1: 'Environmental Permit License',
      cert_1_sub: 'Ministry Recycling License',
      cert_2: 'ISO 9001:2015',
      cert_3: 'ISO 14001:2015',
      cert_2_sub: 'Quality Management Certificate',
      cert_3_sub: 'Environmental Management Certificate',
      cert_4: 'Trademark Registration Certificate',
      cert_4_sub: 'Nevra Brand Registration',
      
      sustain_tag: 'Circular Economy',
      sustain_title: 'Building a Sustainable Future',
      sustain_subtitle: 'By using recycled raw materials, we reduce your carbon footprint and protect nature.',
      sustain_hero_sub: 'We manufacture recycled raw materials and reduce carbon emissions with the awareness of protecting natural resources.',
      stat_lbl_1: 'Annual Recovery (Tons)',
      stat_val_1: '15000',
      stat_desc_1: 'We collect and convert thousands of tons of plastic waste into value-added raw materials every year.',
      stat_lbl_2: 'Carbon Savings',
      stat_val_2: '80',
      stat_desc_2: 'We reduce carbon emissions in our production processes by 80% compared to virgin polymers.',
      stat_lbl_3: 'Energy Efficiency',
      stat_val_3: '65',
      stat_desc_3: 'We consume 65% less energy than virgin plastic production, saving electricity.',
      stat_lbl_4: 'Circular Contribution',
      stat_val_4: '100',
      stat_desc_4: 'Circular B2B products supporting the conservation of natural resources, 100% recyclable.',
      about_stat_1: '19',
      about_stat_2: '15000',
      about_stat_3: '100',
      sustain_banner_title: 'A Clean World for Future Generations',
      sustain_banner_desc: 'As Nevra Plastik, we contribute directly to your zero waste goals and carbon reduction commitments with our high-quality B2B polymers.',
      read_sustain: 'Our Sustainability Vision',
      
      contact_tag: 'Get In Touch',
      contact_title: 'Let\'s Choose the Right Raw Material for Your Project',
      contact_subtitle: 'Our technical experts are ready to formulate the most suitable granule for your application area.',
      contact_hero_sub: 'Nevra Plastik technical team is at your service to produce solutions customized for your needs.',
      contact_details_title: 'Nevra Plastik Contact Details',
      info_phone: 'Phone',
      info_email: 'Email',
      info_address: 'Address',
      
      form_toggle_general: 'General Contact',
      form_toggle_quote: 'Get Raw Material Quote',
      form_toggle_machine_quote: 'Get Machinery Quote',
      form_name: 'Full Name',
      form_company: 'Company Name',
      form_email: 'Email',
      form_phone: 'Phone',
      form_product: 'Requested Raw Material',
      form_qty: 'Estimated Monthly Consumption (Tons)',
      form_machine: 'Requested Machinery',
      form_capacity: 'Requested Capacity / Quantity',
      form_message: 'Your Message / Technical Demands',
      form_kvkk_text: 'I have read and agree to the Nevra Plastik Personal Data Protection Policy (KVKK consent).',
      form_submit: 'Send Message',
      form_submit_quote: 'Get a Price Offer',
      form_submit_machine_quote: 'Get Machinery Offer',
      opt_pp_moblen: 'PP Moblen Granule',
      opt_elteks: 'Elteks PE Granule',
      opt_pprc: 'PPR-C Granule',
      opt_other: 'Special Compounds (Other)',
      opt_balya_press: 'Horizontal Baler',
      opt_yikama_havuzu: 'Horizontal Wash Tank',
      opt_karistirme_mixeri: 'Granule Mixer',
      opt_other_machine: 'Other Machinery / Equipment',
      
      err_name: 'Please enter your full name.',
      err_company: 'Please enter your company name.',
      err_email: 'Please enter a valid email address.',
      err_phone: 'Please enter a valid phone number.',
      err_message: 'Please write a message.',
      
      footer_about: 'Founded in 2007, Nevra Plastik supplies highly qualified recycled plastic raw materials with sustainability and quality-oriented production.',
      footer_links_title: 'Fast Menu',
      footer_products_title: 'Product Groups',
      footer_contact_title: 'Contact Details',
      copyright_text: 'All Rights Reserved.',
      foot_signature: 'Circular Solutions for a Sustainable Future',
      
      modal_specs: 'Technical Specifications',
      spec_mfi: 'Melt Flow Index (MFI)',
      spec_density: 'Density',
      spec_color: 'Color Options',
      spec_usage: 'Recommended Usage',
      modal_quote_btn: 'Request Quote for this Product',
      
      pp_color_val: 'Black, White, Grey, and Custom Colors',
      pp_usage_val: 'Plastic Crates, Buckets, Pipe Fittings, Automotive Sub-industry',
      pe_color_val: 'Black, Blue, Transparent, and Natural',
      pe_usage_val: 'Infrastructure Pipes, Drip Irrigation Pipes, Trash Bags, Plastic Bottles',
      custom_mfi_val: 'Custom formulated based on request',
      compound_color_val: 'RAL Codes, Color Sample Matching, Black, Dark Grey',
      compound_usage_val: 'Automotive Trim, Industrial Housings Requiring High Strength',
      
      color_black: 'Black',
      color_gray: 'Gray',
      color_colored: 'Colored',
      color_trans: 'Translucent / Natural',
      color_pprc_val: 'Green, Gray, White',
      color_calcite_val: 'Black, Dark Gray',
      color_custom_val: 'On Demand',
      
      // PP-100 Black
      pp_100_title: 'Nevra PP-100 Black',
      pp_100_subtitle: 'Black Injection PP',
      pp_100_desc: 'Nevra PP-100 is our recycled polypropylene-based, high impact resistance injection grade black raw material. It is optimized for industrial molding processes with excellent flowability, high mechanical stability, and low warpage characteristics.',
      pp_100_usage: 'Plastic flower pots, transportation crates, buckets, automotive parts, bumpers and mudguard guards, industrial bodies.',
      
      // PP-200 Gray
      pp_200_title: 'Nevra PP-200 Gray',
      pp_200_subtitle: 'Gray Extrusion PP',
      pp_200_desc: 'Nevra PP-200 is our gray polypropylene raw material offering high melt strength and stability. Developed for extrusion and injection processes, it delivers excellent performance in high-resistance profile, pipe, and fittings production.',
      pp_200_usage: 'Plastic pipe fittings, cable conduits, sealing gaskets, profile extrusion, and industrial pipes.',
      
      // PP-300 Color
      pp_300_title: 'Nevra PP-300 Color',
      pp_300_subtitle: 'Colored General Purpose PP',
      pp_300_desc: 'Nevra PP-300 is our economical and high-performance polypropylene granule, produced in custom color matchings for general-purpose plastic injection applications. It optimizes your production costs with wide color options and easy processability.',
      pp_300_usage: 'Hangers, household goods, kitchenware, plastic toys, clothes pegs, cleaning buckets, and general injection products.',
      
      // PE-HD Black
      pe_hd_title: 'Nevra PE-HD Black',
      pe_hd_subtitle: 'Black High-Density PE (HDPE)',
      pe_hd_desc: 'Nevra PE-HD is our high-strength, high-density polyethylene raw material developed for infrastructure and pipe extrusion. It possesses high environmental stress cracking resistance (ESCR) and superior impact strength.',
      pe_hd_usage: 'Infrastructure pipes, drip irrigation pipes, corrugated pipes, blow molded drums, and plastic bottle bodies.',
      
      // PE-LD Translucent
      pe_ld_trans_title: 'Nevra PE-LD Translucent',
      pe_ld_trans_subtitle: 'Translucent Film Grade LDPE',
      pe_ld_trans_desc: 'Nevra PE-LD Translucent is a low-density polyethylene raw material suitable for translucent film extrusion, recovered from high-quality recycled industrial packaging wastes. It provides excellent flexibility, tear resistance, and optimum clarity.',
      pe_ld_trans_usage: 'Industrial nylon film, shrink rolls, greenhouse covers, packaging bags, and bubble wrap manufacturing.',
      
      // PE-LD Black
      pe_ld_black_title: 'Nevra PE-LD Black',
      pe_ld_black_subtitle: 'Black Flexible LDPE',
      pe_ld_black_desc: 'Nevra PE-LD Black is our black granule made of recycled low-density polyethylene, offering high flexibility and optimum tensile strength. It has a wide extrusion processing window and provides stability particularly in products requiring flexibility.',
      pe_ld_black_usage: 'Drip irrigation pipes, cable sheathing, trash bags, construction nylon, and flexible plastic apparatus.',
      
      // PPR-C
      pprc_title: 'Nevra PPR-C',
      pprc_subtitle: 'Random Copolymer PP',
      pprc_desc: 'Nevra PPR-C is a high molecular weight and temperature resistant polypropylene random copolymer granule. It has excellent thermal and chemical stability, specifically for hot & cold sanitary water pipes and plumbing fittings requiring high pressure and temperature resistance.',
      pprc_usage: 'Hot-cold sanitary pipes, high-heat resistant valve and fittings bodies, industrial pipelines.',
      
      // PP-Calcite
      calcite_title: 'Nevra PP-Calcite Compound',
      calcite_subtitle: 'Calcite Filled PP Compound',
      calcite_desc: 'Nevra PP-Calcite is our engineering compound reinforced with high-purity micronized calcium carbonate (calcite) to enhance mechanical strength, heat resistance, and dimensional stability. It reduces mold shrinkage, increases rigidity, and shortens cycle times.',
      calcite_usage: 'Automotive trim components, electrical-electronic plastic housings, household appliance chassis, thin-walled moldings requiring high bending resistance.',
      
      // Custom-Mix
      custom_title: 'Nevra Custom-Mix',
      custom_subtitle: 'Custom Customer Formulations',
      custom_desc: 'Nevra Custom-Mix compounds are custom-formulated in our R&D laboratory to meet our B2B partners\' specific demands for strength, flexibility, melt flow index (MFI), filler type (calcite, talk, glass fiber), and color.',
      custom_usage: 'All plastic manufacturing sectors, tailored to the customer\'s specific mold, product design, and machinery speed requirements.'
    ,
      img_logo: 'assets/logo.svg',
      img_hero: 'assets/hero-bg.png',
      img_about: 'assets/facility.webp',
      img_sustain: 'assets/facility.webp',
      img_quality: 'assets/facility.webp'
    }
  };

  function translatePage(lang) {
    currentLang = lang;
    localStorage.setItem('nevra_lang', lang);
    localStorage.setItem('selectedLang', lang); // For compatibility with older templates
    
    if (langTextSpan) {
      langTextSpan.textContent = lang === 'tr' ? 'EN' : 'TR';
    }
    
    document.querySelectorAll('[data-translate-key]').forEach(el => {
      const key = el.getAttribute('data-translate-key');
      if (translations[lang][key]) {
        if (el.tagName === 'IMG') {
          el.src = translations[lang][key];
        } else if (el.tagName === 'A' && key.startsWith('social_')) {
          el.href = translations[lang][key];
        } else if (el.classList.contains('stat-number') || el.classList.contains('value-number')) {
          const rawVal = translations[lang][key];
          el.setAttribute('data-count', rawVal);
          
          let origText = el.getAttribute('data-orig-text');
          if (!origText) {
            origText = el.textContent || "";
            el.setAttribute('data-orig-text', origText);
          }
          
          const val = parseInt(rawVal, 10);
          if (!isNaN(val)) {
            const hasPlus = origText.includes('+');
            const hasPercent = origText.includes('%');
            const hasK = origText.includes('K');
            
            let displayVal = "";
            if (hasK) {
              displayVal = (val / 1000).toFixed(0) + "K";
            } else {
              displayVal = val.toLocaleString('tr-TR');
            }
            if (hasPercent) displayVal = `%${displayVal}`;
            if (hasPlus) displayVal = `${displayVal}+`;
            
            el.textContent = displayVal;
          } else {
            el.textContent = rawVal;
          }
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });

    const placeholders = {
      tr: {
        'form-name': 'Örn: Ahmet Yılmaz',
        'form-company': 'Örn: Nevra Plastik A.Ş.',
        'form-email': 'ahmet@sirketiniz.com',
        'form-phone': '0555 123 45 67',
        'form-quantity': 'Örn: 10',
        'form-message': 'Talebinizi, teknik şartlarınızı veya sormak istediklerinizi buraya yazabilirsiniz...'
      },
      en: {
        'form-name': 'e.g. John Doe',
        'form-company': 'e.g. Nevra Polymers Ltd.',
        'form-email': 'john@yourcompany.com',
        'form-phone': '+90 555 123 45 67',
        'form-quantity': 'e.g. 15',
        'form-message': 'Describe your technical requirements or question here...'
      }
    };

    if (placeholders[lang]) {
      Object.keys(placeholders[lang]).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.placeholder = placeholders[lang][id];
        }
      });
    }

    if (submitBtn) {
      const isQuoteMode = formPurpose && formPurpose.value === 'quote';
      submitBtn.textContent = isQuoteMode 
        ? translations[lang]['form_submit_quote'] 
        : translations[lang]['form_submit'];
    }
    
    // Dispatch global languageChanged event
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));

    // Dynamic Certificates Rendering
    renderCertificates(lang);

    // Dynamic Favicon Update
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (faviconLink && translations[lang] && translations[lang]['img_favicon']) {
      const favUrl = translations[lang]['img_favicon'];
      faviconLink.href = favUrl;
      if (favUrl.endsWith('.svg')) {
        faviconLink.setAttribute('type', 'image/svg+xml');
      } else if (favUrl.endsWith('.png')) {
        faviconLink.setAttribute('type', 'image/png');
      } else if (favUrl.endsWith('.ico')) {
        faviconLink.setAttribute('type', 'image/x-icon');
      } else {
        faviconLink.removeAttribute('type');
      }
    }
  }

  function renderCertificates(lang) {
    const fallbackList = typeof fallbackCertificates !== 'undefined' ? fallbackCertificates : [];
    const allCertificates = (window.siteData && window.siteData.certificates) ? window.siteData.certificates : fallbackList;
    if (!allCertificates || !Array.isArray(allCertificates)) {
      console.warn("Nevra Plastik: Certificates array not found.");
      return;
    }
    const certificates = allCertificates.filter(c => c.status !== 'passive');
    
    // 1. Render on kalite.html
    const certContainer = document.querySelector('.certificates-section .grid-4');
    if (certContainer) {
      certContainer.innerHTML = '';
      certificates.forEach(c => {
        const card = document.createElement('div');
        card.className = 'stat-card glass-effect text-center scroll-reveal';
        card.style.padding = '2.5rem 1.5rem';
        
        if (c.document_image) {
          card.style.cursor = 'pointer';
          card.onclick = () => openCertificateLightbox(c.document_image, lang === 'tr' ? c.title_tr : c.title_en);
        } else {
          card.style.cursor = 'default';
        }
        
        const title = lang === 'tr' ? c.title_tr : c.title_en;
        const subtitle = lang === 'tr' ? c.sub_tr : c.sub_en;
        
        card.innerHTML = `
          <div style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary);">${c.icon || '📄'}</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${title}</h3>
          <p style="font-size: 0.9rem; color: var(--gray);">${subtitle}</p>
        `;
        certContainer.appendChild(card);
      });
      if (window.initializeScrollReveal) {
        window.initializeScrollReveal();
      }
    }
    
    // 2. Render on kalite.php
    const certShowcase = document.querySelector('.certificates-showcase');
    if (certShowcase) {
      certShowcase.innerHTML = '';
      certificates.forEach(c => {
        const card = document.createElement('div');
        card.className = 'cert-card glass-effect scroll-reveal';
        
        if (c.document_image) {
          card.style.cursor = 'pointer';
          card.onclick = () => openCertificateLightbox(c.document_image, lang === 'tr' ? c.title_tr : c.title_en);
        } else {
          card.style.cursor = 'default';
        }
        
        const title = lang === 'tr' ? c.title_tr : c.title_en;
        const subtitle = lang === 'tr' ? c.sub_tr : c.sub_en;
        
        let svgIcon = '';
        if (c.icon === '📄') {
          svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`;
        } else if (c.icon === '🏅') {
          svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>`;
        } else if (c.icon === '🌿') {
          svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l4.03 3.359a.75.75 0 01.272.575v1.216a.75.75 0 01-.272.575l-4.03 3.359a1.125 1.125 0 00-.405.864v.568M11.25 3.03v.568c0 .334-.148.65-.405.864l-4.03 3.359a.75.75 0 00-.272.575v1.216c0 .244.12.472.321.608l4.137 2.758c.174.116.279.311.279.52v.73c0 .334-.148.65-.405.864l-4.03 3.359a.75.75 0 00-.272.575v1.216c0 .244.12.472.321.608l4.137 2.758c.174.116.279.311.279.52v.73c0 .244-.12.472-.321.608l-4.03 2.687A.75.75 0 015.25 21H3.75a.75.75 0 01-.58-.276c-.368-.46-.777-1.122-1.07-2.024A12.72 12.72 0 011.5 15c0-2.316.618-4.487 1.698-6.368A2.25 2.25 0 015.176 7.5H6.75a.75.75 0 01.58.276c.368.46.777 1.122 1.07 2.024A12.72 12.72 0 019 13.5c0 2.316-.618 4.487-1.698 6.368A2.25 2.25 0 015.324 21H3.75M12.75 20.97v-.568c0-.334.148-.65.405-.864l4.03-3.359a.75.75 0 01.272-.575v-1.216a.75.75 0 01-.272-.575l-4.03-3.359a1.125 1.125 0 00-.405-.864v-.568" /></svg>`;
        } else {
          svgIcon = `<span style="font-size: 2.2rem; display: block; margin: 0.25rem 0;">${c.icon || '📄'}</span>`;
        }
        
        card.innerHTML = `
          <div class="cert-icon">${svgIcon}</div>
          <h4>${title}</h4>
          <p>${subtitle}</p>
        `;
        certShowcase.appendChild(card);
      });
      if (window.initializeScrollReveal) {
        window.initializeScrollReveal();
      }
    }
  }

  window.openCertificateLightbox = function(imageUrl, title) {
    let lightbox = document.getElementById('cert-lightbox');
    if (!lightbox) {
      if (!document.getElementById('cert-lightbox-style')) {
        const style = document.createElement('style');
        style.id = 'cert-lightbox-style';
        style.textContent = `
          @keyframes cert-lightbox-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }

      lightbox = document.createElement('div');
      lightbox.id = 'cert-lightbox';
      lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(8, 12, 21, 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      `;
      
      lightbox.innerHTML = `
        <div id="cert-lightbox-spinner" style="position: absolute; width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #2fb14d; border-radius: 50%; animation: cert-lightbox-spin 0.8s linear infinite; transition: opacity 0.3s; z-index: 1;"></div>
        <div id="cert-lightbox-wrapper" style="position: relative; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center; gap: 1.2rem; transform: scale(0.9) translate3d(0, 30px, 0); opacity: 0; transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease; z-index: 2;">
          <button onclick="closeCertificateLightbox()" style="position: absolute; top: -3.5rem; right: 0; background: rgba(255,255,255,0.15); border: none; color: #ffffff; width: 42px; height: 42px; border-radius: 50%; font-size: 1.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; transition: all 0.3s; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);" onmouseover="this.style.background='#2fb14d'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='scale(1)'">&times;</button>
          <img id="cert-lightbox-img" src="" style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.25);">
          <h3 id="cert-lightbox-title" style="color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 1.3rem; margin: 0; text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.6);"></h3>
        </div>
      `;
      document.body.appendChild(lightbox);
      
      // Close on backdrop click
      lightbox.onclick = (e) => {
        if (e.target === lightbox) closeCertificateLightbox();
      };
    }

    const spinner = document.getElementById('cert-lightbox-spinner');
    const wrapper = document.getElementById('cert-lightbox-wrapper');
    const img = document.getElementById('cert-lightbox-img');
    const titleEl = document.getElementById('cert-lightbox-title');

    // Reset styles
    spinner.style.opacity = '1';
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'scale(0.95) translate3d(0, 20px, 0)';
    img.src = '';
    titleEl.textContent = title;

    // Show backdrop
    lightbox.style.opacity = '1';
    lightbox.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';

    // Preload image
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = imageUrl;
      // Hide spinner
      spinner.style.opacity = '0';
      // Fade in & zoom in wrapper
      setTimeout(() => {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'scale(1) translate3d(0, 0, 0)';
      }, 50);
    };
    tempImg.onerror = () => {
      img.src = imageUrl;
      spinner.style.opacity = '0';
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'scale(1) translate3d(0, 0, 0)';
    };
    tempImg.src = imageUrl;
  };

  window.closeCertificateLightbox = function() {
    const lightbox = document.getElementById('cert-lightbox');
    const wrapper = document.getElementById('cert-lightbox-wrapper');
    if (lightbox && wrapper) {
      // Animate out wrapper
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'scale(0.95) translate3d(0, 15px, 0)';
      // Fade out backdrop
      setTimeout(() => {
        lightbox.style.opacity = '0';
        lightbox.style.pointerEvents = 'none';
        document.body.style.overflow = '';
      }, 150);
    }
  };

  // Bind Switch Button
  if (langSwitchBtn) {
    langSwitchBtn.addEventListener('click', () => {
      const targetLang = currentLang === 'tr' ? 'en' : 'tr';
      translatePage(targetLang);
    });
  }

  // Initial translation apply
  translatePage(currentLang);

  // ------------------------------------------------------------------------
  // Unified Data Loading (PHP/JSON CMS or Fallback)
  // ------------------------------------------------------------------------
  window.siteData = null;

  function initSiteData() {
    console.log("Nevra Plastik: Initiating CMS unified data load.");
    fetch('api/cms.php?action=load&t=' + Date.now())
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.status === 'success') {
          console.log("Nevra Plastik: CMS data loaded successfully:", data);
          window.siteData = {
            categories: data.categories || fallbackCategories,
            products: (data.products || fallbackProducts).filter(p => p.status !== 'passive'),
            translations: data.translations || fallbackTranslations,
            machines: ((data.machines && data.machines.length > 0) ? data.machines : fallbackMachines).filter(m => m.status !== 'passive'),
            certificates: data.certificates || fallbackCertificates,
            faqs: data.faqs || (typeof fallbackFaqs !== 'undefined' ? fallbackFaqs : []),
            blogs: data.blogs || (typeof fallbackBlogs !== 'undefined' ? fallbackBlogs : [])
          };
        } else {
          throw new Error(data.message || 'Unknown CMS error');
        }
      })
      .catch(err => {
        console.warn("Nevra Plastik: Could not load data from CMS, using fallback data. Details:", err);
        window.siteData = {
          categories: fallbackCategories,
          products: fallbackProducts.filter(p => p.status !== 'passive'),
          translations: fallbackTranslations,
          machines: fallbackMachines.filter(m => m.status !== 'passive'),
          certificates: fallbackCertificates,
          faqs: typeof fallbackFaqs !== 'undefined' ? fallbackFaqs : [],
          blogs: typeof fallbackBlogs !== 'undefined' ? fallbackBlogs : []
        };
      })
      .finally(() => {
        // Merge translations into local translations object
        if (window.siteData && window.siteData.translations) {
          if (window.siteData.translations.tr) Object.assign(translations.tr, window.siteData.translations.tr);
          if (window.siteData.translations.en) Object.assign(translations.en, window.siteData.translations.en);
        }
        
        // Re-translate the page now that dynamic translations are merged
        translationsLoaded = true;
        translatePage(currentLang);
        
        // Trigger animations for any targets that came into view before translations loaded
        pendingAnimationTargets.forEach(target => {
          animateCounter(target);
        });
        pendingAnimationTargets.clear();
        
        // Check Maintenance Mode
        if (window.siteData && window.siteData.translations && window.siteData.translations.tr.maintenance_mode === 'active') {
          showMaintenanceScreen();
        }
        
        // Dispatch event so other scripts can render categories/products
        window.dispatchEvent(new CustomEvent('siteDataLoaded', { detail: window.siteData }));
      });
  }

  function showMaintenanceScreen() {
    const isEn = (currentLang === 'en');
    const title = isEn 
      ? (window.siteData.translations.en.maintenance_title || "We'll Be Back Soon!") 
      : (window.siteData.translations.tr.maintenance_title || 'Yenileniyoruz!');
    const desc = isEn 
      ? (window.siteData.translations.en.maintenance_desc || 'We are currently updating our website to provide you with a better experience. We will be online shortly.') 
      : (window.siteData.translations.tr.maintenance_desc || 'Sizlere daha iyi bir hizmet sunabilmek için sitemizi güncelliyoruz. Çok yakında buradayız.');
    const logoUrl = window.siteData.translations.tr.img_logo || 'assets/logo.svg';

    const overlay = document.createElement('div');
    overlay.id = 'maintenance-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0b0f19;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      text-align: center;
      padding: 2rem;
      box-sizing: border-box;
    `;

    overlay.innerHTML = `
      <div style="max-width: 500px; display: flex; flex-direction: column; align-items: center; gap: 1.75rem;">
        <img src="${logoUrl}" alt="Nevra Plastik" style="height: 60px; max-width: 80%; object-fit: contain; margin-bottom: 0.5rem;">
        <div style="background: rgba(47, 177, 77, 0.1); border: 1px solid rgba(47, 177, 77, 0.3); color: #2fb14d; font-size: 0.75rem; font-weight: 700; padding: 0.4rem 0.9rem; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.08em; display: inline-flex; align-items: center; gap: 0.5rem; animation: pulse 2s infinite;">
          <span style="width: 6px; height: 6px; background: #2fb14d; border-radius: 50%;"></span>
          ${isEn ? 'System Update' : 'Sistem Güncellemesi'}
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em; margin: 0; color: #ffffff; line-height: 1.25;">
          ${title}
        </h1>
        <p style="color: #94a3b8; font-size: 1rem; line-height: 1.6; margin: 0;">
          ${desc}
        </p>
        <div style="width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #2fb14d, transparent); margin-top: 0.5rem;"></div>
        <span style="font-size: 0.8rem; color: #475569; font-weight: 500;">
          © ${new Date().getFullYear()} Nevra Plastik. Tüm Hakları Saklıdır.
        </span>
      </div>
      <style>
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      </style>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  // Start initialization
  initSiteData();

  // ------------------------------------------------------------------------
  // FAQ Dynamic Rendering — reference design + CMS data
  // ------------------------------------------------------------------------
  const _faqCatOrder = ['products', 'quality', 'production', 'sustainability', 'order'];
  const _faqCatNamesTR = {
    products: 'Ürünler ve Hammaddeler',
    quality: 'Kalite ve Teknik Özellikler',
    production: 'Üretim ve Kapasite',
    sustainability: 'Sürdürülebilirlik ve Geri Dönüşüm',
    order: 'Sipariş, Numune ve İletişim'
  };
  const _faqCatNamesEN = {
    products: 'Products & Raw Materials',
    quality: 'Quality & Technical Specs',
    production: 'Production & Capacity',
    sustainability: 'Sustainability & Recycling',
    order: 'Order, Sample & Contact'
  };

  function _escFaq(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function _getFaqs() {
    const list = (window.siteData && Array.isArray(window.siteData.faqs))
      ? window.siteData.faqs
      : (typeof fallbackFaqs !== 'undefined' && Array.isArray(fallbackFaqs) ? fallbackFaqs : []);
    return list.filter(f => f.status === 'active')
      .sort((a,b) => Number(a.sort_order || 999) - Number(b.sort_order || 999));
  }

  function _faqText(f, key, lang) {
    const tr = f[key + '_tr'] || '';
    const en = f[key + '_en'] || '';
    return lang === 'en' && en ? en : tr;
  }

  function _buildRefFaqItem(f, lang, prefix, idx) {
    const q=_escFaq(_faqText(f,'question',lang));
    const a=_escFaq(_faqText(f,'answer',lang));
    const id=(prefix || 'faq') + '-' + (f.id || idx);
    return `<article class="ref-faq-item scroll-reveal" data-faq-id="${_escFaq(f.id || '')}">
      <button aria-controls="${id}-answer" aria-expanded="false" class="ref-faq-question" id="${id}-q" type="button">
        <span>${q}</span><span aria-hidden="true" class="ref-faq-icon">+</span>
      </button>
      <div aria-labelledby="${id}-q" class="ref-faq-answer" id="${id}-answer" role="region">
        <div class="ref-faq-answer-inner"><p>${a}</p></div>
      </div>
    </article>`;
  }

  function _bindRefFaqAccordions(scope) {
    (scope || document).querySelectorAll('.ref-faq-item').forEach(item => {
      if (item.dataset.bound === '1') return;
      const trigger=item.querySelector('.ref-faq-question');
      if (!trigger) return;
      item.dataset.bound='1';
      trigger.addEventListener('click', () => {
        const open=item.classList.contains('is-open');
        item.classList.toggle('is-open', !open);
        trigger.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  function renderFaqTeaser(lang) {
    const list=document.getElementById('faq-teaser-list');
    if (!list) return;
    const visible=_getFaqs().filter(f => f.show_home === true).slice(0,3);
    list.innerHTML=visible.map((f,i)=>_buildRefFaqItem(f,lang,'home-faq',i)).join('');
    _bindRefFaqAccordions(list);
    if (window.initializeScrollReveal) window.initializeScrollReveal();
  }

  function renderFaqPage(lang) {
    const catGrid=document.getElementById('faq-category-grid');
    const groupsHost=document.getElementById('faq-groups-container');
    if (!catGrid || !groupsHost) return;

    const active=_getFaqs();
    const grouped={};
    active.forEach(f => {
      const cat=f.category || 'products';
      if (!grouped[cat]) grouped[cat]=[];
      grouped[cat].push(f);
    });

    const order=_faqCatOrder.filter(c => grouped[c] && grouped[c].length);
    Object.keys(grouped).forEach(c => { if (!order.includes(c)) order.push(c); });
    const names=lang === 'en' ? _faqCatNamesEN : _faqCatNamesTR;

    catGrid.innerHTML=order.map((cat,i) => {
      const num=String(i+1).padStart(2,'0');
      const label=_escFaq(names[cat] || cat);
      const count=grouped[cat].length;
      const qLabel=lang === 'en' ? (count===1?'question':'questions') : 'soru';
      return `<a class="ref-faq-category-card scroll-reveal" href="#faq-cat-${i+1}">
        <span class="ref-faq-category-index">${num}</span>
        <span>${label}</span>
        <small>${count} ${qLabel}</small>
      </a>`;
    }).join('');

    groupsHost.innerHTML=order.map((cat,i) => {
      const num=String(i+1).padStart(2,'0');
      const label=_escFaq(names[cat] || cat);
      const items=grouped[cat].map((f,j)=>_buildRefFaqItem(f,lang,'faq-'+(i+1),j)).join('');
      const helper=lang === 'en'
        ? 'Open the details to review short, direct answers.'
        : 'Detayları açarak kısa ve doğrudan yanıtları inceleyebilirsiniz.';
      return `<section class="ref-faq-group-section ${i%2===1?'ref-alt':''}" id="faq-cat-${i+1}">
        <div class="container ref-faq-group-grid">
          <div class="ref-faq-group-heading scroll-reveal">
            <span class="ref-faq-group-number">${num}</span>
            <h2>${label}</h2>
            <p>${helper}</p>
          </div>
          <div class="ref-faq-list">${items}</div>
        </div>
      </section>`;
    }).join('');

    _bindRefFaqAccordions(groupsHost);
    _updateFaqSchema(active,lang);
    if (window.initializeScrollReveal) window.initializeScrollReveal();
  }

  function _updateFaqSchema(activeFaqs,lang) {
    const old=document.getElementById('faq-jsonld-dynamic');
    if (old) old.remove();
    const serverSchema=document.getElementById('faq-jsonld-server');
    if (serverSchema) serverSchema.remove();
    if (!activeFaqs || !activeFaqs.length || !document.getElementById('faq-groups-container')) return;
    const schema={
      '@context':'https://schema.org',
      '@type':'FAQPage',
      mainEntity:activeFaqs.map(f=>({
        '@type':'Question',
        name:_faqText(f,'question',lang),
        acceptedAnswer:{'@type':'Answer',text:_faqText(f,'answer',lang)}
      }))
    };
    const script=document.createElement('script');
    script.type='application/ld+json';
    script.id='faq-jsonld-dynamic';
    script.textContent=JSON.stringify(schema);
    document.head.appendChild(script);
  }

  window.addEventListener('siteDataLoaded', () => {
    const lang=localStorage.getItem('nevra_lang') || 'tr';
    renderFaqTeaser(lang);
    renderFaqPage(lang);
  });

  window.addEventListener('languageChanged', e => {
    const lang=(e.detail && e.detail.lang) || localStorage.getItem('nevra_lang') || 'tr';
    renderFaqTeaser(lang);
    renderFaqPage(lang);
  });


  // ------------------------------------------------------------------------
  // Blog Dynamic Rendering
  // ------------------------------------------------------------------------
  function _blogEsc(value) {
    return String(value || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function _blogField(item, key, lang) {
    const tr = item[key + '_tr'] || '';
    const en = item[key + '_en'] || '';
    return lang === 'en' && en ? en : tr;
  }

  function _activeBlogs() {
    const source = window.siteData && Array.isArray(window.siteData.blogs)
      ? window.siteData.blogs
      : (typeof fallbackBlogs !== 'undefined' ? fallbackBlogs : []);
    return source.filter(b => b.status === 'active')
      .sort((a,b) => {
        const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featured) return featured;
        const order = Number(a.sort_order || 999) - Number(b.sort_order || 999);
        if (order) return order;
        return String(b.publish_date || '').localeCompare(String(a.publish_date || ''));
      });
  }

  function _formatBlogDate(dateStr, lang) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'tr-TR', {day:'2-digit',month:'long',year:'numeric'}).format(d);
  }

  function _blogUrl(slug) {
    const safe = encodeURIComponent(slug || '');
    const local = ['localhost','127.0.0.1'].includes(window.location.hostname);
    return local ? ('blog-detay.html?slug=' + safe) : ('blog/' + safe);
  }

  function renderBlogIndex(lang) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    const blogs = _activeBlogs();
    if (!blogs.length) {
      grid.innerHTML = '<div class="blog-empty">Henüz yayınlanmış blog yazısı bulunmuyor.</div>';
      return;
    }
    grid.innerHTML = blogs.map((b,i) => {
      const title=_blogEsc(_blogField(b,'title',lang));
      const excerpt=_blogEsc(_blogField(b,'excerpt',lang));
      const image=_blogEsc(b.cover_image || 'assets/facility.webp');
      const tags=Array.isArray(b.tags) ? b.tags.slice(0,3) : [];
      return `<article class="blog-card scroll-reveal ${b.featured && i===0 ? 'blog-card-featured' : ''}">
        <a class="blog-card-media" href="${_blogUrl(b.slug)}" aria-label="${title}">
          <img src="${image}" alt="${title}" loading="${i===0?'eager':'lazy'}" decoding="async" width="1200" height="675" ${i===0?'fetchpriority="high"':''}>
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta"><span>${_formatBlogDate(b.publish_date,lang)}</span>${b.featured ? '<span class="blog-featured-pill">Öne Çıkan</span>' : ''}</div>
          <h2><a href="${_blogUrl(b.slug)}">${title}</a></h2>
          <p>${excerpt}</p>
          <div class="blog-card-footer">
            <div class="blog-tags">${tags.map(t=>`<span>${_blogEsc(t)}</span>`).join('')}</div>
            <a class="blog-read-link" href="${_blogUrl(b.slug)}">${lang==='en'?'Read':'Devamını Oku'} <span>↗</span></a>
          </div>
        </div>
      </article>`;
    }).join('');
    if (window.initializeScrollReveal) window.initializeScrollReveal();
  }

  function renderBlogDetail(lang) {
    const root = document.getElementById('blog-detail-root');
    if (!root) return;
    const querySlug = new URLSearchParams(window.location.search).get('slug') || '';
    const pathMatch = window.location.pathname.match(/\/blog\/([^/?#]+)/);
    const slug = querySlug || (pathMatch ? decodeURIComponent(pathMatch[1]) : '');
    const blog = _activeBlogs().find(b => b.slug === slug);
    if (!blog) {
      root.innerHTML = '<div class="container blog-not-found"><span class="section-tag">Blog</span><h1>Yazı bulunamadı.</h1><p>Aradığınız içerik kaldırılmış veya bağlantı hatalı olabilir.</p><a class="btn btn-primary" href="/blog">Bloga Dön</a></div>';
      document.title = 'Blog Yazısı Bulunamadı | Nevra Plastik';
      return;
    }
    const title=_blogField(blog,'title',lang);
    const excerpt=_blogField(blog,'excerpt',lang);
    const content=_blogField(blog,'content',lang);
    const image=blog.cover_image || 'assets/facility.webp';
    const paragraphs=String(content || '').split(/\n\s*\n/).filter(Boolean);
    const tags=Array.isArray(blog.tags) ? blog.tags : [];
    root.innerHTML = `<article>
      <header class="blog-detail-hero">
        <div class="container blog-detail-head">
          <a class="blog-back-link" href="/blog">← ${lang==='en'?'Back to Blog':'Bloga Dön'}</a>
          <div class="blog-detail-meta"><span>${_formatBlogDate(blog.publish_date,lang)}</span>${blog.featured?'<span class="blog-featured-pill">Öne Çıkan</span>':''}</div>
          <h1>${_blogEsc(title)}</h1>
          <p>${_blogEsc(excerpt)}</p>
          <div class="blog-tags">${tags.map(t=>`<span>${_blogEsc(t)}</span>`).join('')}</div>
        </div>
      </header>
      <div class="container blog-detail-layout">
        <div class="blog-detail-cover"><img src="${_blogEsc(image)}" alt="${_blogEsc(title)}" width="1200" height="675" decoding="async" fetchpriority="high"></div>
        <div class="blog-article-content">${paragraphs.map(p=>`<p>${_blogEsc(p)}</p>`).join('')}
          ${blog.related_url ? `<p class="blog-related-link"><a href="${_blogEsc(blog.related_url)}">${_blogEsc(lang==='en' ? (blog.related_label_en || 'Explore related content') : (blog.related_label_tr || 'İlgili içeriği inceleyin'))} <span aria-hidden="true">↗</span></a></p>` : ''}
        </div>
        <div class="blog-detail-cta">
          <div><span class="section-tag">Nevra Plastik</span><h2>${lang==='en'?'Need technical information?':'Teknik bilgiye mi ihtiyacınız var?'}</h2><p>${lang==='en'?'Contact our team for product and raw material requirements.':'Ürün ve hammadde ihtiyaçlarınız için ekibimizle iletişime geçin.'}</p></div>
          <a class="btn btn-primary" href="/iletisim">${lang==='en'?'Contact Us':'İletişime Geç'}</a>
        </div>
      </div>
    </article>`;

    document.title = (lang === 'en' ? (blog.meta_title_en || blog.title_en) : (blog.meta_title_tr || blog.title_tr)) || document.title;
    const desc = lang === 'en' ? blog.meta_description_en : blog.meta_description_tr;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && desc) metaDesc.setAttribute('content', desc);
    let canonical=document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical=document.createElement('link'); canonical.rel='canonical'; document.head.appendChild(canonical); }
    canonical.href='https://nevraplastik.com/blog/' + encodeURIComponent(blog.slug);
  }

  window.addEventListener('siteDataLoaded', () => {
    const lang=localStorage.getItem('nevra_lang') || 'tr';
    renderBlogIndex(lang);
    renderBlogDetail(lang);
  });
  window.addEventListener('languageChanged', e => {
    const lang=(e.detail && e.detail.lang) || localStorage.getItem('nevra_lang') || 'tr';
    renderBlogIndex(lang);
    renderBlogDetail(lang);
  });

});
