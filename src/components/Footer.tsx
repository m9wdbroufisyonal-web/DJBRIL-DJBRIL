import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>طبيبي وشرعي - فاحص الطعام الذكي</span>
        </div>

        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          تطبيق جوال فوري يفحص الأطعمة والمكونات ورموز الإضافات (E-Numbers) ويصنفها إلى طيّب (مسموح)، خبيث (ممنوع)، أو مشبوه مع الأدلة العلمية والشرعية المعتمدة.
        </p>

        <div className="flex items-center justify-center gap-1 text-xs text-slate-400 pt-2">
          <span>تم التصميم والتطوير لخدمة الغذاء الحلال والطيب</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </footer>
  );
};
