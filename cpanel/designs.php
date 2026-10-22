<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: designs.php (Kho mẫu thiết kế PHP 7.4)
 */
$pageTitle = "Kho mẫu thiết kế thực tế";
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$category = isset($_GET['cat']) ? sanitize($_GET['cat']) : '';
$search = isset($_GET['q']) ? sanitize($_GET['q']) : '';

$sql = "SELECT * FROM design_templates WHERE status = 'active'";
$params = [];

if ($category && $category !== 'Tất cả') {
    $sql .= " AND category = :cat";
    $params['cat'] = $category;
}
if ($search) {
    $sql .= " AND (title LIKE :q OR code LIKE :q OR tags LIKE :q)";
    $params['q'] = '%' . $search . '%';
}
$sql .= " ORDER BY is_featured DESC, id DESC";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$templates = $stmt->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">Kho mẫu thiết kế thực tế</h1>
            <p class="text-xs text-slate-500 mt-1">Hàng trăm mẫu ấn phẩm đồ họa chất lượng cao đã hoàn thiện</p>
        </div>

        <form method="GET" class="flex gap-2">
            <input type="text" name="q" value="<?= htmlspecialchars($search) ?>" placeholder="Tìm tên hoặc mã mẫu..." class="p-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-56">
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Tìm</button>
        </form>
    </div>

    <!-- Category filter buttons -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <?php foreach (['Tất cả', 'Banner', 'Logo', 'Avatar', 'Poster', 'Menu', 'Thumbnail', 'Game'] as $c): ?>
            <a href="designs.php?cat=<?= urlencode($c) ?>" class="px-3.5 py-1.5 rounded-lg font-semibold <?= ($category === $c || (!$category && $c === 'Tất cả')) ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' ?>">
                <?= $c ?>
            </a>
        <?php endforeach; ?>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php if (empty($templates)): ?>
            <div class="col-span-3 text-center py-16 text-slate-500 text-xs">Không tìm thấy mẫu thiết kế nào phù hợp.</div>
        <?php else: ?>
            <?php foreach ($templates as $tmpl): ?>
                <div class="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div class="relative aspect-[16/10] bg-slate-900">
                        <img src="<?= htmlspecialchars($tmpl['preview_url']) ?>" class="w-full h-full object-cover">
                        <span class="absolute top-3 left-3 bg-slate-900/80 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                            Mã: <?= htmlspecialchars($tmpl['code']) ?>
                        </span>
                        <span class="absolute top-3 right-3 bg-blue-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                            <?= htmlspecialchars($tmpl['category']) ?>
                        </span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 class="font-heading font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                                <?= htmlspecialchars($tmpl['title']) ?>
                            </h3>
                            <div class="mt-2 text-xs text-slate-500 space-y-1">
                                <div class="flex justify-between"><span>Kích thước:</span> <strong class="text-slate-700 dark:text-slate-300"><?= htmlspecialchars($tmpl['dimensions']) ?></strong></div>
                                <div class="flex justify-between"><span>Định dạng:</span> <strong class="text-slate-700 dark:text-slate-300"><?= htmlspecialchars($tmpl['formats']) ?></strong></div>
                            </div>
                        </div>
                        <div class="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <a href="order.php?template=<?= urlencode($tmpl['code']) ?>" class="block w-full py-2 text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                                Đặt thiết kế tương tự mẫu này
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
