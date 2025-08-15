'use client';

import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatBar from '@/components/StatBar';
import { useApp } from '@/lib/store';
import { t } from '@/lib/i18n';

export default function DashboardPage() {
  const params = useSearchParams();
  const score = Number(params.get('score') || 0);
  const time = Number(params.get('time') || 0);
  const shots = Number(params.get('shots') || 0);
  const { recent, usage } = useApp((s) => ({ recent: s.recent, usage: s.usage }));

  const totalAnswered = recent.reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = recent.reduce((sum, r) => sum + r.correct, 0);
  const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div>
      <h1 className="h1">{t('dashboard.title')}</h1>
      <Card>
        <h2 className="h2">Buddy</h2>
        <StatBar label="Quiz completati" value={usage.total} max={30} />
        <StatBar label="Precisione" value={accuracy} max={100} suffix="%" />
        <StatBar label="Quiz al giorno" value={usage.daily.count} max={10} />
      </Card>
      {params.has('score') && (
        <Card>
          <h2 className="h2">{t('summary.title')}</h2>
          <p>{t('summary.score')}: {score}/30</p>
          <p>{t('summary.accuracy')}: {Math.round((score / 30) * 100)}%</p>
          <p>{t('summary.time')}: {time}s</p>
          <p>{t('summary.shots')}: {shots}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => alert('TODO')}>{t('summary.review')}</Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ text: `Ho fatto ${score}/30 con Buddy!` });
                }
              }}
            >
              {t('summary.share')}
            </Button>
            <Button href="/quiz">{t('summary.new_session')}</Button>
          </div>
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
    </div>
  );
}
