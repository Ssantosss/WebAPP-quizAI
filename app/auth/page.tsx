'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuddyBook } from '../../components/BuddyIllustration';
import { useApp } from '../../lib/store';

export default function AuthPage(){
  const [email,setEmail]=useState('');
  const login=useApp(s=>s.actions.login);
  const router=useRouter();
  return (
    <div className="container">
      <BuddyBook />
      <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <button className="btn" onClick={()=>{login(email);router.push('/quiz');}}>Accedi / Registrati</button>
    </div>
  );
}
