import React from 'react';
import { Phone, Mail, MapPin, Download, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setActiveModal, setPolicyType } = useApp();

  const openPolicy = (type: 'privacy' | 'terms' | 'refund') => {
    setPolicyType(type);
    setActiveModal('policy');
  };

  return (
    <footer className="bg-[#0b1324] text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold">
                <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
              </div>
              <span className="font-heading text-xl font-extrabold text-white tracking-tight">
                INET<span className="text-cyan-400">24H</span>.COM
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Thiết kế ảnh online - Nhanh chóng - Chuyên nghiệp. Nền tảng dịch vụ thiết kế đồ họa thương mại hàng đầu với kho mẫu đa dạng và đội ngũ hỗ trợ tận tâm 24/7.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật dữ liệu & Bản quyền thiết kế 100%</span>
            </div>
          </div>

          {/* Col 2: Contact */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Liên hệ
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Hotline: <strong className="text-white">0987 654 321</strong> (24/7)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Email: <a href="mailto:support@inet24h.com" className="text-slate-300 hover:text-cyan-400">support@inet24h.com</a></span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Địa chỉ: Tòa nhà Công Nghệ, Quận Cầu Giấy, Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Policies */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => openPolicy('privacy')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  • Chính sách bảo mật thông tin
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('terms')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  • Điều khoản sử dụng dịch vụ
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('refund')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  • Chính sách hoàn tiền & chỉnh sửa
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  • Bảng giá niêm yết
                </button>
              </li>
              <li>
                <div className="flex flex-col gap-1.5 pt-1">
                  <a
                    href="/inet24h_cpanel_source.zip"
                    download="inet24h_cpanel_source.zip"
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải trọn bộ .ZIP cPanel (PHP 7.4 + SQL)</span>
                  </a>
                  <button
                    onClick={() => setActiveModal('cpanel_export')}
                    className="text-slate-400 hover:text-slate-300 text-left text-[11px]"
                  >
                    • Xem hướng dẫn & chi tiết mã nguồn
                  </button>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Social media */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Kết nối với chúng tôi
            </h4>
            <div className="flex items-center gap-2">
              {['Facebook', 'YouTube', 'TikTok', 'Zalo'].map((network) => (
                <div
                  key={network}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-[11px] cursor-pointer transition-all"
                  title={network}
                >
                  {network[0]}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-xs leading-relaxed pt-1">
              Nhận thông báo ưu đãi và các gói thiết kế mới nhất qua các kênh truyền thông chính thức.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
          <div>
            © 2026 <strong>INET24H.COM</strong>. Tất cả quyền được bảo lưu. Nền tảng dịch vụ thiết kế ảnh trực tuyến.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => openPolicy('privacy')} className="hover:text-slate-300">
              Bảo mật
            </button>
            <span>•</span>
            <button onClick={() => openPolicy('terms')} className="hover:text-slate-300">
              Điều khoản
            </button>
            <span>•</span>
            <button onClick={() => openPolicy('refund')} className="hover:text-slate-300">
              Hoàn tiền
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
