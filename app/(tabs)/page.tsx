'use client';
import { useState } from 'react';
import CourseSubjectPicker, { PickerChange } from '@/components/CourseSubjectPicker';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [sel, setSel] = useState<PickerChange>({});

  const start = () => {
    if (!sel.courseId || !sel.subjectId) return;
    router.push('/quiz'); // oppure conserva gli id nello store se ti serve
  };

  return (
    <main className="p-4 space-y-6">
      <CourseSubjectPicker value={sel} onChange={setSel} />
      <Button disabled={!sel.courseId || !sel.subjectId} onClick={start}>
        Inizia subito
      </Button>
    </main>
  );
}
