'use client';

import Button from '../../components/Button';
import Card from '../../components/Card';
import { useApp } from '../../lib/store';
import { t } from '../../lib/i18n';

export default function AccountPage() {
  const { user, actions } = useApp((s) => ({ user: s.user, actions: s.actions }));

  const exportData = async () => {
    await fetch('/api/account/export');
    alert('Dati esportati');
  };

  const deleteAccount = async () => {
    await fetch('/api/account/delete', { method: 'POST' });
    actions.logout();
  };

  return (
    <main className="container" style={{ paddingBottom: 72 }}>
      <h1 className="h1">{t('account.title')}</h1>
      <Card>
        <p>{user.email}</p>
        <p>Piano: {user.plan}</p>
      </Card>
      <Button href="/paywall" variant="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Upgrade
      </Button>
      <Button variant="secondary" onClick={exportData} style={{ display: 'block', marginBottom: 8 }}>
        Esporta dati
      </Button>
      <Button variant="secondary" onClick={deleteAccount} style={{ display: 'block', marginBottom: 8 }}>
        Cancella account
      </Button>
      <Button onClick={() => actions.logout()}>{t('account.logout')}</Button>
    </main>
  );
}
