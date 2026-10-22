import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Upload,
  Clock,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderAttachment } from '../../types';
import confetti from 'canvas-confetti';

export const OrderModal: React.FC = () => {
  const {
    currentUser,
    services,
    selectedTemplate,
    selectedService,
    activeModal,
    setActiveModal,
    placeOrder,
    setSelectedOrder,
    orders,
  } = useApp();

  if (activeModal !== 'order') return null;

  // Determine initial service
  const initialService =
    selectedService ||
    (selectedTemplate
      ? services.find((s) => s.category === selectedTemplate.category) || services[0]
      : services[0]);

  const [serviceId, setServiceId] = useState<string>(initialService.id);
  const currentService = services.find((s) => s.id === serviceId) || services[0];

  const [packageId, setPackageId] = useState<string>(
    currentService.packages[0]?.id || ''
  );

  // Sync packageId when service changes
  useEffect(() => {
    if (currentService.packages.length > 0) {
      setPackageId(currentService.packages[0].id);
    }
  }, [serviceId]);

  const currentPkg =
    currentService.packages.find((p) => p.id === packageId) || currentService.packages[0];

  // Form fields
  const [title, setTitle] = useState<string>(
    selectedTemplate ? `Thiết kế theo mẫu [${selectedTemplate.code}] ${selectedTemplate.title}` : ''
  );
  const [requirements, setRequirements] = useState<string>('');
  const [dimensions, setDimensions] = useState<string>(
    selectedTemplate?.dimensions || '1920×1080 px'
  );
  const [colorPalette, setColorPalette] = useState<string>('Xanh cyan neon kết hợp xanh navy');
  const [designStyle, setDesignStyle] = useState<string>('Công nghệ hiện đại & Ánh sáng neon');
  const [textContent, setTextContent] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<OrderAttachment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const basePrice = currentPkg?.price || currentService.basePrice;
  const urgentFee = isUrgent ? 50000 : 0;
  const totalPrice = basePrice + urgentFee;
  const hasEnoughBalance = currentUser.walletBalance >= totalPrice;

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAtt: OrderAttachment = {
          name: file.name,
          url: (event.target?.result as string) || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        };
        setAttachments((prev) => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề hoặc tên ấn phẩm thiết kế.');
      return;
    }

    if (!requirements.trim()) {
      setErrorMessage('Vui lòng mô tả chi tiết ý tưởng hoặc yêu cầu của bạn.');
      return;
    }

    const res = placeOrder({
      serviceId: currentService.id,
      packageId: currentPkg.id,
      templateRefCode: selectedTemplate?.code,
      title,
      requirements,
      dimensions,
      colorPalette,
      designStyle,
      textContent,
      attachments,
      isUrgent,
    });

    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl glass-card bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Đặt dịch vụ thiết kế trực tuyến
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chuyên viên INET24H hỗ trợ duyệt bản demo & chỉnh sửa tận tâm
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Reference Template Alert */}
          {selectedTemplate && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
              <img
                src={selectedTemplate.previewUrl}
                alt={selectedTemplate.title}
                className="w-12 h-12 object-cover rounded-lg shrink-0"
              />
              <div>
                <span>Đang đặt thiết kế theo mẫu tham khảo: </span>
                <strong className="block font-bold text-slate-900 dark:text-white">
                  [{selectedTemplate.code}] {selectedTemplate.title}
                </strong>
              </div>
            </div>
          )}

          {/* 1. Service & Package Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Chọn dịch vụ & Gói thực hiện
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Dịch vụ thiết kế:</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.title} (Từ {srv.basePrice.toLocaleString('vi-VN')} đ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Gói thiết kế:</label>
                <select
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  {currentService.packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — {pkg.price.toLocaleString('vi-VN')} đ ({pkg.revisions} lần sửa)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Package feature tags */}
            {currentPkg && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Bao gồm:</span>
                  {currentPkg.features.map((feat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Order Details */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              2. Chi tiết yêu cầu thiết kế
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tiêu đề đơn / Tên thương hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Banner khuyến mãi Black Friday shop thời trang Nam..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mô tả ý tưởng & yêu cầu chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả cụ thể bố cục, đối tượng khách hàng, sản phẩm cần làm nổi bật, chi tiết cần tránh..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Kích thước (px hoặc mm):</label>
                <input
                  type="text"
                  placeholder="VD: 1920x1080 px"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Tông màu mong muốn:</label>
                <input
                  type="text"
                  placeholder="VD: Đỏ - Đen, Vàng kim..."
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Phong cách:</label>
                <input
                  type="text"
                  placeholder="VD: Tối giản, Gaming, Sang trọng..."
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nội dung chữ đưa lên ảnh (Headline, Hotline, Khuyến mãi, Địa chỉ...):
              </label>
              <textarea
                rows={2}
                placeholder="VD: GIẢM GIÁ 50% TOÀN BỘ SẢN PHẨM - DUY NHẤT HÔM NAY - HOTLINE: 0987 654 321"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Attachments Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Đính kèm tài liệu, logo hoặc ảnh mẫu tham khảo:
              </label>
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Nhấn để tải lên tệp (PNG, JPG, PDF, ZIP)
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Tối đa 15MB/tệp</span>
                <input
                  type="file"
                  accept="image/*,.pdf,.zip"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded items */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span className="max-w-[120px] truncate">{att.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setAttachments((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="text-slate-400 hover:text-red-500 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Urgent Delivery Option */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 cursor-pointer">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Giao hỏa tốc ưu tiên (Trong 4 - 6 giờ)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Được ưu tiên xử lý trước mọi đơn hàng khác
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-600">+50.000đ</span>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </label>
          </div>

          {/* 3. Pricing Summary & Wallet Balance Check */}
          <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Giá gói thiết kế ({currentPkg?.name}):</span>
              <span>{basePrice.toLocaleString('vi-VN')} đ</span>
            </div>
            {isUrgent && (
              <div className="flex justify-between text-amber-600">
                <span>Phụ phí hỏa tốc (4 - 6 giờ):</span>
                <span>+50.000 đ</span>
              </div>
            )}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-baseline font-bold text-sm">
              <span className="text-slate-900 dark:text-white">Tổng thanh toán:</span>
              <span className="text-blue-600 dark:text-cyan-400 font-extrabold text-base">
                {totalPrice.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Current Wallet status */}
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-slate-500" />
                <span className="text-slate-500">Số dư ví của bạn:</span>
                <strong
                  className={
                    hasEnoughBalance
                      ? 'text-emerald-600 font-bold'
                      : 'text-red-500 font-bold'
                  }
                >
                  {currentUser.walletBalance.toLocaleString('vi-VN')} đ
                </strong>
              </div>

              {!hasEnoughBalance && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('wallet');
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  + Nạp tiền ngay qua VietQR
                </button>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {hasEnoughBalance ? (
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận đặt thiết kế & Trừ ví ({totalPrice.toLocaleString('vi-VN')} đ)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveModal('wallet')}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Số dư không đủ - Nhấn để nạp tiền vào ví qua VietQR</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
