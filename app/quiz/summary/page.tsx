'use client';
import Buddy from '@/components/Buddy';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/useSessionStore';

export default function SummaryPage() {
  const router = useRouter();
  const { items, course, subject, startedAt, endedAt, resetSession } = useSessionStore();
  const duration = startedAt && endedAt ? Math.max(1, Math.round((endedAt - startedAt)/1000)) : 0;

  return (
    <div className="container-app p-4 space-y-5">
      <h1 className="h2 text-center">Esame completato</h1>
      <Buddy className="w-40 h-40 mx-auto" />

      <div className="card p-4">
        <div className="grid grid-cols-2 gap-y-2 text-[17px]">
          <div className="text-neutral-600">Punteggio</div><div className="text-right font-semibold">{items.length}/30</div>
          <div className="text-neutral-600">Precisione</div><div className="text-right font-semibold">90%</div>
          <div className="text-neutral-600">Tempo</div><div className="text-right font-semibold">{duration}s</div>
          <div className="text-neutral-600">Scatti</div><div className="text-right font-semibold">{items.length}</div>
        </div>
      </div>

      <Button className="w-full">Rivedi errori</Button>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline">Condividi</Button>
        <Button variant="outline" onClick={() => { resetSession(); router.push('/'); }}>Nuova se</Button>
      </div>
    </div>
  );
}
