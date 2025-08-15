"use client";
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();
  return (
    <main className="container" style={{ textAlign: 'center', paddingBottom: 72 }}>
      <h1 className="h1">Pagamento annullato</h1>
      <p>La transazione è stata annullata.</p>
      <Button onClick={() => router.push('/')}>Torna alla home</Button>
    </main>
  );
}
