import Link from 'next/link';
import BuddyMascot from '../components/BuddyMascot';
import { t } from '../lib/i18n';

export default function HomePage() {
  return (
    <main className="container" style={{ paddingBottom: 80 }}>
      <BuddyMascot mood="welcome" />
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <Link href="/auth" className="btn-primary">
        {t('home.cta_start_session')}
      </Link>
    </main>
  );
}
