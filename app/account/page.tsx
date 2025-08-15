'use client';

import Button from '../../components/Button';
import Card from '../../components/Card';
import { BuddyAvatar } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';
import { t } from '../../lib/i18n';

export default function AccountPage() {
  const { user, actions } = useApp((s) => ({ user: s.user, actions: s.actions }));

  return (
    <main className="container" style={{ paddingBottom: 72, textAlign: 'center' }}>
      <BuddyAvatar width={80} className="img-center" />
      <h1 className="h1">{t('account.title')}</h1>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Email</span>
          <span>{user.email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Piano</span>
          <span>
            {user.plan}{' '}
            <a href="/paywall" style={{ color: 'var(--color-brand)', marginLeft: 4 }}>
              {t('account.manage_plan')}
            </a>
          </span>
        </div>
      </Card>
      <Card>
        <a href="mailto:support@example.com" style={{ color: 'var(--color-brand)' }}>
          {t('account.contact')}
        </a>
      </Card>
      <Button
        variant="secondary"
        onClick={() => actions.logout()}
        style={{ color: '#d00', marginTop: 16 }}
      >
        {t('account.logout')}
      </Button>
    </main>
  );
}
