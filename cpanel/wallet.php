<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: wallet.php (Nạp tiền ví & VietQR PHP 7.4)
 */
$pageTitle = "Ví tiền & Nạp VND VietQR";
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$message = '';

if (!$currentUser) {
    echo "<div class='max-w-md mx-auto my-16 p-6 glass-card rounded-2xl text-center space-y-4'>
            <h3 class='font-bold text-lg'>Vui lòng đăng nhập</h3>
            <p class='text-xs text-slate-500'>Bạn cần đăng nhập để quản lý số dư ví và tạo mã nạp VietQR.</p>
            <a href='login.php' class='inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs'>Đăng nhập ngay</a>
          </div>";
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

$amount = isset($_POST['amount']) ? intval($_POST['amount']) : 100000;
if ($amount < 20000) $amount = 100000;

$syntax = "INET24H CUST" . $currentUser['id'] . " " . floor($amount / 1000) . "K";
$vietQrUrl = "https://img.vietqr.io/image/" . BANK_SHORT_NAME . "-" . BANK_ACCOUNT_NO . "-compact2.png?amount=" . $amount . "&addInfo=" . urlencode($syntax) . "&accountName=" . urlencode(BANK_ACCOUNT_NAME);

// Khi khách bấm xác nhận đã chuyển
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirm_deposit'])) {
    if (!verify_csrf($_POST['csrf_token'] ?? '')) {
        die("Token không hợp lệ.");
    }
    
    $txCode = 'NAP-' . date('Ymd') . '-' . rand(100, 999);
    $stmtTx = $db->prepare("INSERT INTO wallet_transactions (tx_code, user_id, type, amount, balance_before, balance_after, status, method, description, reference_code) VALUES (:tx, :uid, 'deposit', :amt, :b_before, :b_after, 'pending', 'vietqr', :desc, :ref)");
    $stmtTx->execute([
        'tx' => $txCode,
        'uid' => $currentUser['id'],
        'amt' => $amount,
        'b_before' => $currentUser['wallet_balance'],
        'b_after' => $currentUser['wallet_balance'] + $amount,
        'desc' => "Yêu cầu nạp " . number_format($amount, 0, ',', '.') . " đ qua VietQR MB Bank",
        'ref' => $syntax
    ]);
    $message = "Đã ghi nhận yêu cầu nạp tiền (#{$txCode}). Hệ thống sẽ tự động đối soát sao kê và cộng số dư trong 1-3 phút.";
}

// Lấy lịch sử giao dịch ví của user
$stmtHistory = $db->prepare("SELECT * FROM wallet_transactions WHERE user_id = :uid ORDER BY id DESC LIMIT 20");
$stmtHistory->execute(['uid' => $currentUser['id']]);
$transactions = $stmtHistory->fetchAll();
?>

<div class="max-w-4xl mx-auto px-4 py-12 space-y-8">
    <div class="glass-card p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
                <h2 class="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">Ví tiền & Nạp VND VietQR</h2>
                <p class="text-xs text-slate-500 mt-1">Nạp tiền tức thì qua quét mã QR ứng dụng ngân hàng</p>
            </div>
            <div class="text-right">
                <span class="text-[11px] text-slate-400 block">Số dư hiện tại</span>
                <strong class="font-heading font-black text-2xl text-blue-600 dark:text-cyan-400">
                    <?= number_format($currentUser['wallet_balance'], 0, ',', '.') ?> đ
                </strong>
            </div>
        </div>

        <?php if ($message): ?>
            <div class="p-4 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <!-- Chọn mức nạp -->
        <div>
            <label class="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-2 uppercase">1. Chọn số tiền nạp:</label>
            <form method="POST" class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <?php foreach ([50000, 100000, 200000, 500000, 1000000] as $amt): ?>
                    <button type="submit" name="amount" value="<?= $amt ?>" class="py-2.5 rounded-xl text-xs font-bold transition-all <?= $amount == $amt ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' ?>">
                        <?= number_format($amt, 0, ',', '.') ?> đ
                    </button>
                <?php endforeach; ?>
            </form>
        </div>

        <!-- VietQR Box -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div class="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-xs">
                <img src="<?= $vietQrUrl ?>" alt="VietQR" class="w-48 h-auto object-contain rounded-lg">
                <span class="text-[11px] font-bold text-blue-600 mt-2">Quét bằng ứng dụng ngân hàng</span>
            </div>

            <div class="sm:col-span-7 space-y-3 text-xs">
                <div>
                    <span class="text-slate-400 block text-[11px]">Ngân hàng:</span>
                    <strong class="text-sm font-bold"><?= BANK_SHORT_NAME ?> - Ngân hàng Quân Đội</strong>
                </div>
                <div>
                    <span class="text-slate-400 block text-[11px]">Số tài khoản:</span>
                    <strong class="font-mono text-base font-bold text-blue-600"><?= BANK_ACCOUNT_NO ?></strong>
                </div>
                <div>
                    <span class="text-slate-400 block text-[11px]">Chủ tài khoản:</span>
                    <strong class="font-bold"><?= BANK_ACCOUNT_NAME ?></strong>
                </div>
                <div>
                    <span class="text-slate-400 block text-[11px]">Số tiền cần chuyển:</span>
                    <strong class="text-emerald-600 font-extrabold text-base"><?= number_format($amount, 0, ',', '.') ?> đ</strong>
                </div>
                <div>
                    <span class="text-slate-400 block text-[11px]">Nội dung chuyển khoản (bắt buộc):</span>
                    <div class="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 font-mono font-bold text-amber-600">
                        <?= $syntax ?>
                    </div>
                </div>
            </div>
        </div>

        <form method="POST">
            <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
            <input type="hidden" name="amount" value="<?= $amount ?>">
            <button type="submit" name="confirm_deposit" value="1" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all">
                Tôi đã chuyển khoản <?= number_format($amount, 0, ',', '.') ?> đ - Xác nhận ngay
            </button>
        </form>
    </div>

    <!-- Lịch sử ví -->
    <div class="glass-card p-6 rounded-3xl shadow-xl space-y-4">
        <h3 class="font-heading font-bold text-base">Lịch sử giao dịch ví của bạn</h3>
        <div class="overflow-x-auto text-xs">
            <table class="w-full text-left">
                <thead class="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                        <th class="py-2">Mã GD</th>
                        <th class="py-2">Mô tả</th>
                        <th class="py-2">Số tiền</th>
                        <th class="py-2">Trạng thái</th>
                        <th class="py-2">Thời gian</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    <?php if (empty($transactions)): ?>
                        <tr><td colspan="5" class="py-4 text-center text-slate-400">Chưa có giao dịch nào.</td></tr>
                    <?php else: ?>
                        <?php foreach ($transactions as $tx): ?>
                            <tr>
                                <td class="py-3 font-mono font-bold"><?= htmlspecialchars($tx['tx_code']) ?></td>
                                <td class="py-3"><?= htmlspecialchars($tx['description']) ?></td>
                                <td class="py-3 font-bold <?= $tx['type'] === 'deposit' ? 'text-emerald-600' : 'text-slate-800 dark:text-slate-100' ?>">
                                    <?= $tx['type'] === 'deposit' ? '+' : '-' ?><?= number_format($tx['amount'], 0, ',', '.') ?> đ
                                </td>
                                <td class="py-3">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $tx['status'] === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500' ?>">
                                        <?= $tx['status'] === 'completed' ? 'Thành công' : 'Chờ xử lý' ?>
                                    </span>
                                </td>
                                <td class="py-3 text-slate-400"><?= $tx['created_at'] ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
