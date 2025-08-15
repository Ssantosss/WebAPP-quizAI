'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Buddy from '@/components/Buddy';
import CameraCapture from '@/components/CameraCapture';
import { useSessionStore, QuizItem } from '@/store/useSessionStore';
import { useUserStore } from '@/store/useUserStore';

type R = { predicted: 'A'|'B'|'C'|'D'; confidence: number; latencyMs: number };

export default function QuizPage() {
  const router = useRouter();
  const appendResult = useSessionStore(s => s.appendResult);
  const endSession   = useSessionStore(s => s.endSession);
  const recordUsage  = useUserStore(s => s.recordUsage);
  const [last, setLast] = useState<R | null>(null);
  const [thinking, setThinking] = useState(false);

  const onAnalyzed = (r: R) => { setThinking(false); setLast(r); };
  const proceed = () => {
    if (!last) return;
    const item: QuizItem = { id: crypto.randomUUID(), ...last };
    appendResult(item); recordUsage(); setLast(null);
  };
  const finish = () => {
    if (last) appendResult({ id: crypto.randomUUID(), ...last });
    endSession(); router.push('/quiz/summary');
  };

  return (
    <div className="container-app p-4 space-y-6">
      <header className="text-center mt-4"><h1 className="h2">Quiz</h1></header>
      <Buddy className="w-44 h-44 mx-auto" variant={thinking ? 'thinking' : 'happy'} />

      {!last ? (
        <>
          {thinking && <p className="sub text-center">Buddy sta ragionando…</p>}
          <CameraCapture
            showResultCard={false}
            ctaLabel="Scatta foto"
            onAnalyzed={onAnalyzed}
            onStart={() => setThinking(true)}
          />
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-2xl font-semibold">Risposta corretta: {last.predicted}</p>
          <button onClick={proceed} className="btn-hero w-full">Procedi</button>
          <button onClick={finish} className="btn-ghost w-full">Termina esame</button>
        </div>
      )}
    </div>
  );
}
