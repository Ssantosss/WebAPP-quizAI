'use client';
import Link from 'next/link';
import { BuddyAvatar } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';

export default function AccountPage(){
  const { user, actions } = useApp(s=>({user:s.user,actions:s.actions}));
  return (
    <div className="container">
      <BuddyAvatar />
      <p className="lead">{user.email || 'Anonimo'} – piano {user.plan}</p>
      <Link href="/paywall" className="btn" style={{marginBottom:16}}>Gestisci abbonamento</Link>
      <p><a href="mailto:info@example.com">Supporto</a></p>
      <p>
        <Link href="/privacy">Privacy</Link> · <Link href="/cookies">Cookies</Link> · <Link href="/terms">Termini</Link>
      </p>
      <div style={{display:'flex',gap:8,margin:'16px 0'}}>
        <button className="btn secondary" onClick={()=>fetch('/api/account/export').then(r=>r.json()).then(j=>console.log(j))}>Export</button>
        <button className="btn secondary" onClick={()=>fetch('/api/account/delete',{method:'POST'}).then(()=>actions.logout())}>Delete</button>
      </div>
      <button className="btn secondary" onClick={()=>{actions.logout(); location.href='/'}}>Esci</button>
    </div>
  );
}
