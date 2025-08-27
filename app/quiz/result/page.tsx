'use client';
import { useRouter, useSearchParams } from 'next/navigation';
export default function ResultPage(){
  const r=useRouter(), sp=useSearchParams();
  const pred=(sp.get('pred')??'').toUpperCase(); const conf=Number(sp.get('conf')??0);
  return (
    <main className="min-h-[100dvh] grid place-items-center text-center">
      <div className="max-w-md w-full px-6">
        <h1 className="text-4xl font-extrabold mb-5">Quiz</h1>
        <img src="/buddy.png" className="w-36 h-36 mx-auto mb-6" alt=""/>
        <p className="text-2xl mb-6">Risposta corretta: <b>{pred||'—'}</b>{conf?` (${conf*100|0}%)`:''}</p>
        <button onClick={()=>r.push('/paywall')} className="w-full rounded-[20px] bg-[#176d46] text-white py-4 text-lg font-semibold mb-3">Procedi</button>
        <button onClick={()=>r.push('/')} className="w-full rounded-[20px] bg-gray-200 text-gray-800 py-4 text-lg font-semibold">Termina esame</button>
      </div>
    </main>
  );
}
