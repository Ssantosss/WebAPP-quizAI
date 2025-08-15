'use client';
import Buddy from '@/components/Buddy';
import Button from '@/components/Button';

export default function PaywallPage() {
  return (
    <div className="container-app p-4 space-y-6">
      <h1 className="h2 text-center">Passa a Premium<br/>per continuare</h1>
      <Buddy className="w-44 h-44 mx-auto" />
      <ul className="space-y-2 text-[18px]">
        <li>✓ Quiz illimitati</li>
        <li>✓ Statistiche avanzate</li>
        <li>✓ Salvataggio progressi</li>
      </ul>
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-semibold">Premium</div>
            <div className="text-neutral-600">€10/mese</div>
          </div>
          <div className="text-2xl font-semibold">€10/m</div>
        </div>
      </div>
      <Button className="w-full">Prosegui</Button>
    </div>
  );
}
