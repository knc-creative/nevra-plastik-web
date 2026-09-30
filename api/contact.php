<?php
/**
 * Nevra Plastik B2B Contact & Quote Form Handler (Secure Production)
 * PHP Version: 8.2 / 8.3
 */

require_once __DIR__ . '/helpers.php';

set_secure_cors_headers();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Geçersiz istek yöntemi. / Invalid request method.'
    ]);
    exit;
}

// Read client language preference
$lang = isset($_POST['lang']) ? trim($_POST['lang']) : 'tr';
$isEn = ($lang === 'en');

// Error messages translation helper
$messages = [
    'tr' => [
        'err_empty' => 'Lütfen tüm zorunlu alanları doldurunuz.',
        'err_email' => 'Lütfen geçerli bir e-posta adresi giriniz.',
        'err_phone' => 'Lütfen geçerli bir telefon numarası giriniz.',
        'err_kvkk' => 'KVKK onay kutusunu işaretlemeniz gerekmektedir.',
        'err_length' => 'Girdiğiniz veri izin verilen maksimum uzunluğu aşıyor.',
        'err_write' => 'Talebiniz şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyiniz.',
        'success_contact' => 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.',
        'success_quote' => 'Teklif talebiniz başarıyla alındı. Satış departmanımız sizinle irtibata geçecektir.',
        'mail_failed' => 'E-posta gönderimi tamamlanamadı ancak talebiniz sistemimize güvenle kaydedildi. Sizinle iletişime geçeceğiz.'
    ],
    'en' => [
        'err_empty' => 'Please fill in all required fields.',
        'err_email' => 'Please enter a valid email address.',
        'err_phone' => 'Please enter a valid phone number.',
        'err_kvkk' => 'You must accept the Privacy Policy/KVKK consent.',
        'err_length' => 'Input data exceeds maximum allowed length.',
        'err_write' => 'Your request could not be saved at this time. Please try again later.',
        'success_contact' => 'Your message has been sent successfully. We will get back to you shortly.',
        'success_quote' => 'Your price quote request has been received. Our sales team will contact you shortly.',
        'mail_failed' => 'Email dispatch could not complete, but your request has been logged successfully. We will contact you.'
    ]
];

$activeMsgs = $isEn ? $messages['en'] : $messages['tr'];

// Retrieve and Sanitize Form Inputs
$honeypot = isset($_POST['website_hp']) ? trim($_POST['website_hp']) : '';
$name = isset($_POST['name']) ? htmlspecialchars(strip_tags(trim($_POST['name'])), ENT_QUOTES, 'UTF-8') : '';
$company = isset($_POST['company']) ? htmlspecialchars(strip_tags(trim($_POST['company'])), ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars(strip_tags(trim($_POST['phone'])), ENT_QUOTES, 'UTF-8') : '';
$purpose = isset($_POST['purpose']) ? trim($_POST['purpose']) : (isset($_POST['form_purpose']) ? trim($_POST['form_purpose']) : 'general');
$product = isset($_POST['product']) ? trim($_POST['product']) : '';
$quantity = isset($_POST['qty']) ? floatval(str_replace(',', '.', $_POST['qty'])) : (isset($_POST['quantity']) ? floatval(str_replace(',', '.', $_POST['quantity'])) : 0.0);
$machine = isset($_POST['machine']) ? trim($_POST['machine']) : '';
$capacity = isset($_POST['capacity']) ? htmlspecialchars(strip_tags(trim($_POST['capacity'])), ENT_QUOTES, 'UTF-8') : '';
$message = isset($_POST['message']) ? htmlspecialchars(strip_tags(trim($_POST['message'])), ENT_QUOTES, 'UTF-8') : '';
$kvkk = isset($_POST['kvkk']) ? true : false;

// Honeypot spam check: Discard silently if filled (NO storage, NO rate limiting)
if (!empty($honeypot)) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => ($purpose === 'quote') ? $activeMsgs['success_quote'] : $activeMsgs['success_contact']
    ]);
    exit;
}

// 1. IP-based Rate Limiting (Max 5 submissions per IP in 10 minutes)
$clientIp = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateLimitFile = __DIR__ . '/data/rate_limit.json';

$rateData = file_exists($rateLimitFile) ? json_decode(file_get_contents($rateLimitFile), true) : [];
if (!is_array($rateData)) $rateData = [];

$now = time();
$windowSeconds = 600; // 10 minutes
$maxSubmissions = 5;

// Clean up old entries
foreach ($rateData as $ip => $timestamps) {
    $rateData[$ip] = array_values(array_filter($timestamps, function($ts) use ($now, $windowSeconds) {
        return ($now - $ts) < $windowSeconds;
    }));
    if (empty($rateData[$ip])) {
        unset($rateData[$ip]);
    }
}

$userTimestamps = $rateData[$clientIp] ?? [];

if (count($userTimestamps) >= $maxSubmissions) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Çok fazla istek gönderdiniz. Lütfen 10 dakika sonra tekrar deneyin. / Too many requests. Please try again in 10 minutes.'
    ]);
    exit;
}

// Maximum Server-Side Length Controls (Fail-safe safe_strlen)
if (safe_strlen($name) > 100 || safe_strlen($company) > 150 || safe_strlen($email) > 254 || safe_strlen($phone) > 30 || safe_strlen($capacity) > 100 || safe_strlen($message) > 3000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $activeMsgs['err_length']]);
    exit;
}

// Basic Validation
if (empty($name) || empty($company) || empty($email) || empty($phone) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $activeMsgs['err_empty']]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $activeMsgs['err_email']]);
    exit;
}

