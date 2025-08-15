'use client';

import Button from '../../components/Button';
import Card from '../../components/Card';
import { Buddy } from '../../components/BuddyIllustration';
import { useRouter } from 'next/navigation';
import { t } from '../../lib/i18n';

export default function PaywallPage() {
  const router = useRouter();

  const checkout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'premium', period: 'month' }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      router.push('/');
    }
  };

  const features = t('paywall.features') as string[];

  return (
    <main className="container" style={{ paddingBottom: 72, textAlign: 'center' }}>
      <Buddy width={100} className="img-center" />
      <h1 className="h1">{t('paywall.title')}</h1>
      <ul style={{ textAlign: 'left', marginBottom: 24 }}>
        {features.map((f, i) => (
          <li key={i}>✓ {f}</li>
        ))}
      </ul>
      <Card>
        <h2 className="h2">{t('paywall.price')}</h2>
        <Button onClick={checkout}>{t('paywall.cta_continue')}</Button>
      </Card>
    </main>
  );
}
