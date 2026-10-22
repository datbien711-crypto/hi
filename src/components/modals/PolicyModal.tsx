import React from 'react';
import { X, ShieldCheck, FileText, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PolicyModal: React.FC = () => {
  const { activeModal, setActiveModal, policyType } = useApp();

  if (activeModal !== 'policy' || !policyType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl glass-card bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            {policyType === 'privacy' && <ShieldCheck className="w-5 h-5 text-blue-600" />}
            {policyType === 'terms' && <FileText className="w-5 h-5 text-purple-600" />}
            {policyType === 'refund' && <RotateCcw className="w-5 h-5 text-emerald-600" />}
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              {policyType === 'privacy' && 'Chính sách bảo mật thông tin'}
              {policyType === 'terms' && 'Điều khoản sử dụng dịch vụ'}
              {policyType === 'refund' && 'Chính sách hoàn tiền & chỉnh sửa thiết kế'}
            </h3>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {policyType === 'privacy' && (
            <>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">1. Mục đích thu thập thông tin</h4>
              <p>
                INET24H.COM thu thập email, số điện thoại và tư liệu thiết kế chỉ nhằm phục vụ quá trình trao đổi đơn hàng, bàn giao file gốc và xác nhận giao dịch ví tiền an toàn.
              </p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">2. Quyền sở hữu trí tuệ</h4>
              <p>
                Mọi ấn phẩm sau khi được thanh toán và bàn giao file gốc đều thuộc 100% quyền sở hữu thương mại của khách hàng. INET24H cam kết không tái bán tác phẩm cho bên thứ ba.
              </p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">3. Bảo mật giao dịch & tài khoản</h4>
              <p>
                Số dư ví và lịch sử nạp được lưu trữ an toàn bằng chuẩn mã hóa Prepared Statements. Mọi giao dịch nạp tiền đều yêu cầu xác thực đối soát độc lập chống gian lận.
              </p>
            </>
          )}

          {policyType === 'terms' && (
            <>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">1. Quy định đặt hàng</h4>
              <p>
                Khách hàng cung cấp thông tin văn bản, thông số kích thước và tư liệu chính xác. Đơn hàng chỉ bắt đầu thực hiện sau khi khách hàng xác nhận trừ ví hoặc hoàn tất đặt cọc.
              </p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">2. Trách nhiệm của nhân viên thiết kế</h4>
              <p>
                Designer có nghĩa vụ bàn giao bản phác thảo demo đúng deadline cam kết trong từng gói dịch vụ (từ 4 - 24 giờ). Các bản demo hiển thị watermark để bảo vệ bản quyền sơ bộ.
              </p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">3. Giới hạn bản quyền hình ảnh</h4>
              <p>
                Khách hàng chịu trách nhiệm về tính pháp lý của hình ảnh, logo cá nhân cung cấp cho designer để thực hiện ấn phẩm.
              </p>
            </>
          )}

          {policyType === 'refund' && (
            <>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">1. Chính sách chỉnh sửa theo gói</h4>
              <p>
                Mỗi đơn hàng được hỗ trợ số lần chỉnh sửa theo gói dịch vụ đã chọn (từ 2 lần đến không giới hạn). Designer tiếp nhận phản hồi và gửi lại bản demo trong vòng 4-8 giờ làm việc.
              </p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">2. Điều kiện hoàn tiền vào ví</h4>
              <p>
                Khách hàng có quyền yêu cầu hoàn tiền 100% vào số dư ví INET24H nếu:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Designer chậm deadline quá 24 giờ mà không có thông báo chính đáng.</li>
                <li>Bản thiết kế demo không đúng 100% so với mô tả ban đầu và khách hàng chưa sử dụng bất kỳ lượt chỉnh sửa nào.</li>
              </ul>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">3. Quy trình hoàn tiền</h4>
              <p>
                Admin sẽ tiếp nhận khiếu nại, đối soát nhật ký trao đổi và xử lý hoàn tiền trực tiếp vào tài khoản ví trong vòng 1-2 giờ làm việc.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
