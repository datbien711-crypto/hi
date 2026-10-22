import React, { useState } from 'react';
import {
  User,
  Wallet,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Heart,
  CreditCard,
  Lock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    orders,
    transactions,
    templates,
    favorites,
    setActiveModal,
    setSelectedOrder,
    setSelectedTemplate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'transactions' | 'favorites' | 'settings'>('orders');

  const myOrders = orders.filter((o) => o.customerId === currentUser.id);
  const myTransactions = transactions.filter((t) => t.userId === currentUser.id);
  const favoriteTemplates = templates.filter((t) => favorites.includes(t.id));

  const inProgressOrders = myOrders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = myOrders.filter((o) => o.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-purple-600/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <span className="p-1 rounded-full text-emerald-500" title="Tài khoản đã xác minh">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {currentUser.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {currentUser.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet card widget */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                Số dư khả dụng trong ví
              </span>
              <span className="font-heading font-extrabold text-2xl text-blue-600 dark:text-cyan-400">
                {currentUser.walletBalance.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <button
              onClick={() => setActiveModal('wallet')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Nạp tiền VietQR</span>
            </button>
          </div>
        </div>

        {/* 4 Fast Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">Tổng số đơn đã đặt:</span>
            <strong className="text-lg font-heading font-bold text-slate-900 dark:text-white">
              {myOrders.length} Đơn
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">Đơn đang xử lý:</span>
            <strong className="text-lg font-heading font-bold text-blue-600 dark:text-cyan-400">
              {inProgressOrders.length} Đơn
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">Đơn đã hoàn thành:</span>
            <strong className="text-lg font-heading font-bold text-emerald-600 dark:text-emerald-400">
              {completedOrders.length} Đơn
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">Tổng chi tiêu thiết kế:</span>
            <strong className="text-lg font-heading font-bold text-slate-900 dark:text-white">
              {currentUser.totalSpent.toLocaleString('vi-VN')} đ
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto pb-1">
        {[
          { id: 'orders', label: `Đơn thiết kế của tôi (${myOrders.length})`, icon: ShoppingBag },
          { id: 'transactions', label: `Lịch sử ví & Nạp tiền (${myTransactions.length})`, icon: Wallet },
          { id: 'favorites', label: `Mẫu yêu thích (${favoriteTemplates.length})`, icon: Heart },
          { id: 'settings', label: 'Cài đặt tài khoản', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Danh sách đơn đặt thiết kế
            </h3>
            <button
              onClick={() => setActiveModal('order')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Đặt thêm thiết kế</span>
            </button>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-slate-500 text-sm">Bạn chưa có đơn hàng nào.</p>
              <button
                onClick={() => setActiveModal('order')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Đặt thiết kế đầu tiên ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">
                        {ord.orderCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : ord.status === 'waiting_approval'
                            ? 'bg-purple-500/10 text-purple-500'
                            : ord.status === 'revision_requested'
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {ord.status === 'completed'
                          ? 'Đã hoàn thành'
                          : ord.status === 'waiting_approval'
                          ? 'Chờ bạn duyệt demo'
                          : ord.status === 'revision_requested'
                          ? 'Đang chỉnh sửa'
                          : 'Đang thiết kế'}
                      </span>
                      <span className="text-slate-400">• {ord.createdAt}</span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                      {ord.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>Dịch vụ: <strong>{ord.serviceName}</strong></span>
                      <span>•</span>
                      <span>Designer: <strong className="text-slate-700 dark:text-slate-300">{ord.assignedDesignerName || 'Đang phân công'}</strong></span>
                      <span>•</span>
                      <span>Giá: <strong className="text-slate-900 dark:text-white">{ord.price.toLocaleString('vi-VN')} đ</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setActiveModal('order_detail');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Xem tiến độ & Trao đổi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Transactions */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Biến động số dư tài khoản
            </h3>
            <button
              onClick={() => setActiveModal('wallet')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
            >
              + Nạp thêm tiền
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden glass-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3.5">Mã GD</th>
                  <th className="p-3.5">Mô tả giao dịch</th>
                  <th className="p-3.5">Số tiền</th>
                  <th className="p-3.5">Số dư sau GD</th>
                  <th className="p-3.5">Thời gian</th>
                  <th className="p-3.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono font-bold">{tx.txCode}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{tx.description}</td>
                    <td
                      className={`p-3.5 font-bold ${
                        tx.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {tx.type === 'deposit' ? '+' : '-'}
                      {tx.amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-3.5 text-slate-500">{tx.balanceAfter.toLocaleString('vi-VN')} đ</td>
                    <td className="p-3.5 text-slate-400">{tx.createdAt}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          tx.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {tx.status === 'completed' ? 'Thành công' : 'Chờ xử lý'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            Mẫu thiết kế bạn đã lưu
          </h3>

          {favoriteTemplates.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-xs text-slate-500">Bạn chưa lưu mẫu thiết kế nào vào danh sách yêu thích.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTemplates.map((t) => (
                <div key={t.id} className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900">
                    <img src={t.previewUrl} alt={t.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{t.title}</h4>
                    <span className="text-[11px] text-blue-600 font-bold block mt-1">
                      {t.priceRef.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTemplate(t);
                      setActiveModal('template_detail');
                    }}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-xl p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
            Cập nhật thông tin cá nhân
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-slate-500 block mb-1">Họ và tên:</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Số điện thoại Zalo:</label>
              <input
                type="text"
                defaultValue={currentUser.phone}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Email đăng ký:</label>
              <input
                type="email"
                disabled
                defaultValue={currentUser.email}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert('Thông tin cá nhân đã được lưu thành công!')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Lưu thay đổi
          </button>
        </div>
      )}
    </div>
  );
};
