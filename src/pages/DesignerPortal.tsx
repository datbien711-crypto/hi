import React, { useState } from 'react';
import {
  Palette,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  MessageSquare,
  FileCheck,
  Send,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';

export const DesignerPortal: React.FC = () => {
  const {
    currentUser,
    orders,
    submitOrderDraft,
    submitDeliverable,
    updateOrderStatus,
    setSelectedOrder,
    setActiveModal,
  } = useApp();

  const [selectedOrd, setSelectedOrd] = useState<OrderItem | null>(null);
  const [draftUrl, setDraftUrl] = useState('');
  const [draftNote, setDraftNote] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('PSD');
  const [fileSize, setFileSize] = useState('35.4 MB');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Designer orders
  const myOrders = orders.filter(
    (o) => o.assignedDesignerId === currentUser.id || !o.assignedDesignerId
  );

  const activeOrder = selectedOrd || myOrders[0];

  const handleUploadDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    const url =
      draftUrl ||
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80';
    submitOrderDraft(activeOrder.id, url, draftNote || 'Bản demo hoàn thiện sơ bộ.');
    setDraftUrl('');
    setDraftNote('');
    setSuccessMsg('Đã tải lên bản demo thành công cho khách hàng duyệt!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleUploadDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    submitDeliverable(activeOrder.id, {
      fileName: fileName || `${activeOrder.orderCode}_Final_Assets.zip`,
      fileType: fileType || 'ZIP',
      fileSize: fileSize || '45 MB',
      downloadUrl:
        downloadUrl ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    });
    setFileName('');
    setDownloadUrl('');
    setSuccessMsg('Đã bàn giao tệp thành công!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Khu vực làm việc Designer (Staff Portal)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400">
              Designer 24/7
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tiếp nhận yêu cầu, tải lên bản demo watermarked và bàn giao file đồ họa hoàn chỉnh cho khách.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-500">Đang phụ trách:</span>
            <strong className="text-blue-600 dark:text-cyan-400 font-bold">
              {myOrders.filter((o) => o.status !== 'completed').length} Đơn active
            </strong>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Order List Left + Work Area Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Orders Assigned */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
            <span>Danh sách đơn phụ trách</span>
            <span className="text-xs text-slate-400 font-normal">({myOrders.length} đơn)</span>
          </h3>

          <div className="space-y-2.5">
            {myOrders.map((ord) => {
              const isSelected = activeOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrd(ord)}
                  className={`p-4 rounded-2xl glass-card border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 shadow-md ring-1 ring-blue-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {ord.orderCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : ord.status === 'waiting_approval'
                          ? 'bg-purple-500/10 text-purple-500'
                          : ord.status === 'revision_requested'
                          ? 'bg-orange-500/10 text-orange-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      {ord.status === 'completed'
                        ? 'Hoàn thành'
                        : ord.status === 'waiting_approval'
                        ? 'Chờ khách duyệt'
                        : ord.status === 'revision_requested'
                        ? 'Cần sửa'
                        : 'Đang thiết kế'}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">
                    {ord.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Khách: {ord.customerName}</span>
                    <span>Hạn: {ord.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Order Workspace */}
        {activeOrder ? (
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600">
                    {activeOrder.orderCode} • {activeOrder.packageName}
                  </span>
                  <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-0.5">
                    {activeOrder.title}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setSelectedOrder(activeOrder);
                    setActiveModal('order_detail');
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Mở phòng làm việc với khách</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Brief Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Kích thước:</span>
                  <strong>{activeOrder.dimensions}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Màu sắc mong muốn:</span>
                  <strong>{activeOrder.colorPalette}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phong cách:</span>
                  <strong>{activeOrder.designStyle}</strong>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Nội dung chi tiết:</span>
                <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeOrder.requirements}
                </p>
              </div>

              {activeOrder.textContent && (
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Chữ hiển thị trên ảnh:</span>
                  <div className="font-mono p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-cyan-400">
                    {activeOrder.textContent}
                  </div>
                </div>
              )}

              {/* Upload Draft form */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>1. Tải lên bản demo phác thảo (Watermarked Preview)</span>
                </h3>

                <form onSubmit={handleUploadDraft} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">URL ảnh demo xem trước:</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... hoặc dán link ảnh"
                        value={draftUrl}
                        onChange={(e) => setDraftUrl(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Ghi chú gửi kèm khách hàng:</label>
                      <input
                        type="text"
                        placeholder="VD: Mình đã lên layout V1 theo đúng tone nâu kem..."
                        value={draftNote}
                        onChange={(e) => setDraftNote(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi bản demo cho khách duyệt</span>
                  </button>
                </form>
              </div>

              {/* Upload Final Deliverable */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>2. Bàn giao tệp thiết kế hoàn chỉnh (File gốc PSD / PNG / ZIP)</span>
                </h3>

                <form onSubmit={handleUploadDeliverable} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Tên file bàn giao:</label>
                      <input
                        type="text"
                        placeholder="VD: Banner_Final_HD.zip"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Định dạng file:</label>
                      <select
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="ZIP">ZIP (Đầy đủ PSD + PNG + Font)</option>
                        <option value="PSD">PSD (Photoshop)</option>
                        <option value="AI">AI (Illustrator Vector)</option>
                        <option value="PNG">PNG HD (Nền trong suốt)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Kích thước file:</label>
                      <input
                        type="text"
                        placeholder="VD: 45.2 MB"
                        value={fileSize}
                        onChange={(e) => setFileSize(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lưu file bàn giao</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 text-xs">Chọn một đơn hàng ở cột bên trái để bắt đầu xử lý.</p>
          </div>
        )}
      </div>
    </div>
  );
};
