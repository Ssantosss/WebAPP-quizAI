'use client';
import { useState } from 'react';
import CourseSubjectPicker from '../_components/CourseSubjectPicker';
import Button from '@/components/Button';
import Buddy from '@/components/Buddy';
import { useRouter } from 'next/navigation';

type PickerValue = {
  course?: { id: string; name: string };
  subject?: { id: string; name: string; course_id: string };
};

export default function HomeClient({ initialCourses }: { initialCourses: { id: string; name: string }[] }) {
  const router = useRouter();
  const [sel, setSel] = useState<PickerValue>({});

  const canStart = !!sel.course?.id && !!sel.subject?.id;

  const start = () => {
    if (!canStart) return;
    router.push(`/quiz?courseId=${sel.course!.id}&subjectId=${sel.subject!.id}`);
  };

  return (
    <main className="px-5 pb-28 pt-10 flex flex-col items-center relative">
      <div className="absolute inset-0 z-0 pointer-events-none" />
      {/* Titolo + Buddy */}
      <h1 className="text-[42px] leading-tight font-black text-neutral-900 text-center">
        Allenati con <br /> Buddy
      </h1>

      <figure className="mx-auto mt-6 w-[260px] pointer-events-none select-none relative z-0">
        <Buddy className="w-[260px] h-[260px]" />
      </figure>

      <p className="mt-6 text-[18px] text-neutral-700 text-center">
        Puoi provare gratis un quiz completo
      </p>

      {/* Card selezioni */}
      <section className="mt-10 w-full max-w-[680px] rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 relative z-20 pointer-events-auto">
        <CourseSubjectPicker initialCourses={initialCourses} onChange={setSel} />

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
