'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapture from '../../components/CameraCapture';
import Button from '../../components/Button';
import { BuddyThinking } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';
import { t } from '../../lib/i18n';
import { quizzesLeft } from '../../lib/quotas';

type UIState = 'idle' | 'loading' | 'result';

export default function QuizPage() {
  const router = useRouter();
  const { session, actions, user, usage } = useApp((s) => ({
    session: s.session,
    actions: s.actions,
    user: s.user,
    usage: s.usage,
  }));
  const [ui, setUi] = useState<UIState>('idle');
  const [pred, setPred] = useState('');

  useEffect(() => {
    if (!session) {
      const ok = actions.startSession();
      if (!ok) {
        router.push('/paywall');
      }
    }
  }, [session, actions, router]);

  if (!session) return null;

  const count = session.answers.length + (ui === 'idle' ? 1 : 0);

  const onCapture = async (blob: Blob) => {
    const base64 = await toBase64(blob);
    setUi('loading');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-plan': user.plan },
        body: JSON.stringify({ imageBase64: base64.split(',')[1] }),
      });
      if (res.status === 429) {
        alert(t('quiz.limit_reached'));
        setUi('idle');
        return;
      }
      const data = await res.json();
      actions.incShot();
      actions.recordAnswer(data.predicted);
      setPred(data.predicted);
      setUi('result');
    } catch {
      setUi('idle');
    }
  };

  const proceed = () => setUi('idle');

  const finish = () => {
    const correct = session.answers.length;
    const timeSec = Math.round((Date.now() - session.startedAt) / 1000);
    actions.finishSession({ total: 30, correct, timeSec });
    router.push(`/dashboard?score=${correct}&time=${timeSec}&shots=${session.shots}`);
  };

  const remaining = quizzesLeft(user.plan, usage);

  return (
    <main className="container" style={{ paddingBottom: 72, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, right: 8 }}>{count}/30</div>
      {ui === 'idle' && <CameraCapture onCapture={onCapture} />}
      {ui === 'loading' && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <BuddyThinking width={80} className="img-center" />
          <p>{t('quiz.thinking')}</p>
        </div>
      )}
      {ui === 'result' && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p>{t('quiz.answer_label', { X: pred })}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <Button onClick={proceed} disabled={false}>
              {t('quiz.proceed')}
            </Button>
            <Button variant="secondary" onClick={finish}>
              {t('quiz.finish')}
            </Button>
          </div>
        </div>
      )}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <small>Quiz rimasti oggi: {remaining === Infinity ? '∞' : remaining}</small>
      </div>
    </main>
  );
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.readAsDataURL(blob);
  });
}
