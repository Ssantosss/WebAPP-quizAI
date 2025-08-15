'use client';
import clsx from 'clsx';
export type PickerChange = { course: string; subject: string };

const courses = ['Informatica', 'Ingegneria', 'Economia'];
const subjects = ['Algoritmi', 'Reti', 'Diritto', 'Statistica'];

export default function CourseSubjectPicker({
  defaultCourse = '', defaultSubject = '', onChange,
}: { defaultCourse?: string; defaultSubject?: string; onChange?: (v: PickerChange) => void; }) {
  const emit = (c: string, s: string) => onChange?.({ course: c, subject: s });
  return (
    <div className="grid gap-3">
      <label className="block">
        <span className="text-sm text-neutral-600">Corso di Laurea</span>
        <select
          defaultValue={defaultCourse}
          onChange={(e) => emit(e.target.value, (document.getElementById('subject') as HTMLSelectElement)?.value || '')}
          className={clsx('mt-1 w-full h-12 rounded-2xl border border-neutral-200 bg-white px-3')}
          id="course"
        >
          <option value="" disabled>Seleziona corso</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="text-sm text-neutral-600">Materia</span>
        <select
          defaultValue={defaultSubject}
          onChange={(e) => emit((document.getElementById('course') as HTMLSelectElement)?.value || '', e.target.value)}
          className={clsx('mt-1 w-full h-12 rounded-2xl border border-neutral-200 bg-white px-3')}
          id="subject"
        >
          <option value="" disabled>Seleziona materia</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
    </div>
  );
}
