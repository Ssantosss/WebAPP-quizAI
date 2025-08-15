import Button from '../../components/Button';

export default function SuccessPage() {
  return (
    <main className="container" style={{ textAlign: 'center', paddingBottom: 72 }}>
      <h1 className="h1">Pagamento completato</h1>
      <p>Grazie per l'acquisto!</p>
      <Button href="/account">Vai all'account</Button>
    </main>
  );
}
