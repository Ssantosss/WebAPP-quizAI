'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuddyBook } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';
import { t } from '../../lib/i18n';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const login = useApp((s) => s.actions.login);
  const router = useRouter();

  return (
    <main className="container">
      <BuddyBook />
      <input
        className="input"
        type="email"
        placeholder={t('auth.email_placeholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="btn"
        style={{ marginTop: 16 }}
        onClick={() => {
          login(email);
          router.push('/quiz');
        }}
      >
        {t('auth.cta_login')}
      </button>
    </main>
  );
}
