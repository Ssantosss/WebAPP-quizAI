'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Tabbar(){
  const p = usePathname();
  return (
    <nav className="tabbar">
      <Link href="/" aria-current={p==='/'?'page':undefined}>Home</Link>
      <Link href="/dashboard" aria-current={p.startsWith('/dashboard')?'page':undefined}>Progressi</Link>
      <Link href="/account" aria-current={p.startsWith('/account')?'page':undefined}>Account</Link>
    </nav>
  );
}
