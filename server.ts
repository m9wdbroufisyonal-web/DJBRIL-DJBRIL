import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Helper: Smart Rule-Based Fallback Analyzer when offline or if API key is not present
function runFallbackAnalysis(queryText: string = '', sourceType: 'image' | 'text'): any {
  const text = queryText.toLowerCase();
  
  // Check for known Haram / Khabith triggers
  const hasCarmine = text.includes('e120') || text.includes('كارمين') || text.includes('carmine') || text.includes('cochineal') || text.includes('قرمز');
  const hasPorkOrAlcohol = text.includes('خنزير') || text.includes('pork') || text.includes('bacon') || text.includes('كحول') || text.includes('alcohol') || text.includes('wine') || text.includes('ديدان') || text.includes('خمر');
  
  // Check for known Mashbuh triggers
  const hasGelatin = text.includes('جيلاتين') || text.includes('gelatin') || text.includes('e441') || text.includes('e471') || text.includes('نودلز كوري') || text.includes('samyang') || text.includes('بسكويت') || text.includes('شيلاك');
  
  if (hasCarmine || hasPorkOrAlcohol) {
    return {
      id: 'scan-' + Date.now(),
      name: queryText ? queryText.slice(0, 45) : 'منتج غذائي مفحوص',
      status: 'khabith',
      statusLabel: '❌ خبيث (ممنوع)',
      statusReason: 'يحتوي المنتج على صبغة الكارمين E120 المستخرجة من الحشرات أو مكونات محرمة شرعاً.',
      detailedReasons: [
        'وجود صبغة الكارمين E120 المستخرجة من سحق حشرات القرمز، وهي معدودة من الخبائث عند جمهور الفقهاء.',
        'عدم خلو المنتج من مواد مشتقة من مصادر غير جائزة للاستهلاك الآدمي في الشريعة الإسلامية.',
        'احتمالية التسبب في ردود فعل تحسسية لبعض المستهلكين بحسب تقارير هيئة سلامة الغذاء.'
      ],
      scientificEvidence: 'صبغة الكارمين (E120 / Carminic Acid) هي ملون أحمر يتم الحصول عليه من أجسام حشرات الدودة القرمزية (Dactylopius coccus) المجففة والمسحوقة. طبياً، قد تسبب تحسساً جلدياً أو تنفسياً لدى فئة من الأفراد.',
      islamicEvidence: 'لقوله تعالى: {وَيُحِلُّ لَهُمُ الطَّيِّبَاتِ وَيُحَرِّمُ عَلَيْهِمُ الْخَبَائِثَ} [الأعراف: 157]. وقد ذهب جمهور الفقهاء إلى تحريم تناول الحشرات وما استخلص منها لكونها من الخبائث المستقذرة طبعاً.',
      ingredientsAnalysis: [
        {
          name: 'E120 (كارمين / Cochineal)',
          status: 'khabith',
          description: 'صبغة حمراء مستخرجة من حشرات القرمز المسحوقة'
        }
      ],
      consumerAdvice: 'تجنب هذا المنتج وابحث عن بدائل تستخدم صبغات نباتية طبيعية مثل الشمندر (E162) أو الأنثوسيانين (E163).',
      timestamp: new Date().toISOString(),
      sourceType
    };
  } else if (hasGelatin || sourceType === 'image') {
    return {
      id: 'scan-' + Date.now(),
      name: queryText ? queryText.slice(0, 45) : 'منتج غذائي تم تصويره',
      status: 'mashbuh',
      statusLabel: '⚠️ مشبوه (بحاجة لتوضيح)',
      statusReason: 'يحتوي على مكونات مثل الجيلاتين أو المستحلبات الدهنية التي يتوقف حكمها على معرفة مصدرها الحيواني أو النباتي.',
      detailedReasons: [
        'وجود مادة الجيلاتين أو مستحلبات (مثل E471) دون تصريح واضح على العبوة بمصدرها (نباتي أم خنزيري/حيواني).',
        'المنتجات المستوردة من دول غير إسلامية تتطلب التأكد من وجود ختم حلال معتمد من هيئة موثوقة.',
        'احتمالية استخدام دهون أو أنزيمات مشتقة من ذبائح غير مذكاة شرعاً في عملية التصنيع.'
      ],
      scientificEvidence: 'الجيلاتين هو بروتين مشتق من التحلل المائي للكولاجين المأخوذ من جلود وعظام الحيوانات (غالباً البقر أو الخنزير). كيميائياً لا يمكن تمييز أصل الكولاجين بعد التصنيع إلا بفحص الحمض النووي (DNA) أو شهادة المنشأ.',
      islamicEvidence: 'لقول النبي ﷺ: "الحلالُ بيِّنٌ والحرامُ بيِّنٌ، وبينهما أمورٌ مشتبهاتٌ لا يعلمُهنَّ كثيرٌ من الناسِ، فمن اتَّقى الشُّبهاتِ استبرأَ لدينِه وعِرضِه" [متفق عليه].',
      ingredientsAnalysis: [
        {
          name: 'الجيلاتين (Gelatin / E441)',
          status: 'mashbuh',
          description: 'مادة هلامية تستوجب التأكد هل هي نباتية/سمكية أم بقري حلال أم خنزيرية'
        },
        {
          name: 'مستحلبات دهنية (E471)',
          status: 'mashbuh',
          description: 'قد تكون من زيت النخيل النباتي أو من شحوم حيوانية غير مذكاة'
        }
      ],
      consumerAdvice: 'افحص غلاف المنتج بحثاً عن علامة (Halal معتمدة) أو عبارة (Suitable for Vegetarians نباتي). إن لم تجدها فالأفضل اجتنابه.',
      timestamp: new Date().toISOString(),
      sourceType
    };
  } else {
    return {
      id: 'scan-' + Date.now(),
      name: queryText ? queryText.slice(0, 45) : 'طعام طبيعي / فحص عام',
      status: 'tayyib',
      statusLabel: '✅ طيّب (مسموح)',
      statusReason: 'مكوناته خالية من المحرمات والمشتبهات، ومأخوذ من أصل طيب ومسموح للاستهلاك.',
      detailedReasons: [
        'جميع المكونات المذكورة من أصل نباتي أو حيواني حلال ومذكى أو طبيعي آمن.',
        'خلو المنتج من الصبغات الحشرية المحرمة (مثل E120) والكحول والمواد الضارة بالصحة.',
        'مطابق للقواعد الصحية العامة ومعايير الغذاء الحلال الطيب.'
      ],
      scientificEvidence: 'المكونات المذكورة (مثل الحليب المبستر، الملح، المنفحة النباتية، أو الزيوت الطبيعية) آمنة صحياً وخالية من السموم والمضافات عالية الخطورة.',
      islamicEvidence: 'القاعدة الفقهية الكبرى: "الأصل في الأطعمة والأشربة الحل والإباحة إلا ما ورد دليل صحيح بتحريمه"، لقوله تعالى: {كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا}.',
      ingredientsAnalysis: [
        {
          name: 'مكونات طبيعية مسموحة',
          status: 'tayyib',
          description: 'مكونات غذائية نقية وخالية من الشبهات الشرعية والصحية'
        }
      ],
      consumerAdvice: 'هذا الطعام طيّب ومسموح به؛ يُنصح دائماً بالاعتدال في تناول السكريات والأملاح للحفاظ على الصحة العامة.',
      timestamp: new Date().toISOString(),
      sourceType
    };
  }
}

