import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureImage: (base64Data: string, mimeType: string) => void;
  onSelectFile: (file: File) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCaptureImage,
  onSelectFile
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (mode: 'environment' | 'user') => {
    setCameraError(null);
    stopCamera();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('متصفحك الحالي لا يدعم الوصول المباشر للكاميرا. يرجى استخدام زر اختيار صورة من المعرض.');
        return;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('لم نتمكن من تشغيل كاميرا الجوال. تأكد من منح الإذن للكاميرا أو استخدم زر "اختيار صورة من الاستوديو".');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64 = dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      
      setTimeout(() => {
        setIsCapturing(false);
        stopCamera();
        onCaptureImage(base64, 'image/jpeg');
        onClose();
      }, 300);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      onSelectFile(file);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl border border-slate-200 flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">
              تصوير المنتج أو قائمة المكونات
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport or Error */}
        <div className="relative bg-black aspect-3/4 sm:aspect-4/3 w-full overflow-hidden flex items-center justify-center">
          {cameraError ? (
            <div className="p-6 text-center text-white max-w-xs mx-auto">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                {cameraError}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>اختيار صورة من الاستوديو</span>
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Aim Overlay Frame */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
                <div className="w-64 h-64 sm:w-72 sm:h-72 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_0_999px_rgba(0,0,0,0.4)] flex items-center justify-center">
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />

                  {/* Scanning Laser Line */}
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] absolute animate-pulse" />

                  <p className="absolute -bottom-8 text-white/90 text-xs font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                    وجه الكاميرا نحو مكونات الغلاف أو صورة الطعام
                  </p>
                </div>
              </div>

              {/* Flash/Shutter Animation Overlay */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white opacity-80 transition-opacity" />
              )}
            </>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            {/* Gallery Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-medium text-sm border border-slate-300 shadow-xs transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>من الاستوديو</span>
            </button>

            {/* Flip Camera Button */}
            {!cameraError && (
              <button
                onClick={handleSwitchCamera}
                title="تبديل الكاميرا"
                className="p-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Primary Shutter / Scan Button */}
          {!cameraError && (
            <button
              onClick={handleCapturePhoto}
              disabled={isCapturing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isCapturing ? 'جاري الفحص...' : 'التقاط وفحص الصورة الآن'}</span>
            </button>
          )}

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
  );
};
