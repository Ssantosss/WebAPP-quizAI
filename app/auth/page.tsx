'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import { BuddyThinking } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';
import { t } from '../../lib/i18n';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const login = useApp((s) => s.actions.login);
  const router = useRouter();

  return (
    <main className="container" style={{ paddingBottom: 72, textAlign: 'center' }}>
      <BuddyThinking width={100} className="img-center" />
      <input
        className="input"
        type="email"
        placeholder={t('auth.email_placeholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        onClick={() => {
          login(email);
          router.push('/quiz');
        }}
      >
        {t('auth.cta_login')}
      </Button>
    </main>
  );
}
