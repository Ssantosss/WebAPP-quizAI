'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapture from '../../components/CameraCapture';
import { BuddyThinking } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';
import { canStartQuiz } from '../../lib/quotas';
import { t } from '../../lib/i18n';

type UIState = 'idle'|'loading'|'result';

export default function QuizPage(){
  const router = useRouter();
  const { session, actions, user, recent } = useApp(s=>({ session: s.session, actions: s.actions, user: s.user, recent: s.recent }));
  const [ui,setUi] = useState<UIState>('idle');
  const [pred,setPred] = useState<string>('');
  const [limit,setLimit] = useState(false);

  useEffect(()=>{
    if(!session){
      const ok = canStartQuiz(user, recent);
      if(!ok.ok){ router.push('/paywall'); return; }
      actions.startSession();
    }
  }, [session, actions, user, recent, router]);

  if(!session) return null;

  const count = session.answers.length + (ui==='idle'?1:0);

  const onCapture = async (blob:Blob)=>{
    const base64 = await toBase64(blob);
    setUi('loading');
    try{
      const res = await fetch('/api/analyze',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ imageBase64: base64.split(',')[1], shots: session.shots })});
      if(res.status===429){
        setLimit(true); alert(t('quiz.limit_reached')); setUi('idle'); return;
      }
      const data = await res.json();
      actions.incShot();
      actions.recordAnswer(data.predicted);
      setPred(data.predicted);
      if(session.shots+1 >= 35){ setLimit(true); }
      setUi('result');
    }catch{
      setUi('idle');
    }
  };

  const proceed = ()=> setUi('idle');

  const finish = ()=>{
    const correct = session.answers.length;
    const timeSec = Math.round((Date.now()-session.startedAt)/1000);
    actions.finishSession({ total:30, correct, timeSec });
    router.push(`/dashboard?score=${correct}&time=${timeSec}&shots=${session.shots}`);
  };

  return (
    <main className="container" style={{ position:'relative' }}>
      <div style={{ position:'absolute', top:8, right:8 }}>{count}/30</div>
      {ui==='idle' && <CameraCapture onCapture={onCapture} />}
      {ui==='loading' && (
        <div style={{ textAlign:'center', marginTop:40 }}>
          <BuddyThinking />
          <p>{t('quiz.thinking')}</p>
        </div>
      )}
      {ui==='result' && (
        <div style={{ textAlign:'center', marginTop:40 }}>
          <p>{t('quiz.answer_label',{ X: pred })}</p>
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:16 }}>
            <button className="btn" disabled={limit} onClick={proceed}>{t('quiz.proceed')}</button>
            <button className="btn secondary" onClick={finish}>{t('quiz.finish')}</button>
          </div>
        </div>
      )}
    </main>
  );
}

function toBase64(blob:Blob):Promise<string>{
  return new Promise(res=>{ const r = new FileReader(); r.onload=()=>res(r.result as string); r.readAsDataURL(blob); });
}
