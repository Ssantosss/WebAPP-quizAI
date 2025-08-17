'use client';
import { useEffect, useState } from 'react';

type Health = {
  ok: boolean;
  env: { hasUrl: boolean; hasKey: boolean };
  counts: { courses: number; subjects: number };
  errors?: { courses?: string|null; subjects?: string|null };
  error?: string;
};

export default function DebugBanner({ lastError }: { lastError?: string|null }) {
  const [h, setH] = useState<Health | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';
    setVisible(show);
    if (!show) return;
    fetch('/api/health', { cache: 'no-store' })
      .then(r => r.json())
      .then(setH)
      .catch(e => setH({ ok:false, env:{hasUrl:false,hasKey:false}, counts:{courses:0,subjects:0}, error:String(e) }));
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-2 right-2 z-[9999] rounded-xl border bg-white shadow p-3 text-[11px]">
      <div className="font-semibold mb-1">DEBUG</div>
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(h, null, 2)}
      </pre>
      {lastError && <div className="mt-2 text-red-600">pickerError: {lastError}</div>}
    </div>
  );
}
