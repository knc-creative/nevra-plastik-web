<?php
/* ==========================================================================
   Nevra Plastik - Unified PHP CMS API Gateway
   ========================================================================== */

// Enable sessions
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$dataDir = __DIR__ . '/data';

// Helper to get administrator credentials dynamically
function getAdminCredentials($dataDir) {
    $credsFile = $dataDir . '/credentials.json';
    if (file_exists($credsFile)) {
        $data = json_decode(file_get_contents($credsFile), true);
        if ($data && isset($data['username']) && isset($data['password'])) {
            return $data;
        }
    }
    return ["username" => "admin", "password" => "admin123"];
}

$creds = getAdminCredentials($dataDir);
define('ADMIN_USER', $creds['username']);
define('ADMIN_PASS', $creds['password']);

// Helper: Ensure directory and JSON files exist with seed data if needed
function initDatabase($dataDir) {
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    $productsFile = $dataDir . '/products.json';
    $categoriesFile = $dataDir . '/categories.json';
    $translationsFile = $dataDir . '/translations.json';
    $certificatesFile = $dataDir . '/certificates.json';

    // Seed Certificates
    if (!file_exists($certificatesFile)) {
        $defaultCertificates = [
            [
                "id" => "cert_1",
                "icon" => "📄",
                "title_tr" => "Çevre İzin Lisans Belgesi",
                "title_en" => "Environmental Permit License",
                "sub_tr" => "Bakanlık Geri Kazanım Lisansı",
                "sub_en" => "Ministry Recycling License",
                "status" => "active",
                "document_image" => ""
            ],
            [
                "id" => "cert_2",
                "icon" => "🏅",
                "title_tr" => "ISO 9001:2015",
                "title_en" => "ISO 9001:2015",
                "sub_tr" => "Kalite Yönetim Sertifikası",
                "sub_en" => "Quality Management Certificate",
                "status" => "active",
                "document_image" => ""
            ],
            [
                "id" => "cert_3",
                "icon" => "🌿",
                "title_tr" => "ISO 14001:2015",
                "title_en" => "ISO 14001:2015",
                "sub_tr" => "Çevre Yönetim Sertifikası",
                "sub_en" => "Environmental Management Certificate",
                "status" => "active",
                "document_image" => ""
            ],
            [
                "id" => "cert_4",
                "icon" => "™",
                "title_tr" => "Tescil Belgesi",
                "title_en" => "Trademark Registration Certificate",
                "sub_tr" => "Nevra Marka Tescili",
                "sub_en" => "Nevra Trademark Registration",
                "status" => "active",
                "document_image" => ""
            ]
        ];
        file_put_contents($certificatesFile, json_encode($defaultCertificates, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    // Seed Categories
    if (!file_exists($categoriesFile)) {
        $defaultCategories = [
            ["id" => "pp", "title_tr" => "PP MOBLEN GRANÜL", "title_en" => "PP MOBLEN GRANULE", "desc_tr" => "Polipropilen bazlı, enjeksiyonluk ve ekstrüzyonluk sınıflarda, yüksek mukavemetli granül hammaddeler.", "desc_en" => "Polypropylene-based granule raw materials with high strength, available in injection molding and extrusion grades.", "image" => "assets/product-pp.png", "url" => "urun-pp-moblen.html"],
            ["id" => "pe", "title_tr" => "ELTEKS", "title_en" => "ELTEKS", "desc_tr" => "Alçak Yoğunluk (AYPE) ve Yüksek Yoğunluk (YYPE) polietilen granüller, şişirmelik ve film üretimlerine uygun.", "desc_en" => "Low-Density (LDPE) and High-Density (HDPE) polyethylene granules suitable for blow molding and film production.", "image" => "assets/product-pe.png", "url" => "urun-elteks.html"],
            ["id" => "pprc", "title_tr" => "PPR-C GRANÜL", "title_en" => "PPR-C GRANULE", "desc_tr" => "Sıcak-soğuk su boruları, sıhhi tesisat ek parçaları ve altyapı boru grupları için random kopolimer granüller.", "desc_en" => "Random copolymer granules for hot-cold water pipes, sanitary fittings, and infrastructure piping groups.", "image" => "assets/product-compound.png", "filter" => "hue-rotate(90deg) brightness(0.9)", "url" => "urun-pprc.html"],
            ["id" => "other", "title_tr" => "ÖZEL KOMPAUNDLAR", "title_en" => "SPECIAL COMPOUNDS", "desc_tr" => "Kalsiyum karbonat, cam elyafı veya mineral dolgularla mekanik özellikleri güçlendirilmiş mühendislik polimerleri.", "desc_en" => "Engineering polymers reinforced with calcium carbonate, glass fiber, or custom mineral additives.", "image" => "assets/product-compound.png", "url" => "urun-diger.html"]
        ];
        file_put_contents($categoriesFile, json_encode($defaultCategories, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    // Seed Products
    if (!file_exists($productsFile)) {
        $defaultProducts = [
            [
                "id" => "pp-black",
                "category_id" => "pp",
                "code" => "Nevra PP-100",
                "name_tr" => "Siyah Enjeksiyonluk PP",
                "name_en" => "Black Injection PP",
                "desc_tr" => "Kasa, kova, plastik saksı ve endüstriyel gövdeler için yüksek darbe mukavemetli enjeksiyonluk siyah hammadde.",
                "desc_en" => "Black raw material for crates, buckets, flower pots, and industrial housings with high impact resistance.",
                "detail_tr" => "Nevra PP-100 Siyah Granüllerimiz, yüksek darbe dayanımı ve mükemmel kalıp doldurma özellikleri ile üretilmektedir. Enjeksiyon kalıplama hatlarında güvenle kullanılabilir. Otomotiv yan sanayisi, ambalaj, bahçe mobilyaları gibi sanayi kollarında sıklıkla tercih edilen kararlı formülasyonlardır.",
                "detail_en" => "Our Nevra PP-100 Black Granules are manufactured with high impact strength and excellent mold-filling properties. Safe to use in injection molding lines. These are stable formulations highly preferred in industrial sectors like automotive, packaging, and garden furniture.",
                "mfi" => "8 - 15 g/10 min (230°C / 2.16 kg)",
                "density" => "0.90 - 0.92 g/cm³",
                "color_tr" => "Siyah",
                "color_en" => "Black",
                "usage_tr" => "Plastik saksı, taşıma kasaları, kovalar, otomotiv parçaları, tamponlar, endüstriyel gövdeler.",
                "usage_en" => "Plastic flower pots, transport crates, buckets, automotive parts, bumpers, industrial bodies.",
                "image" => "assets/product-pp.png",
                "filter" => "none"
            ],
            [
                "id" => "pp-gray",
                "category_id" => "pp",
                "code" => "Nevra PP-200",
                "name_tr" => "Gri Ekstrüzyonluk PP",
                "name_en" => "Gray Extrusion PP",
                "desc_tr" => "Plastik boru ekleme parçaları, contalar ve profil ekstrüzyonu için uygun yüksek viskoziteli gri hammadde.",
                "desc_en" => "High viscosity gray raw material for plastic pipe fittings, gaskets, and profile extrusion.",
                "detail_tr" => "Nevra PP-200 Gri, yüksek viskoziteli yapısı sayesinde ekstrüzyon ve enjeksiyon prosesleri için mükemmel direnç değerleri sağlar. Özellikle altyapı boru fittings malzemeleri ve endüstriyel contaların üretiminde stabil bir proses sunar.",
                "detail_en" => "Nevra PP-200 Gray, with its high-viscosity structure, provides excellent resistance values for extrusion and injection molding processes. It offers a stable process particularly for the production of pipe fittings and industrial gaskets.",
                "mfi" => "5 - 8 g/10 min (230°C / 2.16 kg)",
                "density" => "0.90 - 0.92 g/cm³",
                "color_tr" => "Gri",
                "color_en" => "Gray",
                "usage_tr" => "Boru ekleme parçaları, fittings elemanları, contalar, levha ve profil ekstrüzyonu.",
                "usage_en" => "Pipe connection parts, fittings elements, gaskets, sheet and profile extrusion.",
                "image" => "assets/product-pp.png",
                "filter" => "hue-rotate(120deg) brightness(0.8)"
            ],
            [
                "id" => "pp-color",
                "category_id" => "pp",
                "code" => "Nevra PP-300",
                "name_tr" => "Renkli Genel Amaçlı PP",
                "name_en" => "Colored General Purpose PP",
                "desc_tr" => "Askı, bahçe mobilyası, ev gereçleri ve oyuncak üretimine uygun ekonomik, özel renk eşleştirmeli hammadde.",
                "desc_en" => "Economical raw material for hangers, garden furniture, household goods, and toys with custom color matchings.",
                "detail_tr" => "Nevra PP-300 Renkli, oyuncak, askı, ev gereçleri gibi geniş yelpazedeki enjeksiyon kalıplama uygulamaları için ekonomik ve estetik bir çözümdür. Müşteri numunelerine göre özel renk eşleme çalışması yapılabilmektedir.",
                "detail_en" => "Nevra PP-300 Colored is an economical and aesthetic solution for a wide range of injection molding applications like toys, hangers, and household goods. Custom color matching is available according to customer samples.",
                "mfi" => "10 - 18 g/10 min (230°C / 2.16 kg)",
                "density" => "0.90 - 0.92 g/cm³",
                "color_tr" => "Siyah, Beyaz, Gri ve Özel Renkler",
                "color_en" => "Black, White, Grey, and Custom Colors",
                "usage_tr" => "Askı, bahçe mobilyası, oyuncaklar, mandal, ev gereçleri.",
                "usage_en" => "Hangers, garden furniture, toys, clothes pegs, household goods.",
                "image" => "assets/product-pp.png",
                "filter" => "hue-rotate(270deg) brightness(0.9)"
            ]
        ];
        file_put_contents($productsFile, json_encode($defaultProducts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    // Seed Translations
    if (!file_exists($translationsFile)) {
        // Embed a basic subset or placeholder that gets updated
        // To save space, we can seed it with the tr/en structure containing core translation mappings
        $defaultTranslations = [
            "tr" => [
                "nav_home" => "Anasayfa", "nav_about" => "Hakkımızda", "nav_products" => "Ürünler", "nav_process" => "Üretim Süreci", "nav_quality" => "Kalite & Sertifikalar", "nav_sustain" => "Sürdürülebilirlik", "nav_contact" => "İletişim", "cta_quote" => "Teklif Talep Et", "back_to_catalog" => "Ürün Kataloğuna Dön", "cta_quote_long" => "Teklif Talep Et", "cta_explore" => "Ürünleri İncele",
                "hero_tagline" => "2007'den Beri Sürdürülebilir Gelecek", "hero_title" => "Bugünün Atıklarını, Yarının Değerine Dönüştürüyoruz.", "hero_desc" => "Nevra Plastik, 2007 yılından bu yana lisanslı, çevre standartlarına uygun ve tamamen izlenebilir üretim süreçleriyle yüksek kaliteli geri dönüştürülmüş plastik hammaddeler üretmektedir.",
                "about_tag" => "Biz Kimiz?", "about_title" => "Değer Katan Geri Dönüşüm, Güvenilir Hammadde", "about_hero_sub" => "Nevra Plastik, 2007 yılından bu yana çevre standartlarına uygun, yüksek kaliteli geri dönüştürülmüş plastik hammaddeler üretmektedir.", "about_history_title" => "2007'den Beri Güven ve Sürdürülebilirlik", "about_desc_1" => "Nevra Plastik, 2007 yılında Konya'da kurulmuş olup, endüstriyel ve evsel plastik atıkları yeniden ekonomiye kazandırarak yüksek kalitede geri dönüştürülmüş polimer hammaddeler üretmektedir. Sektördeki 19 yıllık uzmanlığımızla, plastik üreticilerine çevre dostu, ekonomik ve standart kalitede sürdürülebilir hammaddeler temin ediyoruz.", "about_desc_2" => "Modern makine parkurumuz, uzman kadromuz ve Çevre, Şehircilik ve İklim Değişikliği Bakanlığı onaylı lisanslarımız ile atıkları kaynağından nihai ürüne kadar tam izlenebilirlik sistemiyle işliyoruz. Nevra Plastik, iş ortakları için sadece bir hammadde tedarikçisi değil, yeşil dönüşüm yolculuklarında uzun vadeli ve güvenilir bir B2B çözüm ortağıdır.", "about_desc_3" => "Geri kazandırdığımız her ton plastik ile doğal kaynaklarımızın tüketimini azaltıyor, petrol ithalatı bağımlılığını düşürüyor ve gelecek nesillere daha yaşanabilir bir çevre bırakma vizyonuyla çalışıyoruz. Çevreye duyarlılığımız ve kalitemiz, ulusal ve uluslararası geçerliliğe sahip sertifikalarımızla tescillenmiştir.",
                "img_logo" => "assets/logo.svg", "img_hero" => "assets/hero-bg.png", "img_about" => "assets/facility.png", "img_sustain" => "assets/facility.png", "img_quality" => "assets/facility.png", "img_machinery" => "uploads/yatay_balya_press.png", "img_favicon" => "assets/logo.svg"
            ],
            "en" => [
                "nav_home" => "Home", "nav_about" => "About Us", "nav_products" => "Products", "nav_process" => "Production Process", "nav_quality" => "Quality & Certificates", "nav_sustain" => "Sustainability", "nav_contact" => "Contact", "cta_quote" => "Request Quote", "back_to_catalog" => "Back to Product Catalog", "cta_quote_long" => "Request Quote", "cta_explore" => "Explore Products",
                "hero_tagline" => "Sustainable Future Since 2007", "hero_title" => "Transforming Today's Waste into Tomorrow's Value.", "hero_desc" => "Since 2007, Nevra Plastik has been producing high-quality recycled plastic raw materials with licensed, environmentally friendly, and fully traceable processes.",
                "about_tag" => "Who We Are", "about_title" => "Value-Adding Recycling, Reliable Raw Material", "about_hero_sub" => "Since 2007, Nevra Plastik has been producing high-quality recycled plastic raw materials with licensed and environmentally friendly processes.", "about_history_title" => "Trust and Sustainability Since 2007", "about_desc_1" => "Nevra Plastik was established in Konya in 2007, returning industrial and domestic plastic waste to the economy by manufacturing high-quality recycled polymer raw materials. With our 19 years of expertise, we provide eco-friendly, economical, and standard-quality sustainable raw materials to plastic manufacturers.", "about_desc_2" => "With our modern machinery, expert staff, and licenses approved by the Ministry of Environment, Urbanization, and Climate Change, we process waste from source to final product under a full traceability system. Nevra Plastik is not just a supplier, but a long-term and reliable solution partner in the green transition.", "about_desc_3" => "With every ton of plastic we recover, we reduce natural resource consumption, lower oil import dependency, and work with the vision of leaving a more livable environment for future generations. Our environmental awareness and quality are certified by national and international standards.",
                "img_logo" => "assets/logo.svg", "img_hero" => "assets/hero-bg.png", "img_about" => "assets/facility.png", "img_sustain" => "assets/facility.png", "img_quality" => "assets/facility.png", "img_machinery" => "uploads/yatay_balya_press.png", "img_favicon" => "assets/logo.svg"
            ]
        ];
        file_put_contents($translationsFile, json_encode($defaultTranslations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}

// Ensure database is initialized
initDatabase($dataDir);

$productsFile = $dataDir . '/products.json';
$categoriesFile = $dataDir . '/categories.json';
$translationsFile = $dataDir . '/translations.json';
$machinesFile = $dataDir . '/machines.json';
$contactsFile = $dataDir . '/contacts.json';
$certificatesFile = $dataDir . '/certificates.json';

// Helper to check authentication
function checkAuth() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Unauthorized access. Please log in first."]);
        exit();
    }
}

// Execute Actions
switch ($action) {
    case 'check_session':
        echo json_encode([
            "logged_in" => (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true),
            "username" => isset($_SESSION['admin_user']) ? $_SESSION['admin_user'] : null
        ]);
        break;

    case 'login':
        // Read POST request body
        $rawPost = file_get_contents('php://input');
        $postData = json_decode($rawPost, true);
        if (!$postData) {
            $postData = $_POST;
        }

        $user = isset($postData['username']) ? $postData['username'] : '';
        $pass = isset($postData['password']) ? $postData['password'] : '';

        if ($user === ADMIN_USER && $pass === ADMIN_PASS) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = $user;
            echo json_encode(["status" => "success", "message" => "Logged in successfully."]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(["status" => "success", "message" => "Logged out successfully."]);
        break;

    case 'load':
        // Load all data
        $products = json_decode(file_get_contents($productsFile), true);
        $categories = json_decode(file_get_contents($categoriesFile), true);
        $translations = json_decode(file_get_contents($translationsFile), true);
        
        $machines = [];
        if (file_exists($machinesFile)) {
            $machines = json_decode(file_get_contents($machinesFile), true);
        }
        
        $contacts = [];
        // Performance & GDPR/KVKK Security: Only load contacts for logged-in admin session
        if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
            if (file_exists($contactsFile)) {
                $contacts = json_decode(file_get_contents($contactsFile), true);
            }
        }

        $certificates = [];
        if (file_exists($certificatesFile)) {
            $certificates = json_decode(file_get_contents($certificatesFile), true);
        }

        echo json_encode([
            "status" => "success",
            "products" => $products,
            "categories" => $categories,
            "translations" => $translations,
            "machines" => $machines,
            "contacts" => $contacts,
            "certificates" => $certificates
        ]);
        break;

    case 'save_product':
        checkAuth();
        $rawPost = file_get_contents('php://input');
        $newProduct = json_decode($rawPost, true);
        if (!$newProduct || !isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid data or missing ID parameter."]);
            exit();
        }

        $id = $_GET['id'];
        $products = json_decode(file_get_contents($productsFile), true);
        $found = false;

        foreach ($products as $idx => $prod) {
            if ($prod['id'] === $id) {
                $products[$idx] = array_merge(["id" => $id], $newProduct);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $products[] = array_merge(["id" => $id], $newProduct);
        }

        file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        updateFallbackDataJs();
        echo json_encode(["status" => "success", "message" => "Product saved successfully."]);
        break;

    case 'delete_product':
        checkAuth();
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing ID parameter."]);
            exit();
        }

        $id = $_GET['id'];
        $products = json_decode(file_get_contents($productsFile), true);
        $initialCount = count($products);
        $products = array_values(array_filter($products, function($prod) use ($id) {
            return $prod['id'] !== $id;
        }));

        if (count($products) === $initialCount) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Product not found."]);
        } else {
            file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            updateFallbackDataJs();
            echo json_encode(["status" => "success", "message" => "Product deleted successfully."]);
        }
        break;

    case 'reorder_products':
        checkAuth();
        $rawPost = file_get_contents('php://input');
        $newOrderIds = json_decode($rawPost, true);
        if (!$newOrderIds || !is_array($newOrderIds)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz sıralama verisi."]);
            exit();
        }

        $products = [];
        if (file_exists($productsFile)) {
            $products = json_decode(file_get_contents($productsFile), true);
        }

        $orderedProducts = [];
        foreach ($newOrderIds as $id) {
            foreach ($products as $p) {
                if ($p['id'] === $id) {
                    $orderedProducts[] = $p;
                    break;
                }
            }
        }

        foreach ($products as $p) {
            $alreadyAdded = false;
            foreach ($orderedProducts as $op) {
                if ($op['id'] === $p['id']) {
                    $alreadyAdded = true;
                    break;
                }
            }
            if (!$alreadyAdded) {
                $orderedProducts[] = $p;
            }
        }

        file_put_contents($productsFile, json_encode($orderedProducts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        updateFallbackDataJs();
        echo json_encode(["status" => "success", "message" => "Ürün sıralaması başarıyla güncellendi."]);
        break;

    case 'save_category':
        checkAuth();
        $rawPost = file_get_contents('php://input');
        $newCategory = json_decode($rawPost, true);
        if (!$newCategory || !isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid data or missing ID parameter."]);
            exit();
        }

        $id = $_GET['id'];
        $categories = json_decode(file_get_contents($categoriesFile), true);
        $found = false;

        foreach ($categories as $idx => $cat) {
            if ($cat['id'] === $id) {
                $categories[$idx] = array_merge(["id" => $id], $newCategory);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $categories[] = array_merge(["id" => $id], $newCategory);
        }

        file_put_contents($categoriesFile, json_encode($categories, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        updateFallbackDataJs();
        echo json_encode(["status" => "success", "message" => "Category saved successfully."]);
        break;

    case 'delete_category':
        checkAuth();
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing ID parameter."]);
            exit();
        }

        $id = $_GET['id'];
        $categories = json_decode(file_get_contents($categoriesFile), true);
        $initialCount = count($categories);
        $categories = array_values(array_filter($categories, function($cat) use ($id) {
            return $cat['id'] !== $id;
        }));

        if (count($categories) === $initialCount) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Category not found."]);
        } else {
            file_put_contents($categoriesFile, json_encode($categories, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            updateFallbackDataJs();
            echo json_encode(["status" => "success", "message" => "Category deleted successfully."]);
        }
        break;

    case 'save_translations':
        checkAuth();
        $rawPost = file_get_contents('php://input');
        $updatedTranslations = json_decode($rawPost, true);
        if (!$updatedTranslations || !isset($updatedTranslations['tr']) || !isset($updatedTranslations['en'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid translation payload structure."]);
            exit();
        }

        // Backend Protection: Read existing data and merge missing keys (like image paths, maintenance mode etc.)
        if (file_exists($translationsFile)) {
            $existing = json_decode(file_get_contents($translationsFile), true);
            if ($existing && isset($existing['tr']) && isset($existing['en'])) {
                foreach ($existing['tr'] as $key => $val) {
                    if (!isset($updatedTranslations['tr'][$key])) {
                        $updatedTranslations['tr'][$key] = $val;
                    }
                }
                foreach ($existing['en'] as $key => $val) {
                    if (!isset($updatedTranslations['en'][$key])) {
                        $updatedTranslations['en'][$key] = $val;
                    }
                }
            }
        }

        file_put_contents($translationsFile, json_encode($updatedTranslations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        updateFallbackDataJs();
        echo json_encode(["status" => "success", "message" => "Translations and site text saved successfully."]);
        break;

    case 'save_machine':
        checkAuth();
        $rawPost = file_get_contents('php://input');
        $newMachine = json_decode($rawPost, true);
        if (!$newMachine || !isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid data or missing ID parameter."]);
            exit();
        }

        $id = $_GET['id'];
        $machines = [];
        if (file_exists($machinesFile)) {
            $machines = json_decode(file_get_contents($machinesFile), true);
        }
        
        $found = false;
        foreach ($machines as $idx => $mach) {
            if ($mach['id'] === $id) {
                $machines[$idx] = array_merge(["id" => $id], $newMachine);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $machines[] = array_merge(["id" => $id], $newMachine);
        }

        file_put_contents($machinesFile, json_encode($machines, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        updateFallbackDataJs();
        echo json_encode(["status" => "success", "message" => "Machine saved successfully."]);
        break;

    case 'delete_machine':
        checkAuth();
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing ID parameter."]);
            exit();
        }

        $id = $_GET['id'];
        $machines = [];
        if (file_exists($machinesFile)) {
            $machines = json_decode(file_get_contents($machinesFile), true);
        }
        
        $initialCount = count($machines);
        $machines = array_values(array_filter($machines, function($mach) use ($id) {
            return $mach['id'] !== $id;
        }));

        if (count($machines) === $initialCount) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Machine not found."]);
        } else {
            file_put_contents($machinesFile, json_encode($machines, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            updateFallbackDataJs();
            echo json_encode(["status" => "success", "message" => "Machine deleted successfully."]);
        }
        break;

    case 'delete_contact':
        checkAuth();
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing ID parameter."]);
            exit();
        }

        $id = $_GET['id'];
        $contacts = [];
        if (file_exists($contactsFile)) {
            $contacts = json_decode(file_get_contents($contactsFile), true);
        }
        
        $initialCount = count($contacts);
        $contacts = array_values(array_filter($contacts, function($c) use ($id) {
            return $c['id'] !== $id;
        }));

        if (count($contacts) === $initialCount) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Contact submission not found."]);
        } else {
            file_put_contents($contactsFile, json_encode($contacts, JSON_PRETTY_PRINT | LOCK_EX));
            echo json_encode(["status" => "success", "message" => "Contact submission deleted successfully."]);
        }
        break;

    case 'save_certificate':
        checkAuth();
        $rawPost = file_get_contents('php://input');
        $newCert = json_decode($rawPost, true);
        if (!$newCert || !isset($newCert['title_tr']) || !isset($newCert['title_en'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz sertifika verisi."]);
            exit();
        }

        $certs = [];
        if (file_exists($certificatesFile)) {
            $certs = json_decode(file_get_contents($certificatesFile), true);
        }

        $id = isset($newCert['id']) ? $newCert['id'] : null;
        if (!$id) {
            $id = 'cert_' . round(microtime(true) * 1000);
            $newCert['id'] = $id;
            $certs[] = $newCert;
        } else {
            $found = false;
            foreach ($certs as $index => $c) {
                if ($c['id'] === $id) {
                    $certs[$index] = $newCert;
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $certs[] = $newCert;
            }
        }

        file_put_contents($certificatesFile, json_encode($certs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        updateFallbackDataJs();
        echo json_encode(["status" => "success", "message" => "Sertifika başarıyla kaydedildi.", "id" => $id]);
        break;

    case 'delete_certificate':
        checkAuth();
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Sertifika ID'si eksik."]);
            exit();
        }

        $certs = [];
        if (file_exists($certificatesFile)) {
            $certs = json_decode(file_get_contents($certificatesFile), true);
        }

        $newCerts = [];
        $deleted = false;
        foreach ($certs as $c) {
            if ($c['id'] === $id) {
                $deleted = true;
            } else {
                $newCerts[] = $c;
            }
        }

        if ($deleted) {
            file_put_contents($certificatesFile, json_encode($newCerts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            updateFallbackDataJs();
            echo json_encode(["status" => "success", "message" => "Sertifika başarıyla silindi."]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Sertifika bulunamadı."]);
        }
        break;

    case 'change_password':
        checkAuth();
        $rawPost = file_get_contents('php://input');
        $postData = json_decode($rawPost, true);
        
        $currentPass = isset($postData['current_password']) ? $postData['current_password'] : '';
        $newPass = isset($postData['new_password']) ? $postData['new_password'] : '';
        
        $credsFile = $dataDir . '/credentials.json';
        if (file_exists($credsFile)) {
            $credsData = json_decode(file_get_contents($credsFile), true);
            $dbUser = isset($credsData['username']) ? $credsData['username'] : 'admin';
            $dbPass = isset($credsData['password']) ? $credsData['password'] : 'admin123';
        } else {
            $dbUser = 'admin';
            $dbPass = 'admin123';
        }
        
        if ($currentPass !== $dbPass) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Mevcut şifre hatalı."]);
            exit();
        }
        
        if (strlen($newPass) < 4) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Yeni şifre en az 4 karakter olmalıdır."]);
            exit();
        }
        
        $newCreds = [
            "username" => $dbUser,
            "password" => $newPass
        ];
        
        if (file_put_contents($credsFile, json_encode($newCreds, JSON_PRETTY_PRINT))) {
            echo json_encode(["status" => "success", "message" => "Şifreniz başarıyla değiştirildi."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Dosyaya şifre yazılamadı."]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Action not found."]);
        break;
}

function updateFallbackDataJs() {
    $dataDir = __DIR__ . '/data';
    $productsFile = $dataDir . '/products.json';
    $categoriesFile = $dataDir . '/categories.json';
    $machinesFile = $dataDir . '/machines.json';
    $certificatesFile = $dataDir . '/certificates.json';
    $translationsFile = $dataDir . '/translations.json';

    $products = file_exists($productsFile) ? json_decode(file_get_contents($productsFile), true) : [];
    $categories = file_exists($categoriesFile) ? json_decode(file_get_contents($categoriesFile), true) : [];
    $machines = file_exists($machinesFile) ? json_decode(file_get_contents($machinesFile), true) : [];
    $certificates = file_exists($certificatesFile) ? json_decode(file_get_contents($certificatesFile), true) : [];
    $translations = file_exists($translationsFile) ? json_decode(file_get_contents($translationsFile), true) : [];

    $content = "/* ==========================================================================\n";
    $content .= "   Nevra Plastik - Local Static Fallback Database Data (Auto-Generated)\n";
    $content .= "   ========================================================================== */\n\n";
    
    $content .= "const fallbackCategories = " . json_encode($categories, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n\n";
    $content .= "const fallbackProducts = " . json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n\n";
    $content .= "const fallbackMachines = " . json_encode($machines, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n\n";
    $content .= "const fallbackCertificates = " . json_encode($certificates, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n\n";
    $content .= "const fallbackTranslations = " . json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . ";\n";

    file_put_contents(__DIR__ . '/../js/fallback-data.js', $content);
}
?>
