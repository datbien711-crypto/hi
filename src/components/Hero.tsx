import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Clock,
  DownloadCloud,
  Layers,
  Image as ImageIcon,
  Flame,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Hero: React.FC<{ onCategorySelect: (cat: string) => void }> = ({ onCategorySelect }) => {
  const { setActiveModal, setActiveTab } = useApp();

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
      {/* Background radial gradients for tech aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-linear-to-b from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 shadow-2xs">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Thiết kế chuyên nghiệp 24/7</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              THIẾT KẾ ẢNH ONLINE <br />
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-400 bg-clip-text text-transparent">
                CHỈ TRONG VÀI PHÚT
              </span>
            </h1>

            {/* Subtitle */}
            <div className="space-y-2 text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Banner • Logo • Avatar • Poster • Ảnh bìa • Menu • Ảnh shop
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                Kho mẫu đa dạng - Dễ sử dụng - Xuất ảnh chất lượng cao - Hỗ trợ chỉnh sửa tận tâm
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveModal('order')}
                className="group px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2.5 transition-all"
              >
                <span>Đặt thiết kế ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all shadow-2xs"
              >
                <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Xem mẫu thiết kế</span>
              </button>
            </div>

            {/* Guarantee metrics */}
            <div className="flex items-center gap-6 pt-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold text-base">★★★★★</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">4.9/5</span> (1,840+ đánh giá)
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Bàn giao file từ <strong>4 - 12 giờ</strong></span>
              </div>
            </div>
          </div>

          {/* Right Hero Illustration: Creative Tech Studio Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1.5 bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>

              {/* Main Card with Studio Scene */}
              <div className="relative rounded-2xl overflow-hidden glass-card shadow-2xl border border-white/20 dark:border-slate-700/60 p-3 sm:p-4 bg-gradient-to-b from-white/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-950/90">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
                    alt="Creative Design Workspace"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Overlaid software interface mockups */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase">
                        Active Workspace
                      </span>
                      <span className="text-xs text-cyan-300 font-mono">1920 × 1080 • CMYK 300DPI</span>
                    </div>
                    <h3 className="text-white font-bold text-lg leading-snug">
                      Đồ họa chất lượng cao cho mọi kênh truyền thông
                    </h3>
                    <p className="text-slate-300 text-xs mt-1">
                      Photoshop (PSD) • Illustrator (AI/Vector) • Sẵn sàng in ấn
                    </p>
                  </div>

                  {/* Floating Badges like in Screenshot 1 */}
                  <div className="absolute top-4 right-4 bg-blue-950/90 border border-blue-400/40 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">Ps</span>
                    <span>Photoshop HD</span>
                  </div>

                  <div className="absolute top-16 right-4 bg-amber-950/90 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-5 h-5 rounded bg-amber-600 text-white flex items-center justify-center text-[10px]">Ai</span>
                    <span>Vector File</span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-purple-950/90 border border-purple-500/40 text-purple-300 px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Layered Source</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Benefit Cards (Matching Screenshot 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 sm:mt-16">
          {[
            {
              icon: CheckCircle2,
              title: 'Thiết kế theo yêu cầu',
              desc: 'Đúng ý, đúng nhu cầu doanh nghiệp',
              color: 'text-blue-500 bg-blue-500/10',
            },
            {
              icon: ShieldCheck,
              title: 'Báo giá minh bạch',
              desc: 'Không phát sinh chi phí ẩn',
              color: 'text-cyan-500 bg-cyan-500/10',
            },
            {
              icon: Clock,
              title: 'Chỉnh sửa theo gói',
              desc: 'Hỗ trợ đến khi bạn hài lòng',
              color: 'text-indigo-500 bg-indigo-500/10',
            },
            {
              icon: DownloadCloud,
              title: 'Giao file trực tuyến',
              desc: 'Nhanh chóng, an toàn và lưu trữ 24/7',
              color: 'text-emerald-500 bg-emerald-500/10',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Category Bar (Matching Screenshot 1 bottom) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {[
            { cat: 'Banner', label: 'Banner', sub: 'Ảnh bìa, quảng cáo', icon: '🖼️' },
            { cat: 'Logo', label: 'Logo', sub: 'Thương hiệu, shop', icon: '✨' },
            { cat: 'Avatar', label: 'Avatar', sub: 'Facebook, Zalo, TikTok', icon: '👤' },
            { cat: 'Poster', label: 'Poster', sub: 'Sự kiện, khuyến mãi', icon: '📢' },
            { cat: 'Menu', label: 'Menu', sub: 'Quán ăn, cafe', icon: '🍴' },
            { cat: 'Thumbnail', label: 'Thumbnail', sub: 'YouTube, TikTok', icon: '🎬' },
          ].map((c) => (
            <button
              key={c.cat}
              onClick={() => onCategorySelect(c.cat)}
              className="glass-card p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 text-left transition-all hover:scale-102 group cursor-pointer"
            >
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{c.icon}</div>
              <div className="font-heading font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                {c.label}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{c.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
