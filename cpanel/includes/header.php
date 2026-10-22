<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: includes/header.php
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$currentUser = null;
if (!empty($_SESSION['user_id'])) {
    $db = getDB();
    $stmt = $db->prepare("SELECT id, name, email, phone, role, wallet_balance, avatar FROM users WHERE id = :id AND status = 'active' LIMIT 1");
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $currentUser = $stmt->fetch();
}
$currentBalance = $currentUser ? number_format($currentUser['wallet_balance'], 0, ',', '.') : '0';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? htmlspecialchars($pageTitle) . ' - ' : '' ?>INET24H.COM - Dịch vụ Thiết kế Ảnh Online 24/7</title>
    <meta name="description" content="Thiết kế banner, logo, avatar, poster, thumbnail, menu và ấn phẩm truyền thông trực tuyến chuyên nghiệp.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        navy: { 900: '#070d18', 800: '#0b1324', 700: '#131e36' }
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        h1, h2, h3, h4, .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(226, 232, 240, 0.8); }
        .dark .glass-card { background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
    </style>
</head>
<body class="bg-slate-50 dark:bg-[#070d18] text-slate-800 dark:text-slate-100 min-h-screen flex flex-col antialiased">

<!-- Main Header -->
<header class="sticky top-0 z-50 bg-white/90 dark:bg-[#0b1324]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18">
            <!-- Logo -->
            <a href="index.php" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
                    <div class="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                        <div class="w-2 h-2 bg-cyan-200 rounded-full animate-ping"></div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                        INET<span class="text-blue-600 dark:text-cyan-400">24H</span>.COM
                    </span>
                    <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400">Thiết kế ảnh online</span>
                </div>
            </a>

            <!-- Navigation Links -->
            <nav class="hidden lg:flex items-center gap-1 font-medium text-sm">
                <a href="index.php" class="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600">Trang chủ</a>
                <a href="services.php" class="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600">Dịch vụ</a>
                <a href="designs.php" class="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600">Mẫu thiết kế</a>
                <a href="index.php#pricing" class="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600">Bảng giá</a>
                <a href="wallet.php" class="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600">Nạp ví</a>
                <?php if ($currentUser && $currentUser['role'] === 'admin'): ?>
                    <a href="admin/index.php" class="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs">Admin Panel</a>
                <?php endif; ?>
            </nav>

            <!-- User Status & Actions -->
            <div class="flex items-center gap-3">
                <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" title="Đổi màu giao diện">
                    🌓
                </button>

                <?php if ($currentUser): ?>
                    <a href="account.php" class="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                        <img src="<?= htmlspecialchars($currentUser['avatar']) ?>" class="w-6 h-6 rounded-full object-cover">
                        <span class="hidden md:inline"><?= htmlspecialchars($currentUser['name']) ?></span>
                    </a>
                <?php else: ?>
                    <a href="login.php" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs">
                        Đăng nhập
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Sub-bar (Matching Screenshot 1) -->
    <div class="bg-slate-100/90 dark:bg-[#0b1324]/90 border-t border-b border-slate-200 dark:border-slate-800 text-xs py-2 px-4">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                <span class="text-slate-600 dark:text-slate-400">
                    <strong class="text-slate-800 dark:text-slate-200">INET24H Designer Đang Trực Tuyến:</strong> Sẵn sàng nhận việc 24/7
                </span>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    <span class="text-slate-500">Số dư ví:</span>
                    <strong class="text-blue-600 dark:text-cyan-400 font-bold"><?= $currentBalance ?> đ</strong>
                    <a href="wallet.php" class="ml-1 text-[11px] font-bold text-blue-600 hover:underline">+ Nạp</a>
                </div>
                <a href="order.php" class="px-3.5 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700">
                    + Đặt thiết kế
                </a>
            </div>
        </div>
    </div>
</header>
<main class="flex-1">
