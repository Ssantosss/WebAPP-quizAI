'use client';

import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/useSessionStore';

export default function SummaryPage() {
  const router = useRouter();
  const { items, course, subject, startedAt, endedAt, resetSession } = useSessionStore();

  const duration = startedAt && endedAt ? Math.round((endedAt - startedAt) / 1000) : 0;

  return (
    <div className="container-app p-4 space-y-4">
      <h1 className="text-3xl font-semibold">Esame terminato</h1>
      <p className="text-neutral-600">
        {course && <span>{course}</span>} {subject && <span>· {subject}</span>} · {items.length} domande · {duration}s
      </p>

      <div className="card p-3">
        <ul className="divide-y divide-neutral-200">
          {items.map((it, i) => (
            <li key={it.id} className="py-2 flex items-center justify-between">
              <span className="text-neutral-600">#{i + 1}</span>
              <span className="font-semibold text-lg">{it.predicted}</span>
              <span className="text-neutral-500 text-sm">{(it.confidence * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          className="w-full h-12 rounded-2xl bg-neutral-200 text-neutral-800"
          onClick={() => { resetSession(); router.push('/'); }}
        >
          Nuova sessione
        </button>
        <button
          className="btn-primary h-12 rounded-2xl"
          onClick={() => router.push('/progress')}
        >
          Vai ai Progressi
        </button>
      </div>
    </div>
  );
}
