'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabBar(){
  const path = usePathname();
  const item = (href:string, label:string)=> (
    <Link href={href} className={path===href? 'active':''}>{label}</Link>
  );
  return (
    <nav className="tabbar">
      {item('/', 'Home')}
      {item('/dashboard', 'Progressi')}
      {item('/account', 'Account')}
    </nav>
  );
}
