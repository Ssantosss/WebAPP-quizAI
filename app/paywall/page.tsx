'use client';

import BuddyMascot from '../../components/BuddyMascot';
import PaywallCard from '../../components/PaywallCard';
import { Plan, useApp } from '../../lib/store';
import { useRouter } from 'next/navigation';
import { t } from '../../lib/i18n';

export default function PaywallPage() {
  const { actions } = useApp((s) => ({ actions: s.actions }));
  const router = useRouter();

  const select = (plan: Plan) => {
    actions.upgrade(plan);
    router.push('/');
  };

  return (
    <main className="container" style={{ paddingBottom: 80 }}>
      <BuddyMascot mood="thinking" />
      <h1>{t('paywall.title')}</h1>
      <PaywallCard
        plan="premium"
        title="Premium"
        description={t('paywall.premium')}
        onSelect={() => select('premium')}
      />
      <PaywallCard
        plan="pro"
        title="Pro"
        description={t('paywall.pro')}
        onSelect={() => select('pro')}
      />
    </main>
  );
}
