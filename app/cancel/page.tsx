import Button from '../../components/Button';

export default function CancelPage() {
  return (
    <main className="container" style={{ textAlign: 'center', paddingBottom: 72 }}>
      <h1 className="h1">Pagamento annullato</h1>
      <p>La transazione è stata annullata.</p>
      <Button href="/">Torna alla home</Button>
    </main>
  );
}
