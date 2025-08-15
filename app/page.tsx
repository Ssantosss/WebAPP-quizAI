import Button from '../components/Button';
import { Buddy } from '../components/BuddyIllustration';
import { t } from '../lib/i18n';

export default function HomePage() {
  return (
    <main className="container" style={{ paddingBottom: 72, textAlign: 'center' }}>
      <Buddy width={120} className="img-center" />
      <h1 className="h0">{t('home.title')}</h1>
      <p className="lead">{t('home.subtitle')}</p>
      <Button href="/auth">{t('home.cta_start_session')}</Button>
    </main>
  );
}
