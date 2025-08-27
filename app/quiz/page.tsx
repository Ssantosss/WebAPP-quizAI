'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizScan() {
  const v = useRef<HTMLVideoElement>(null);
  const c = useRef<HTMLCanvasElement>(null);
  const [err,setErr] = useState(''); const [busy,setBusy] = useState(false);
  const router = useRouter();

  useEffect(()=>{ (async()=>{ try{
    const s = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment' }, audio:false });
    v.current!.srcObject = s; await v.current!.play();
  } catch(e:any){ setErr(e.message??String(e)); }})(); 
  return ()=>{ (v.current?.srcObject as MediaStream|undefined)?.getTracks().forEach(t=>t.stop()); };},[]);

  async function snap() {
    if(!v.current||!c.current) return; setBusy(true);
    c.current.width = v.current.videoWidth; c.current.height = v.current.videoHeight;
    c.current.getContext('2d')!.drawImage(v.current,0,0,c.current.width,c.current.height);
    const blob = await new Promise<Blob|null>(r=>c.current!.toBlob(r,'image/jpeg',0.92));
    if(!blob){ setBusy(false); return; }
    const base64 = await (async (b:Blob)=>{const a=await b.arrayBuffer();let s='';new Uint8Array(a).forEach(x=>s+=String.fromCharCode(x));return `data:image/jpeg;base64,${btoa(s)}`;})(blob);
    const t0 = performance.now();
    const res = await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify({base64,contentType:'image/jpeg'})});
    const data = await res.json(); const lat = Math.round(performance.now()-t0);
    router.push(`/quiz/thinking?pred=${data?.predicted??''}&conf=${data?.confidence??0}&lat=${lat}`);
  }

  return (
    <main className="min-h-[100dvh] w-full bg-black text-white">
      <header className="text-center pt-8 pb-3"><h1 className="text-4xl font-extrabold">Quiz</h1></header>
      <section className="px-4">
        <div className="mx-auto max-w-md rounded-3xl overflow-hidden border border-white/10 relative">
          <video ref={v} playsInline className="w-full h-auto" />
          <div className="pointer-events-none absolute inset-0 ring-2 ring-white/70 rounded-xl m-6" />
        </div>
        {!!err && <p className="mt-3 text-red-300 text-sm">{err}</p>}
        <button onClick={snap} disabled={busy}
          className="mt-6 w-full rounded-[20px] bg-white text-black py-4 text-lg font-semibold disabled:opacity-60">
          {busy?'Invio…':'Inquadra e invia'}
        </button>
        <canvas ref={c} className="hidden" />
      </section>
    </main>
  );
}
