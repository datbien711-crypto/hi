<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: login.php (Đăng nhập PHP 7.4)
 */
$pageTitle = "Đăng nhập tài khoản";
require_once __DIR__ . '/includes/header.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email AND status = 'active' LIMIT 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    // Kiểm tra mật khẩu (hoặc mật khẩu mặc định Admin@2026)
    if ($user && ($password === 'Admin@2026' || password_verify($password, $user['password']))) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_name'] = $user['name'];

        if ($user['role'] === 'admin') {
            header("Location: admin/index.php");
        } else {
            header("Location: account.php");
        }
        exit;
    } else {
        $error = "Email hoặc mật khẩu không chính xác.";
    }
}
?>

<div class="max-w-md mx-auto px-4 py-16">
    <div class="glass-card p-8 rounded-3xl shadow-xl space-y-6">
        <div class="text-center">
            <h2 class="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">Đăng nhập INET24H</h2>
            <p class="text-xs text-slate-500 mt-1">Quản lý đơn thiết kế và số dư ví VND của bạn</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-bold">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4 text-xs">
            <div>
                <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email đăng nhập:</label>
                <input type="email" name="email" value="admin@inet24h.com" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            </div>

            <div>
                <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mật khẩu:</label>
                <input type="password" name="password" value="Admin@2026" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            </div>

            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[11px] text-blue-700 dark:text-blue-300">
                <strong>Tài khoản mẫu:</strong><br>
                Admin: <code>admin@inet24h.com</code> / Mật khẩu: <code>Admin@2026</code><br>
                Khách hàng: <code>khachhang@gmail.com</code> / Mật khẩu: <code>Admin@2026</code>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                Đăng nhập
            </button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
