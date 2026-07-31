import React, { useState } from 'react';
import {
  History,
  Trash2,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { FoodAnalysisResult, FoodStatus } from '../types';

interface HistoryViewProps {
  history: FoodAnalysisResult[];
  onSelectResult: (result: FoodAnalysisResult) => void;
  onClearHistory: () => void;
  onDeleteResult: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onDeleteResult
}) => {
  const [filter, setFilter] = useState<'all' | FoodStatus>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              سجل فحوصات الأطعمة
            </h2>
            <p className="text-slate-500 text-sm">
              جميع المنتجات وقوائم المكونات التي قمت بفحصها وتحليلها مسبقاً محفوظة محلياً على جهازك
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs sm:text-sm border border-rose-200 transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>مسح جميع السجلات ({history.length})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          الكل ({history.length})
        </button>
        <button
          onClick={() => setFilter('tayyib')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 ${
            filter === 'tayyib'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>طيّب مسموح ({history.filter((i) => i.status === 'tayyib').length})</span>
        </button>
        <button
          onClick={() => setFilter('khabith')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 ${
            filter === 'khabith'
              ? 'bg-rose-600 text-white'
              : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>خبيث ممنوع ({history.filter((i) => i.status === 'khabith').length})</span>
        </button>
        <button
          onClick={() => setFilter('mashbuh')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 ${
            filter === 'mashbuh'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>مشبوه ({history.filter((i) => i.status === 'mashbuh').length})</span>
        </button>
      </div>

      {/* History Cards Grid */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center text-slate-400 border border-slate-200">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-base text-slate-700">لا توجد فحوصات سابقة في هذه الفئة</p>
          <p className="text-xs text-slate-400 mt-1">ابدأ بفحص أي طعام بالكاميرا أو كتابة اسمه ليتم حفظ النتيجة هنا</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white mt-0.5 ${
                    item.status === 'tayyib'
                      ? 'bg-emerald-600'
                      : item.status === 'khabith'
                      ? 'bg-rose-600'
                      : 'bg-amber-500'
                  }`}
                >
                  {item.status === 'tayyib' && <CheckCircle2 className="w-6 h-6" />}
                  {item.status === 'khabith' && <AlertOctagon className="w-6 h-6" />}
                  {item.status === 'mashbuh' && <HelpCircle className="w-6 h-6" />}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {item.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        item.status === 'tayyib'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'khabith'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 line-clamp-1">
                    {item.statusReason}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.timestamp)}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => onDeleteResult(item.id)}
                  title="حذف من السجل"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectResult(item)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors"
                >
                  <span>عرض التقرير</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
