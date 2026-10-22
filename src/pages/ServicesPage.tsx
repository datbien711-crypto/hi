import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Check,
  Clock,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';

export const ServicesPage: React.FC = () => {
  const { services, setSelectedService, setActiveModal } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>('Tất cả');

  const categories = [
    'Tất cả',
    'Banner',
    'Logo',
    'Avatar',
    'Thumbnail',
    'Poster',
    'Menu',
    'Game',
    'Custom',
  ];

  const filteredServices =
    selectedCat === 'Tất cả'
      ? services
      : services.filter((s) => s.category === selectedCat);

  const handleOrderService = (srv: ServiceItem) => {
    setSelectedService(srv);
    setActiveModal('order');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Danh mục dịch vụ đa dạng</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Dịch vụ thiết kế ảnh theo yêu cầu
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Đội ngũ designer chuyên nghiệp tại INET24H luôn sẵn sàng đáp ứng mọi nhu cầu đồ họa từ ấn phẩm truyền thông mạng xã hội, bộ nhận diện doanh nghiệp đến hình ảnh thương mại điện tử.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCat === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="group rounded-3xl glass-card overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative aspect-[16/8] overflow-hidden bg-slate-900">
                <img
                  src={srv.bannerImage}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 uppercase">
                      {srv.category}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-white mt-1">
                      {srv.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-300 block">Giá từ</span>
                    <strong className="text-cyan-400 font-extrabold text-lg">
                      {srv.basePrice.toLocaleString('vi-VN')} đ
                    </strong>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {srv.fullDesc}
                </p>

                {/* Packages inside service */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Các gói tùy chọn:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {srv.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 mb-1">
                            <span>{pkg.name}</span>
                            <span className="text-blue-600 dark:text-cyan-400">
                              {pkg.price.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{pkg.turnaround} • {pkg.revisions} lần sửa</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-6 pt-0">
              <button
                onClick={() => handleOrderService(srv)}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span>Đặt thiết kế dịch vụ này ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
