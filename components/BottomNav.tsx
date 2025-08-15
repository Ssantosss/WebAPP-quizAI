'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/progress', label: 'Progressi' },
  { href: '/account', label: 'Account' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="tabbar">
      {tabs.map(t => (
        <Link key={t.href} href={t.href} className={clsx({ 'font-semibold': pathname === t.href })}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
