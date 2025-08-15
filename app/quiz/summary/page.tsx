'use client';

import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import { useSessionStore } from '../../../store/useSessionStore';

export default function SummaryPage() {
  const router = useRouter();
  const { session, resetSession } = useSessionStore((s) => ({
    session: s.session,
    resetSession: s.resetSession,
  }));

  if (session.status !== 'ended') return null;

  const duration = session.startedAt && session.endedAt
    ? Math.round((session.endedAt - session.startedAt) / 1000)
    : 0;

  return (
    <main className="container" style={{ paddingBottom: 72, textAlign: 'center' }}>
      <h1 className="h0" style={{ fontSize: 34 }}>Esame terminato</h1>
      <p className="lead">
        {session.course} · {session.subject} · durata {duration}s · domande {session.items.length}
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {session.items.map((it, idx) => (
          <li key={it.id} className="card" style={{ marginBottom: 8 }}>
            #{idx + 1} — {it.predicted} ({Math.round(it.confidence * 100)}%)
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button
          onClick={() => {
            resetSession();
            router.push('/');
          }}
        >
          Nuova sessione
        </Button>
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
          Vai ai Progressi
        </Button>
      </div>
    </main>
  );
}
