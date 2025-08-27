'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Thinking() {
  const sp = useSearchParams(); const router = useRouter();
  useEffect(()=>{ const t=setTimeout(()=>router.replace(`/quiz/result?pred=${sp.get('pred')??''}&conf=${sp.get('conf')??0}`),900); return ()=>clearTimeout(t); },[]);
  return (
    <main className="min-h-[100dvh] grid place-items-center text-center">
      <div>
        <h1 className="text-4xl font-extrabold mb-4">Quiz</h1>
        <img src="/buddy-thinking.png" className="w-36 h-36 mx-auto mb-6" alt=""/>
        <p className="text-xl">Buddy sta ragionando…</p>
      </div>
    </main>
  );
}
