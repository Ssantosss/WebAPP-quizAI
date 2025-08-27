'use client';
import { useState } from 'react';
export default function Paywall(){
  const [loading,setLoading]=useState(false);
  async function go(){ setLoading(true);
    const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceId:process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTH??'',plan:'premium'})});
    const {url}=await r.json(); window.location.href=url;
  }
  return (
    <main className="min-h-[100dvh] grid place-items-center text-center">
      <div className="max-w-md w-full px-6">
        <img src="/buddy.png" className="w-36 h-36 mx-auto mb-6" alt=""/>
        <h1 className="text-3xl font-extrabold mb-6">Passa a Premium per continuare</h1>
        <div className="rounded-2xl border p-5 text-left mb-6 flex items-center justify-between">
          <div><div className="font-bold text-xl">Premium</div><div className="text-gray-600">Quiz illimitati, statistiche</div></div>
          <div className="text-2xl font-extrabold">€10/m</div>
        </div>
        <button onClick={go} disabled={loading}
          className="w-full rounded-[20px] bg-[#176d46] text-white py-4 text-lg font-semibold disabled:opacity-60">
          {loading?'Reindirizzo…':'Prosegui'}
        </button>
      </div>
    </main>
  );
}
