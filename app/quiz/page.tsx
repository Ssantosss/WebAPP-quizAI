'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Buddy from '../../components/Buddy';
import Button from '../../components/Button';
import CameraCapture from '../../components/CameraCapture';
import { useSessionStore } from '../../store/useSessionStore';
import { useUserStore } from '../../store/useUserStore';

export default function QuizPage() {
  const router = useRouter();
  const appendResult = useSessionStore((s) => s.appendResult);
  const endSession = useSessionStore((s) => s.endSession);
  const recordUsage = useUserStore((s) => s.recordUsage);
  const [last, setLast] = useState<
    | { predicted: 'A' | 'B' | 'C' | 'D'; confidence: number; latencyMs: number }
    | null
  >(null);

  const proceed = () => {
    if (last) {
      appendResult({ id: crypto.randomUUID(), ...last });
      recordUsage();
      setLast(null);
    }
  };

  const finish = () => {
    if (last) {
      appendResult({ id: crypto.randomUUID(), ...last });
      recordUsage();
    }
    endSession();
    router.push('/quiz/summary');
  };

  return (
    <main className="container" style={{ paddingBottom: 72, textAlign: 'center' }}>
      <h1 className="h0" style={{ fontSize: 34 }}>Quiz</h1>
      <Buddy className="w-40 h-40 mx-auto my-4" />
      {last === null ? (
        <CameraCapture
          showResultCard={false}
          onAnalyzed={setLast}
          ctaLabel="Scatta foto"
        />
      ) : (
        <div style={{ marginTop: 32 }}>
          <p className="h1">Risposta corretta: {last.predicted}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <Button onClick={proceed}>Procedi</Button>
            <Button variant="secondary" onClick={finish}>
              Termina esame
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
