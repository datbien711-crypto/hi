import React, { useState } from 'react';
import {
  Search,
  Eye,
  Sparkles,
  Heart,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DesignTemplate } from '../types';

export const ShowcaseGrid: React.FC<{
  initialCategory?: string;
  showAll?: boolean;
}> = ({ initialCategory = 'Tất cả', showAll = false }) => {
  const {
    templates,
    favorites,
    toggleFavorite,
    setSelectedTemplate,
    setActiveModal,
    setActiveTab,
  } = useApp();

  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Tất cả', 'Banner', 'Logo', 'Avatar', 'Poster', 'Menu', 'Thumbnail', 'Game'];

  const filtered = templates.filter((item) => {
    const matchCategory = selectedCat === 'Tất cả' || item.category === selectedCat;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const displayedTemplates = showAll ? filtered : filtered.slice(0, 6);

  const handleViewDetail = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setActiveModal('template_detail');
  };

  const handleOrderSimilar = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setActiveModal('order');
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Kho ảnh mẫu thực tế</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Mẫu thiết kế nổi bật
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Các sản phẩm đã thực hiện thực tế với chất lượng cao nhất cho khách hàng
            </p>
          </div>

          {!showAll && (
            <button
              onClick={() => setActiveTab('templates')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              <span>Xem tất cả mẫu ({templates.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Bar & Search (Exact design from Screenshot 2) */}
        <div className="glass-card p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-400 dark:text-slate-500 mr-2 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Phân loại:
            </span>
            {categories.map((cat) => {
              const active = selectedCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã mẫu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid (Matching Screenshot 2 Cards) */}
        {displayedTemplates.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Không tìm thấy mẫu thiết kế phù hợp với từ khóa "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSelectedCat('Tất cả');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTemplates.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl glass-card overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  {/* Image preview with badges */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden cursor-pointer" onClick={() => handleViewDetail(item)}>
                    <img
                      src={item.previewUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient top bar */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/70 to-transparent pointer-events-none" />

                    {/* Code badge (Left) */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-white/10">
                      Mã: {item.code}
                    </div>

                    {/* Category badge (Right) */}
                    <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                      {item.category}
                    </div>

                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-transform active:scale-90"
                      title="Lưu mẫu yêu thích"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => handleViewDetail(item)}
                        className="font-heading font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer line-clamp-1 transition-colors"
                      >
                        {item.title}
                      </h3>

                      {/* Technical Specs matching Screenshot 2 */}
                      <div className="mt-3 space-y-1.5 text-xs border-y border-slate-100 dark:border-slate-800/80 py-2.5 text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 dark:text-slate-500">Kích thước:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{item.dimensions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 dark:text-slate-500">Định dạng:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{item.formats}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2 Action Buttons (Exact style from Screenshot 2) */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
                      <button
                        onClick={() => handleViewDetail(item)}
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>

                      <button
                        onClick={() => handleOrderSimilar(item)}
                        className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Đặt tương tự</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
