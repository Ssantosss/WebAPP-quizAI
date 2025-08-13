'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onCapture(blob: Blob): void;
}

export default function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);

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
    canvas.toBlob((blob) => blob && onCapture(blob), 'image/png');
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCapture(file);
  };

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
      <button className="btn-primary" style={{ marginTop: 8 }} onClick={takePhoto}>
        Scatta
      </button>
    </div>
  );
}
