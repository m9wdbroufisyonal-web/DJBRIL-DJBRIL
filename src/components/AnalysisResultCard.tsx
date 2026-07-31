import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  BookOpen,
  FlaskConical,
  ShieldAlert,
  HeartHandshake,
  Copy,
  Check,
  Bookmark,
  Share2,
  ArrowRight,
  ListFilter
} from 'lucide-react';
import { FoodAnalysisResult } from '../types';

interface AnalysisResultCardProps {
  result: FoodAnalysisResult;
  onSaveToHistory: (result: FoodAnalysisResult) => void;
  isSaved: boolean;
  onScanAnother: () => void;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  result,
  onSaveToHistory,
  isSaved,
  onScanAnother
}) => {
  const [copied, setCopied] = useState(false);

  const getHeaderTheme = () => {
    if (result.status === 'tayyib') {
      return {
        bg: 'bg-emerald-600',
        lightBg: 'bg-emerald-50',
        text: 'text-emerald-900',
        border: 'border-emerald-300',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        icon: <CheckCircle2 className="w-8 h-8 text-white" />
      };
    } else if (result.status === 'khabith') {
      return {
        bg: 'bg-rose-600',
        lightBg: 'bg-rose-50',
        text: 'text-rose-900',
        border: 'border-rose-300',
        badgeBg: 'bg-rose-100 text-rose-800',
        icon: <AlertOctagon className="w-8 h-8 text-white" />
      };
    }
    return {
      bg: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      badgeBg: 'bg-amber-100 text-amber-900',
      icon: <HelpCircle className="w-8 h-8 text-white" />
    };
  };

  const theme = getHeaderTheme();

  const handleCopyReport = () => {
    const reportText = `====== تقرير فحص الطعام (طبيبي وشرعي) ======
المنتج: ${result.name}
التصنيف: ${result.statusLabel}
السبب المباشر: ${result.statusReason}

الدليل العلمي والصحي:
${result.scientificEvidence}

المستند الشرعي والدليل الفقهي:
${result.islamicEvidence}

نصيحة للمستهلك:
${result.consumerAdvice}
=======================================`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `نتيجة فحص: ${result.name}`,
          text: `فحصت هذا المنتج في تطبيق (طبيبي وشرعي): ${result.name} - النتيجة: ${result.statusLabel} (${result.statusReason})`
        });
      } catch (err) {
        // Ignored if user cancelled share
      }
    } else {
      handleCopyReport();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Status Hero Header */}
      <div className={`${theme.bg} p-6 sm:p-8 text-white relative`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              {theme.icon}
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-1">
                دقة الفحص: 100%
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {result.statusLabel}
              </h2>
              <p className="text-white/90 text-sm mt-0.5 font-medium">
                {result.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => onSaveToHistory(result)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors"
              title="حفظ في السجل"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'محفوظ' : 'حفظ'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors"
              title="مشاركة التقرير"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </button>
          </div>
        </div>

        {/* Direct Summary Sentence */}
        <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20">
          <p className="text-white text-sm sm:text-base font-semibold leading-relaxed">
            {result.statusReason}
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 sm:p-8 space-y-6">
        {/* Why this classification? Bullet Points */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            <span>الأسباب المفصلة للتصنيف:</span>
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {result.detailedReasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Grid: Scientific vs Islamic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scientific Evidence Box */}
          <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-800 font-bold text-base mb-2.5">
                <FlaskConical className="w-5 h-5" />
                <h4>الدليل العلمي والصحي</h4>
              </div>
              <p className="text-slate-800 text-sm leading-relaxed">
                {result.scientificEvidence}
              </p>
            </div>
          </div>

          {/* Islamic Evidence Box */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base mb-2.5">
                <BookOpen className="w-5 h-5" />
                <h4>المستند الشرعي والدليل الفقهي</h4>
              </div>
              <p className="text-slate-800 text-sm leading-relaxed">
                {result.islamicEvidence}
              </p>
            </div>
          </div>
        </div>

        {/* Ingredients & E-Numbers Analysis Table */}
        {result.ingredientsAnalysis && result.ingredientsAnalysis.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-emerald-600" />
              <span>تحليل المكونات والمضافات المكتشفة:</span>
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 text-xs sm:text-sm">
                    <th className="p-3.5 font-bold">المكون / الإضافة</th>
                    <th className="p-3.5 font-bold w-36">الحكم</th>
                    <th className="p-3.5 font-bold">التفصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {result.ingredientsAnalysis.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.status === 'tayyib'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'khabith'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status === 'tayyib' && '✅ طيّب'}
                          {item.status === 'khabith' && '❌ خبيث'}
                          {item.status === 'mashbuh' && '⚠️ مشبوه'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 text-xs sm:text-sm">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Consumer Actionable Advice */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-950 flex items-start gap-3">
          <HeartHandshake className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm sm:text-base mb-1">
              نصيحة المستهلك:
            </h4>
            <p className="text-sm leading-relaxed text-slate-800">
              {result.consumerAdvice}
            </p>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onScanAnother}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-colors"
          >
            <span>فحص طعام آخر</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyReport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>تم نسخ التقرير!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>نسخ التقرير النصي</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