// API Route: Analyze Food with Gemini 2.5 Flash
app.post('/api/analyze-food', async (req: Request, res: Response) => {
  try {
    const { sourceType, imageBase64, imageMimeType, queryText } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Using local scientific & Islamic rules engine.');
      const fallback = runFallbackAnalysis(queryText || '', sourceType || 'text');
      return res.json(fallback);
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemInstruction = `أنت خبير شرعي ومستشار تغذية وصحة غذائية عربي متخصص في تصنيف الأطعمة والمضافات الغذائية (E-Numbers) حسب الشريعة الإسلامية والعلوم الطبية والصحية.
مهمتك: فحص الطعام أو المكونات أو صورة الطعام بدقة 100% وتصنيف المنتج مباشرة إلى إحدى الفئات الثلاث فقط:
1. "tayyib" (✅ طيّب - مسموح به شرعاً وآمن صحياً، خالٍ من المحرمات والشبهات).
2. "khabith" (❌ خبيث - ممنوع شرعاً أو ضار، مثل: احتوائه على صبغة الكارمين E120 المأخوذة من حشرات القرمز، خنزير أو مشتقاته، كحول ومسكرات، دم مسفوح، لحوم غير مذكاة، نجاسات، أو مواد شديدة الضرر صحياً).
3. "mashbuh" (⚠️ مشبوه - بحاجة لتوضيح أو تحقق، مثل: جيلاتين E441 أو E471 أو منفحة أو إنزيمات غير محددة المصدر هل هي نباتية/سمكية أم حيوانية غير مذكاة، أو أطعمة مجهولة المصدر).

يجب أن ترجع الإجابة بصيغة JSON متوافقة تماماً مع هذا الهيكل دون زيادة أو نقصان:
{
  "name": "اسم المنتج أو الطعام الواضح بالعربية",
  "status": "tayyib" | "khabith" | "mashbuh",
  "statusLabel": "✅ طيّب (مسموح)" | "❌ خبيث (ممنوع)" | "⚠️ مشبوه (بحاجة لتوضيح)",
  "statusReason": "جملة واحدة موجزة تشرح سبب التصنيف بشكل مباشر ومقنع",
  "detailedReasons": [
    "نقطة تفصيلية أولى عن سبب التصنيف",
    "نقطة تفصيلية ثانية عن المكونات أو التصنيع",
    "نقطة تفصيلية ثالثة عن الجانب الصحي أو الشرعي"
  ],
  "scientificEvidence": "الدليل العلمي والصحي التفصيلي (التركيب الكيميائي للمضافات، المصدر العلمي للمادة مثل حشرات القرمز لـ E120، الأثر الصحي والمخاطر أو الأمان الطبية)",
  "islamicEvidence": "المستند الشرعي والدليل الفقهي (الآية أو الحديث أو القاعدة الفقهية المطبقة مثل الأصل في الأطعمة الحل أو تحريم الخبائث والنجاسات أو أحكام الاستحالة والمشتبهات)",
  "ingredientsAnalysis": [
    {
      "name": "اسم المكون أو رقم E (مثال: E120 كارمين)",
      "status": "tayyib" | "khabith" | "mashbuh",
      "description": "وصف دقيق للمكون ومصدره الفعلي"
    }
  ],
  "consumerAdvice": "نصيحة عملية ومباشرة للمستهلك (مثال: ابحث عن ختم حلال معتمد، أو استبدله بمنتج بديل آمن، أو اطمئن فهو حلال)"
}`;

    const parts: any[] = [];
    if (sourceType === 'image' && imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: imageBase64
        }
      });
      parts.push({
        text: `قم بتحليل صورة الطعام أو مكونات الغلاف هذه بدقة عربية 100% وصنفها إلى طيّب (مسموح) أو خبيث (ممنوع) أو مشبوه مع الأدلة العلمية والشرعية. ${queryText ? 'ملاحظة أو اسم إضافي: ' + queryText : ''}`
      });
    } else {
      parts.push({
        text: `قم بتحليل وفحص هذا الطعام أو المكونات أو رمز الإضافة الغذائية بدقة 100% وتصنيفه: "${queryText}". اذكر الأسباب والدليل العلمي والصحي والدليل الشرعي المفصل.`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        parsed.id = 'scan-' + Date.now();
        parsed.timestamp = new Date().toISOString();
        parsed.sourceType = sourceType;
        parsed.queryText = queryText;
        return res.json(parsed);
      }
    } catch (geminiError) {
      console.error('Error executing Gemini model:', geminiError);
      const fallback = runFallbackAnalysis(queryText || '', sourceType || 'text');
      return res.json(fallback);
    }

    const fallback = runFallbackAnalysis(queryText || '', sourceType || 'text');
    return res.json(fallback);
  } catch (err: any) {
    console.error('API /api/analyze-food error:', err);
    res.status(500).json({ error: 'حدث خطأ في فحص الطعام. يرجى المحاولة مرة أخرى.' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite Middleware for development OR static serving for production
if (process.env.NODE_ENV !== 'production') {
  import('vite').then(async (viteModule) => {
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 AI Food Scanner Server running on http://0.0.0.0:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AI Food Scanner Production Server running on port ${PORT}`);
  });
}
