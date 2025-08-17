'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BuddyHero from '@/components/BuddyHero';
import CourseSubjectPicker, { PickerChange } from '@/components/CourseSubjectPicker';
import { useSessionStore } from '@/store/useSessionStore';
import DebugBanner from '@/components/DebugBanner';

type AnySel = PickerChange & { course?: string; subject?: string };
const isReady = (s: AnySel) => Boolean(s.courseId || s.course) && Boolean(s.subjectId || s.subject);
const getNames = (s: AnySel) => ({ courseName: s.courseName || s.course || s.courseId || '', subjectName: s.subjectName || s.subject || s.subjectId || '' });

export default function HomePage() {
  const router = useRouter();
  const startSession = useSessionStore(s => s.startSession);
  const [sel, setSel] = useState<AnySel>({ courseId: '', courseName: '', subjectId: '', subjectName: '' });
  const [lastError, setLastError] = useState<string|null>(null);

  const go = () => {
    if (!isReady(sel)) return;
    const { courseName, subjectName } = getNames(sel);
    startSession(courseName, subjectName);
    router.push('/quiz');
  };

  return (
    <main className="flex-1 p-4 pb-32 space-y-6">
      <header className="text-center mt-6"><h1 className="h1">Allenati con<br/>Buddy</h1></header>
      <div className="w-full flex justify-center"><BuddyHero className="w-48 h-auto" /></div>
      <p className="sub text-center">Puoi provare gratis un quiz completo</p>
      <div className="card p-4">
        <CourseSubjectPicker value={sel as PickerChange} onChange={setSel} onError={setLastError} />
      </div>
      <button type="button" onClick={go} disabled={!isReady(sel)} className="btn-hero w-full disabled:opacity-50 disabled:pointer-events-none">Inizia subito</button>
      <div className="h-20" />
      <DebugBanner lastError={lastError} />
    </main>
  );
}
