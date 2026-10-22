<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: order.php (Đặt thiết kế PHP 7.4)
 */
$pageTitle = "Đặt thiết kế trực tuyến";
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$message = '';
$messageType = '';

// Yêu cầu đăng nhập để đặt
if (!$currentUser) {
    echo "<div class='max-w-md mx-auto my-16 p-6 glass-card rounded-2xl text-center space-y-4'>
            <h3 class='font-bold text-lg'>Vui lòng đăng nhập</h3>
            <p class='text-xs text-slate-500'>Bạn cần đăng nhập tài khoản để đặt thiết kế và sử dụng số dư ví.</p>
            <a href='login.php' class='inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs'>Đăng nhập ngay</a>
          </div>";
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

// Xử lý submit form đặt thiết kế
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf($_POST['csrf_token'] ?? '')) {
        die("Phiên làm việc hết hạn hoặc token CSRF không hợp lệ.");
    }

    $serviceId = intval($_POST['service_id'] ?? 1);
    $packageId = intval($_POST['package_id'] ?? 1);
    $title = sanitize($_POST['title'] ?? '');
    $requirements = sanitize($_POST['requirements'] ?? '');
    $dimensions = sanitize($_POST['dimensions'] ?? '1920x1080');
    $colorPalette = sanitize($_POST['color_palette'] ?? '');
    $designStyle = sanitize($_POST['design_style'] ?? '');
    $textContent = sanitize($_POST['text_content'] ?? '');
    $templateRef = sanitize($_POST['template_ref_code'] ?? '');
    $isUrgent = !empty($_POST['is_urgent']) ? 1 : 0;

    // Lấy giá gói
    $stmtPkg = $db->prepare("SELECT price, revisions, turnaround FROM service_packages WHERE id = :id LIMIT 1");
    $stmtPkg->execute(['id' => $packageId]);
    $pkg = $stmtPkg->fetch();
    $basePrice = $pkg ? floatval($pkg['price']) : 50000;
    $totalPrice = $basePrice + ($isUrgent ? 50000 : 0);

    // Kiểm tra số dư ví
    if ($currentUser['wallet_balance'] < $totalPrice) {
        $message = "Số dư ví không đủ (" . number_format($currentUser['wallet_balance'], 0, ',', '.') . " đ). Cần " . number_format($totalPrice, 0, ',', '.') . " đ. Vui lòng nạp thêm!";
        $messageType = "error";
    } elseif (empty($title) || empty($requirements)) {
        $message = "Vui lòng nhập đầy đủ tiêu đề và nội dung mô tả yêu cầu.";
        $messageType = "error";
    } else {
        // Bắt đầu Transaction Database an toàn chống trừ tiền trùng
        $db->beginTransaction();
        try {
            $orderCode = 'DH-' . date('Ymd') . '-' . rand(100, 999);
            
            // 1. Trừ ví người dùng
            $newBalance = $currentUser['wallet_balance'] - $totalPrice;
            $stmtUser = $db->prepare("UPDATE users SET wallet_balance = :bal, total_spent = total_spent + :spent WHERE id = :id");
            $stmtUser->execute(['bal' => $newBalance, 'spent' => $totalPrice, 'id' => $currentUser['id']]);

            // 2. Tạo đơn hàng
            $stmtOrd = $db->prepare("INSERT INTO orders (order_code, customer_id, service_id, package_id, template_ref_code, title, requirements, dimensions, color_palette, design_style, text_content, price, status, deadline) VALUES (:code, :cust_id, :srv_id, :pkg_id, :ref_code, :title, :req, :dim, :color, :style, :txt, :price, 'pending_confirmation', :deadline)");
            $stmtOrd->execute([
                'code' => $orderCode,
                'cust_id' => $currentUser['id'],
                'srv_id' => $serviceId,
                'pkg_id' => $packageId,
                'ref_code' => $templateRef,
                'title' => $title,
                'req' => $requirements,
                'dim' => $dimensions,
                'color' => $colorPalette,
                'style' => $designStyle,
                'txt' => $textContent,
                'price' => $totalPrice,
                'deadline' => $isUrgent ? 'Trong 4-6 giờ' : ($pkg['turnaround'] ?? '24 giờ')
            ]);
            $orderId = $db->lastInsertId();

            // 3. Ghi lịch sử ví
            $stmtTx = $db->prepare("INSERT INTO wallet_transactions (tx_code, user_id, type, amount, balance_before, balance_after, status, method, description, reference_code, verified_at) VALUES (:tx_code, :user_id, 'order_payment', :amt, :b_before, :b_after, 'completed', 'wallet', :desc, :ref_code, NOW())");
            $stmtTx->execute([
                'tx_code' => 'TT-' . date('Ymd') . '-' . rand(100, 999),
                'user_id' => $currentUser['id'],
                'amt' => $totalPrice,
                'b_before' => $currentUser['wallet_balance'],
                'b_after' => $newBalance,
                'desc' => "Thanh toán đơn thiết kế #{$orderCode}",
                'ref_code' => "ORDER_{$orderCode}"
            ]);

            $db->commit();
            $message = "Đặt thiết kế thành công! Mã đơn: #{$orderCode}. Đội ngũ designer đang tiếp nhận.";
            $messageType = "success";
            $currentUser['wallet_balance'] = $newBalance;
        } catch (Exception $e) {
            $db->rollBack();
            $message = "Có lỗi xảy ra trong quá trình xử lý: " . $e->getMessage();
            $messageType = "error";
        }
    }
}

