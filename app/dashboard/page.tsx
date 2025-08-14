'use client';

import { useSearchParams } from 'next/navigation';
import { useApp } from '../../lib/store';
import { t } from '../../lib/i18n';

export default function DashboardPage() {
  const params = useSearchParams();
  const score = Number(params.get('score') || 0);
  const time = Number(params.get('time') || 0);
  const shots = Number(params.get('shots') || 0);
  const { recent } = useApp((s) => ({ recent: s.recent }));

  return (
    <main className="container">
      <h1 className="h1">{t('dashboard.title')}</h1>
      {params.has('score') && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h2 className="h2">{t('summary.title')}</h2>
          <p>{t('summary.score')}: {score}/30</p>
          <p>{t('summary.accuracy')}: {Math.round((score/30)*100)}%</p>
          <p>{t('summary.time')}: {time}s</p>
          <p>{t('summary.shots')}: {shots}/35</p>
        </div>
      )}
      <h3>{t('summary.recent')}</h3>
      <div>
        {recent.map((r,i)=>(
          <div key={i} className="card" style={{ marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>{r.date}</span>
              <span>{r.correct}/{r.total}</span>
            </div>
            <div style={{ height:4, background:'#eee', marginTop:4 }}>
              <div style={{ width:`${(r.correct/r.total)*100}%`, height:'100%', background:'#0a0' }}></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
