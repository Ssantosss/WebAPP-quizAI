'use client';
import { useState } from 'react';

const premium = {
  month: process.env.PRICE_PREMIUM_MONTH!,
  '6mo': process.env.PRICE_PREMIUM_6MO!,
  year: process.env.PRICE_PREMIUM_YEAR!,
  '2year': process.env.PRICE_PREMIUM_2YEAR!,
};
const pro = {
  month: process.env.PRICE_PRO_MONTH!,
  '6mo': process.env.PRICE_PRO_6MO!,
  year: process.env.PRICE_PRO_YEAR!,
  '2year': process.env.PRICE_PRO_2YEAR!,
};

export default function PaywallPage(){
  const [tab,setTab]=useState<'premium'|'pro'>('premium');
  const map = tab==='premium'?premium:pro;
  const checkout = async (priceId:string)=>{
    const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceId,plan:tab})});
    const j=await r.json();
    if(j.url) location.href=j.url;
  };
  return (
    <div className="container">
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        <button className="btn" onClick={()=>setTab('premium')} aria-current={tab==='premium'?'page':undefined}>Premium</button>
        <button className="btn" onClick={()=>setTab('pro')} aria-current={tab==='pro'?'page':undefined}>Pro</button>
      </div>
      {Object.entries(map).map(([k,id])=> (
        <div key={k} className="card">
          <h2 className="h2">{label(k)}</h2>
          <button className="btn" onClick={()=>checkout(id)}>Scegli</button>
        </div>
      ))}
    </div>
  );
}

function label(k:string){
  switch(k){
    case 'month': return 'Mensile';
    case '6mo': return '6 Mesi';
    case 'year': return 'Annuale';
    case '2year': return '2 Anni';
    default: return k;
  }
}
