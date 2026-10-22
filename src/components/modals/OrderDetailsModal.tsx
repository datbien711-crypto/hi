import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  Palette,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
  MessageSquare,
  FileCheck,
  RotateCcw,
  Star,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderItem, OrderStatus } from '../../types';
import confetti from 'canvas-confetti';

export const OrderDetailsModal: React.FC = () => {
  const {
    currentUser,
    selectedOrder,
    setSelectedOrder,
    activeModal,
    setActiveModal,
    requestOrderRevision,
    approveOrderCompleted,
    sendOrderMessage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'drafts' | 'deliverables' | 'chat'>('overview');
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('Thiết kế rất đúng ý, màu sắc đẹp và tiến độ nhanh!');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (activeModal !== 'order_detail' || !selectedOrder) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendOrderMessage(selectedOrder.id, chatInput.trim());
    setChatInput('');
  };

  const handleConfirmRevision = () => {
    if (!revisionNote.trim()) return;
    requestOrderRevision(selectedOrder.id, revisionNote.trim());
    setRevisionNote('');
    setShowRevisionForm(false);
  };

  const handleConfirmApproval = () => {
    approveOrderCompleted(selectedOrder.id, rating, feedback);
    setShowApprovalModal(false);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_confirmation':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500">Chờ xác nhận</span>;
      case 'designing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500">Đang thiết kế</span>;
      case 'waiting_approval':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-500">Chờ khách duyệt</span>;
      case 'revision_requested':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500">Yêu cầu chỉnh sửa</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500">Đã hoàn thành</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl glass-card bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500">Mã đơn:</span>
              <strong className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {selectedOrder.orderCode}
              </strong>
              {getStatusBadge(selectedOrder.status)}
            </div>
            <h3 className="font-heading font-bold text-base text-slate-800 dark:text-slate-100 mt-1 line-clamp-1">
              {selectedOrder.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveModal(null);
                setSelectedOrder(null);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1627] text-xs font-semibold gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Chi tiết yêu cầu' },
            { id: 'drafts', label: `Bản demo (${selectedOrder.drafts.length})` },
            { id: 'deliverables', label: `File bàn giao (${selectedOrder.deliverables.length})` },
            { id: 'chat', label: `Trao đổi & Tin nhắn (${selectedOrder.messages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 border-b-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-cyan-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Timeline pipeline */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Tiến trình đơn hàng
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Khách hàng:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{selectedOrder.customerName}</strong>
                    <div className="text-[10px] text-slate-400 mt-1">{selectedOrder.customerPhone}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Designer phụ trách:</span>
                    <strong className="text-blue-600 dark:text-cyan-400">
                      {selectedOrder.assignedDesignerName || 'Đang chờ phân công'}
                    </strong>
                    <div className="text-[10px] text-slate-400 mt-1">Hạn: {selectedOrder.deadline}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Gói dịch vụ:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{selectedOrder.packageName}</strong>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {selectedOrder.price.toLocaleString('vi-VN')} đ (Đã trừ ví)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Số lần chỉnh sửa:</span>
                    <strong className="text-purple-600 dark:text-purple-400">
                      {selectedOrder.revisionCount} / {selectedOrder.maxRevisions} lần
                    </strong>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {selectedOrder.status === 'completed' ? 'Đã hoàn tất duyệt' : 'Còn lượt sửa'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements & Brief detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">
                    Yêu cầu thiết kế chi tiết
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {selectedOrder.requirements}
                  </p>
                  {selectedOrder.textContent && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Chữ hiển thị trên ảnh:
                      </span>
                      <p className="font-mono text-[11px] p-2 bg-slate-50 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                        {selectedOrder.textContent}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">
                    Thông số kỹ thuật
                  </h4>
                  <div className="space-y-2 text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kích thước:</span>
                      <strong>{selectedOrder.dimensions || 'Theo tiêu chuẩn'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tông màu:</span>
                      <strong>{selectedOrder.colorPalette || 'Tự do'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phong cách:</span>
                      <strong>{selectedOrder.designStyle || 'Hiện đại'}</strong>
                    </div>
                    {selectedOrder.templateRefCode && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mẫu tham khảo:</span>
                        <strong className="text-blue-600">{selectedOrder.templateRefCode}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drafts' && (
            <div className="space-y-6">
              {selectedOrder.drafts.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                  <Palette className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Designer đang hoàn thiện bản phác thảo demo đầu tiên.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Dự kiến hoàn thành: {selectedOrder.deadline}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedOrder.drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-sm text-blue-600 dark:text-cyan-400">
                          Bản demo V{draft.version}
                        </span>
                        <span className="text-[11px] text-slate-400">{draft.createdAt}</span>
                      </div>

                      {/* Watermarked Preview */}
                      <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <img src={draft.url} alt="Draft preview" className="w-full h-full object-contain" />
                        {/* Semi-transparent watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-25">
                          <span className="text-4xl sm:text-6xl font-black text-white -rotate-12 tracking-widest font-heading">
                            INET24H.COM DEMO
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <strong>Ghi chú từ Designer:</strong> {draft.note}
                      </p>
                    </div>
                  ))}

                  {/* Customer action buttons when draft is waiting approval */}
                  {selectedOrder.status !== 'completed' && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          Bạn đã hài lòng với bản demo này chưa?
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Còn lại {selectedOrder.maxRevisions - selectedOrder.revisionCount} lần chỉnh sửa theo gói.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowRevisionForm(true)}
                          className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Yêu cầu chỉnh sửa</span>
                        </button>

                        <button
                          onClick={() => setShowApprovalModal(true)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Duyệt thiết kế & Tải file</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Revision form modal/drawer */}
              {showRevisionForm && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-orange-300 dark:border-orange-800 space-y-3">
                  <h4 className="font-bold text-xs text-orange-600 dark:text-orange-400">
                    Nhập chi tiết cần điều chỉnh (Lần {selectedOrder.revisionCount + 1})
                  </h4>
                  <textarea
                    rows={3}
                    placeholder="VD: Thay đổi màu chữ sang vàng gold, phóng to logo ở góc trên bên trái..."
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRevisionForm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleConfirmRevision}
                      className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
                    >
                      Gửi yêu cầu chỉnh sửa
                    </button>
                  </div>
                </div>
              )}

              {/* Approval Modal */}
              {showApprovalModal && (
                <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3">
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                    Xác nhận duyệt hoàn thành bản thiết kế
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Sau khi duyệt, đơn hàng sẽ được đánh dấu hoàn tất và bạn có thể tải toàn bộ file gốc không gắn watermark.
                  </p>

                  <div className="flex items-center gap-1 py-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-2">Đánh giá:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`text-lg ${s <= rating ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowApprovalModal(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleConfirmApproval}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                    >
                      Duyệt & Nhận file ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'deliverables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  Danh sách tệp thiết kế hoàn chỉnh
                </h4>
                <span className="text-xs text-emerald-600 font-semibold">
                  ✓ Không watermark • Đầy đủ layer
                </span>
              </div>

              {selectedOrder.deliverables.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                  <Download className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">File hoàn chỉnh sẽ xuất hiện ở đây khi bạn duyệt bản demo.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {selectedOrder.deliverables.map((deliv) => (
                    <div
                      key={deliv.id}
                      className="p-4 bg-white dark:bg-slate-900/60 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs uppercase">
                          {deliv.fileType}
                        </div>
                        <div>
                          <strong className="text-slate-800 dark:text-slate-100 block">
                            {deliv.fileName}
                          </strong>
                          <span className="text-slate-400 text-[11px]">
                            {deliv.fileSize} • Đã quét mã độc an toàn • {deliv.createdAt}
                          </span>
                        </div>
                      </div>

                      <a
                        href={deliv.downloadUrl}
                        download={deliv.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải về</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-[400px]">
              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {selectedOrder.messages.map((msg) => {
                  const isMe = msg.senderRole === currentUser.role;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <span className="font-semibold">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.createdAt}</span>
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                        {msg.attachmentUrl && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-white/20">
                            <img src={msg.attachmentUrl} alt="Attached" className="max-h-40 w-auto object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendChat} className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Gửi phản hồi hoặc trao đổi nhanh với Designer..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
