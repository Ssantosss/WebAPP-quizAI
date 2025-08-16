'use client';

import { useState } from 'react';
import Link from 'next/link';
import BuddyHero from '@/components/BuddyHero';
import CourseSubjectPicker, { PickerChange } from '@/components/CourseSubjectPicker';
import { useSessionStore } from '@/store/useSessionStore';

export default function HomePage() {
  const startSession = useSessionStore(s => s.startSession);
  const [sel, setSel] = useState<PickerChange>({ course: '', subject: '' });

  const ready = sel.course !== '' && sel.subject !== '';

  return (
    <main className="flex-1 p-4 pb-32">{/* spazio per non far coprire la CTA dalla bottom-nav */}
      <div className="space-y-6">
        <header className="text-center mt-6">
          <h1 className="h1">Allenati con<br/>Buddy</h1>
        </header>

        {/* FOTO UFFICIALE */}
        <div className="w-full flex justify-center">
          <BuddyHero className="w-48 h-auto" />
        </div>

        <p className="sub text-center">Puoi provare gratis un quiz completo</p>

        <div className="card p-4">
          {/* Picker CONTROLLATO */}
          <CourseSubjectPicker value={sel} onChange={setSel} />
        </div>

        {/* CTA: quando pronto, è un <Link> che salva la sessione e NAVIGA */}
        {ready ? (
          <Link
            href="/quiz"
            prefetch={false}
            onClick={() => startSession(sel.course, sel.subject)}
            className="btn-hero w-full"
          >
            Inizia subito
          </Link>
        ) : (
          <button type="button" className="btn-hero w-full opacity-50 pointer-events-none">
            Inizia subito
          </button>
        )}

        <div className="h-20" />
      </div>
    </main>
  );
}
