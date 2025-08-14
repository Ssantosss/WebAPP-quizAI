import Link from 'next/link';
import { Buddy } from '../components/BuddyIllustration';
import { t } from '../lib/i18n';

export default function HomePage() {
  return (
    <main className="container">
      <Buddy />
      <h1 className="h0">{t('home.title')}</h1>
      <p className="lead">{t('home.subtitle')}</p>
      <Link href="/auth" className="btn">
        {t('home.cta_start_session')}
      </Link>
    </main>
  );
}
