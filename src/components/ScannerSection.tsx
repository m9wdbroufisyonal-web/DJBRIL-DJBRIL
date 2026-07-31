import React, { useState, useRef } from 'react';
import {
  Camera,
  Search,
  Upload,
  Sparkles,
  Flame,
  Candy,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  FileText,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { QuickExample } from '../types';
import { QUICK_EXAMPLES } from '../data/additivesGuide';

interface ScannerSectionProps {
  onAnalyzeText: (text: string) => void;
  onOpenCameraModal: () => void;
  onSelectImageFile: (file: File) => void;
  isLoading: boolean;
  loadingMessage?: string;
}

export const ScannerSection: React.FC<ScannerSectionProps> = ({
  onAnalyzeText,
  onOpenCameraModal,
  onSelectImageFile,
  isLoading,
  loadingMessage
}) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmitText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputText.trim();
    if (!query) return;
    onAnalyzeText(query);
  };

  const handleSelectQuickExample = (example: QuickExample) => {
    setInputText(example.query);
    onAnalyzeText(example.query);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectImageFile(file);
    }
  };

  const getExampleBadgeColor = (category: string) => {
    if (category === 'tayyib') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (category === 'khabith') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>فحص الأطعمة بدقة 100% مع الدليل العلمي والشرعي</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            هل هذا الطعام طيّب، خبيث، أم مشبوه؟
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            التقط صورة لغلاف الطعام أو قائمة المكونات بالكاميرا، أو اكتب اسم المنتج ورموز الإضافات (مثل E120) للحصول على الحكم الشرعي والتحليل الصحي الموثق.
          </p>

          {/* Action Choice Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              onClick={onOpenCameraModal}
              disabled={isLoading}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/20 transition-all active:scale-98"
            >
              <Camera className="w-5 h-5" />
              <span>تصوير الطعام بالكاميرا 📸</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white font-medium text-sm sm:text-base border border-white/20 transition-all active:scale-98"
            >
              <Upload className="w-5 h-5 text-emerald-400" />
              <span>أرفق صورة من الاستوديو</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Text / Ingredient Search Box */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">
            أو اكتب اسم الطعام أو المكونات أو أرقام E
          </h3>
        </div>

        <form onSubmit={handleSubmitText} className="space-y-3">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="مثال: نودلز كوري حار بنكهة الدجاج، أو: جيلاتين بقري، صبغة E120، مستحلب E471..."
              rows={3}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              يمكنك نسخ قائمة المكونات بالكامل من المتجر أو العبوة ولصقها هنا
            </span>
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-sm sm:text-base shadow-sm transition-all"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'جاري الفحص...' : 'فحص وتحليل فوري'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Test Examples / Ready Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>أمثلة سريعة وجاهزة للتجربة (اضغط للفحص المباشر):</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_EXAMPLES.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuickExample(example)}
              disabled={isLoading}
              className="text-right p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs group flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getExampleBadgeColor(
                    example.category
                  )}`}
                >
                  {example.category === 'tayyib' && '✅ طيّب'}
                  {example.category === 'khabith' && '❌ خبيث'}
                  {example.category === 'mashbuh' && '⚠️ مشبوه'}
                </span>
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  {example.title}
                </h5>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {example.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
