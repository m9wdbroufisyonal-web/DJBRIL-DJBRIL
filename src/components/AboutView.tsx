import React from 'react';
import { ShieldCheck, CheckCircle2, AlertOctagon, HelpCircle, BookOpen, FlaskConical, HeartHandshake, Sparkles } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Brand Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          منهجية الفحص والتصنيف في "طبيبي وشرعي"
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
          يجمع التطبيق بين التحليل الفقهي الإسلامي المعتمد على الأدلة الشرعية من القرآن والسنة، والتدقيق الطبي التغذوي للمكونات والرموز الكيميائية (E-Numbers).
        </p>
      </div>

      {/* 3 Categories Explanation */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>الأحكام الثلاثة الرئيسية:</span>
        </h3>

        {/* Tayyib */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-emerald-900 text-lg">
              ✅ طيّب (مسموح)
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              كل طعام أو مكون غذائي طاهر نافع، خالٍ من النجاسات والمحرمات (مثل الخنزير والكحول والدم والصبغات الحشرية المحرمة)، ولا يلحق ضرراً بالصحة العامة.
            </p>
            <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
              القاعدة الفقهية: "الأصل في الأطعمة والأشربة الحل والإباحة إلا ما ورد دليل صحيح بتحريمه".
            </p>
          </div>
        </div>

        {/* Khabith */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-rose-900 text-lg">
              ❌ خبيث (ممنوع)
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              ما ثبت تحريمه بنص شرعي صريح أو لاحتوائه على مواد محرمة أو ضارة، مثل صبغة الكارمين E120 المستخرجة من حشرات القرمز، مشتقات الخنزير، الكحول والمسكرات، اللحوم غير المذكاة، أو المضافات عالية السمية.
            </p>
            <p className="text-xs text-rose-800 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              القاعدة الفقهية: {`{وَيُحِلُّ لَهُمُ الطَّيِّبَاتِ وَيُحَرِّمُ عَلَيْهِمُ الْخَبَائِثَ}`} [الأعراف: 157].
            </p>
          </div>
        </div>

        {/* Mashbuh */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-lg">
              ⚠️ مشبوه (بحاجة لتوضيح)
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              المكونات التي تحتمل أكثر من مصدر (نباتي أو حيواني غير مذكى) مثل الجيلاتين E441، أو المستحلبات الدهنية E471، أو منتجات مستوردة تفتقر لشهادة حلال موثوقة.
            </p>
            <p className="text-xs text-amber-900 font-semibold bg-amber-50 p-2.5 rounded-lg border border-amber-100">
              الحديث الشريف: "فمن اتَّقى الشُّبهاتِ استبرأَ لدينِه وعِرضِه" [متفق عليه].
            </p>
          </div>
        </div>
      </div>

      {/* Scientific & Fiqh Integration Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200">
          <div className="flex items-center gap-2 text-teal-900 font-bold mb-2">
            <FlaskConical className="w-5 h-5" />
            <h4>الدليل العلمي والتغذوي</h4>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            تدقيق كيميائي وطبي لأصل كل إضافة غذائية ومخاطرها الصحية، مثل مسببات الحساسية، المحليات الصناعية، ومصادر الاستخلاص.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-900 font-bold mb-2">
            <BookOpen className="w-5 h-5" />
            <h4>الدليل الفقهي والشرعي</h4>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            الاستناد إلى أقوال المجامع الفقهية وهيئات الرقابة الشرعية المعتمدة في أحكام الاستحالة والمضافات الغذائية الحلال.
          </p>
        </div>
      </div>
    </div>
  );
};
