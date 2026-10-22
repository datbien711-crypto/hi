<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: services.php (Danh sách dịch vụ PHP 7.4)
 */
$pageTitle = "Dịch vụ thiết kế ảnh";
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$services = $db->query("SELECT * FROM services WHERE status = 'active' ORDER BY display_order ASC")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div class="text-center max-w-2xl mx-auto space-y-2">
        <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">Dịch vụ thiết kế ảnh theo yêu cầu</h1>
        <p class="text-xs text-slate-500">Đầy đủ các hạng mục thiết kế phục vụ kinh doanh online, truyền thông & thương hiệu</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <?php foreach ($services as $srv): ?>
            <?php
                $stmtPkgs = $db->prepare("SELECT * FROM service_packages WHERE service_id = :sid");
                $stmtPkgs->execute(['sid' => $srv['id']]);
                $pkgs = $stmtPkgs->fetchAll();
            ?>
            <div class="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                    <div class="relative aspect-[16/8] bg-slate-900">
                        <img src="<?= htmlspecialchars($srv['banner_image']) ?>" class="w-full h-full object-cover">
                        <div class="absolute bottom-3 left-3 text-white">
                            <span class="px-2 py-0.5 rounded bg-blue-600 text-[10px] font-bold"><?= htmlspecialchars($srv['category']) ?></span>
                            <h3 class="font-bold text-base mt-1"><?= htmlspecialchars($srv['title']) ?></h3>
                        </div>
                    </div>
                    <div class="p-5 space-y-3">
                        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"><?= htmlspecialchars($srv['full_desc']) ?></p>
                        <div class="text-xs space-y-1">
                            <span class="font-bold text-slate-400 text-[11px] uppercase">Gói dịch vụ:</span>
                            <?php foreach ($pkgs as $p): ?>
                                <div class="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-[11px]">
                                    <span><?= htmlspecialchars($p['name']) ?> (<?= htmlspecialchars($p['turnaround']) ?>)</span>
                                    <strong class="text-blue-600 font-bold"><?= number_format($p['price'], 0, ',', '.') ?> đ</strong>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <div class="p-5 pt-0">
                    <a href="order.php?service_id=<?= $srv['id'] ?>" class="block w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                        Đặt thiết kế ngay →
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
