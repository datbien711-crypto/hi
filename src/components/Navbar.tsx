import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Search,
  Wallet,
  Sparkles,
  User,
  Shield,
  Palette,
  Menu,
  X,
  PlusCircle,
  FileText,
  HelpCircle,
  Phone,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isDarkMode,
    toggleDarkMode,
    activeTab,
    setActiveTab,
    setActiveModal,
    switchUserRole,
    orders,
    transactions,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pendingDeposits = transactions.filter((t) => t.status === 'pending').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending_confirmation').length;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const roles: { role: UserRole; label: string; icon: typeof User; badge?: string }[] = [
    { role: 'customer', label: 'Khách hàng (Đặt thiết kế & Nạp ví)', icon: User },
    { role: 'designer', label: 'Nhân viên thiết kế (Workspace)', icon: Palette },
    { role: 'admin', label: 'Quản trị viên (Admin Dashboard)', icon: Shield, badge: 'Full quyền' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200">
      {/* Top Main Navbar */}
      <nav className="glass-nav border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="relative w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-200 rounded-full animate-ping" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    INET<span className="text-blue-600 dark:text-cyan-400">24H</span>.COM
                  </span>
                </div>
                <span className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
                  Thiết kế ảnh online
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 font-medium text-sm">
              {[
                { id: 'home', label: 'Trang chủ' },
                { id: 'services', label: 'Dịch vụ' },
                { id: 'templates', label: 'Mẫu thiết kế' },
                { id: 'pricing', label: 'Bảng giá' },
                { id: 'news', label: 'Tin tức' },
                { id: 'contact', label: 'Liên hệ' },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600/10 dark:bg-cyan-500/15 text-blue-600 dark:text-cyan-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              {/* Fast Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
                  title="Chuyển đổi vai trò trải nghiệm"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="capitalize">
                    {currentUser.role === 'customer'
                      ? 'Khách hàng'
                      : currentUser.role === 'designer'
                      ? 'Designer'
                      : 'Admin'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {roleMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-xl glass-card shadow-2xl p-2 border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setRoleMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Chọn vai trò để trải nghiệm đầy đủ
                    </div>
                    <div className="space-y-1 mt-1">
                      {roles.map((r) => {
                        const Icon = r.icon;
                        const isCurrent = currentUser.role === r.role;
                        return (
                          <button
                            key={r.role}
                            onClick={() => {
                              switchUserRole(r.role);
                              setRoleMenuOpen(false);
                              if (r.role === 'admin') setActiveTab('admin');
                              if (r.role === 'designer') setActiveTab('designer');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                              isCurrent
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4" />
                              <span>{r.label}</span>
                            </div>
                            {r.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-500 font-bold">
                                {r.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Portal shortcuts based on role */}
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === 'admin'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                  {(pendingDeposits > 0 || pendingOrders > 0) && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {pendingDeposits + pendingOrders}
                    </span>
                  )}
                </button>
              ) : currentUser.role === 'designer' ? (
                <button
                  onClick={() => handleNavClick('designer')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === 'designer'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Khu vực Designer</span>
                </button>
              ) : null}

              {/* User Account / Auth Button */}
              <button
                onClick={() => handleNavClick('account')}
                className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  activeTab === 'account'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500/40"
                />
                <span className="hidden md:inline max-w-[100px] truncate">{currentUser.name}</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-2 glass-card">
            {[
              { id: 'home', label: 'Trang chủ' },
              { id: 'services', label: 'Dịch vụ' },
              { id: 'templates', label: 'Mẫu thiết kế' },
              { id: 'pricing', label: 'Bảng giá' },
              { id: 'news', label: 'Tin tức' },
              { id: 'contact', label: 'Liên hệ' },
              { id: 'account', label: 'Tài khoản & Ví tiền' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Sub-bar as shown in user screenshot 1:
          🟢 INET24H Designer Đang Trực Tuyến: Sẵn sàng nhận việc 24/7 | 💳 Số dư ví: 250.000 đ [+ Nạp] | [+ Đặt thiết kế] */}
      <div className="bg-slate-100/90 dark:bg-[#0b1324]/90 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">INET24H Designer Đang Trực Tuyến:</strong>{' '}
              Sẵn sàng nhận việc 24/7
            </span>
          </div>

          {/* Quick wallet & CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800/90 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              <Wallet className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span className="text-slate-500 dark:text-slate-400">Số dư ví:</span>
              <strong className="text-blue-600 dark:text-cyan-400 font-bold">
                {currentUser.walletBalance.toLocaleString('vi-VN')} đ
              </strong>
              <button
                onClick={() => setActiveModal('wallet')}
                className="ml-1 text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline hover:opacity-80"
              >
                + Nạp
              </button>
            </div>

            <button
              onClick={() => setActiveModal('order')}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-102"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đặt thiết kế</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
