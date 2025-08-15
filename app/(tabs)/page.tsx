'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BuddyHero from '@/components/BuddyHero';
import CourseSubjectPicker, { PickerChange } from '@/components/CourseSubjectPicker';
import { useSessionStore } from '@/store/useSessionStore';
// ⚠️ niente check quote qui: il gating avviene in /quiz dentro CameraCapture

export default function HomePage() {
  const router = useRouter();
  const startSession = useSessionStore((s) => s.startSession);

  const [sel, setSel] = useState<PickerChange>({ course: '', subject: '' });
  const ready = sel.course !== '' && sel.subject !== '';

  const start = () => {
    if (!ready) {
      alert('Seleziona Corso di Laurea e Materia');
      return;
    }
    startSession(sel.course, sel.subject);
    router.push('/quiz');
  };

  return (
    <div className="space-y-6">
      <header className="text-center mt-6">
        <h1 className="h1">Allenati con<br/>Buddy</h1>
      </header>

      <div className="w-full flex justify-center">
        <BuddyHero className="w-48 h-auto" />
      </div>

      <p className="sub text-center">Puoi provare gratis un quiz completo</p>

      <div className="card p-4">
        <CourseSubjectPicker value={sel} onChange={setSel} />
      </div>

      <button
        onClick={start}
        disabled={!ready}
        className="btn-hero w-full disabled:opacity-50 disabled:pointer-events-none"
      >
        Inizia subito
      </button>

      <div className="h-20" />
    </div>
  );
}
