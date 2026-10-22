import React from 'react';
import { Check, Star, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PricingSection: React.FC = () => {
  const { setActiveModal, setSelectedService, services } = useApp();

  const tiers = [
    {
      id: 'tier_basic',
      name: 'Gói cơ bản',
      subtitle: 'Phù hợp cho cá nhân cần 1 ảnh truyền thông mạng xã hội nhanh gọn.',
      price: '50.000đ',
      unit: '/lần',
      features: [
        'Thiết kế 1 ảnh / banner theo mẫu',
        'Chỉnh sửa tối đa 2 lần',
        'File JPG/PNG chất lượng cao',
        'Tối ưu kích thước chuẩn MXH',
      ],
      turnaround: '12 - 24 giờ',
      isPopular: false,
    },
    {
      id: 'tier_advanced',
      name: 'Gói nâng cao',
      subtitle: 'Lựa chọn phổ biến nhất cho shop bán hàng và doanh nghiệp nhỏ.',
      price: '100.000đ',
      unit: '/lần',
      features: [
        'Thiết kế 1-3 ảnh / banner đồng bộ',
        'Chỉnh sửa tối đa 5 lần',
        'File PSD gốc + JPG/PNG HD',
        'Tặng kèm mockup xem trước 3D',
      ],
      turnaround: '8 - 16 giờ',
      isPopular: true,
    },
    {
      id: 'tier_pro',
      name: 'Gói Pro',
      subtitle: 'Thiết kế không giới hạn trong ngày cho các chiến dịch ra mắt sản phẩm.',
      price: '200.000đ',
      unit: '/ngày',
      features: [
        'Thiết kế không giới hạn 1 ngày',
        'Chỉnh sửa không giới hạn đến khi duyệt',
        'Toàn bộ file gốc vector + fonts',
        'Ưu tiên hỗ trợ trực tiếp 1:1',
      ],
      turnaround: 'Ưu tiên hỏa tốc',
      isPopular: false,
    },
    {
      id: 'tier_enterprise',
      name: 'Gói doanh nghiệp',
      subtitle: 'Giải pháp toàn diện đồng hành thương hiệu với hợp đồng bảo chứng.',
      price: '500.000đ',
      unit: '/tháng',
      features: [
        'Tư vấn riêng, thiết kế theo yêu cầu',
        'Ưu tiên xử lý đơn hàng hàng đầu',
        'Hỗ trợ đồng hành 1 - 3 tháng',
        'Bàn giao trọn bộ Brand Guidelines',
      ],
      turnaround: 'Chuyên viên riêng',
      isPopular: false,
    },
  ];

  const handleRegisterTier = (tierName: string) => {
    // Select first matching banner/custom service
    const defaultSrv = services[0];
    setSelectedService(defaultSrv);
    setActiveModal('order');
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-100/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Bảng giá dịch vụ
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Chọn gói phù hợp với nhu cầu của bạn - Minh bạch, không phát sinh chi phí
            </p>
          </div>

          <button
            onClick={() => {
              const defaultSrv = services[0];
              setSelectedService(defaultSrv);
              setActiveModal('order');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline"
          >
            <span>Đặt dịch vụ ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Grid (Matching Screenshot 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {tiers.map((tier) => {
            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-6 glass-card flex flex-col justify-between transition-all duration-300 ${
                  tier.isPopular
                    ? 'border-2 border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-500/10 -translate-y-1'
                    : 'border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md'
                }`}
              >
                {/* Popular Pill Badge on top */}
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Phổ biến nhất</span>
                  </div>
                )}

                <div>
                  {/* Title & subtitle */}
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[36px] line-clamp-2">
                    {tier.subtitle}
                  </p>

                  {/* Price display */}
                  <div className="mt-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {tier.unit}
                    </span>
                  </div>

                  {/* Checklist */}
                  <ul className="mt-5 space-y-3">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <div className="p-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 mt-0.5 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer with Turnaround and Action Button */}
                <div className="mt-8 pt-4 space-y-3">
                  <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Thời gian thực hiện: <strong>{tier.turnaround}</strong></span>
                  </div>

                  <button
                    onClick={() => handleRegisterTier(tier.name)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                      tier.isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-98'
                        : 'border border-blue-600/30 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                    }`}
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
