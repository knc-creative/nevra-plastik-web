<?php
/* ==========================================================================
   Nevra Plastik - Secure File Upload API
   ========================================================================== */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Only POST requests are allowed."]);
    exit();
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No file uploaded. Key must be 'file'."]);
    exit();
}

$file = $_FILES['file'];

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Upload failed with PHP error code: " . $file['error']]);
    exit();
}

// Specify upload directory
$uploadDir = '../uploads/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to create uploads directory on the server."]);
        exit();
    }
}

// Sanitize filename
$filename = basename($file['name']);
$filename = preg_replace("/[^a-zA-Z0-9\._-]/", "_", $filename); // Sanitize special characters
$uniqueName = time() . '_' . rand(1000, 9999) . '_' . $filename;
$targetFilePath = $uploadDir . $uniqueName;

// Validate file type (allow common images)
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
$fileType = mime_content_type($file['tmp_name']);

if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid file type. Only JPEG, PNG, GIF, WEBP and SVG are allowed."]);
    exit();
}

// Move file to target directory
if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
    // Automatically resize and optimize image if GD library is available
    if (extension_loaded('gd')) {
        $sourceImg = null;
        if ($fileType === 'image/jpeg') {
            $sourceImg = @imagecreatefromjpeg($targetFilePath);
        } elseif ($fileType === 'image/png') {
            $sourceImg = @imagecreatefrompng($targetFilePath);
        } elseif ($fileType === 'image/webp') {
            $sourceImg = @imagecreatefromwebp($targetFilePath);
        }

        if ($sourceImg) {
            $width = imagesx($sourceImg);
            $height = imagesy($sourceImg);
            $maxDim = 1000;
            
            if ($width > $maxDim || $height > $maxDim) {
                if ($width > $height) {
                    $newWidth = $maxDim;
                    $newHeight = intval($height * ($maxDim / $width));
                } else {
                    $newHeight = $maxDim;
                    $newWidth = intval($width * ($maxDim / $height));
                }
                
                $resizedImg = imagecreatetruecolor($newWidth, $newHeight);
                
                // Preserve transparency for PNG and WebP
                if ($fileType === 'image/png' || $fileType === 'image/webp') {
                    imagealphablending($resizedImg, false);
                    imagesavealpha($resizedImg, true);
                    $transparent = imagecolorallocatealpha($resizedImg, 255, 255, 255, 127);
                    imagefilledrectangle($resizedImg, 0, 0, $newWidth, $newHeight, $transparent);
                }
                
                imagecopyresampled($resizedImg, $sourceImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                
                if ($fileType === 'image/jpeg') {
                    imagejpeg($resizedImg, $targetFilePath, 80);
                } elseif ($fileType === 'image/png') {
                    imagepng($resizedImg, $targetFilePath, 8);
                } elseif ($fileType === 'image/webp') {
                    imagewebp($resizedImg, $targetFilePath, 80);
                }
                
                imagedestroy($resizedImg);
            } else {
                // If it is smaller than 1000px, still re-save to compress
                if ($fileType === 'image/jpeg') {
                    imagejpeg($sourceImg, $targetFilePath, 80);
                } elseif ($fileType === 'image/webp') {
                    imagewebp($sourceImg, $targetFilePath, 80);
                }
            }
            imagedestroy($sourceImg);
        }
    }

    // Return relative URL from the root of the site (since uploadDir is '../uploads/', the URL is 'uploads/filename')
    $relativeUrl = 'uploads/' . $uniqueName;
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "File uploaded successfully.",
        "url" => $relativeUrl
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file."]);
}
?>
