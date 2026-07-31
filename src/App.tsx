import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ScannerSection } from './components/ScannerSection';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { CameraModal } from './components/CameraModal';
import { ENumbersGuideView } from './components/ENumbersGuideView';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { FoodAnalysisResult } from './types';
import { playScanSound } from './utils/sound';
import { AlertCircle, ArrowUp, RefreshCw, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'halal_scanner_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'guide' | 'history' | 'about'>('scanner');
  const [currentResult, setCurrentResult] = useState<FoodAnalysisResult | null>(null);
  const [history, setHistory] = useState<FoodAnalysisResult[]>([]);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  // Save history to localStorage
  const saveHistoryToStorage = (newHistory: FoodAnalysisResult[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (err) {
      console.error('Failed to save history:', err);
    }
  };

  const handleToggleSaveResult = (result: FoodAnalysisResult) => {
    const exists = history.some((h) => h.id === result.id);
    if (exists) {
      const filtered = history.filter((h) => h.id !== result.id);
      saveHistoryToStorage(filtered);
    } else {
      const updated = [result, ...history];
      saveHistoryToStorage(updated);
    }
  };

  const isCurrentResultSaved = currentResult
    ? history.some((h) => h.id === currentResult.id)
    : false;

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
        resolve({ base64, mimeType: file.type || 'image/jpeg' });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Main Food Analyzer call to server /api/analyze-food
  const runFoodAnalysis = async (payload: {
    sourceType: 'image' | 'text';
    imageBase64?: string;
    imageMimeType?: string;
    queryText?: string;
  }) => {
    setIsLoading(true);
    setErrorBanner(null);
    setLoadingMessage('جاري فحص الطعام وتحليل المكونات ومطابقة الأدلة العلمية والشرعية...');

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`خطأ في السيرفر: ${res.status}`);
      }

      const data: FoodAnalysisResult = await res.json();
      setCurrentResult(data);

      // Play chime according to status
      playScanSound(data.status);

      // Automatically add to history if not duplicate
      if (data && data.id) {
        setHistory((prev) => {
          const exists = prev.some((h) => h.name === data.name && h.status === data.status);
          if (exists) return prev;
          const newArr = [data, ...prev].slice(0, 50); // Keep last 50
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newArr));
          } catch {}
          return newArr;
        });
      }

      setActiveTab('scanner');

      // Scroll smoothly to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Food analysis error:', err);
      setErrorBanner('تعذر الاتصال بالسيرفر، تأكد من اتصالك بالإنترنت وسنحاول مرة أخرى.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleAnalyzeText = (text: string) => {
    runFoodAnalysis({
      sourceType: 'text',
      queryText: text
    });
  };

  const handleCaptureFromCameraModal = (base64Data: string, mimeType: string) => {
    runFoodAnalysis({
      sourceType: 'image',
      imageBase64: base64Data,
      imageMimeType: mimeType,
      queryText: 'صورة ملتقطة بكاميرا الجوال لفحص الطعام'
    });
  };

  const handleSelectImageFile = async (file: File) => {
    try {
      const { base64, mimeType } = await fileToBase64(file);
      runFoodAnalysis({
        sourceType: 'image',
        imageBase64: base64,
        imageMimeType: mimeType,
        queryText: `فحص صورة العبوة/المكونات (${file.name})`
      });
    } catch (err) {
      setErrorBanner('حدث خطأ في قراءة الصورة. يرجى اختيار صورة بصيغة JPG أو PNG.');
    }
  };

  const handleSelectENumberForScan = (code: string) => {
    setActiveTab('scanner');
    runFoodAnalysis({
      sourceType: 'text',
      queryText: `فحص الرمز الغذائي: ${code}`
    });
  };

  const handleSelectHistoryItem = (result: FoodAnalysisResult) => {
    setCurrentResult(result);
    setActiveTab('scanner');
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClearHistory = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح سجل الفحوصات؟')) {
      saveHistoryToStorage([]);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistoryToStorage(updated);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex flex-col justify-between"
    >
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        onOpenLiveCamera={() => setIsCameraModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 w-full flex-1 space-y-6">
        {/* Error Notification Banner */}
        {errorBanner && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-xs font-bold text-rose-700 hover:underline shrink-0"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-200 text-center space-y-4 animate-in fade-in">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                جاري فحص الطعام وتحليل المكونات...
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {loadingMessage || 'يتم تدقيق المادة العلمية ومطابقة الحكم الشرعي للمكونات والمضافات'}
              </p>
            </div>
          </div>
        )}

        {/* VIEW 1: SCANNER & ACTIVE RESULTS */}
        {activeTab === 'scanner' && (
          <div className="space-y-8">
            <ScannerSection
              onAnalyzeText={handleAnalyzeText}
              onOpenCameraModal={() => setIsCameraModalOpen(true)}
              onSelectImageFile={handleSelectImageFile}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />

            {/* Analysis Result Display */}
            {currentResult && !isLoading && (
              <div ref={resultRef} className="pt-2">
                <AnalysisResultCard
                  result={currentResult}
                  onSaveToHistory={handleToggleSaveResult}
                  isSaved={isCurrentResultSaved}
                  onScanAnother={() => {
                    setCurrentResult(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: E-NUMBERS REFERENCE GUIDE */}
        {activeTab === 'guide' && (
          <ENumbersGuideView onSelectENumberForScan={handleSelectENumberForScan} />
        )}

        {/* VIEW 3: SAVED HISTORY */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectResult={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            onDeleteResult={handleDeleteHistoryItem}
          />
        )}

        {/* VIEW 4: ABOUT THE APPLICATION */}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Live Camera Scanner Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCaptureImage={handleCaptureFromCameraModal}
        onSelectFile={handleSelectImageFile}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
