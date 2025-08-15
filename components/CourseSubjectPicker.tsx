'use client';

export type PickerChange = { course: string; subject: string };

const COURSES = ['Informatica', 'Ingegneria', 'Economia'];
const SUBJECTS = ['Algoritmi', 'Reti', 'Diritto', 'Statistica'];

export default function CourseSubjectPicker({
  value,
  onChange,
  courses = COURSES,
  subjects = SUBJECTS,
}: {
  value: PickerChange;                       // ← controlled
  onChange: (v: PickerChange) => void;       // ← controlled
  courses?: string[];
  subjects?: string[];
}) {
  return (
    <div className="grid gap-3">
      <label className="block">
        <span className="text-sm text-neutral-600">Corso di Laurea</span>
        <select
          value={value.course}
          onChange={(e) => onChange({ course: e.target.value, subject: value.subject })}
          className="mt-1 w-full h-12 rounded-2xl border border-neutral-200 bg-white px-3"
        >
          <option value="">Seleziona corso</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-neutral-600">Materia</span>
        <select
          value={value.subject}
          onChange={(e) => onChange({ course: value.course, subject: e.target.value })}
          className="mt-1 w-full h-12 rounded-2xl border border-neutral-200 bg-white px-3"
        >
          <option value="">Seleziona materia</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
