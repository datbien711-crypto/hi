<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: config/config.php
 * Cấu hình kết nối MySQL và tham số hệ thống chạy trên cPanel (PHP 7.4+)
 */

// 1. Chống truy cập trực tiếp nếu cần
if (!defined('INET24H_APP')) {
    define('INET24H_APP', true);
}

// 2. Thông tin kết nối MySQL Database trên Hosting cPanel
define('DB_HOST', 'localhost');
define('DB_NAME', 'inet24h_database');    // Điền tên Database tạo trên cPanel
define('DB_USER', 'inet24h_user');        // Điền Database User
define('DB_PASS', 'MatKhauBaoMat2026!');  // Điền Mật khẩu Database
define('DB_CHARSET', 'utf8mb4');

// 3. Đường dẫn website (URL tương đối hoặc tuyệt đối)
define('SITE_URL', 'https://inet24h.com'); // Hoặc để trống nếu dùng đường dẫn tương đối
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 15 * 1024 * 1024); // 15MB

// 4. Cấu hình ngân hàng thụ hưởng VietQR
define('BANK_BIN', '970422');             // Mã BIN MB Bank (Ngân hàng Quân Đội)
define('BANK_SHORT_NAME', 'MB');
define('BANK_ACCOUNT_NO', '0987654321');
define('BANK_ACCOUNT_NAME', 'CONG TY CP THIET KE INET24H');
define('BANK_WEBHOOK_KEY', 'INET24H_SECURE_TOKEN_XYZ789');

// 5. Khởi tạo session an toàn (PHP 7.4)
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

// 6. Token CSRF
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function verify_csrf($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
