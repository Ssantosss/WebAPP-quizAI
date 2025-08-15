"use client";
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  return (
    <main className="container" style={{ textAlign: 'center', paddingBottom: 72 }}>
      <h1 className="h1">Pagamento completato</h1>
      <p>Grazie per l'acquisto!</p>
      <Button onClick={() => router.push('/account')}>Vai all'account</Button>
    </main>
  );
}
