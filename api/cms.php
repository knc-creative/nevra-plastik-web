<?php
/* ==========================================================================
   Nevra Plastik - Unified PHP CMS API Gateway (Production Secure & Fail-Closed Setup)
   ========================================================================== */

require_once __DIR__ . '/helpers.php';

init_secure_session();
set_secure_cors_headers();

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-Setup-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$dataDir = __DIR__ . '/data';

function getAdminCredentials($dataDir) {
    $credsFile = $dataDir . '/credentials.json';
    if (file_exists($credsFile)) {
        $data = json_decode(file_get_contents($credsFile), true);
        if ($data && is_array($data)) {
            return $data;
        }
    }
    return ["username" => "admin", "password_hash" => ""];
}

$creds = getAdminCredentials($dataDir);
$adminUser = isset($creds['username']) ? $creds['username'] : 'admin';
$adminHash = isset($creds['password_hash']) ? $creds['password_hash'] : '';

function initDatabase($dataDir) {
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    $certificatesFile = $dataDir . '/certificates.json';
    $categoriesFile = $dataDir . '/categories.json';

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
        safe_json_write($certificatesFile, $defaultCertificates);
    }

    if (!file_exists($categoriesFile)) {
        $defaultCategories = [
            ["id" => "pp", "title_tr" => "PP MOBLEN GRANÜL", "title_en" => "PP MOBLEN GRANULE", "desc_tr" => "Polipropilen bazlı, enjeksiyonluk ve ekstrüzyonluk sınıflarda, yüksek mukavemetli granül hammaddeler.", "desc_en" => "Polypropylene-based granule raw materials with high strength, available in injection molding and extrusion grades.", "image" => "assets/product-pp.webp", "url" => "urun-pp-moblen"],
            ["id" => "pe", "title_tr" => "ELTEKS", "title_en" => "ELTEKS", "desc_tr" => "Alçak Yoğunluk (AYPE) ve Yüksek Yoğunluk (YYPE) polietilen granüller, şişirmelik ve film üretimlerine uygun.", "desc_en" => "Low-Density (LDPE) and High-Density (HDPE) polyethylene granules suitable for blow molding and film production.", "image" => "assets/product-pe.webp", "url" => "urun-elteks"],
            ["id" => "pprc", "title_tr" => "PPR-C GRANÜL", "title_en" => "PPR-C GRANULE", "desc_tr" => "Sıcak-soğuk su boruları, sıhhi tesisat ek parçaları ve altyapı boru grupları için random kopolimer granüller.", "desc_en" => "Random copolymer granules for hot-cold water pipes, sanitary fittings, and infrastructure piping groups.", "image" => "assets/product-compound.webp", "filter" => "hue-rotate(90deg) brightness(0.9)", "url" => "urun-pprc"],
            ["id" => "other", "title_tr" => "ÖZEL KOMPAUNDLAR", "title_en" => "SPECIAL COMPOUNDS", "desc_tr" => "Kalsiyum karbonat, cam elyafı veya mineral dolgularla mekanik özellikleri güçlendirilmiş mühendislik polimerleri.", "desc_en" => "Engineering polymers reinforced with calcium carbonate, glass fiber, or custom mineral additives.", "image" => "assets/product-compound.webp", "url" => "urun-diger"]
        ];
        safe_json_write($categoriesFile, $defaultCategories);
    }
}

initDatabase($dataDir);

$productsFile = $dataDir . '/products.json';
$categoriesFile = $dataDir . '/categories.json';
$translationsFile = $dataDir . '/translations.json';
$machinesFile = $dataDir . '/machines.json';
$certificatesFile = $dataDir . '/certificates.json';
$contactsFile = $dataDir . '/contacts.json';
$faqsFile = $dataDir . '/faqs.json';
$blogsFile = $dataDir . '/blogs.json';

