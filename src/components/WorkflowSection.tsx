import React from 'react';
import {
  Palette,
  FileText,
  CreditCard,
  Activity,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WorkflowSection: React.FC = () => {
  const { setActiveModal } = useApp();

  const steps = [
    {
      num: 1,
      icon: Palette,
      title: 'Chọn mẫu / dịch vụ',
      desc: 'Tham khảo kho mẫu phong phú hoặc chọn phân loại thiết kế theo đúng mục tiêu kinh doanh.',
    },
    {
      num: 2,
      icon: FileText,
      title: 'Gửi nội dung & yêu cầu',
      desc: 'Cung cấp văn bản, thông số kích thước, màu sắc mong muốn hoặc ảnh mẫu tham khảo kèm theo.',
    },
    {
      num: 3,
      icon: CreditCard,
      title: 'Xác nhận & thanh toán',
      desc: 'Báo giá rõ ràng, trừ trực tiếp từ số dư ví VND một cách an toàn, minh bạch và tự động.',
    },
    {
      num: 4,
      icon: Activity,
      title: 'Theo dõi tiến độ',
      desc: 'Nhận bản demo thiết kế sơ bộ và yêu cầu chỉnh sửa trực tiếp qua khung trao đổi trực tuyến.',
    },
    {
      num: 5,
      icon: Download,
      title: 'Nhận file & hoàn tất',
      desc: 'Tải file gốc chất lượng cao (JPG, PNG, PSD, AI) chuẩn in ấn và truyền thông mạng xã hội.',
    },
  ];

  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Quy trình làm việc 5 bước chuyên nghiệp
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Tối ưu hóa thời gian xử lý đơn hàng, minh bạch từng khâu từ tiếp nhận đến bàn giao file
          </p>
        </div>

        {/* 5 Cards Row (Matching Screenshot 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl p-5 glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Top: Step Number and next arrow */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-blue-500/30">
                      {step.num}
                    </div>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 hidden lg:block group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className="mb-3 text-blue-600 dark:text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout Banner (Matching Screenshot 4) */}
        <div className="mt-12 rounded-2xl glass-card border border-blue-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-purple-600/5">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Bạn đã có ý tưởng thiết kế riêng cho thương hiệu của mình?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Đội ngũ thiết kế của INET24H luôn sẵn sàng hỗ trợ chỉ trong 15 - 30 phút.
            </p>
          </div>

          <button
            onClick={() => setActiveModal('order')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 shrink-0 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bắt đầu thiết kế ngay</span>
          </button>
        </div>
      </div>
    </section>
  );
};
