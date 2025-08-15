'use client';

import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { useUserStore } from '../store/useUserStore';

interface Props {
  onCapture?: (blob: Blob) => void;
  onAnalyzed?: (r: {
    predicted: 'A' | 'B' | 'C' | 'D';
    confidence: number;
    latencyMs: number;
  }) => void;
  showResultCard?: boolean;
  ctaLabel?: string;
}

export default function CameraCapture({
  onCapture,
  onAnalyzed,
  showResultCard = true,
  ctaLabel,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [result, setResult] = useState<
    | { predicted: 'A' | 'B' | 'C' | 'D'; confidence: number; latencyMs: number }
    | null
  >(null);

  useEffect(() => {
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch {
        setHasPermission(false);
      }
    }
    init();
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      if (onAnalyzed) {
        const { canUseQuiz } = useUserStore.getState();
        if (!canUseQuiz()) {
          alert('Limite raggiunto');
          return;
        }
        const base64 = await toBase64(blob);
        const t0 = performance.now();
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64.split(',')[1] }),
        });
        const data = await res.json();
        const latency = performance.now() - t0;
        const r = {
          predicted: data.predicted as 'A' | 'B' | 'C' | 'D',
          confidence: data.confidence ?? 0,
          latencyMs: latency,
        };
        setResult(r);
        onAnalyzed(r);
      } else {
        onCapture && onCapture(blob);
      }
    }, 'image/png');
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCapture?.(file);
  };

  const label = ctaLabel ?? (onAnalyzed ? 'Scatta & Analizza' : 'Scatta');

  if (!hasPermission) {
    return (
      <div>
        <input type="file" accept="image/*" onChange={onFile} />
      </div>
    );
  }

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      <Button onClick={takePhoto} style={{ marginTop: 8 }}>{label}</Button>
      {result && showResultCard && (
        <div className="card" style={{ textAlign: 'center', marginTop: 16 }}>
          <p>Risposta corretta: {result.predicted}</p>
          <small>Confidenza {(result.confidence * 100).toFixed(1)}%</small>
        </div>
      )}
    </div>
  );
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.readAsDataURL(blob);
  });
}
