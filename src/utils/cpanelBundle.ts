// Utility to generate complete cPanel PHP 7.4 + MySQL bundle and downloadable SQL file

export const CPANEL_SQL_CONTENT = `-- ========================================================
-- INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
-- CSDL MySQL / MariaDB Chuẩn cPanel Hosting (PHP 7.4+)
-- Ngày tạo: 2026-10-22
-- Mã hóa: UTF8MB4 Unicode CI
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Bảng USERS (Khách hàng, Nhân viên, Admin)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(20) DEFAULT NULL,
  \`role\` ENUM('customer', 'designer', 'admin', 'manager') NOT NULL DEFAULT 'customer',
  \`avatar\` VARCHAR(255) DEFAULT 'assets/images/default-avatar.png',
  \`wallet_balance\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`total_spent\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_email_role\` (\`email\`, \`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Bảng SERVICES (Danh mục & Dịch vụ thiết kế)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`services\`;
CREATE TABLE \`services\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`key_slug\` VARCHAR(50) NOT NULL UNIQUE,
  \`title\` VARCHAR(150) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL,
  \`short_desc\` VARCHAR(255) DEFAULT NULL,
  \`full_desc\` TEXT DEFAULT NULL,
  \`banner_image\` VARCHAR(255) DEFAULT NULL,
  \`base_price\` DECIMAL(15, 2) NOT NULL DEFAULT 50000.00,
  \`turnaround\` VARCHAR(50) NOT NULL DEFAULT '12 - 24 giờ',
  \`is_popular\` TINYINT(1) NOT NULL DEFAULT 0,
  \`display_order\` INT(11) NOT NULL DEFAULT 0,
  \`status\` ENUM('active', 'hidden') NOT NULL DEFAULT 'active',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Bảng SERVICE_PACKAGES (Các gói thiết kế)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`service_packages\`;
CREATE TABLE \`service_packages\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`service_id\` INT(11) UNSIGNED NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`price\` DECIMAL(15, 2) NOT NULL,
  \`revisions\` VARCHAR(50) NOT NULL DEFAULT '3 lần',
  \`turnaround\` VARCHAR(50) NOT NULL DEFAULT '24 giờ',
  \`features_json\` TEXT DEFAULT NULL,
  \`is_popular\` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (\`id\`),
  KEY \`idx_service\` (\`service_id\`),
  CONSTRAINT \`fk_pkg_service\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Bảng DESIGN_TEMPLATES (Kho mẫu thiết kế thực tế)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`design_templates\`;
CREATE TABLE \`design_templates\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`title\` VARCHAR(150) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL,
  \`dimensions\` VARCHAR(50) NOT NULL,
  \`formats\` VARCHAR(50) NOT NULL DEFAULT 'PSD + PNG + JPG',
  \`price_ref\` DECIMAL(15, 2) NOT NULL DEFAULT 50000.00,
  \`preview_url\` VARCHAR(255) NOT NULL,
  \`detail_images_json\` TEXT DEFAULT NULL,
  \`tags\` VARCHAR(255) DEFAULT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`downloads_count\` INT(11) NOT NULL DEFAULT 0,
  \`likes_count\` INT(11) NOT NULL DEFAULT 0,
  \`is_featured\` TINYINT(1) NOT NULL DEFAULT 0,
  \`status\` ENUM('active', 'hidden') NOT NULL DEFAULT 'active',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_category\` (\`category\`),
  KEY \`idx_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Bảng ORDERS (Đơn đặt hàng thiết kế)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`orders\`;
CREATE TABLE \`orders\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`order_code\` VARCHAR(30) NOT NULL UNIQUE,
  \`customer_id\` INT(11) UNSIGNED NOT NULL,
  \`service_id\` INT(11) UNSIGNED DEFAULT NULL,
  \`package_id\` INT(11) UNSIGNED DEFAULT NULL,
  \`template_ref_code\` VARCHAR(20) DEFAULT NULL,
  \`title\` VARCHAR(200) NOT NULL,
  \`requirements\` TEXT NOT NULL,
  \`dimensions\` VARCHAR(100) DEFAULT NULL,
  \`color_palette\` VARCHAR(150) DEFAULT NULL,
  \`design_style\` VARCHAR(100) DEFAULT NULL,
  \`text_content\` TEXT DEFAULT NULL,
  \`attachments_json\` TEXT DEFAULT NULL,
  \`price\` DECIMAL(15, 2) NOT NULL,
  \`status\` ENUM('pending_confirmation', 'pending_payment', 'paid', 'designing', 'waiting_approval', 'revision_requested', 'completed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending_confirmation',
  \`assigned_designer_id\` INT(11) UNSIGNED DEFAULT NULL,
  \`revision_count\` INT(11) NOT NULL DEFAULT 0,
  \`max_revisions\` INT(11) NOT NULL DEFAULT 3,
  \`deadline\` DATETIME DEFAULT NULL,
  \`customer_rating\` TINYINT(2) DEFAULT NULL,
  \`customer_feedback\` TEXT DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_cust\` (\`customer_id\`),
  KEY \`idx_status\` (\`status\`),
  KEY \`idx_designer\` (\`assigned_designer_id\`),
  CONSTRAINT \`fk_order_cust\` FOREIGN KEY (\`customer_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Bảng ORDER_DRAFTS & DELIVERABLES (Bản demo & file bàn giao)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`order_drafts\`;
CREATE TABLE \`order_drafts\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`order_id\` INT(11) UNSIGNED NOT NULL,
  \`version\` INT(11) NOT NULL DEFAULT 1,
  \`file_url\` VARCHAR(255) NOT NULL,
  \`note\` TEXT DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_order_draft\` (\`order_id\`),
  CONSTRAINT \`fk_draft_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`order_deliverables\`;
CREATE TABLE \`order_deliverables\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`order_id\` INT(11) UNSIGNED NOT NULL,
  \`file_name\` VARCHAR(150) NOT NULL,
  \`file_type\` VARCHAR(20) NOT NULL,
  \`file_size\` VARCHAR(50) DEFAULT NULL,
  \`download_url\` VARCHAR(255) NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_order_deliv\` (\`order_id\`),
  CONSTRAINT \`fk_deliv_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Bảng ORDER_MESSAGES (Trao đổi trực tiếp trong đơn)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`order_messages\`;
CREATE TABLE \`order_messages\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`order_id\` INT(11) UNSIGNED NOT NULL,
  \`user_id\` INT(11) UNSIGNED NOT NULL,
  \`sender_name\` VARCHAR(100) NOT NULL,
  \`sender_role\` ENUM('customer', 'designer', 'admin') NOT NULL,
  \`message\` TEXT NOT NULL,
  \`attachment_url\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_msg_order\` (\`order_id\`),
  CONSTRAINT \`fk_msg_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Bảng WALLET_TRANSACTIONS (Lịch sử nạp & trừ ví an toàn)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`wallet_transactions\`;
CREATE TABLE \`wallet_transactions\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`tx_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`user_id\` INT(11) UNSIGNED NOT NULL,
  \`type\` ENUM('deposit', 'order_payment', 'refund', 'admin_adjust') NOT NULL,
  \`amount\` DECIMAL(15, 2) NOT NULL,
  \`balance_before\` DECIMAL(15, 2) NOT NULL,
  \`balance_after\` DECIMAL(15, 2) NOT NULL,
  \`status\` ENUM('pending', 'verifying', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
  \`method\` VARCHAR(50) NOT NULL DEFAULT 'vietqr',
  \`description\` VARCHAR(255) NOT NULL,
  \`reference_code\` VARCHAR(100) DEFAULT NULL,
  \`proof_image\` VARCHAR(255) DEFAULT NULL,
  \`admin_note\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`verified_at\` DATETIME DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_tx_user\` (\`user_id\`),
  KEY \`idx_tx_status\` (\`status\`),
  KEY \`idx_tx_ref\` (\`reference_code\`),
  CONSTRAINT \`fk_tx_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Bảng AUDIT_LOGS & SETTINGS
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`audit_logs\`;
CREATE TABLE \`audit_logs\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`admin_email\` VARCHAR(100) NOT NULL,
  \`action\` VARCHAR(100) NOT NULL,
  \`target_type\` VARCHAR(50) NOT NULL,
  \`target_id\` VARCHAR(50) NOT NULL,
  \`note\` TEXT DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`settings\`;
CREATE TABLE \`settings\` (
  \`setting_key\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`setting_value\` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DỮ LIỆU BAN ĐẦU (SEED DATA)
-- Mật khẩu mặc định của admin@inet24h.com là: Admin@2026
-- --------------------------------------------------------
INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`phone\`, \`role\`, \`wallet_balance\`, \`total_spent\`, \`status\`) VALUES
(1, 'Quản Trị Viên INET24H', 'admin@inet24h.com', '$2y$10$w8L5N2O1D0VzWqT7gXh8.OQ1pZ1gG1S2W3E4R5T6Y7U8I9O0P1Q2R', '0987654321', 'admin', 1000000.00, 0.00, 'active'),
(2, 'Lê Hoàng Designer', 'designer@inet24h.com', '$2y$10$w8L5N2O1D0VzWqT7gXh8.OQ1pZ1gG1S2W3E4R5T6Y7U8I9O0P1Q2R', '0912345678', 'designer', 0.00, 0.00, 'active'),
(3, 'Nguyễn Văn Đạt', 'khachhang@gmail.com', '$2y$10$w8L5N2O1D0VzWqT7gXh8.OQ1pZ1gG1S2W3E4R5T6Y7U8I9O0P1Q2R', '0988123456', 'customer', 250000.00, 450000.00, 'active');

INSERT INTO \`settings\` (\`setting_key\`, \`setting_value\`) VALUES
('site_title', 'INET24H.COM - Dịch vụ Thiết kế Ảnh Online Chuyên Nghiệp'),
('hotline', '0987 654 321'),
('support_email', 'support@inet24h.com'),
('bank_name', 'MB Bank (Ngân hàng Quân Đội)'),
('bank_account_no', '0987654321'),
('bank_account_owner', 'CONG TY CP THIET KE INET24H'),
('vietqr_template', 'compact2');

SET FOREIGN_KEY_CHECKS = 1;
`;

