<?php
/**
 * INET24H.COM - DỊCH VỤ THIẾT KẾ ẢNH ONLINE
 * File: index.php (Trang chủ PHP 7.4)
 */
$pageTitle = "Trang chủ - Thiết kế ảnh chuyên nghiệp";
require_once __DIR__ . '/includes/header.php';

$db = getDB();

// Lấy danh sách mẫu thiết kế nổi bật từ CSDL
$stmtTmpl = $db->query("SELECT * FROM design_templates WHERE status = 'active' ORDER BY is_featured DESC, id DESC LIMIT 6");
$templates = $stmtTmpl->fetchAll();

// Lấy danh sách dịch vụ
$stmtSrv = $db->query("SELECT * FROM services WHERE status = 'active' ORDER BY display_order ASC");
$services = $stmtSrv->fetchAll();
?>

<!-- Hero Section (Matching Screenshot 1) -->
<section class="relative pt-10 pb-16 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div class="lg:col-span-7 space-y-6">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                    <span>✨ Thiết kế chuyên nghiệp 24/7</span>
                </div>
                <h1 class="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    THIẾT KẾ ẢNH ONLINE <br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400">
                        CHỈ TRONG VÀI PHÚT
                    </span>
                </h1>
                <p class="text-slate-600 dark:text-slate-300 text-base font-medium">
                    Banner • Logo • Avatar • Poster • Ảnh bìa • Menu • Ảnh shop<br>
                    <span class="text-slate-500 text-sm">Kho mẫu đa dạng - Dễ sử dụng - Xuất ảnh chất lượng cao</span>
                </p>
                <div class="flex flex-wrap gap-4 pt-2">
                    <a href="order.php" class="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md">
                        Đặt thiết kế ngay →
                    </a>
                    <a href="designs.php" class="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                        Xem mẫu thiết kế
                    </a>
                </div>
            </div>

            <!-- Right Preview Mockup -->
            <div class="lg:col-span-5">
                <div class="relative rounded-2xl overflow-hidden glass-card p-3 shadow-xl">
                    <div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-blue-900/90 text-blue-200 px-3 py-1 rounded-lg text-xs font-bold">
                            Ps Photoshop HD
                        </div>
                        <div class="absolute top-14 right-4 bg-amber-900/90 text-amber-200 px-3 py-1 rounded-lg text-xs font-bold">
                            Ai Vector 300DPI
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 4 Benefits Cards (Matching Screenshot 1) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
            <div class="glass-card p-4 rounded-2xl flex items-center gap-3">
                <div class="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 font-bold">✓</div>
                <div>
                    <h4 class="font-bold text-sm text-slate-800 dark:text-white">Thiết kế theo yêu cầu</h4>
                    <p class="text-xs text-slate-500">Đúng ý, đúng nhu cầu</p>
                </div>
            </div>
            <div class="glass-card p-4 rounded-2xl flex items-center gap-3">
                <div class="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 font-bold">🛡</div>
                <div>
                    <h4 class="font-bold text-sm text-slate-800 dark:text-white">Báo giá minh bạch</h4>
                    <p class="text-xs text-slate-500">Không phát sinh chi phí</p>
                </div>
            </div>
            <div class="glass-card p-4 rounded-2xl flex items-center gap-3">
                <div class="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 font-bold">⏱</div>
                <div>
                    <h4 class="font-bold text-sm text-slate-800 dark:text-white">Chỉnh sửa theo gói</h4>
                    <p class="text-xs text-slate-500">Hỗ trợ đến khi hài lòng</p>
                </div>
            </div>
            <div class="glass-card p-4 rounded-2xl flex items-center gap-3">
                <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">☁</div>
                <div>
                    <h4 class="font-bold text-sm text-slate-800 dark:text-white">Giao file trực tuyến</h4>
                    <p class="text-xs text-slate-500">Nhanh chóng, an toàn</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Mẫu thiết kế nổi bật (Matching Screenshot 2) -->
