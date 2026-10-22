<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: account.php (Quản lý tài khoản PHP 7.4)
 */
$pageTitle = "Tài khoản của tôi";
require_once __DIR__ . '/includes/header.php';

if (!$currentUser) {
    header("Location: login.php");
    exit;
}

$db = getDB();
$stmtOrders = $db->prepare("SELECT * FROM orders WHERE customer_id = :cid ORDER BY id DESC");
$stmtOrders->execute(['cid' => $currentUser['id']]);
$orders = $stmtOrders->fetchAll();
?>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div class="glass-card p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
            <img src="<?= htmlspecialchars($currentUser['avatar']) ?>" class="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500">
            <div>
                <h1 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white"><?= htmlspecialchars($currentUser['name']) ?></h1>
                <p class="text-xs text-slate-500"><?= htmlspecialchars($currentUser['email']) ?> • <?= htmlspecialchars($currentUser['phone']) ?></p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <div class="text-right">
                <span class="text-[11px] text-slate-400 block uppercase font-bold">Số dư ví</span>
                <strong class="font-heading font-black text-2xl text-blue-600 dark:text-cyan-400"><?= number_format($currentUser['wallet_balance'], 0, ',', '.') ?> đ</strong>
            </div>
            <a href="wallet.php" class="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">+ Nạp tiền</a>
            <a href="logout.php" class="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs">Đăng xuất</a>
        </div>
    </div>

    <!-- Danh sách đơn hàng -->
    <div class="glass-card p-6 rounded-3xl shadow-xl space-y-4">
        <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white">Đơn đặt thiết kế của bạn (<?= count($orders) ?>)</h3>
        <div class="overflow-x-auto text-xs">
            <table class="w-full text-left">
                <thead class="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                        <th class="py-2.5">Mã đơn</th>
                        <th class="py-2.5">Tiêu đề thiết kế</th>
                        <th class="py-2.5">Giá tiền</th>
                        <th class="py-2.5">Trạng thái</th>
                        <th class="py-2.5">Thời hạn</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    <?php if (empty($orders)): ?>
                        <tr><td colspan="5" class="py-6 text-center text-slate-400">Bạn chưa có đơn đặt thiết kế nào.</td></tr>
                    <?php else: ?>
                        <?php foreach ($orders as $ord): ?>
                            <tr>
                                <td class="py-3 font-mono font-bold text-blue-600"><?= htmlspecialchars($ord['order_code']) ?></td>
                                <td class="py-3 font-bold"><?= htmlspecialchars($ord['title']) ?></td>
                                <td class="py-3 font-bold"><?= number_format($ord['price'], 0, ',', '.') ?> đ</td>
                                <td class="py-3">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500">
                                        <?= htmlspecialchars($ord['status']) ?>
                                    </span>
                                </td>
                                <td class="py-3 text-slate-400"><?= htmlspecialchars($ord['deadline']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
