# HƯỚNG DẪN CÀI ĐẶT TRỌN BỘ MÃ NGUỒN INET24H.COM LÊN HOSTING CPANEL (PHP 7.4)

## 1. Yêu cầu hệ thống:
- PHP 7.4 (hoặc PHP 8.0 - 8.2)
- Tiện ích mở rộng PHP: `pdo_mysql`, `mbstring`, `json`, `gd` hoặc `imagick`
- MySQL / MariaDB 10.3+

## 2. Các bước cài đặt:
1. **Bước 1**: Đăng nhập cPanel -> **MySQL Database Wizard**:
   - Tạo Database mới: ví dụ `youruser_inet24h`
   - Tạo User mới: ví dụ `youruser_dbuser`
   - Gán toàn quyền (ALL PRIVILEGES) vào Database.
2. **Bước 2**: Mở **phpMyAdmin**:
   - Chọn database vừa tạo.
   - Nhấp vào tab **Import** (Nhập) -> Chọn file `database/inet24h.sql` -> Nhấn **Go**.
3. **Bước 3**: Upload mã nguồn:
   - Tải file ZIP lên thư mục `public_html` qua cPanel File Manager hoặc FTP và giải nén.
4. **Bước 4**: Cấu hình kết nối:
   - Mở file `config/config.php` và điền:
     - `DB_NAME`: tên database của bạn
     - `DB_USER`: user database của bạn
     - `DB_PASS`: mật khẩu database của bạn
     - `BANK_ACCOUNT_NO`: số tài khoản ngân hàng nhận tiền VietQR
5. **Bước 5**: Đăng nhập Quản Trị Viên (ADMIN):
   - Đường dẫn: `https://yourdomain.com/admin/`
   - Email: `admin@inet24h.com`
   - Mật khẩu: `Admin@2026`
