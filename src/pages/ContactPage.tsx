import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Thời gian hoàn thành một đơn thiết kế mất bao lâu?',
      a: 'Tùy theo gói dịch vụ bạn lựa chọn, thời gian bàn giao bản demo đầu tiên dao động từ 4 - 6 giờ (gói hỏa tốc) đến 12 - 24 giờ (gói cơ bản & tiêu chuẩn).',
    },
    {
      q: 'Tôi có thể yêu cầu chỉnh sửa bao nhiêu lần?',
      a: 'Mỗi gói thiết kế quy định rõ số lượt chỉnh sửa (từ 2 lần đến không giới hạn đối với gói Pro và VIP). Đội ngũ thiết kế sẽ hỗ trợ sửa đổi theo đúng yêu cầu chi tiết của bạn.',
    },
    {
      q: 'File thiết kế bàn giao gồm những định dạng nào?',
      a: 'Sau khi bạn duyệt thiết kế, hệ thống sẽ bàn giao tệp chất lượng cao gồm: JPG/PNG độ phân giải cao, file gốc Photoshop (PSD) có đầy đủ layer, hoặc file Vector Illustrator (AI/EPS) chuẩn in ấn.',
    },
    {
      q: 'Hình thức nạp tiền vào ví hoạt động như thế nào?',
      a: 'Hệ thống hỗ trợ quét mã VietQR ngân hàng Quân Đội (MB Bank). Bạn chỉ cần mở app ngân hàng quét mã, tiền sẽ được cập nhật tự động vào ví trong vòng 1-3 phút.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Liên hệ & Hỗ trợ khách hàng 24/7
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Đội ngũ tư vấn viên và chuyên viên đồ họa của INET24H luôn túc trực hỗ trợ bạn mọi lúc.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Thông tin liên hệ trực tiếp
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Hotline hỗ trợ 24/7:</span>
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">
                    0987 654 321
                  </strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">Hỗ trợ tiếp nhận đơn gấp & tư vấn kỹ thuật</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Hòm thư điện tử:</span>
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">
                    support@inet24h.com
                  </strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">Phản hồi giải đáp trong vòng 15 phút</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Địa chỉ văn phòng:</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    Tòa nhà Sáng Tạo Công Nghệ, Phố Duy Tân, Quận Cầu Giấy, Hà Nội
                  </strong>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Thời gian làm việc:</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    24 giờ / 7 ngày trong tuần (Kể cả ngày lễ & Chủ nhật)
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-5">
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Gửi yêu cầu tư vấn báo giá riêng
          </h3>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                Đã gửi yêu cầu thành công!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Chuyên viên INET24H sẽ liên hệ lại qua số điện thoại hoặc Zalo trong vòng 15 phút.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 block mb-1 font-semibold">
                    Họ và tên của bạn:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 block mb-1 font-semibold">
                    Số điện thoại / Zalo:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0988 123 456"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 block mb-1 font-semibold">
                  Hạng mục cần thiết kế:
                </label>
                <select className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
                  <option>Banner quảng cáo đa nền tảng</option>
                  <option>Logo thương hiệu & Bộ nhận diện</option>
                  <option>Thumbnail YouTube & Video Cover</option>
                  <option>Poster sự kiện & Khai trương</option>
                  <option>Banner Shop Game / Streamer</option>
                  <option>Menu quán ăn / Cafe</option>
                  <option>Ấn phẩm theo yêu cầu riêng</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 block mb-1 font-semibold">
                  Nội dung chi tiết yêu cầu:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Mô tả ý tưởng, kích thước hoặc mong muốn của bạn..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Gửi thông tin tư vấn ngay</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
            Câu hỏi thường gặp (FAQ)
          </h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
