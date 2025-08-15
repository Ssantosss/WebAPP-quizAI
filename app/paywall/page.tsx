'use client';

import Button from '../../components/Button';
import Card from '../../components/Card';
import { useRouter } from 'next/navigation';

export default function PaywallPage() {
  const router = useRouter();

  const checkout = async (plan: 'premium' | 'pro') => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, period: 'month' }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      router.push('/');
    }
  };

  return (
    <main className="container" style={{ paddingBottom: 72 }}>
      <h1 className="h1">Scegli il tuo piano</h1>
      <Card>
        <h2>Premium</h2>
        <p>7 quiz al giorno</p>
        <Button onClick={() => checkout('premium')}>Iscriviti</Button>
      </Card>
      <Card>
        <h2>Pro</h2>
        <p>Quiz illimitati</p>
        <Button onClick={() => checkout('pro')}>Iscriviti</Button>
      </Card>
    </main>
  );
}
