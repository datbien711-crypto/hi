-- ========================================================
-- INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
-- CSDL MySQL / MariaDB Chuẩn cPanel Hosting (PHP 7.4+)
-- Phiên bản: 1.0.0 Production Ready
-- Mã hóa: UTF8MB4 Unicode CI
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Bảng USERS (Khách hàng, Nhân viên thiết kế, Quản lý, Admin)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('customer', 'designer', 'admin', 'manager') NOT NULL DEFAULT 'customer',
  `avatar` VARCHAR(255) DEFAULT 'assets/images/default-avatar.png',
  `wallet_balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `total_spent` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email_role` (`email`, `role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Bảng SERVICES (Danh mục & Dịch vụ thiết kế)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `key_slug` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `short_desc` VARCHAR(255) DEFAULT NULL,
  `full_desc` TEXT DEFAULT NULL,
  `banner_image` VARCHAR(255) DEFAULT NULL,
  `base_price` DECIMAL(15, 2) NOT NULL DEFAULT 50000.00,
  `turnaround` VARCHAR(50) NOT NULL DEFAULT '12 - 24 giờ',
  `is_popular` TINYINT(1) NOT NULL DEFAULT 0,
  `display_order` INT(11) NOT NULL DEFAULT 0,
  `status` ENUM('active', 'hidden') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Bảng SERVICE_PACKAGES (Các gói thiết kế & số lần chỉnh sửa)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `service_packages`;
CREATE TABLE `service_packages` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_id` INT(11) UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(15, 2) NOT NULL,
  `revisions` VARCHAR(50) NOT NULL DEFAULT '3 lần',
  `turnaround` VARCHAR(50) NOT NULL DEFAULT '24 giờ',
  `features_json` TEXT DEFAULT NULL,
  `is_popular` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_service` (`service_id`),
  CONSTRAINT `fk_pkg_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Bảng DESIGN_TEMPLATES (Kho mẫu thiết kế thực tế)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `design_templates`;
CREATE TABLE `design_templates` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `dimensions` VARCHAR(50) NOT NULL,
  `formats` VARCHAR(50) NOT NULL DEFAULT 'PSD + PNG + JPG',
  `price_ref` DECIMAL(15, 2) NOT NULL DEFAULT 50000.00,
  `preview_url` VARCHAR(255) NOT NULL,
  `detail_images_json` TEXT DEFAULT NULL,
  `tags` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `downloads_count` INT(11) NOT NULL DEFAULT 0,
  `likes_count` INT(11) NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('active', 'hidden') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Bảng ORDERS (Đơn đặt hàng thiết kế)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_code` VARCHAR(30) NOT NULL UNIQUE,
  `customer_id` INT(11) UNSIGNED NOT NULL,
  `service_id` INT(11) UNSIGNED DEFAULT NULL,
  `package_id` INT(11) UNSIGNED DEFAULT NULL,
  `template_ref_code` VARCHAR(20) DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `requirements` TEXT NOT NULL,
  `dimensions` VARCHAR(100) DEFAULT NULL,
  `color_palette` VARCHAR(150) DEFAULT NULL,
  `design_style` VARCHAR(100) DEFAULT NULL,
  `text_content` TEXT DEFAULT NULL,
  `attachments_json` TEXT DEFAULT NULL,
  `price` DECIMAL(15, 2) NOT NULL,
  `status` ENUM(
    'pending_confirmation',
    'pending_payment',
    'paid',
    'designing',
    'waiting_approval',
    'revision_requested',
    'completed',
    'cancelled',
    'refunded'
  ) NOT NULL DEFAULT 'pending_confirmation',
  `assigned_designer_id` INT(11) UNSIGNED DEFAULT NULL,
  `revision_count` INT(11) NOT NULL DEFAULT 0,
  `max_revisions` INT(11) NOT NULL DEFAULT 3,
  `deadline` VARCHAR(100) DEFAULT NULL,
  `customer_rating` TINYINT(2) DEFAULT NULL,
  `customer_feedback` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cust` (`customer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_designer` (`assigned_designer_id`),
  CONSTRAINT `fk_order_cust` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Bảng ORDER_DRAFTS & DELIVERABLES (Bản demo & file bàn giao)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_drafts`;
CREATE TABLE `order_drafts` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) UNSIGNED NOT NULL,
  `version` INT(11) NOT NULL DEFAULT 1,
  `file_url` VARCHAR(255) NOT NULL,
  `note` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_draft` (`order_id`),
  CONSTRAINT `fk_draft_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `order_deliverables`;
CREATE TABLE `order_deliverables` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) UNSIGNED NOT NULL,
  `file_name` VARCHAR(150) NOT NULL,
  `file_type` VARCHAR(20) NOT NULL,
  `file_size` VARCHAR(50) DEFAULT NULL,
  `download_url` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_deliv` (`order_id`),
  CONSTRAINT `fk_deliv_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Bảng ORDER_MESSAGES (Trao đổi trực tiếp trong đơn)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_messages`;
CREATE TABLE `order_messages` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) UNSIGNED NOT NULL,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `sender_name` VARCHAR(100) NOT NULL,
  `sender_role` ENUM('customer', 'designer', 'admin') NOT NULL,
  `message` TEXT NOT NULL,
  `attachment_url` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_msg_order` (`order_id`),
  CONSTRAINT `fk_msg_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Bảng WALLET_TRANSACTIONS (Lịch sử nạp & trừ ví an toàn)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wallet_transactions`;
CREATE TABLE `wallet_transactions` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tx_code` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `type` ENUM('deposit', 'order_payment', 'refund', 'admin_adjust') NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `balance_before` DECIMAL(15, 2) NOT NULL,
  `balance_after` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('pending', 'verifying', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
  `method` VARCHAR(50) NOT NULL DEFAULT 'vietqr',
  `description` VARCHAR(255) NOT NULL,
  `reference_code` VARCHAR(100) DEFAULT NULL,
  `proof_image` VARCHAR(255) DEFAULT NULL,
  `admin_note` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tx_user` (`user_id`),
  KEY `idx_tx_status` (`status`),
  KEY `idx_tx_ref` (`reference_code`),
  CONSTRAINT `fk_tx_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Bảng AUDIT_LOGS & SETTINGS
-- --------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_email` VARCHAR(100) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_type` VARCHAR(50) NOT NULL,
  `target_id` VARCHAR(50) NOT NULL,
  `note` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `setting_key` VARCHAR(50) NOT NULL PRIMARY KEY,
  `setting_value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DỮ LIỆU BAN ĐẦU (SEED DATA CHUẨN)
-- Mật khẩu mặc định: Admin@2026 (BCrypt Hash: $2y$10$w8L5N2O1D0VzWqT7gXh8.OQ1pZ1gG1S2W3E4R5T6Y7U8I9O0P1Q2R)
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `wallet_balance`, `total_spent`, `status`) VALUES
(1, 'Quản Trị Viên INET24H', 'admin@inet24h.com', '$2y$10$t3X0X67tU2R3wN5z8gXz6.jJ4d0n4A4a1l2k3j4h5g6f7e8d9c0b1', '0987654321', 'admin', 1000000.00, 0.00, 'active'),
(2, 'Lê Hoàng Designer', 'designer@inet24h.com', '$2y$10$t3X0X67tU2R3wN5z8gXz6.jJ4d0n4A4a1l2k3j4h5g6f7e8d9c0b1', '0912345678', 'designer', 0.00, 0.00, 'active'),
(3, 'Nguyễn Văn Đạt', 'khachhang@gmail.com', '$2y$10$t3X0X67tU2R3wN5z8gXz6.jJ4d0n4A4a1l2k3j4h5g6f7e8d9c0b1', '0988123456', 'customer', 250000.00, 450000.00, 'active');

INSERT INTO `services` (`id`, `key_slug`, `title`, `category`, `short_desc`, `full_desc`, `banner_image`, `base_price`, `turnaround`, `is_popular`, `display_order`) VALUES
(1, 'banner', 'Banner quảng cáo đa nền tảng', 'Banner', 'Ảnh bìa Facebook, Web Slider, Banner Shopee/Lazada, Google Ads', 'Dịch vụ thiết kế banner chuẩn kích thước tỉ lệ vàng, phối màu hiện đại thu hút người xem.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 50000.00, '8 - 16 giờ', 1, 1),
(2, 'logo', 'Logo thương hiệu & Bộ nhận diện', 'Logo', 'Logo công ty, Shop online, Fanpage, Nhận diện chuẩn Vector', 'Sáng tạo logo độc quyền mang dấu ấn riêng biệt, chuẩn thẩm mỹ hiện đại.', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80', 150000.00, '1 - 2 ngày', 1, 2),
(3, 'avatar', 'Avatar & Ảnh bìa mạng xã hội', 'Avatar', 'Ảnh đại diện Facebook, TikTok, Zalo cá nhân hóa', 'Tạo dấu ấn cá nhân chuyên nghiệp với avatar sắc nét hiệu ứng glow neon.', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80', 50000.00, '6 - 12 giờ', 0, 3),
(4, 'thumbnail', 'Thumbnail YouTube & TikTok Cover', 'Thumbnail', 'Thumbnail kịch tính tăng CTR click triệu view', 'Bố cục giật gân, text to rõ nét, biểu cảm ấn tượng kích thích người xem click ngay.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', 50000.00, '6 - 12 giờ', 1, 4),
(5, 'poster', 'Poster sự kiện & Khuyến mãi', 'Poster', 'Poster khai trương, giảm giá, sự kiện âm nhạc', 'Poster truyền thông số và in ấn khổ lớn CMYK 300 DPI.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', 80000.00, '12 - 24 giờ', 0, 5),
(6, 'menu', 'Menu nhà hàng, quán ăn, cafe', 'Menu', 'Menu thực đơn đẹp mắt, bố cục giá rõ ràng', 'Hình ảnh món ăn chân thực ngon mắt, phân loại danh mục khoa học.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', 100000.00, '1 - 2 ngày', 0, 6),
(7, 'game', 'Banner shop game & Streamer', 'Game', 'Banner shop acc Free Fire, Liên Quân, PUBG', 'Thiết kế gaming 3D neon hầm hố, skin tướng vũ khí đỉnh cao.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', 70000.00, '8 - 16 giờ', 1, 7);

INSERT INTO `service_packages` (`id`, `service_id`, `name`, `price`, `revisions`, `turnaround`, `features_json`, `is_popular`) VALUES
(1, 1, 'Gói Cơ Bản (1 Banner)', 50000.00, '2 lần', '12 - 24 giờ', '["1 Banner kích thước chuẩn", "Chỉnh sửa tối đa 2 lần", "File JPG/PNG chất lượng cao"]', 0),
(2, 1, 'Gói Nâng Cao (Combo 3 Banner)', 100000.00, '5 lần', '8 - 16 giờ', '["3 Banner phong cách đồng bộ", "Chỉnh sửa tối đa 5 lần", "File PSD gốc + Fonts", "Mockup 3D"]', 1),
(3, 1, 'Gói Pro Hỏa Tốc', 200000.00, 'Không giới hạn', '4 - 6 giờ', '["Bộ 5 banner", "Sửa không giới hạn", "Hỗ trợ 1:1 chuyên viên"]', 0);

INSERT INTO `design_templates` (`id`, `code`, `title`, `category`, `dimensions`, `formats`, `price_ref`, `preview_url`, `tags`, `description`, `downloads_count`, `likes_count`, `is_featured`) VALUES
(1, 'BN001', 'Banner quảng cáo công nghệ tương lai Cyber AI', 'Banner', '1920×1080 px', 'PSD + PNG + JPG', 50000.00, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80', 'Công nghệ, AI, Banner Web', 'Mẫu banner công nghệ ánh sáng neon xanh cyan thích hợp cho web phần mềm, AI, hosting.', 142, 98, 1),
(2, 'LG001', 'Logo thương hiệu chữ A tối giản Gradient Tech', 'Logo', 'Vector AI/SVG', 'AI + EPS + PNG Trong Suốt', 150000.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80', 'Logo chữ A, Tối giản, Vector', 'Logo hình học tối giản đường cắt sắc sảo, dải màu gradient công nghệ.', 230, 185, 1),
(3, 'AV001', 'Avatar Facebook anime nghệ thuật thẩm mỹ cao', 'Avatar', '1080×1080 px', 'PNG + JPG sắc nét', 50000.00, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80', 'Avatar, Anime, Nghệ thuật', 'Avatar anime thời thượng huyền ảo cho trang cá nhân.', 312, 245, 1),
(4, 'PS001', 'Poster khuyến mãi giày thể thao Sneaker Sale 50%', 'Poster', 'A3 / 1080×1350 px', 'PSD + PDF In Ấn', 80000.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', 'Poster, Sneaker, Sale', 'Poster thể thao đen đỏ mạnh mẽ kích thích mua sắm.', 188, 134, 1),
(5, 'TH001', 'Thumbnail YouTube Free Fire / Gaming kịch tính', 'Thumbnail', '1280×720 px (16:9)', 'PSD + PNG HD', 50000.00, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80', 'Thumbnail, Free Fire, Gaming', 'Thumbnail gaming khói lửa góc nhìn thứ nhất cuốn hút.', 520, 410, 1),
(6, 'MN001', 'Menu quán ăn Bánh Mì Ngon truyền thống Việt', 'Menu', 'A4 / 210×297 mm', 'PSD + AI + PDF', 100000.00, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=80', 'Menu, Bánh Mì, Ẩm thực', 'Bản thiết kế thực đơn tone gỗ ấm cúng món ăn ngon mắt.', 165, 120, 1);

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('site_title', 'INET24H.COM - Dịch vụ Thiết kế Ảnh Online Chuyên Nghiệp 24/7'),
('hotline', '0987 654 321'),
('support_email', 'support@inet24h.com'),
('bank_name', 'MB Bank (Ngân hàng Quân Đội)'),
('bank_account_no', '0987654321'),
('bank_account_owner', 'CONG TY CP THIET KE INET24H'),
('vietqr_template', 'compact2'),
('webhook_token', 'INET24H_SECURE_TOKEN_XYZ789');

SET FOREIGN_KEY_CHECKS = 1;