// Get expected setup token if any
function getExpectedSetupToken($dataDir) {
    $envToken = getenv('NEVRA_SETUP_TOKEN');
    if ($envToken !== false && strlen(trim($envToken)) > 0) {
        return trim($envToken);
    }
    $tokenFile = $dataDir . '/setup_token.php';
    if (file_exists($tokenFile)) {
        include_once $tokenFile;
        if (defined('NEVRA_SETUP_TOKEN') && strlen(trim(NEVRA_SETUP_TOKEN)) > 0 && NEVRA_SETUP_TOKEN !== 'YOUR_STRONG_RANDOM_TOKEN_HERE') {
            return trim(NEVRA_SETUP_TOKEN);
        }
    }
    return null;
}

switch ($action) {
    case 'check_setup':
        $isLoggedIn = (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true);
        $expectedToken = getExpectedSetupToken($dataDir);
        echo json_encode([
            "status" => "success",
            "setup_required" => empty($adminHash),
            "setup_configured" => ($expectedToken !== null),
            "logged_in" => $isLoggedIn,
            "username" => isset($_SESSION['admin_user']) ? $_SESSION['admin_user'] : null,
            "csrf_token" => $isLoggedIn ? get_csrf_token() : null
        ]);
        break;

    case 'setup_admin':
        // 1. If password_hash is already set, setup is PERMANENTLY DISABLED
        if (!empty($adminHash)) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Kurulum daha önce tamamlanmıştır."]);
            exit();
        }

        // 2. FAIL-CLOSED: If server-side setup token is NOT configured, setup is completely blocked
        $expectedToken = getExpectedSetupToken($dataDir);
        if (empty($expectedToken)) {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Yönetici kurulumu sunucu tarafında henüz yapılandırılmamıştır (NEVRA_SETUP_TOKEN)."]);
            exit();
        }

        // 3. Verify provided token via X-Setup-Token header or setup_token parameter
        $rawPost = file_get_contents('php://input');
        $postData = json_decode($rawPost, true);
        if (!$postData) $postData = $_POST;

        $providedToken = isset($_SERVER['HTTP_X_SETUP_TOKEN']) ? trim($_SERVER['HTTP_X_SETUP_TOKEN']) : (isset($postData['setup_token']) ? trim($postData['setup_token']) : '');

        if (empty($providedToken) || !hash_equals($expectedToken, $providedToken)) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Geçersiz veya eksik kurulum tokeni."]);
            exit();
        }

        $newPass = isset($postData['new_password']) ? $postData['new_password'] : '';
        $confirmPass = isset($postData['new_password_confirm']) ? $postData['new_password_confirm'] : '';

        if (strlen($newPass) < 12) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Yönetici şifresi en az 12 karakter olmalıdır."]);
            exit();
        }

        if ($newPass !== $confirmPass) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Şifreler birbiriyle uyuşmuyor."]);
            exit();
        }

        $newHash = password_hash($newPass, PASSWORD_BCRYPT);
        $credsFile = $dataDir . '/credentials.json';
        $saveData = [
            "username" => "admin",
            "password_hash" => $newHash
        ];

        if (safe_json_write($credsFile, $saveData)) {
            session_regenerate_id(true);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = "admin";
            $csrfToken = get_csrf_token();
            echo json_encode([
                "status" => "success",
                "message" => "Yönetici şifresi başarıyla oluşturuldu.",
                "csrf_token" => $csrfToken
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Şifre dosyası yazılamadı."]);
        }
        break;

    case 'check_session':
        $isLoggedIn = (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true);
        echo json_encode([
            "logged_in" => $isLoggedIn,
            "username" => isset($_SESSION['admin_user']) ? $_SESSION['admin_user'] : null,
            "setup_required" => empty($adminHash),
            "csrf_token" => $isLoggedIn ? get_csrf_token() : null
        ]);
        break;

    case 'login':
        if (empty($adminHash)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "İlk şifre kurulumu gereklidir.", "setup_required" => true]);
            exit();
        }

        $rawPost = file_get_contents('php://input');
        $postData = json_decode($rawPost, true);
        if (!$postData) $postData = $_POST;

        $user = isset($postData['username']) ? trim($postData['username']) : '';
        $pass = isset($postData['password']) ? $postData['password'] : '';

        if ($user === $adminUser && password_verify($pass, $adminHash)) {
            session_regenerate_id(true);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = $user;
            $csrfToken = get_csrf_token();
            echo json_encode([
                "status" => "success",
                "message" => "Giriş başarılı.",
                "csrf_token" => $csrfToken
            ]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz kullanıcı adı veya şifre."]);
        }
        break;

    case 'logout':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Oturum kapatma yalnızca POST yöntemi ile yapılabilir."]);
            exit();
        }
        check_admin_auth();
        check_csrf_token();
        $_SESSION = array();
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        echo json_encode(["status" => "success", "message" => "Oturum kapatıldı."]);
        break;

    case 'change_password':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $postData = json_decode($rawPost, true);

        $currentPass = isset($postData['current_password']) ? $postData['current_password'] : '';
        $newPass = isset($postData['new_password']) ? $postData['new_password'] : '';
        $confirmPass = isset($postData['new_password_confirm']) ? $postData['new_password_confirm'] : '';

        if (!password_verify($currentPass, $adminHash)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Mevcut şifre hatalı."]);
            exit();
        }

        if (strlen($newPass) < 12) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Yeni şifre en az 12 karakter olmalıdır."]);
            exit();
        }

        if ($confirmPass !== '' && $newPass !== $confirmPass) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Yeni şifre tekrarları eşleşmiyor."]);
            exit();
        }

        $newHash = password_hash($newPass, PASSWORD_BCRYPT);
        $credsFile = $dataDir . '/credentials.json';
        $saveData = [
            "username" => $adminUser,
            "password_hash" => $newHash
        ];

        if (safe_json_write($credsFile, $saveData)) {
            echo json_encode(["status" => "success", "message" => "Şifreniz başarıyla değiştirildi."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Şifre kaydı güncellenemedi."]);
        }
        break;

    case 'load':
        $products = file_exists($productsFile) ? json_decode(file_get_contents($productsFile), true) : [];
        $categories = file_exists($categoriesFile) ? json_decode(file_get_contents($categoriesFile), true) : [];
        $translations = file_exists($translationsFile) ? json_decode(file_get_contents($translationsFile), true) : [];

        $machines = file_exists($machinesFile) ? json_decode(file_get_contents($machinesFile), true) : [];
        $certificates = file_exists($certificatesFile) ? json_decode(file_get_contents($certificatesFile), true) : [];
        $faqs = file_exists($faqsFile) ? json_decode(file_get_contents($faqsFile), true) : [];
        $blogs = file_exists($blogsFile) ? json_decode(file_get_contents($blogsFile), true) : [];

        $contacts = [];
        if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true && file_exists($contactsFile)) {
            $contacts = json_decode(file_get_contents($contactsFile), true);
        }

        echo json_encode([
            "status" => "success",
            "products" => $products,
            "categories" => $categories,
            "translations" => $translations,
            "machines" => $machines,
            "contacts" => $contacts,
            "certificates" => $certificates,
            "faqs" => $faqs,
            "blogs" => $blogs,
            "csrf_token" => (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) ? get_csrf_token() : null
        ]);
        break;

    case 'save_product':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $item = json_decode($rawPost, true);
        if (!$item || !isset($item['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz ürün verisi."]);
            exit();
        }

        $products = file_exists($productsFile) ? json_decode(file_get_contents($productsFile), true) : [];
        $updated = false;
        for ($i = 0; $i < count($products); $i++) {
            if ($products[$i]['id'] === $item['id']) {
                $products[$i] = $item;
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            $products[] = $item;
        }

        safe_json_write($productsFile, $products);
        echo json_encode(["status" => "success", "message" => "Ürün başarıyla kaydedildi."]);
        break;

    case 'delete_product':
        check_admin_auth();
        check_csrf_token();
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID zorunludur."]);
            exit();
        }

        $products = file_exists($productsFile) ? json_decode(file_get_contents($productsFile), true) : [];
        $products = array_values(array_filter($products, function($p) use ($id) {
            return $p['id'] !== $id;
        }));

        safe_json_write($productsFile, $products);
        echo json_encode(["status" => "success", "message" => "Ürün silindi."]);
        break;

    case 'save_category':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $item = json_decode($rawPost, true);
        if (!$item || !isset($item['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz kategori verisi."]);
            exit();
        }

        $categories = file_exists($categoriesFile) ? json_decode(file_get_contents($categoriesFile), true) : [];
        $updated = false;
        for ($i = 0; $i < count($categories); $i++) {
            if ($categories[$i]['id'] === $item['id']) {
                $categories[$i] = $item;
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            $categories[] = $item;
        }

        safe_json_write($categoriesFile, $categories);
        echo json_encode(["status" => "success", "message" => "Kategori kaydedildi."]);
        break;

    case 'delete_category':
        check_admin_auth();
        check_csrf_token();
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID zorunludur."]);
            exit();
        }

        $categories = file_exists($categoriesFile) ? json_decode(file_get_contents($categoriesFile), true) : [];
        $categories = array_values(array_filter($categories, function($c) use ($id) {
            return $c['id'] !== $id;
        }));

        safe_json_write($categoriesFile, $categories);
        echo json_encode(["status" => "success", "message" => "Kategori silindi."]);
        break;

    case 'save_translations':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $item = json_decode($rawPost, true);
        if (!$item) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz çeviri verisi."]);
            exit();
        }

        safe_json_write($translationsFile, $item);
        echo json_encode(["status" => "success", "message" => "Çeviriler kaydedildi."]);
        break;

    case 'save_machine':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $item = json_decode($rawPost, true);
        if (!$item || !isset($item['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz makine verisi."]);
            exit();
        }

        $machines = file_exists($machinesFile) ? json_decode(file_get_contents($machinesFile), true) : [];
        $updated = false;
        for ($i = 0; $i < count($machines); $i++) {
            if ($machines[$i]['id'] === $item['id']) {
                $machines[$i] = $item;
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            $machines[] = $item;
        }

        safe_json_write($machinesFile, $machines);
        echo json_encode(["status" => "success", "message" => "Makine kaydedildi."]);
        break;

    case 'delete_machine':
        check_admin_auth();
        check_csrf_token();
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID zorunludur."]);
            exit();
        }

        $machines = file_exists($machinesFile) ? json_decode(file_get_contents($machinesFile), true) : [];
        $machines = array_values(array_filter($machines, function($m) use ($id) {
            return $m['id'] !== $id;
        }));

        safe_json_write($machinesFile, $machines);
        echo json_encode(["status" => "success", "message" => "Makine silindi."]);
        break;

    case 'save_certificate':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $item = json_decode($rawPost, true);
        if (!$item || !isset($item['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz sertifika verisi."]);
            exit();
        }

        $certificates = file_exists($certificatesFile) ? json_decode(file_get_contents($certificatesFile), true) : [];
        $updated = false;
        for ($i = 0; $i < count($certificates); $i++) {
            if ($certificates[$i]['id'] === $item['id']) {
                $certificates[$i] = $item;
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            $certificates[] = $item;
        }

        safe_json_write($certificatesFile, $certificates);
        echo json_encode(["status" => "success", "message" => "Sertifika kaydedildi."]);
        break;

    case 'delete_certificate':
        check_admin_auth();
        check_csrf_token();
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID zorunludur."]);
            exit();
        }

        $certificates = file_exists($certificatesFile) ? json_decode(file_get_contents($certificatesFile), true) : [];
        $certificates = array_values(array_filter($certificates, function($c) use ($id) {
            return $c['id'] !== $id;
        }));

        safe_json_write($certificatesFile, $certificates);
        echo json_encode(["status" => "success", "message" => "Sertifika silindi."]);
        break;

    case 'delete_contact':
        check_admin_auth();
        check_csrf_token();
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID zorunludur."]);
            exit();
        }

        $contacts = file_exists($contactsFile) ? json_decode(file_get_contents($contactsFile), true) : [];
        $contacts = array_values(array_filter($contacts, function($c) use ($id) {
            return $c['id'] !== $id;
        }));

        safe_json_write($contactsFile, $contacts);
        echo json_encode(["status" => "success", "message" => "İletişim mesajı silindi."]);
        break;

    case 'save_faq':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $item = json_decode($rawPost, true);
        if (!$item || !isset($item['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz SSS verisi."]);
            exit();
        }

        $faqs = file_exists($faqsFile) ? json_decode(file_get_contents($faqsFile), true) : [];
        $updated = false;
        for ($i = 0; $i < count($faqs); $i++) {
            if ($faqs[$i]['id'] === $item['id']) {
                $faqs[$i] = $item;
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            $faqs[] = $item;
        }

        safe_json_write($faqsFile, $faqs);
        echo json_encode(["status" => "success", "message" => "Soru başarıyla kaydedildi."]);
        break;

    case 'delete_faq':
        check_admin_auth();
        check_csrf_token();
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID zorunludur."]);
            exit();
        }

        $faqs = file_exists($faqsFile) ? json_decode(file_get_contents($faqsFile), true) : [];
        $faqs = array_values(array_filter($faqs, function($f) use ($id) {
            return $f['id'] !== $id;
        }));

        safe_json_write($faqsFile, $faqs);
        echo json_encode(["status" => "success", "message" => "Soru silindi."]);
        break;

    case 'update_faq_status':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $postData = json_decode($rawPost, true);
        $id = isset($postData['id']) ? $postData['id'] : (isset($_GET['id']) ? $_GET['id'] : '');
        $status = isset($postData['status']) ? $postData['status'] : '';
        if (!$id || !$status) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID ve durum zorunludur."]);
            exit();
        }

        $faqs = file_exists($faqsFile) ? json_decode(file_get_contents($faqsFile), true) : [];
        for ($i = 0; $i < count($faqs); $i++) {
            if ($faqs[$i]['id'] === $id) {
                $faqs[$i]['status'] = $status;
                break;
            }
        }

        safe_json_write($faqsFile, $faqs);
        echo json_encode(["status" => "success", "message" => "Durum güncellendi."]);
        break;


    case 'save_blog':
        check_admin_auth();
        check_csrf_token();
        $rawPost = file_get_contents('php://input');
        $item = json_decode($rawPost, true);
        if (!$item || !isset($item['id']) || empty($item['slug']) || empty($item['title_tr'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçersiz blog verisi. ID, slug ve Türkçe başlık zorunludur."]);
            exit();
        }

        $item['slug'] = strtolower(trim(preg_replace('/[^a-zA-Z0-9-]+/', '-', $item['slug']), '-'));
        if ($item['slug'] === '') {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geçerli bir slug girilmelidir."]);
            exit();
        }

        $blogs = file_exists($blogsFile) ? json_decode(file_get_contents($blogsFile), true) : [];
        if (!is_array($blogs)) $blogs = [];

        foreach ($blogs as $existing) {
            if (isset($existing['slug']) && $existing['slug'] === $item['slug'] && (!isset($existing['id']) || $existing['id'] !== $item['id'])) {
                http_response_code(409);
                echo json_encode(["status" => "error", "message" => "Bu blog bağlantısı (slug) zaten kullanılıyor."]);
                exit();
            }
        }

        $updated = false;
        for ($i = 0; $i < count($blogs); $i++) {
            if (isset($blogs[$i]['id']) && $blogs[$i]['id'] === $item['id']) {
                $blogs[$i] = $item;
                $updated = true;
                break;
            }
        }
        if (!$updated) $blogs[] = $item;

        if (!safe_json_write($blogsFile, $blogs)) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Blog verisi kaydedilemedi."]);
            exit();
        }

        echo json_encode(["status" => "success", "message" => "Blog yazısı kaydedildi."]);
        break;

    case 'delete_blog':
        check_admin_auth();
        check_csrf_token();
        $id = isset($_GET['id']) ? trim($_GET['id']) : '';
        if ($id === '') {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID zorunludur."]);
            exit();
        }

        $blogs = file_exists($blogsFile) ? json_decode(file_get_contents($blogsFile), true) : [];
        if (!is_array($blogs)) $blogs = [];
        $blogs = array_values(array_filter($blogs, function($b) use ($id) {
            return !isset($b['id']) || $b['id'] !== $id;
        }));

        if (!safe_json_write($blogsFile, $blogs)) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Blog yazısı silinemedi."]);
            exit();
        }

        echo json_encode(["status" => "success", "message" => "Blog yazısı silindi."]);
        break;

    default:
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Eylem bulunamadı."]);
        break;
}
?>
