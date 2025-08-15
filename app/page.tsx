'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Buddy from '../components/Buddy';
import Button from '../components/Button';
import CourseSubjectPicker, { PickerChange } from '../components/CourseSubjectPicker';
import { useSessionStore } from '../store/useSessionStore';
import { useUserStore } from '../store/useUserStore';

export default function HomePage() {
  const router = useRouter();
  const startSession = useSessionStore((s) => s.startSession);
  const canUseQuiz = useUserStore((s) => s.canUseQuiz);
  const [sel, setSel] = useState<PickerChange>({ course: '', subject: '' });

  const start = () => {
    if (!canUseQuiz()) {
      alert('Limite raggiunto');
      return;
    }
    if (!sel.course || !sel.subject) return;
    startSession(sel.course, sel.subject);
    router.push('/quiz');
  };

  return (
    <main className="container" style={{ paddingBottom: 72, textAlign: 'center' }}>
      <h1 className="h0" style={{ fontSize: 34, marginTop: 64 }}>Allenati con Buddy</h1>
      <Buddy className="w-40 h-40 mx-auto my-4" />
      <p className="lead">Puoi provare gratis un quiz completo</p>
      <CourseSubjectPicker onChange={setSel} />
      <Button onClick={start} style={{ marginTop: 16 }}>Inizia subito</Button>
    </main>
  );
}
