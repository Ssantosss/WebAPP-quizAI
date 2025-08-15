'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Buddy from '@/components/Buddy';
import CourseSubjectPicker, { PickerChange } from '@/components/CourseSubjectPicker';
import { useSessionStore } from '@/store/useSessionStore';
import { useUserStore } from '@/store/useUserStore';

export default function HomePage() {
  const router = useRouter();
  const startSession = useSessionStore(s => s.startSession);
  const canUseQuiz = useUserStore(s => s.canUseQuiz);
  const [sel, setSel] = useState<PickerChange>({ course: '', subject: '' });

  const start = () => {
    const ok = canUseQuiz();
    if (!ok.allowed) { alert(ok.reason || 'Limite raggiunto'); return; }
    if (!sel.course || !sel.subject) return;
    startSession(sel.course, sel.subject);
    router.push('/quiz');
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-semibold">Allenati con Buddy</h1>
      </header>

      <Buddy className="w-40 h-40 mx-auto" />

      <p className="text-center text-neutral-600">
        Puoi provare gratis un quiz completo
      </p>

      <div className="card p-4">
        <CourseSubjectPicker onChange={setSel} />
      </div>

      <button onClick={start} className="btn-primary w-full h-14 rounded-2xl text-base font-medium">
        Inizia subito
      </button>
    </div>
  );
}
