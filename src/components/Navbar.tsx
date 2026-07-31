import React from 'react';
import { ShieldCheck, Camera, BookOpen, History, Info, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'scanner' | 'guide' | 'history' | 'about';
  setActiveTab: (tab: 'scanner' | 'guide' | 'history' | 'about') => void;
  historyCount: number;
  onOpenLiveCamera: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  onOpenLiveCamera
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-2.5 group text-right focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  طبيبي وشرعي
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  بدقة 100%
                </span>
              </div>
              <p className="text-xs text-slate-500">
                فاحص الأطعمة والمضافات بالدليل العلمي والشرعي
              </p>
            </div>
          </button>

          {/* Quick Camera Trigger Button for Mobile */}
          <button
            onClick={onOpenLiveCamera}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>كاميرا الفحص</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center justify-start sm:justify-center gap-1.5 mt-3 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              activeTab === 'scanner'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>فحص الأطعمة</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              activeTab === 'guide'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>دليل رموز E والمضافات</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 relative ${
              activeTab === 'history'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>سجل الفحوصات</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              activeTab === 'about'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>عن التطبيق</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
