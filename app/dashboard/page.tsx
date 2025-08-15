'use client';

import { useSearchParams } from 'next/navigation';
import Card from '../../components/Card';
import { useApp } from '../../lib/store';
import { t } from '../../lib/i18n';

export default function DashboardPage() {
  const params = useSearchParams();
  const score = Number(params.get('score') || 0);
  const time = Number(params.get('time') || 0);
  const shots = Number(params.get('shots') || 0);
  const { recent } = useApp((s) => ({ recent: s.recent }));

  return (
    <main className="container" style={{ paddingBottom: 72 }}>
      <h1 className="h1">{t('dashboard.title')}</h1>
      {params.has('score') && (
        <Card>
          <h2 className="h2">{t('summary.title')}</h2>
          <p>{t('summary.score')}: {score}/30</p>
          <p>{t('summary.accuracy')}: {Math.round((score / 30) * 100)}%</p>
          <p>{t('summary.time')}: {time}s</p>
          <p>{t('summary.shots')}: {shots}</p>
        </Card>
      )}
      <h3>{t('summary.recent')}</h3>
      <div>
        {recent.map((r, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{r.date}</span>
              <span>{r.correct}/{r.total}</span>
            </div>
            <div className="progress" style={{ marginTop: 4 }}>
              <span style={{ width: `${(r.correct / r.total) * 100}%` }} />
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
