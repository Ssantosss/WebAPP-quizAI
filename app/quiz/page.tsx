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
  const endSession = useSessionStore(s => s.endSession);
  const recordUsage = useUserStore(s => s.recordUsage);
  const [last, setLast] = useState<R | null>(null);

  const proceed = () => {
    if (!last) return;
    const item: QuizItem = { id: crypto.randomUUID(), ...last };
    appendResult(item);
    recordUsage();
    setLast(null);
  };

  const finish = () => {
    if (last) {
      const item: QuizItem = { id: crypto.randomUUID(), ...last };
      appendResult(item);
    }
    endSession();
    router.push('/quiz/summary');
  };

  return (
    <div className="container-app p-4 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-semibold">Quiz</h1>
      </header>

      <Buddy className="w-36 h-36 mx-auto" />

      {!last ? (
        <CameraCapture showResultCard={false} ctaLabel="Scatta foto" onAnalyzed={setLast} />
      ) : (
        <div className="space-y-4">
          <p className="text-center text-2xl font-semibold">Risposta corretta: {last.predicted}</p>
          <button onClick={proceed} className="btn-primary w-full h-14 rounded-2xl">Procedi</button>
          <button onClick={finish} className="w-full h-14 rounded-2xl bg-neutral-200 text-neutral-800">Termina esame</button>
        </div>
      )}
    </div>
  );
}