// Lấy danh sách dịch vụ và gói
$services = $db->query("SELECT * FROM services WHERE status = 'active'")->fetchAll();
$packages = $db->query("SELECT * FROM service_packages")->fetchAll();
?>

<div class="max-w-3xl mx-auto px-4 py-12">
    <div class="glass-card p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div>
            <h2 class="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">Đặt dịch vụ thiết kế trực tuyến</h2>
            <p class="text-xs text-slate-500 mt-1">Số dư ví hiện tại: <strong class="text-blue-600 font-bold"><?= number_format($currentUser['wallet_balance'], 0, ',', '.') ?> đ</strong></p>
        </div>

        <?php if ($message): ?>
            <div class="p-4 rounded-xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20' ?>">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4 text-xs">
            <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dịch vụ thiết kế:</label>
                    <select name="service_id" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <?php foreach ($services as $s): ?>
                            <option value="<?= $s['id'] ?>"><?= htmlspecialchars($s['title']) ?> (Từ <?= number_format($s['base_price'], 0, ',', '.') ?>đ)</option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gói dịch vụ:</label>
                    <select name="package_id" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <?php foreach ($packages as $p): ?>
                            <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['name']) ?> - <?= number_format($p['price'], 0, ',', '.') ?>đ (<?= $p['revisions'] ?>)</option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div>
                <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tiêu đề đơn / Tên thương hiệu:</label>
                <input type="text" name="title" required placeholder="VD: Banner khai trương quán cafe & bánh ngọt..." class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            </div>

            <div>
                <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mô tả ý tưởng chi tiết:</label>
                <textarea name="requirements" rows="3" required placeholder="Bố cục, thông điệp cần truyền tải, màu sắc chủ đạo..." class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label class="text-slate-500 block mb-1">Kích thước (px):</label>
                    <input type="text" name="dimensions" value="1920x1080 px" class="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                </div>
                <div>
                    <label class="text-slate-500 block mb-1">Tông màu:</label>
                    <input type="text" name="color_palette" value="Xanh cyan neon, Navy" class="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                </div>
                <div>
                    <label class="text-slate-500 block mb-1">Phong cách:</label>
                    <input type="text" name="design_style" value="Hiện đại, công nghệ" class="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                </div>
            </div>

            <div>
                <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nội dung chữ đưa lên ảnh:</label>
                <textarea name="text_content" rows="2" placeholder="VD: GIẢM GIÁ 50% - DUY NHẤT HÔM NAY - HOTLINE 0987 654 321" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"></textarea>
            </div>

            <label class="flex items-center gap-2 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 cursor-pointer">
                <input type="checkbox" name="is_urgent" value="1" class="w-4 h-4 text-blue-600">
                <span class="font-bold text-slate-800 dark:text-slate-100">Giao hỏa tốc 4 - 6 giờ (+50.000đ)</span>
            </label>

            <button type="submit" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all">
                Xác nhận đặt thiết kế & Trừ tiền từ số dư ví
            </button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
