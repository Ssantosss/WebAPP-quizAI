import Link from 'next/link';

export default function Cancel(){
  return (
    <div className="container">
      <h1 className="h1">Pagamento annullato</h1>
      <Link href="/" className="btn">Riprova</Link>
    </div>
  );
}
