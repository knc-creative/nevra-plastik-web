<?php
/* ==========================================================================
   Nevra Plastik - Secure Authenticated File Upload API
   ========================================================================== */

require_once __DIR__ . '/helpers.php';

init_secure_session();
set_secure_cors_headers();

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Yalnızca POST isteklerine izin verilir."]);
    exit();
}

// 1. Authenticate Admin Session
check_admin_auth();

// 2. CSRF Token Verification
check_csrf_token();

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Yüklenecek dosya bulunamadı. Key 'file' olmalıdır."]);
    exit();
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Dosya yükleme hatası koda göre: " . $file['error']]);
    exit();
}

// 3. File Size Limit (Max 5 MB)
$maxSize = 5 * 1024 * 1024; // 5 MB
if ($file['size'] > $maxSize) {
    http_response_code(413);
    echo json_encode(["status" => "error", "message" => "Dosya boyutu çok büyük. Maksimum izin verilen limit: 5 MB."]);
    exit();
}

// 4. Secure MIME type checking via Fileinfo
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$detectedMime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$mimeToExt = [
    'image/jpeg' => '.jpg',
    'image/png'  => '.png',
    'image/webp' => '.webp'
];

if (!isset($mimeToExt[$detectedMime])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "İzin verilmeyen dosya türü. Yalnızca JPEG, PNG ve WebP kabul edilir."]);
    exit();
}

$extension = $mimeToExt[$detectedMime];

// 5. Specify upload directory
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Uploads dizini oluşturulamadı."]);
        exit();
    }
}

// Ensure secure .htaccess exists in uploads/
$uploadsHtaccess = $uploadDir . '.htaccess';
if (!file_exists($uploadsHtaccess)) {
    $htContent = "Options -Indexes\n"
               . "<FilesMatch \"\\.(php|php3|php4|php5|php7|phtml|pl|py|cgi|asp|js|sh)$\">\n"
               . "    Order Allow,Deny\n"
               . "    Deny from all\n"
               . "</FilesMatch>\n"
               . "<IfModule mod_php7.c>\n    php_flag engine off\n</IfModule>\n"
               . "<IfModule mod_php.c>\n    php_flag engine off\n</IfModule>\n"
               . "Header set X-Content-Type-Options \"nosniff\"\n";
    file_put_contents($uploadsHtaccess, $htContent);
}

// 6. Generate cryptographically random secure filename
$randomName = bin2hex(random_bytes(16)) . $extension;
$targetFilePath = $uploadDir . $randomName;

if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
    // Automatic image optimization via GD if available
    if (extension_loaded('gd')) {
        $sourceImg = null;
        if ($detectedMime === 'image/jpeg') {
            $sourceImg = @imagecreatefromjpeg($targetFilePath);
        } elseif ($detectedMime === 'image/png') {
            $sourceImg = @imagecreatefrompng($targetFilePath);
        } elseif ($detectedMime === 'image/webp') {
            $sourceImg = @imagecreatefromwebp($targetFilePath);
        }

        if ($sourceImg) {
            $width = imagesx($sourceImg);
            $height = imagesy($sourceImg);
            $maxDim = 1200;
            
            if ($width > $maxDim || $height > $maxDim) {
                if ($width > $height) {
                    $newWidth = $maxDim;
                    $newHeight = intval($height * ($maxDim / $width));
                } else {
                    $newHeight = $maxDim;
                    $newWidth = intval($width * ($maxDim / $height));
                }
                
                $resizedImg = imagecreatetruecolor($newWidth, $newHeight);
                
                if ($detectedMime === 'image/png' || $detectedMime === 'image/webp') {
                    imagealphablending($resizedImg, false);
                    imagesavealpha($resizedImg, true);
                    $transparent = imagecolorallocatealpha($resizedImg, 255, 255, 255, 127);
                    imagefilledrectangle($resizedImg, 0, 0, $newWidth, $newHeight, $transparent);
                }
                
                imagecopyresampled($resizedImg, $sourceImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                
                if ($detectedMime === 'image/jpeg') {
                    imagejpeg($resizedImg, $targetFilePath, 85);
                } elseif ($detectedMime === 'image/png') {
                    imagepng($resizedImg, $targetFilePath, 8);
                } elseif ($detectedMime === 'image/webp') {
                    imagewebp($resizedImg, $targetFilePath, 85);
                }
                
                imagedestroy($resizedImg);
            }
            imagedestroy($sourceImg);
        }
    }

    $relativeUrl = 'uploads/' . $randomName;
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Dosya başarıyla yüklendi.",
        "url" => $relativeUrl
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Sunucu tarafında dosya kaydedilemedi."]);
}
?>
