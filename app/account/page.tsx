'use client';

import { BuddyAvatar } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';
import { t } from '../../lib/i18n';

export default function AccountPage() {
  const { user, actions } = useApp((s) => ({ user: s.user, actions: s.actions }));

  return (
    <main className="container">
      <BuddyAvatar />
      <h1 className="h1">{t('account.title')}</h1>
      <div className="card">
        <p>{user.email}</p>
        <p>Piano: {user.plan}</p>
      </div>
      <a
        className="btn secondary"
        href="mailto:info@example.com"
        style={{ display: 'block', marginBottom: 8, textAlign: 'center' }}
      >
        {t('account.contact')}
      </a>
      <button className="btn" onClick={() => actions.logout()}>
        {t('account.logout')}
      </button>
    </main>
  );
}