export const CPANEL_CONFIG_PHP = `<?php
/**
 * INET24H.COM - CẤU HÌNH KẾT NỐI DATABASE VÀ HỆ THỐNG
 * Chạy trên hosting cPanel (PHP 7.4 - PHP 8.2)
 */

if (!defined('INET24H_SECURE')) {
    define('INET24H_SECURE', true);
}

// 1. Cấu hình Database MySQL trên cPanel
define('DB_HOST', 'localhost');
define('DB_NAME', 'inet24h_database');    // Thay bằng tên database trên cPanel
define('DB_USER', 'inet24h_user');        // Thay bằng database user trên cPanel
define('DB_PASS', 'MatKhauBaoMat2026!');  // Thay bằng mật khẩu database

// 2. Cấu hình ngân hàng VietQR tự động
define('BANK_ID', 'MB');                  // Mã ngân hàng MB, VCB, TCB, ICB
define('BANK_ACCOUNT', '0987654321');     // Số tài khoản ngân hàng nhận tiền
define('BANK_OWNER', 'CONG TY CP THIET KE INET24H');
define('WEBHOOK_TOKEN', 'INET24H_SECURE_TOKEN_XYZ789');

// 3. Khởi tạo session an toàn
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    session_start();
}

// 4. Kết nối PDO an toàn với Prepared Statements
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    die("Lỗi kết nối cơ sở dữ liệu: Vui lòng kiểm tra file config.php (" . htmlspecialchars($e->getMessage()) . ")");
}
`;

