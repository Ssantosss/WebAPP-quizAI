import Link from 'next/link';
import { Buddy } from '../components/BuddyIllustration';

export default function HomePage() {
  return (
    <div className="container">
      <h1 className="h0">Allenati con Buddy</h1>
      <Buddy />
      <p className="lead">Scatta le domande e preparati per l'esame.</p>
      <Link href="/auth" className="btn">Inizia subito</Link>
    </div>
  );
}
