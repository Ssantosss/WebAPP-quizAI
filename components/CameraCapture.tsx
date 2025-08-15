'use client';
import { useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

type Result = { predicted: 'A'|'B'|'C'|'D'; confidence: number; latencyMs: number };

export default function CameraCapture({
  onAnalyzed,
  onStart,
  showResultCard = true,
  ctaLabel = 'Scatta & Analizza',
}: {
  onAnalyzed?: (r: Result) => void;
  onStart?: () => void;
  showResultCard?: boolean;
  ctaLabel?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const { canUseQuiz, recordUsage } = useUserStore();

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) { console.error('Camera error', e); }
    })();
    return () => { stream && stream.getTracks().forEach(t => t.stop()); };
  }, []);

  const snapAndAnalyze = async () => {
    onStart?.();
    const ok = canUseQuiz();
    if (!ok.allowed) { alert(ok.reason || 'Limite raggiunto'); return; }
    if (!videoRef.current || !canvasRef.current) return;

    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const base64 = c.toDataURL('image/jpeg', 0.92).split(',')[1];

    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, contentType: 'image/jpeg' }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Errore analisi'); return; }
      const r: Result = { predicted: data.predicted, confidence: data.confidence, latencyMs: data.latencyMs };
      setResult(r);
      onAnalyzed?.(r);
      if (showResultCard) recordUsage();
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-neutral-200">
        <video ref={videoRef} playsInline muted className="w-full h-auto bg-black"/>
      </div>
      <canvas ref={canvasRef} className="hidden"/>
      <button className="btn-primary w-full h-14 rounded-2xl" onClick={snapAndAnalyze} disabled={loading}>
        {loading ? 'Analisi…' : ctaLabel}
      </button>

      {showResultCard && result && (
        <div className="card p-4">
          <p className="text-sm text-neutral-500">Risultato</p>
          <p className="text-2xl font-semibold">{result.predicted}</p>
          <p className="text-sm text-neutral-500">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
