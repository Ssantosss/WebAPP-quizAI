import Link from 'next/link';

export default function Success(){
  return (
    <div className="container">
      <h1 className="h1">Pagamento riuscito</h1>
      <Link href="/" className="btn">Torna alla home</Link>
    </div>
  );
}
