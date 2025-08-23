'use client';
import { useState } from 'react';
import CourseSubjectPicker from '@/components/CourseSubjectPicker';
import Button from '@/components/Button';
import Buddy from '@/components/Buddy';
import { useRouter } from 'next/navigation';

type PickerValue = { courseId?: string; subjectId?: string };

export default function HomePage() {
  const router = useRouter();
  const [sel, setSel] = useState<PickerValue>({});

  const canStart = !!sel.courseId && !!sel.subjectId;

  const start = () => {
    if (!canStart) return;
    router.push(`/quiz?courseId=${sel.courseId}&subjectId=${sel.subjectId}`);
  };

  return (
    <main className="px-5 pb-28 pt-10 flex flex-col items-center">
      {/* Titolo + Buddy */}
      <h1 className="text-[42px] leading-tight font-black text-neutral-900 text-center">
        Allenati con <br /> Buddy
      </h1>

      <div className="mt-6">
        <Buddy className="w-[260px] h-[260px]" />
      </div>

      <p className="mt-6 text-[18px] text-neutral-700 text-center">
        Puoi provare gratis un quiz completo
      </p>

      {/* Card selezioni */}
      <section className="mt-6 w-full max-w-[680px] rounded-3xl border border-neutral-200 bg-white shadow-sm p-5">
        <CourseSubjectPicker onChange={setSel} />

        <div className="mt-6">
          <Button
            className="w-full h-14 text-[18px] rounded-2xl"
            disabled={!canStart}
            onClick={start}
          >
            Inizia subito
          </Button>
        </div>
      </section>
    </main>
  );
}
