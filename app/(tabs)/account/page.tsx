'use client';
import Buddy from '@/components/Buddy';
export default function AccountPage() {
  return (
    <div className="space-y-6">
      <header className="text-center mt-2">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
          <Buddy className="w-16 h-16" />
        </div>
        <h1 className="h2 mt-2">Account</h1>
      </header>

      <div className="card p-4 space-y-4">
        <div>
          <div className="text-neutral-600">Email</div>
          <div className="text-[17px] font-medium">jack@example.com</div>
        </div>
        <hr className="border-neutral-200" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-neutral-600">Piano</div>
            <div className="text-[17px] font-medium">Premium</div>
          </div>
          <a className="text-brand font-medium" href="/paywall">Gestisci abbonamento ›</a>
        </div>
      </div>

      <div className="card p-4"><a className="text-brand font-medium" href="mailto:hello@example.com">Contattaci</a></div>
      <div className="text-center text-red-600 font-semibold">Esci</div>
    </div>
  );
}
