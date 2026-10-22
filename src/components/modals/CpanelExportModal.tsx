import React, { useState } from 'react';
import {
  X,
  Database,
  Download,
  FileCode,
  Server,
  CheckCircle2,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CPANEL_SQL_CONTENT,
  CPANEL_CONFIG_PHP,
  CPANEL_README_GUIDE,
  downloadFile,
} from '../../utils/cpanelBundle';

export const CpanelExportModal: React.FC = () => {
  const { activeModal, setActiveModal } = useApp();
  const [activeTab, setActiveTab] = useState<'sql' | 'config' | 'guide'>('sql');
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'cpanel_export') return null;

  const currentContent =
    activeTab === 'sql'
      ? CPANEL_SQL_CONTENT
      : activeTab === 'config'
      ? CPANEL_CONFIG_PHP
      : CPANEL_README_GUIDE;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (activeTab === 'sql') {
      downloadFile('inet24h_database.sql', CPANEL_SQL_CONTENT, 'text/sql;charset=utf-8');
    } else if (activeTab === 'config') {
      downloadFile('config.php', CPANEL_CONFIG_PHP, 'text/x-php;charset=utf-8');
    } else {
      downloadFile('README_CPANEL.md', CPANEL_README_GUIDE, 'text/markdown;charset=utf-8');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl glass-card bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Bộ cài đặt & Xuất mã nguồn cPanel (PHP 7.4 / MySQL)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sẵn sàng import phpMyAdmin và upload File Manager trên mọi hosting
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Direct Download Banner for .ZIP */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <h4 className="font-bold text-sm">Gói mã nguồn trọn bộ cPanel (inet24h_cpanel_source.zip)</h4>
              <p className="text-[11px] text-purple-100">Bao gồm toàn bộ file PHP 7.4, CSDL MySQL (inet24h.sql), config.php và .htaccess</p>
            </div>
          </div>
          <a
            href="/inet24h_cpanel_source.zip"
            download="inet24h_cpanel_source.zip"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-purple-700 font-extrabold text-xs flex items-center gap-2 shadow-lg shrink-0 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>TẢI FILE .ZIP NGAY (34 KB)</span>
          </a>
        </div>

        {/* Tab selection */}
        <div className="flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 text-xs font-semibold">
          <div className="flex items-center gap-2">
            {[
              { id: 'sql', label: '1. File CSDL (inet24h_database.sql)', icon: Database },
              { id: 'config', label: '2. Cấu hình (config.php)', icon: FileCode },
              { id: 'guide', label: '3. Hướng dẫn cPanel từng bước', icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file về máy</span>
            </button>
          </div>
        </div>

        {/* Code display */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-slate-200">
          <pre className="whitespace-pre-wrap leading-relaxed select-text">
            {currentContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
