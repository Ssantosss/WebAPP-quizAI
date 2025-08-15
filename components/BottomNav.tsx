'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const items = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/progress', label: 'Progressi', icon: 'stats' },
  { href: '/account', label: 'Account', icon: 'user' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50">
      <div className="mx-auto max-w-md backdrop-blur bg-white/95 border-t border-neutral-200">
        <div className="grid grid-cols-3 px-2 py-2.5">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={clsx(
                  'flex flex-col items-center gap-1 py-1 rounded-xl',
                  active ? 'text-[#176d46] font-medium' : 'text-neutral-700'
                )}
              >
                <svg className="w-6 h-6" aria-hidden><use href={`/icons.svg#${it.icon}`} /></svg>
                <span className="text-xs">{it.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