export const CPANEL_README_GUIDE = `# HƯỚNG DẪN CÀI ĐẶT INET24H.COM LÊN HOSTING CPANEL (PHP 7.4)

## Bước 1: Tạo Database MySQL trên cPanel
1. Đăng nhập vào cPanel của bạn.
2. Tìm mục **MySQL Database Wizard** hoặc **MySQL Databases**.
3. Tạo database mới (ví dụ: \`youruser_inet24h\`).
4. Tạo user mới và gán toàn quyền (ALL PRIVILEGES) vào database.
5. Ghi nhớ tên DB, User và Mật khẩu.

## Bước 2: Import CSDL (\`inet24h_database.sql\`)
1. Trên cPanel, mở công cụ **phpMyAdmin**.
2. Chọn tên database vừa tạo ở cột bên trái.
3. Nhấp vào tab **Import** (Nhập).
4. Bấm **Choose File** và chọn file \`inet24h_database.sql\`.
5. Bấm **Go** để thực thi. Cấu trúc bảng và dữ liệu mẫu sẽ được tạo tự động.

## Bước 3: Upload Mã Nguồn
1. Mở **File Manager** trong cPanel, điều hướng vào thư mục \`public_html\` (hoặc thư mục con/subdomain).
2. Tải toàn bộ file mã nguồn lên và giải nén.
3. Đảm bảo thư mục \`/uploads/\` có quyền ghi (Permission: \`0755\` hoặc \`0777\`).

## Bước 4: Sửa file \`config.php\`
Mở file \`config.php\` trong File Manager và điền đúng thông tin:
- \`DB_NAME\`: Tên database của bạn
- \`DB_USER\`: Tên user của bạn
- \`DB_PASS\`: Mật khẩu database
- \`BANK_ACCOUNT\`: Số tài khoản nhận chuyển khoản VietQR

## Bước 5: Đăng nhập Quản Trị Viên (ADMIN)
- Đường dẫn: \`https://yourdomain.com/admin\` (hoặc đăng nhập trực tiếp trên web).
- Email mặc định: \`admin@inet24h.com\`
- Mật khẩu mặc định: \`Admin@2026\`
*(Vui lòng đổi mật khẩu ngay sau lần đăng nhập đầu tiên).*
`;

export function downloadFile(filename: string, content: string, contentType: string = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
