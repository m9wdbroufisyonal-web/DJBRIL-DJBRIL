import React, { useState } from 'react';
import { Search, BookOpen, FlaskConical, ShieldAlert, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';
import { E_NUMBERS_GUIDE } from '../data/additivesGuide';
import { ENumberReference, FoodStatus } from '../types';

interface ENumbersGuideViewProps {
  onSelectENumberForScan: (code: string) => void;
}

export const ENumbersGuideView: React.FC<ENumbersGuideViewProps> = ({
  onSelectENumberForScan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | FoodStatus>('all');

  const filtered = E_NUMBERS_GUIDE.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.includes(searchTerm) ||
      item.explanation.includes(searchTerm) ||
      item.origin.includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
            E
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              دليل أرقام الإضافات الغذائية (E-Numbers)
            </h2>
            <p className="text-slate-500 text-sm">
              مرجع سريع ودقيق للحكم الشرعي والتفسير العلمي لأشهر المضافات والملونات والمستحلبات
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث برقم الإضافة (مثال: E120، E441) أو بالاسم (مثل الكارمين، الجيلاتين)..."
            className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute top-4 right-3.5 pointer-events-none" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل ({E_NUMBERS_GUIDE.length})
          </button>
          <button
            onClick={() => setActiveFilter('tayyib')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 ${
              activeFilter === 'tayyib'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>طيّب مسموح</span>
          </button>
          <button
            onClick={() => setActiveFilter('khabith')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 ${
              activeFilter === 'khabith'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>خبيث ممنوع</span>
          </button>
          <button
            onClick={() => setActiveFilter('mashbuh')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 ${
              activeFilter === 'mashbuh'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>مشبوه يحتاج توضيح</span>
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-base text-slate-700">لم نجد إضافة غذائية تطابق بحثك</p>
            <p className="text-xs text-slate-400 mt-1">جرب كتابة رمز E بالأرقام الإنجليزية مثل E120 أو E471</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.code}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md border border-slate-200 transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm sm:text-base">
                    {item.code}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      {item.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      المصدر: {item.origin}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                    item.status === 'tayyib'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.status === 'khabith'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {item.status === 'tayyib' && '✅ طيّب (مسموح)'}
                  {item.status === 'khabith' && '❌ خبيث (ممنوع)'}
                  {item.status === 'mashbuh' && '⚠️ مشبوه (يحتاج توضيح)'}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-slate-800 text-sm leading-relaxed font-medium">
                  {item.explanation}
                </p>
                <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="font-bold text-slate-800">التفسير الطبي والكيميائي: </span>
                  {item.scientificDetail}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onSelectENumberForScan(item.code)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <span>فحص هذا الرمز الآن في التطبيق</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
