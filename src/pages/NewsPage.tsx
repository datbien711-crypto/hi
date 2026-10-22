import React, { useState } from 'react';
import { Sparkles, Calendar, User, Eye, ArrowRight, Tag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewsPost } from '../types';

export const NewsPage: React.FC = () => {
  const { news } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<NewsPost | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kiến thức & Xu hướng</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Tin tức & Cẩm nang thiết kế đồ họa
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cập nhật kích thước chuẩn mạng xã hội, mẹo tối ưu thumbnail và xu hướng đồ họa thương mại mới nhất.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedArticle(post)}
            className="group rounded-3xl glass-card overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {post.views} lượt xem
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-cyan-400">
              <span>Đọc tiếp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl glass-card bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-600 uppercase">{selectedArticle.category}</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="aspect-[16/8] rounded-2xl overflow-hidden bg-slate-900">
                <img src={selectedArticle.thumbnail} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>

              <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span>Tác giả: <strong>{selectedArticle.author}</strong></span>
                <span>Ngày: {selectedArticle.date}</span>
                <span>{selectedArticle.views} lượt xem</span>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                {selectedArticle.content}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {selectedArticle.tags.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