<section class="py-12 bg-slate-100/50 dark:bg-slate-900/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-8">
            <div>
                <h2 class="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Mẫu thiết kế nổi bật</h2>
                <p class="text-xs text-slate-500 mt-1">Các sản phẩm đã thực hiện thực tế với chất lượng cao nhất cho khách hàng</p>
            </div>
            <a href="designs.php" class="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline">Xem tất cả mẫu →</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div class="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <a href="designs.php?code=<?= urlencode($tmpl['code']) ?>" class="py-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                                Xem chi tiết
                            </a>
                            <a href="order.php?template=<?= urlencode($tmpl['code']) ?>" class="py-2 text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                                Đặt tương tự
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Bảng giá dịch vụ (Matching Screenshot 3) -->
<section id="pricing" class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-xl mx-auto mb-12">
            <h2 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">Bảng giá dịch vụ</h2>
            <p class="text-xs text-slate-500 mt-1">Chọn gói phù hợp với nhu cầu của bạn - Minh bạch, không phát sinh chi phí</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Gói cơ bản -->
            <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-lg">Gói cơ bản</h3>
                    <p class="text-xs text-slate-500 mt-1">Phù hợp cho cá nhân cần 1 ảnh truyền thông mạng xã hội.</p>
                    <div class="my-4 font-heading text-2xl font-black text-slate-900 dark:text-white">50.000đ <span class="text-xs font-normal text-slate-500">/lần</span></div>
                    <ul class="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                        <li>✓ Thiết kế 1 ảnh/banner theo mẫu</li>
                        <li>✓ Chỉnh sửa tối đa 2 lần</li>
                        <li>✓ File JPG/PNG chất lượng cao</li>
                    </ul>
                </div>
                <a href="order.php?package=basic" class="mt-6 block text-center py-2.5 rounded-xl border border-blue-600 text-blue-600 font-bold text-xs">Đăng ký ngay</a>
            </div>

            <!-- Gói nâng cao (Phổ biến) -->
            <div class="glass-card p-6 rounded-2xl border-2 border-blue-600 shadow-xl flex flex-col justify-between relative -translate-y-1">
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">★ Phổ biến nhất</span>
                <div>
                    <h3 class="font-bold text-lg">Gói nâng cao</h3>
                    <p class="text-xs text-slate-500 mt-1">Lựa chọn phổ biến cho shop bán hàng và doanh nghiệp nhỏ.</p>
                    <div class="my-4 font-heading text-2xl font-black text-blue-600 dark:text-cyan-400">100.000đ <span class="text-xs font-normal text-slate-500">/lần</span></div>
                    <ul class="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                        <li>✓ Thiết kế 1-3 ảnh đồng bộ</li>
                        <li>✓ Chỉnh sửa tối đa 5 lần</li>
                        <li>✓ File PSD gốc + JPG/PNG HD</li>
                        <li>✓ Tặng kèm mockup xem trước 3D</li>
                    </ul>
                </div>
                <a href="order.php?package=advanced" class="mt-6 block text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">Đăng ký ngay</a>
            </div>

            <!-- Gói Pro -->
            <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-lg">Gói Pro</h3>
                    <p class="text-xs text-slate-500 mt-1">Thiết kế không giới hạn trong ngày cho các chiến dịch ra mắt.</p>
                    <div class="my-4 font-heading text-2xl font-black text-slate-900 dark:text-white">200.000đ <span class="text-xs font-normal text-slate-500">/ngày</span></div>
                    <ul class="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                        <li>✓ Thiết kế không giới hạn 1 ngày</li>
                        <li>✓ Chỉnh sửa không giới hạn đến khi duyệt</li>
                        <li>✓ Toàn bộ file gốc vector + fonts</li>
                    </ul>
                </div>
                <a href="order.php?package=pro" class="mt-6 block text-center py-2.5 rounded-xl border border-blue-600 text-blue-600 font-bold text-xs">Đăng ký ngay</a>
            </div>

            <!-- Gói Doanh nghiệp -->
            <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-lg">Gói doanh nghiệp</h3>
                    <p class="text-xs text-slate-500 mt-1">Giải pháp toàn diện đồng hành thương hiệu dài hạn.</p>
                    <div class="my-4 font-heading text-2xl font-black text-slate-900 dark:text-white">500.000đ <span class="text-xs font-normal text-slate-500">/tháng</span></div>
                    <ul class="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                        <li>✓ Tư vấn riêng theo yêu cầu</li>
                        <li>✓ Ưu tiên xử lý đơn hàng hàng đầu</li>
                        <li>✓ Bàn giao trọn bộ Brand Guidelines</li>
                    </ul>
                </div>
                <a href="order.php?package=enterprise" class="mt-6 block text-center py-2.5 rounded-xl border border-blue-600 text-blue-600 font-bold text-xs">Đăng ký ngay</a>
            </div>
        </div>
    </div>
</section>

<!-- Quy trình làm việc 5 bước (Matching Screenshot 4) -->
<section class="py-14 bg-slate-100/50 dark:bg-slate-900/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-xl mx-auto mb-10">
            <h2 class="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">Quy trình làm việc 5 bước chuyên nghiệp</h2>
            <p class="text-xs text-slate-500 mt-1">Tối ưu hóa thời gian xử lý đơn hàng, minh bạch từng khâu</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div class="glass-card p-4 rounded-xl text-center">
                <span class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">1</span>
                <h4 class="font-bold text-xs">Chọn mẫu / dịch vụ</h4>
            </div>
            <div class="glass-card p-4 rounded-xl text-center">
                <span class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">2</span>
                <h4 class="font-bold text-xs">Gửi nội dung & yêu cầu</h4>
            </div>
            <div class="glass-card p-4 rounded-xl text-center">
                <span class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">3</span>
                <h4 class="font-bold text-xs">Xác nhận & thanh toán</h4>
            </div>
            <div class="glass-card p-4 rounded-xl text-center">
                <span class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">4</span>
                <h4 class="font-bold text-xs">Theo dõi tiến độ</h4>
            </div>
            <div class="glass-card p-4 rounded-xl text-center">
                <span class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">5</span>
                <h4 class="font-bold text-xs">Nhận file & hoàn tất</h4>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
