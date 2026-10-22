import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Eye,
  Download,
  Share2,
  CheckCircle2,
  Layers,
  FileCode,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TemplateDetailModal: React.FC = () => {
  const {
    selectedTemplate,
    activeModal,
    setActiveModal,
    favorites,
    toggleFavorite,
  } = useApp();

  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (activeModal !== 'template_detail' || !selectedTemplate) return null;

  const images = [selectedTemplate.previewUrl, ...(selectedTemplate.detailImages || [])];
  const isFav = favorites.includes(selectedTemplate.id);

  const handleOrderThis = () => {
    setActiveModal('order');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl glass-card bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              Mã: {selectedTemplate.code}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400">
              {selectedTemplate.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Sao chép liên kết mẫu"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(selectedTemplate.id)}
              className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Yêu thích"
            >
              <Heart
                className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery Left */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                <img
                  src={images[activeImgIdx] || selectedTemplate.previewUrl}
                  alt={selectedTemplate.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-mono text-white">
                  Độ phân giải siêu nét HD
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImgIdx === idx
                          ? 'border-blue-600 scale-102'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Right */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedTemplate.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Specs Table */}
              <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" /> Kích thước:
                  </span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {selectedTemplate.dimensions}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Định dạng bàn giao:
                  </span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {selectedTemplate.formats}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Lượt tải tham khảo:
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {selectedTemplate.downloadsCount} lượt
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Giá tham khảo dịch vụ:</span>
                  <span className="font-heading font-extrabold text-base text-blue-600 dark:text-cyan-400">
                    {selectedTemplate.priceRef.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Thẻ phân loại:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <button
                  onClick={handleOrderThis}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Đặt thiết kế tương tự mẫu này ({selectedTemplate.priceRef.toLocaleString('vi-VN')} đ)</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  ✓ Tùy chỉnh màu sắc, hình ảnh & nội dung theo thương hiệu riêng của bạn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
