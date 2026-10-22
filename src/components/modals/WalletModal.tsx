import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Check,
  Copy,
  Clock,
  ArrowRight,
  ShieldCheck,
  History,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export const WalletModal: React.FC = () => {
  const {
    currentUser,
    activeModal,
    setActiveModal,
    requestDeposit,
    transactions,
    approveDeposit,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit');
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSuccessNotif, setIsSuccessNotif] = useState(false);
  const [createdTxCode, setCreatedTxCode] = useState<string | null>(null);

  if (activeModal !== 'wallet') return null;

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  const effectiveAmount = customAmount ? parseInt(customAmount, 10) || selectedAmount : selectedAmount;

  const bankAccount = '0987654321';
  const bankName = 'MB Bank (Ngân hàng Quân Đội)';
  const accountOwner = 'CONG TY CP THIET KE INET24H';
  const transferSyntax = `INET24H ${currentUser.id.slice(-6).toUpperCase()} ${Math.floor(effectiveAmount / 1000)}K`;

  // Dynamic VietQR standard URL
  const vietQrUrl = `https://img.vietqr.io/image/MB-${bankAccount}-compact2.png?amount=${effectiveAmount}&addInfo=${encodeURIComponent(
    transferSyntax
  )}&accountName=${encodeURIComponent(accountOwner)}`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmTransfer = () => {
    const res = requestDeposit(effectiveAmount, 'vietqr');
    setCreatedTxCode(res.txCode);
    setIsSuccessNotif(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const userTxs = transactions.filter((t) => t.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl glass-card bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Ví tiền & Nạp VND trực tuyến
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Số dư hiện tại:{' '}
                <strong className="text-blue-600 dark:text-cyan-400 font-bold">
                  {currentUser.walletBalance.toLocaleString('vi-VN')} đ
                </strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'deposit' ? 'history' : 'deposit')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {activeTab === 'deposit' ? 'Lịch sử nạp' : 'Nạp tiền'}
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'deposit' ? (
            <>
              {isSuccessNotif ? (
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-emerald-900 dark:text-emerald-300">
                    Đã ghi nhận yêu cầu nạp tiền!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 max-w-md mx-auto">
                    Mã giao dịch: <strong>{createdTxCode}</strong>. Hệ thống tự động kiểm tra sao kê ngân hàng và cộng tiền vào ví trong vòng 1-3 phút.
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    {/* Simulated Instant Test Button */}
                    <button
                      onClick={() => {
                        const target = transactions.find((t) => t.txCode === createdTxCode);
                        if (target) {
                          approveDeposit(target.id);
                          setIsSuccessNotif(false);
                          setActiveModal(null);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      ✓ Duyệt ngay (Mô phỏng ngân hàng thành công)
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold"
                    >
                      Xem lịch sử giao dịch
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Quick Amount Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  1. Chọn số tiền cần nạp
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {quickAmounts.map((amt) => {
                    const isSelected = selectedAmount === amt && !customAmount;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {amt.toLocaleString('vi-VN')} đ
                      </button>
                    );
                  })}
                </div>

                {/* Custom amount */}
                <div className="mt-3">
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Hoặc nhập số tiền khác (tối thiểu 20.000đ)..."
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      VND
                    </span>
                  </div>
                </div>
              </div>

              {/* VietQR & Transfer Info Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  2. Quét mã VietQR hoặc chuyển khoản
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  {/* QR Image */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                    <img
                      src={vietQrUrl}
                      alt="VietQR MB Bank"
                      className="w-48 h-auto object-contain rounded-lg"
                      onError={(e) => {
                        // Fallback placeholder if offline
                        (e.target as HTMLImageElement).src =
                          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
                          encodeURIComponent(transferSyntax);
                      }}
                    />
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-2">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Quét bằng mọi ứng dụng ngân hàng</span>
                    </div>
                  </div>

                  {/* Account details */}
                  <div className="sm:col-span-7 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Ngân hàng thụ hưởng:</span>
                      <strong className="text-slate-800 dark:text-slate-100 font-bold text-sm">
                        {bankName}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Số tài khoản:</span>
                      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 mt-0.5">
                        <span className="font-mono font-bold text-sm text-blue-600 dark:text-cyan-400">
                          {bankAccount}
                        </span>
                        <button
                          onClick={() => copyToClipboard(bankAccount, 'stk')}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400"
                        >
                          {copiedField === 'stk' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'stk' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Chủ tài khoản:</span>
                      <strong className="text-slate-800 dark:text-slate-100 font-bold">
                        {accountOwner}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Số tiền nạp:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        {effectiveAmount.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        Nội dung chuyển khoản (bắt buộc):
                      </span>
                      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-amber-300 dark:border-amber-700/60 mt-0.5">
                        <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400 truncate">
                          {transferSyntax}
                        </span>
                        <button
                          onClick={() => copyToClipboard(transferSyntax, 'syntax')}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-amber-600 shrink-0 ml-2"
                        >
                          {copiedField === 'syntax' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'syntax' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                        * Giữ nguyên nội dung chuyển khoản để hệ thống tự động nhận diện và cộng tiền.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleConfirmTransfer}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tôi đã chuyển {effectiveAmount.toLocaleString('vi-VN')} đ - Xác nhận ngay</span>
                </button>
              </div>
            </>
          ) : (
            /* Transaction history view */
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">
                Lịch sử nạp và thanh toán ví của bạn
              </h4>
              {userTxs.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">Chưa có giao dịch nào.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  {userTxs.map((tx) => (
                    <div key={tx.id} className="p-3.5 bg-white dark:bg-slate-900/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {tx.txCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : tx.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {tx.status === 'completed'
                              ? 'Thành công'
                              : tx.status === 'pending'
                              ? 'Chờ xác nhận'
                              : 'Thất bại'}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{tx.description}</p>
                        <span className="text-[10px] text-slate-400">{tx.createdAt}</span>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-bold text-sm ${
                            tx.type === 'deposit'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {tx.type === 'deposit' ? '+' : '-'}
                          {tx.amount.toLocaleString('vi-VN')} đ
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Ví sau GD: {tx.balanceAfter.toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
