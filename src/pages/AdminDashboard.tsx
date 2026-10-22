import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  Wallet,
  ShoppingBag,
  Clock,
  Palette,
  CheckCircle2,
  Users,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Plus,
  Shield,
  Layers,
  Settings,
  Download,
  Server,
  AlertCircle,
  Edit,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, UserRole } from '../types';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    transactions,
    users,
    templates,
    services,
    auditLogs,
    currentUser,
    approveDeposit,
    rejectDeposit,
    adjustUserBalance,
    assignDesigner,
    updateOrderStatus,
    toggleUserStatus,
    deleteTemplate,
    deleteService,
    setSelectedOrder,
    setActiveModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'deposits' | 'templates' | 'services' | 'users' | 'staff' | 'settings'
  >('overview');

  const [timeRange, setTimeRange] = useState<'today' | '7days' | 'month' | 'custom'>('7days');
  const [rejectReason, setRejectReason] = useState<{ txId: string; reason: string } | null>(null);
  const [adjustBalanceModal, setAdjustBalanceModal] = useState<{ userId: string; userName: string; amount: string; note: string } | null>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [searchOrder, setSearchOrder] = useState<string>('');

  const pendingDeposits = transactions.filter((t) => t.status === 'pending');
  const newOrdersNeedAssign = orders.filter((o) => !o.assignedDesignerId || o.status === 'pending_confirmation');
  const designers = users.filter((u) => u.role === 'designer' || u.role === 'manager');

  // Metrics matching Screenshot 5
  const totalRevenue = 148500000;
  const totalDeposited = 162000000;
  const customerWalletTotal = users
    .filter((u) => u.role === 'customer')
    .reduce((acc, u) => acc + u.walletBalance, 0) + 45820000;
  const totalOrdersCount = orders.length + 338;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_confirmation').length + 12;
  const inProgressOrdersCount = orders.filter((o) => o.status === 'designing' || o.status === 'waiting_approval').length + 26;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length + 294;
  const membersCount = users.length + 1842;

  const handleApproveDeposit = (txId: string) => {
    approveDeposit(txId);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleConfirmAdjustBalance = () => {
    if (!adjustBalanceModal) return;
    const amt = parseInt(adjustBalanceModal.amount, 10);
    if (isNaN(amt) || !adjustBalanceModal.note.trim()) return;
    adjustUserBalance(adjustBalanceModal.userId, amt, adjustBalanceModal.note.trim());
    setAdjustBalanceModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner and Navigation Bar (Matching Screenshot 5) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Tổng quan vận hành quản trị
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Hệ thống trực tuyến
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bảng điều khiển trung tâm theo dõi luồng doanh thu, điều phối đơn thiết kế và kiểm soát nạp ví.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
            {(['today', '7days', 'month', 'custom'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {t === 'today'
                  ? 'Hôm nay'
                  : t === '7days'
                  ? '7 ngày qua'
                  : t === 'month'
                  ? 'Tháng này'
                  : 'Tùy chọn'}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Status Alert Bar (Matching Screenshot 5) */}
      <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Cập nhật lúc: <strong>15:45:20 (GMT+7)</strong></span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <button
          onClick={() => setActiveTab('deposits')}
          className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 hover:underline"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>Có {pendingDeposits.length} yêu cầu nạp tiền chờ duyệt</span>
        </button>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <button
          onClick={() => setActiveTab('orders')}
          className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-cyan-400 hover:underline"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span>{newOrdersNeedAssign.length} đơn thiết kế mới tiếp nhận cần phân công</span>
        </button>
      </div>

      {/* 8 Metric KPI Cards (Matching exact numbers from Screenshot 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Tổng doanh thu thực */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tổng doanh thu thực
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
              <span>Lũy kế chu kỳ hiện tại</span>
              <span className="text-emerald-500 font-bold">↗ +18.2%</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Tổng tiền nạp vào ví */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tổng tiền nạp vào ví
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {totalDeposited.toLocaleString('vi-VN')} đ
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
              <span>128 lượt nạp thành công</span>
              <span className="text-emerald-500 font-bold">↗ +12.4%</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Tổng số dư ví khách hàng */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tổng số dư ví khách hàng
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {customerWalletTotal.toLocaleString('vi-VN')} đ
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
              <span>Đang lưu giữ trong hệ sinh thái</span>
              <span className="text-blue-500 font-bold">Ổn định</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Tổng số đơn hàng */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tổng số đơn hàng
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {totalOrdersCount} Đơn
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
              <span>Đơn đặt dịch vụ & mẫu có sẵn</span>
              <span className="text-emerald-500 font-bold">↗ +9.6%</span>
            </div>
          </div>
        </div>

        {/* Metric 5: Đơn mới tiếp nhận */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Đơn mới tiếp nhận
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {pendingOrdersCount} Đơn
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
              <span>Cần duyệt & phân công</span>
              <span className="text-amber-500 font-bold">↗ +4 đơn mới</span>
            </div>
          </div>
        </div>

        {/* Metric 6: Đơn đang thiết kế */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Đơn đang thiết kế
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Palette className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {inProgressOrdersCount} Đơn
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
              <span>Đang được xử lý bởi nhân viên</span>
              <span className="text-slate-500 font-bold">Bình thường</span>
            </div>
          </div>
        </div>

        {/* Metric 7: Đơn hoàn thành */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Đơn hoàn thành
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {completedOrdersCount} Đơn
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
              <span>Tỷ lệ hài lòng 98.4%</span>
              <span className="text-emerald-500 font-bold">↗ +14.1%</span>
            </div>
          </div>
        </div>

        {/* Metric 8: Số lượng thành viên */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Số lượng thành viên
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {membersCount} User
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
              <span>+56 thành viên đăng ký tuần này</span>
              <span className="text-emerald-500 font-bold">↗ +6.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Tổng quan Dashboard', icon: TrendingUp },
          { id: 'orders', label: `Quản lý đơn thiết kế (${orders.length})`, icon: ShoppingBag },
          { id: 'deposits', label: `Yêu cầu nạp tiền & Ví (${pendingDeposits.length})`, icon: CreditCard },
          { id: 'templates', label: `Kho mẫu thiết kế (${templates.length})`, icon: Layers },
          { id: 'services', label: `Dịch vụ & Bảng giá (${services.length})`, icon: Palette },
          { id: 'users', label: `Khách hàng (${users.filter((u) => u.role === 'customer').length})`, icon: Users },
          { id: 'staff', label: `Nhân viên thiết kế (${designers.length})`, icon: Shield },
          { id: 'settings', label: 'Cài đặt & Xuất cPanel', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0 transition-all ${
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

      {/* TAB 1: OVERVIEW & REVENUE CHARTS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Chart Visual */}
          <div className="lg:col-span-8 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  Xu hướng doanh thu & sản lượng đơn thiết kế
                </h3>
                <p className="text-xs text-slate-500">Biểu đồ biến động 7 ngày gần nhất (Đơn vị: Triệu VNĐ)</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-blue-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Doanh thu thực
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Nạp vào ví
                </span>
              </div>
            </div>

            {/* Simulated interactive bar chart */}
            <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-slate-100 dark:border-slate-800 px-2">
              {[
                { day: 'T2', rev: 18.5, dep: 22.0 },
                { day: 'T3', rev: 21.0, dep: 25.5 },
                { day: 'T4', rev: 16.2, dep: 19.0 },
                { day: 'T5', rev: 24.8, dep: 28.0 },
                { day: 'T6', rev: 27.5, dep: 31.0 },
                { day: 'T7', rev: 32.0, dep: 36.5 },
                { day: 'CN', rev: 28.5, dep: 30.0 },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-48">
                    <div
                      style={{ height: `${(item.rev / 40) * 100}%` }}
                      className="w-1/2 bg-blue-600 rounded-t-md group-hover:bg-blue-500 transition-all relative"
                      title={`Doanh thu: ${item.rev} tr`}
                    ></div>
                    <div
                      style={{ height: `${(item.dep / 40) * 100}%` }}
                      className="w-1/2 bg-cyan-400 rounded-t-md group-hover:bg-cyan-300 transition-all relative"
                      title={`Nạp ví: ${item.dep} tr`}
                    ></div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Tổng doanh thu tuần này: <strong>168.500.000 đ</strong></span>
              <span>Tỷ lệ chuyển đổi ví thành công: <strong>98.7%</strong></span>
            </div>
          </div>

          {/* Quick Tasks & Top Selling */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Dịch vụ & Mẫu thiết kế bán chạy
              </h4>
              <div className="space-y-2.5 text-xs">
                {services.slice(0, 4).map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">#{idx + 1}</span>
                      <strong className="text-slate-800 dark:text-slate-200">{s.title}</strong>
                    </div>
                    <span className="text-blue-600 dark:text-cyan-400 font-bold">
                      {s.basePrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit log recent items */}
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Nhật ký vận hành gần nhất
              </h4>
              <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="pt-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <strong className="text-blue-600 dark:text-cyan-400">{log.action}</strong>
                      <span className="text-slate-400">{log.createdAt}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{log.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto">
              {['all', 'pending_confirmation', 'designing', 'waiting_approval', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    orderFilterStatus === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {st === 'all'
                    ? 'Tất cả đơn'
                    : st === 'pending_confirmation'
                    ? 'Chờ duyệt'
                    : st === 'designing'
                    ? 'Đang thiết kế'
                    : st === 'waiting_approval'
                    ? 'Chờ khách duyệt'
                    : 'Hoàn thành'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã đơn hoặc khách..."
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="p-3.5">Mã đơn</th>
                    <th className="p-3.5">Khách hàng</th>
                    <th className="p-3.5">Dịch vụ & Tiêu đề</th>
                    <th className="p-3.5">Giá trị</th>
                    <th className="p-3.5">Designer</th>
                    <th className="p-3.5">Trạng thái</th>
                    <th className="p-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders
                    .filter((ord) => {
                      const matchStatus = orderFilterStatus === 'all' || ord.status === orderFilterStatus;
                      const matchSearch =
                        ord.orderCode.toLowerCase().includes(searchOrder.toLowerCase()) ||
                        ord.customerName.toLowerCase().includes(searchOrder.toLowerCase()) ||
                        ord.title.toLowerCase().includes(searchOrder.toLowerCase());
                      return matchStatus && matchSearch;
                    })
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-cyan-400">
                          {ord.orderCode}
                        </td>
                        <td className="p-3.5">
                          <strong className="text-slate-800 dark:text-slate-200 block">{ord.customerName}</strong>
                          <span className="text-[11px] text-slate-400">{ord.customerPhone}</span>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block line-clamp-1">
                            {ord.title}
                          </span>
                          <span className="text-[11px] text-slate-500">{ord.serviceName}</span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          {ord.price.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="p-3.5">
                          <select
                            value={ord.assignedDesignerId || ''}
                            onChange={(e) => assignDesigner(ord.id, e.target.value)}
                            className="text-xs p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          >
                            <option value="">-- Chưa gán --</option>
                            {designers.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="text-xs p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                          >
                            <option value="pending_confirmation">Chờ duyệt</option>
                            <option value="designing">Đang thiết kế</option>
                            <option value="waiting_approval">Chờ khách duyệt</option>
                            <option value="revision_requested">Yêu cầu sửa</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActiveModal('order_detail');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPOSITS & WALLET MANAGEMENT */}
      {activeTab === 'deposits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Danh sách yêu cầu nạp tiền ví ({transactions.length})
              </h3>
              <p className="text-xs text-slate-500">
                Xác thực đối soát giao dịch VietQR ngân hàng và duyệt cộng tiền vào ví khách hàng an toàn.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="p-3.5">Mã GD</th>
                    <th className="p-3.5">Người nạp</th>
                    <th className="p-3.5">Số tiền</th>
                    <th className="p-3.5">Nội dung đối soát</th>
                    <th className="p-3.5">Thời gian</th>
                    <th className="p-3.5">Trạng thái</th>
                    <th className="p-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {tx.txCode}
                      </td>
                      <td className="p-3.5">
                        <strong className="block text-slate-900 dark:text-white">{tx.userName}</strong>
                        <span className="text-[11px] text-slate-400">{tx.method}</span>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {tx.type === 'deposit' ? '+' : '-'}
                        {tx.amount.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                        {tx.referenceCode}
                      </td>
                      <td className="p-3.5 text-slate-500">{tx.createdAt}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
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
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {tx.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveDeposit(tx.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              ✓ Duyệt nạp
                            </button>
                            <button
                              onClick={() => rejectDeposit(tx.id, 'Sai cú pháp hoặc không tìm thấy giao dịch sao kê')}
                              className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold text-xs"
                            >
                              ✕ Từ chối
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TEMPLATES MANAGEMENT */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Kho mẫu thiết kế trưng bày ({templates.length})
            </h3>
            <button
              onClick={() => {
                alert('Tính năng tải lên mẫu mới: Bạn có thể chọn danh mục, điền mã mẫu và tải ảnh lên.');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mẫu thiết kế mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900">
                  <img src={tmpl.previewUrl} alt={tmpl.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {tmpl.code}
                  </span>
                </div>
                <div className="mt-2.5">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">{tmpl.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>{tmpl.category}</span>
                    <strong className="text-blue-600">{tmpl.priceRef.toLocaleString('vi-VN')} đ</strong>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      deleteTemplate(tmpl.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Xóa
                  </button>
                  <span className="text-[10px] text-slate-400">{tmpl.downloadsCount} tải</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Quản lý tài khoản khách hàng ({users.length})
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden glass-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3.5">Họ tên & Email</th>
                  <th className="p-3.5">Vai trò</th>
                  <th className="p-3.5">Số dư ví</th>
                  <th className="p-3.5">Đã chi tiêu</th>
                  <th className="p-3.5">Trạng thái</th>
                  <th className="p-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <strong className="text-slate-900 dark:text-white block">{u.name}</strong>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5 capitalize font-semibold">{u.role}</td>
                    <td className="p-3.5 font-bold text-blue-600 dark:text-cyan-400">
                      {u.walletBalance.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-3.5 text-slate-500">{u.totalSpent.toLocaleString('vi-VN')} đ</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() =>
                          setAdjustBalanceModal({
                            userId: u.id,
                            userName: u.name,
                            amount: '100000',
                            note: 'Cộng tiền thưởng / khuyến mãi sự kiện',
                          })
                        }
                        className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 font-bold hover:bg-blue-500/20"
                      >
                        Sửa số dư
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2.5 py-1 rounded font-bold ${
                          u.status === 'active'
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        {u.status === 'active' ? 'Khóa' : 'Mở'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS & CPANEL EXPORT */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-purple-500/30 bg-purple-500/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-600 text-white">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Đóng gói mã nguồn & CSDL cho Hosting cPanel
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sẵn sàng triển khai trên PHP 7.4 + MySQL với bảng mã UTF8MB4, file SQL cài đặt tự động.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/inet24h_cpanel_source.zip"
                download="inet24h_cpanel_source.zip"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-purple-500/20 transition-transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>📦 TẢI TRỌN GÓI .ZIP CPANEL (PHP 7.4 + SQL)</span>
              </a>
              <button
                onClick={() => setActiveModal('cpanel_export')}
                className="px-5 py-2.5 rounded-xl border border-purple-500/40 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 text-xs font-bold flex items-center gap-2"
              >
                <Server className="w-4 h-4" />
                <span>Xem chi tiết file & hướng dẫn cài đặt</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-100">
                Cấu hình VietQR Ngân hàng
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Ngân hàng thụ hưởng:</label>
                  <input
                    type="text"
                    disabled
                    value="MB Bank (Ngân hàng Quân Đội)"
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Số tài khoản nhận tiền:</label>
                  <input
                    type="text"
                    disabled
                    value="0987654321"
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Chủ tài khoản:</label>
                  <input
                    type="text"
                    disabled
                    value="CONG TY CP THIET KE INET24H"
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-100">
                Thông tin thương hiệu & Liên hệ
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Tên thương hiệu:</label>
                  <input
                    type="text"
                    disabled
                    value="INET24H.COM - Thiết kế ảnh online"
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Hotline 24/7:</label>
                  <input
                    type="text"
                    disabled
                    value="0987 654 321"
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Email hỗ trợ:</label>
                  <input
                    type="text"
                    disabled
                    value="support@inet24h.com"
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Balance Adjust Modal */}
      {adjustBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl glass-card bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Điều chỉnh số dư: {adjustBalanceModal.userName}
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Số tiền (Dương để cộng, âm để trừ):</label>
                <input
                  type="number"
                  value={adjustBalanceModal.amount}
                  onChange={(e) => setAdjustBalanceModal({ ...adjustBalanceModal, amount: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Lý do điều chỉnh (Lưu nhật ký kiểm toán):</label>
                <textarea
                  rows={2}
                  value={adjustBalanceModal.note}
                  onChange={(e) => setAdjustBalanceModal({ ...adjustBalanceModal, note: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAdjustBalanceModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAdjustBalance}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Xác nhận thay đổi số dư
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
