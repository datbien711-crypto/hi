<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: config/db.php
 * Khởi tạo kết nối PDO chuẩn Prepared Statements chống SQL Injection
 */

require_once __DIR__ . '/config.php';

class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // Tắt mô phỏng để dùng true prepared statement
        ];

        try {
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Không lộ mật khẩu hoặc chi tiết nhạy cảm ra ngoài
            error_log("Database Connection Error: " . $e->getMessage());
            die("Không thể kết nối cơ sở dữ liệu. Vui lòng kiểm tra file config/config.php trên hosting.");
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance->pdo;
    }
}

// Hàm lấy đối tượng PDO dùng chung
function getDB() {
    return Database::getInstance();
}
