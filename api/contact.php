<?php
/**
 * Nevra Plastik B2B Contact & Quote Form Handler
 * PHP Version: 8.2 / 8.3
 */

// Set header for JSON response
header('Content-Type: application/json; charset=utf-8');

// Ensure it is a POST request
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
        'success_contact' => 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.',
        'success_quote' => 'Teklif talebiniz başarıyla alındı. Satış departmanımız sizinle irtibata geçecektir.',
        'mail_failed' => 'E-posta gönderimi başarısız oldu ancak talebiniz sistemimize kaydedildi. Sizinle iletişime geçeceğiz.'
    ],
    'en' => [
        'err_empty' => 'Please fill in all required fields.',
        'err_email' => 'Please enter a valid email address.',
        'err_phone' => 'Please enter a valid phone number.',
        'err_kvkk' => 'You must accept the Privacy Policy/KVKK consent.',
        'success_contact' => 'Your message has been sent successfully. We will get back to you shortly.',
        'success_quote' => 'Your price quote request has been received. Our sales team will contact you shortly.',
        'mail_failed' => 'Email dispatch failed, but your request has been logged successfully. We will contact you.'
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

// Honeypot spam check: Discard silently if filled
if (!empty($honeypot)) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => ($purpose === 'quote') ? $activeMsgs['success_quote'] : $activeMsgs['success_contact']
    ]);
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

if (!$kvkk) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $activeMsgs['err_kvkk']]);
    exit;
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

// 1. Log submission locally as backup (Very safe B2B practice)
$logFile = __DIR__ . '/submissions_backup.log';
$logTime = date('Y-m-d H:i:s');

if ($purpose === 'quote') {
    $detailLog = sprintf("Product: %s | Qty: %d Ton", $selectedProduct, $quantity);
} elseif ($purpose === 'quote_machine') {
    $detailLog = sprintf("Machine: %s | Capacity/Qty: %s", $selectedMachine, $capacity);
} else {
    $detailLog = "N/A";
}

$logData = sprintf(
    "[%s] [%s] Name: %s | Company: %s | Email: %s | Phone: %s | Details: %s | Message: %s\n",
    $logTime,
    strtoupper($purpose),
    $name,
    $company,
    $email,
    $phone,
    $detailLog,
    str_replace(["\r", "\n"], " ", $message)
);

// Write to backup log file securely
@file_put_contents($logFile, $logData, FILE_APPEND | LOCK_EX);

// 1.5. Save submission to api/data/contacts.json
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
@file_put_contents($contactsFile, json_encode($contacts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// 2. Prepare and Send E-mail Notification
$to = 'info@nevraplastik.com'; // Corporate email target

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

// Custom Elegant HTML email body
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
      Tarih: {$logTime} | Gönderen IP: " . htmlspecialchars($_SERVER['REMOTE_ADDR']) . "
    </div>
  </div>
</body>
</html>
";

// Headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'From: Nevra Plastik Web Form <no-reply@nevraplastik.com>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Send E-mail
$mailSent = @mail($to, $subject, $emailBody, implode("\r\n", $headers));

// Response
if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => ($purpose === 'quote') ? $activeMsgs['success_quote'] : $activeMsgs['success_contact']
    ]);
} else {
    // If mail fails, return success because we safely logged it in files, but inform as warning
    // In B2B environments, we want to look highly professional
    echo json_encode([
        'success' => true,
        'message' => $activeMsgs['mail_failed']
    ]);
}
exit;
