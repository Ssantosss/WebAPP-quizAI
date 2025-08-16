'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CourseSubjectPicker, { PickerChange } from '@/components/CourseSubjectPicker';
import BuddyHero from '@/components/BuddyHero';
import { useSessionStore } from '@/store/useSessionStore';

export default function HomePage() {
  const router = useRouter();
  const startSession = useSessionStore(s => s.startSession);

  const [sel, setSel] = useState<PickerChange>({
    courseId: '', courseName: '', subjectId: '', subjectName: ''
  });

  // abilitazione chiara: serve ID di corso e materia
  const ready = Boolean(sel.courseId && sel.subjectId);

  const go = () => {
    if (!ready) return;
    // salviamo i NOMI (fallback sugli ID se mancano)
    startSession(sel.courseName || sel.courseId, sel.subjectName || sel.subjectId);
    router.push('/quiz');
  };

  return (
    <main className="flex-1 p-4 pb-32">
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
          type="button"
          onClick={go}
          disabled={!ready}
          className="btn-hero w-full disabled:opacity-50 disabled:pointer-events-none"
        >
          Inizia subito
        </button>

        <div className="h-20" />
      </div>
    </main>
  );
}