// Phone Number Regex & Minimum Digit Validation (International friendly)
$digitsOnly = preg_replace('/\D/', '', $phone);
if (!preg_match('/^[+\d\s\(\)\-]{7,30}$/', $phone) || strlen($digitsOnly) < 7) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $activeMsgs['err_phone']]);
    exit;
}

if (!$kvkk) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $activeMsgs['err_kvkk']]);
    exit;
}

// Record submission timestamp for Rate Limiting
$rateData[$clientIp][] = $now;
if (!safe_json_write($rateLimitFile, $rateData)) {
    error_log("Nevra Contact API Error: Failed to write rate_limit.json");
}

// Map product codes to names
$productNames = [
    'pp' => 'PP Granül (Polipropilen)',
    'pe' => 'PE Granül (Poliyetilen)',
    'compound' => 'Özel Geri Dönüştürülmüş Kompaundlar',
    'custom' => 'Müşteriye Özel Formülasyonlar'
];
$selectedProduct = isset($productNames[$product]) ? $productNames[$product] : $product;

// Map machine codes to names
$machineNames = [
    'yatay_balya_press' => 'Yatay Balya Presi',
    'capak_yikama_havuzu' => 'Yatay Çapak Yıkama Havuzu',
    'granul_karistirme_mixeri' => 'Granül Karıştırma Mikseri',
    'other_machine' => 'Diğer Geri Dönüşüm Hatları / Ekipmanları'
];
$selectedMachine = isset($machineNames[$machine]) ? $machineNames[$machine] : $machine;

// 1. Save submission to api/data/contacts.json atomically
$contactsFile = __DIR__ . '/data/contacts.json';
$contacts = [];
if (file_exists($contactsFile)) {
    $contacts = json_decode(file_get_contents($contactsFile), true);
    if (!is_array($contacts)) {
        $contacts = [];
    }
}

$submission = [
    "id" => "contact_" . round(microtime(true) * 1000),
    "date" => date('Y-m-d H:i:s'),
    "purpose" => $purpose,
    "name" => $name,
    "company" => $company,
    "email" => $email,
    "phone" => $phone,
    "product" => $product,
    "qty" => $quantity,
    "machine" => $machine,
    "capacity" => $capacity,
    "message" => $message,
    "lang" => $lang
];

$contacts[] = $submission;

if (!safe_json_write($contactsFile, $contacts)) {
    error_log("Nevra Contact API Error: Failed to write contacts.json");
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $activeMsgs['err_write']
    ]);
    exit;
}

// 2. Prepare and Send E-mail Notification
$to = 'info@nevraplastik.com';

if ($purpose === 'quote') {
    $subject = 'Nevra Plastik Web - Yeni Hammadde Fiyat Teklifi Talebi';
    $titleHeading = 'Hammadde Teklif Talebi';
} elseif ($purpose === 'quote_machine') {
    $subject = 'Nevra Plastik Web - Yeni Makine Fiyat Teklifi Talebi';
    $titleHeading = 'Makine Teklif Talebi';
} else {
    $subject = 'Nevra Plastik Web - Yeni İletişim Formu Mesajı';
    $titleHeading = 'İletişim Formu Gönderimi';
}

$logTime = date('Y-m-d H:i:s');
$emailBody = "
<html>
<head>
  <title>{$subject}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1e20; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
    .header { background-color: #2fb14d; color: white; padding: 15px; border-radius: 6px 6px 0 0; text-align: center; }
    .header h2 { margin: 0; font-size: 20px; }
    .content { padding: 20px 0; }
    .field { margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .label { font-weight: bold; color: #3d71b7; display: inline-block; width: 150px; }
    .val { display: inline-block; }
    .message-box { background-color: #f8fafc; padding: 15px; border-left: 4px solid #2fb14d; border-radius: 4px; margin-top: 15px; }
    .footer { font-size: 11px; color: #6d7172; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2>{$titleHeading}</h2>
    </div>
    <div class='content'>
      <div class='field'><span class='label'>Adı Soyadı:</span><span class='val'>{$name}</span></div>
      <div class='field'><span class='label'>Şirket Adı:</span><span class='val'>{$company}</span></div>
      <div class='field'><span class='label'>E-posta:</span><span class='val'><a href='mailto:{$email}'>{$email}</a></span></div>
      <div class='field'><span class='label'>Telefon:</span><span class='val'><a href='tel:{$phone}'>{$phone}</a></span></div>
";

if ($purpose === 'quote') {
    $emailBody .= "
      <div class='field'><span class='label'>Talep Edilen Ürün:</span><span class='val'>{$selectedProduct}</span></div>
      <div class='field'><span class='label'>Aylık Miktar (Ton):</span><span class='val'>{$quantity} Ton</span></div>
    ";
} elseif ($purpose === 'quote_machine') {
    $emailBody .= "
      <div class='field'><span class='label'>Talep Edilen Makine:</span><span class='val'>{$selectedMachine}</span></div>
      <div class='field'><span class='label'>Kapasite / Adet:</span><span class='val'>{$capacity}</span></div>
    ";
}

$emailBody .= "
      <div class='message-box'>
        <strong>Mesaj / Teknik Talepler:</strong><br>
        " . nl2br($message) . "
      </div>
    </div>
    <div class='footer'>
      Bu e-posta Nevra Plastik web sitesi form modülünden otomatik olarak gönderilmiştir.<br>
      Tarih: {$logTime} | Gönderen IP: " . htmlspecialchars($clientIp) . "
    </div>
  </div>
</body>
</html>
";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'From: Nevra Plastik Web Form <no-reply@nevraplastik.com>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

$mailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => ($purpose === 'quote') ? $activeMsgs['success_quote'] : $activeMsgs['success_contact']
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => $activeMsgs['mail_failed']
    ]);
}
exit;
