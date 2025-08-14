'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuddyThinking } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';
import { canStartQuiz } from '../../lib/quotas';

export default function QuizPage(){
  const router = useRouter();
  const { user, recent, session, actions } = useApp(s=>({user:s.user,recent:s.recent,session:s.session,actions:s.actions}));
  const [ui,setUi]=useState<'idle'|'loading'|'result'>('idle');
  const [pred,setPred]=useState('');

  useEffect(()=>{
    if(!session){
      const chk = canStartQuiz(user,recent);
      if(!chk.ok){ alert(chk.reason==='daily'?"Limite giornaliero raggiunto":"Limite totale raggiunto"); router.push('/paywall'); return; }
      actions.startSession();
    }
  },[session,user,recent,actions,router]);

  if(!session) return null;
  const limit = session.shots>=35;

  const onFile = async (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0]; if(!file) return;
    const base64=await toBase64(file);
    setUi('loading');
    try{
      const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageBase64:base64.split(',')[1]})});
      const data=await res.json();
      actions.incShot();
      actions.recordAnswer(data.predicted);
      setPred(data.predicted);
      setUi('result');
    }catch{ setUi('idle'); }
  };

  const proceed=()=>{setUi('idle');};
  const finish=()=>{actions.finishSession({total:session.answers.length,correct:session.answers.length,timeSec:0});router.push('/dashboard');};

  return (
    <div className="container">
      {ui==='idle' && (
        <input className="input" type="file" accept="image/*" capture="environment" onChange={onFile} disabled={limit} />
      )}
      {ui==='loading' && (
        <div style={{textAlign:'center'}}>
          <BuddyThinking />
          <p className="lead">Analisi in corso...</p>
        </div>
      )}
      {ui==='result' && (
        <div style={{textAlign:'center'}}>
          <p className="lead">Risposta corretta: {pred}</p>
          <div style={{display:'flex',gap:8,justifyContent:'center'}}>
            <button className="btn" onClick={proceed} disabled={limit}>Procedi</button>
            <button className="btn secondary" onClick={finish}>Termina esame</button>
          </div>
        </div>
      )}
    </div>
  );
}

function toBase64(file:File){
  return new Promise<string>((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result as string);r.onerror=rej;r.readAsDataURL(file);});
}
