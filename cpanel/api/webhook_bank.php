<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: api/webhook_bank.php
 * Webhook nhận thông báo biến động số dư ngân hàng tự động (MB Bank / Casso / SePAY)
 * Bảo mật: Xác thực chữ ký bí mật, Transaction DB, chống cộng tiền trùng lặp
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

// 1. Kiểm tra Authorization Header / Token bí mật
$headers = getallheaders();
$providedToken = $headers['Authorization'] ?? $headers['authorization'] ?? ($_GET['token'] ?? '');
$cleanToken = str_replace('Bearer ', '', $providedToken);

if (!hash_equals(BANK_WEBHOOK_KEY, $cleanToken)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized: Invalid webhook signature']);
    exit;
}

// 2. Lấy dữ liệu Webhook gửi lên
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
    exit;
}

$db = getDB();

/**
 * Format mẫu dữ liệu ngân hàng thường gửi:
 * [
 *   'transaction_id' => 'MB_12345678',
 *   'amount'         => 100000,
 *   'content'        => 'INET24H CUST3 100K',
 *   'date'           => '2026-10-22 15:30:00'
 * ]
 */
$transId = sanitize($data['transaction_id'] ?? $data['id'] ?? ('AUTO_' . time()));
$amount = floatval($data['amount'] ?? 0);
$content = strtoupper(sanitize($data['content'] ?? $data['description'] ?? ''));

if ($amount <= 0 || empty($content)) {
    echo json_encode(['success' => false, 'message' => 'Amount must be positive']);
    exit;
}

// 3. Phân tích cú pháp: INET24H CUST{USER_ID} {AMOUNT}K
preg_match('/INET24H\s+CUST(\d+)/i', $content, $matches);
if (empty($matches[1])) {
    echo json_encode(['success' => false, 'message' => 'No valid customer ID found in content']);
    exit;
}

$userId = intval($matches[1]);

// 4. Bắt đầu Database Transaction có khóa bản ghi chống cộng trùng
$db->beginTransaction();
try {
    // Kiểm tra xem transaction_id của ngân hàng này đã được cộng trước đó chưa
    $stmtCheck = $db->prepare("SELECT id FROM wallet_transactions WHERE reference_code = :ref AND status = 'completed' LIMIT 1 FOR UPDATE");
    $stmtCheck->execute(['ref' => $transId]);
    if ($stmtCheck->fetch()) {
        $db->rollBack();
        echo json_encode(['success' => true, 'message' => 'Transaction already processed (Idempotent)']);
        exit;
    }

    // Kiểm tra khách hàng tồn tại
    $stmtUser = $db->prepare("SELECT id, wallet_balance FROM users WHERE id = :uid AND status = 'active' LIMIT 1 FOR UPDATE");
    $stmtUser->execute(['uid' => $userId]);
    $user = $stmtUser->fetch();
    if (!$user) {
        $db->rollBack();
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    $balanceBefore = floatval($user['wallet_balance']);
    $balanceAfter = $balanceBefore + $amount;

    // Cộng tiền vào tài khoản ví
    $stmtUpdate = $db->prepare("UPDATE users SET wallet_balance = :bal WHERE id = :uid");
    $stmtUpdate->execute(['bal' => $balanceAfter, 'uid' => $userId]);

    // Ghi nhận giao dịch thành công
    $txCode = 'AUTO-' . date('Ymd') . '-' . rand(100, 999);
    $stmtTx = $db->prepare("INSERT INTO wallet_transactions (tx_code, user_id, type, amount, balance_before, balance_after, status, method, description, reference_code, verified_at) VALUES (:tx, :uid, 'deposit', :amt, :bb, :ba, 'completed', 'vietqr_auto', :desc, :ref, NOW())");
    $stmtTx->execute([
        'tx' => $txCode,
        'uid' => $userId,
        'amt' => $amount,
        'bb' => $balanceBefore,
        'ba' => $balanceAfter,
        'desc' => "Nạp tiền tự động qua Webhook VietQR (#{$transId})",
        'ref' => $transId
    ]);

    // Ghi audit log
    $stmtAudit = $db->prepare("INSERT INTO audit_logs (admin_email, action, target_type, target_id, note) VALUES ('webhook@system', 'Tự động cộng tiền ví', 'transaction', :tid, :note)");
    $stmtAudit->execute([
        'tid' => $txCode,
        'note' => "Cộng {$amount} đ cho user #{$userId} qua Webhook đối soát thành công"
    ]);

    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Deposit credited successfully', 'new_balance' => $balanceAfter]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
