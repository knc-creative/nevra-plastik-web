<?php
/* ==========================================================================
   Nevra Plastik - Security & Helper Functions
   ========================================================================== */

ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);

function safe_strlen($value) {
    if ($value === null) return 0;
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }
    return strlen($value);
}

function init_secure_session() {
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');

        $isSecure = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on' || $_SERVER['HTTPS'] === '1'))
                 || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => '',
            'secure' => $isSecure,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
        session_start();

        if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
            $now = time();
            $idleLimit = 1800;      // 30 minutes of inactivity
            $absoluteLimit = 28800; // 8 hours maximum session lifetime

            if (!isset($_SESSION['admin_started_at'])) {
                $_SESSION['admin_started_at'] = $now;
            }
            if (!isset($_SESSION['admin_last_activity'])) {
                $_SESSION['admin_last_activity'] = $now;
            }

            $idleExpired = ($now - (int)$_SESSION['admin_last_activity']) > $idleLimit;
            $absoluteExpired = ($now - (int)$_SESSION['admin_started_at']) > $absoluteLimit;

            if ($idleExpired || $absoluteExpired) {
                $_SESSION = [];
                if (ini_get('session.use_cookies')) {
                    $params = session_get_cookie_params();
                    setcookie(session_name(), '', time() - 42000,
                        $params['path'], $params['domain'],
                        $params['secure'], $params['httponly']
                    );
                }
                session_destroy();
                return;
            }

            $_SESSION['admin_last_activity'] = $now;
        }
    }
}

function get_csrf_token() {
    init_secure_session();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function check_csrf_token() {
    init_secure_session();
    $token = '';
    
    if (isset($_SERVER['HTTP_X_CSRF_TOKEN'])) {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'];
    } elseif (isset($_POST['csrf_token'])) {
        $token = $_POST['csrf_token'];
    } else {
        $rawPost = file_get_contents('php://input');
        if ($rawPost) {
            $json = json_decode($rawPost, true);
            if (isset($json['csrf_token'])) {
                $token = $json['csrf_token'];
            }
        }
    }
    
    if (empty($_SESSION['csrf_token']) || empty($token) || !hash_equals($_SESSION['csrf_token'], $token)) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "CSRF doğrulama hatası (geçersiz token)."]);
        exit();
    }
}

function check_admin_auth() {
    init_secure_session();
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Yetkisiz erişim. Oturum açmanız gerekmektedir."]);
        exit();
    }
}

function safe_json_write($filepath, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return false;
    }

    $dir = dirname($filepath);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return false;
    }

    $tmpFile = $filepath . '.' . bin2hex(random_bytes(6)) . '.tmp';
    if (file_put_contents($tmpFile, $json, LOCK_EX) === false) {
        return false;
    }

    // Verify the exact bytes we are about to publish are still valid JSON.
    $verify = json_decode(file_get_contents($tmpFile), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        @unlink($tmpFile);
        return false;
    }

    // Keep one last-known-good copy before replacing the active data file.
    if (is_file($filepath)) {
        @copy($filepath, $filepath . '.bak');
    }

    if (!rename($tmpFile, $filepath)) {
        @unlink($tmpFile);
        return false;
    }

    return true;
}


function safe_json_mutate($filepath, $callback, $default = []) {
    $dir = dirname($filepath);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return false;
    }

    $lockFile = $filepath . '.lock';
    $lockHandle = @fopen($lockFile, 'c');
    if (!$lockHandle) {
        return false;
    }

    if (!flock($lockHandle, LOCK_EX)) {
        fclose($lockHandle);
        return false;
    }

    try {
        $current = $default;
        if (is_file($filepath)) {
            $decoded = json_decode(file_get_contents($filepath), true);
            if (is_array($decoded)) {
                $current = $decoded;
            }
        }

        $updated = $callback($current);
        if ($updated === null) {
            $updated = $current;
        }

        return safe_json_write($filepath, $updated);
    } finally {
        flock($lockHandle, LOCK_UN);
        fclose($lockHandle);
    }
}

function set_secure_cors_headers() {
    header_remove("X-Powered-By");
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if ($origin === 'https://nevraplastik.com') {
        header("Access-Control-Allow-Origin: https://nevraplastik.com");
        header("Access-Control-Allow-Credentials: true");
    }
}
?>
