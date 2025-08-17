'use client';
import { useEffect, useMemo, useState } from 'react';

export type PickerChange = { courseId?: string; subjectId?: string };
type Opt = { id: string; name: string };

export default function CourseSubjectPicker({
  value,
  onChange,
}: {
  value: PickerChange;
  onChange: (v: PickerChange) => void;
}) {
  const [courses, setCourses] = useState<Opt[]>([]);
  const [subjects, setSubjects] = useState<Opt[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // --- Carica corsi una volta ---
  useEffect(() => {
    let off = false;
    setLoadingCourses(true);
    fetch('/api/courses', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Opt[]) => { if (!off) setCourses(data ?? []); })
      .catch(() => { if (!off) setCourses([]); })
      .finally(() => { if (!off) setLoadingCourses(false); });
    return () => { off = true; };
  }, []);

  // --- Carica materie quando cambia il corso ---
  useEffect(() => {
    if (!value?.courseId) { setSubjects([]); return; }
    let off = false;
    setLoadingSubjects(true);
    fetch(`/api/subjects?courseId=${encodeURIComponent(value.courseId)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Opt[]) => { if (!off) setSubjects(data ?? []); })
      .catch(() => { if (!off) setSubjects([]); })
      .finally(() => { if (!off) setLoadingSubjects(false); });
    return () => { off = true; };
  }, [value?.courseId]);

  // --- Helpers UI ---
  const canPickSubject = !!value?.courseId && !loadingSubjects && subjects.length > 0;
  const subjectPlaceholder = useMemo(() => {
    if (!value?.courseId) return 'Seleziona corso prima';
    if (loadingSubjects) return 'Carico…';
    if (subjects.length === 0) return 'Nessuna materia disponibile';
    return 'Seleziona materia';
  }, [value?.courseId, loadingSubjects, subjects.length]);

  return (
    <div className="space-y-6">
      {/* Corso */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Corso di Laurea</label>
        <select
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25"
          value={value.courseId ?? ''}
          onChange={(e) => onChange({ courseId: e.target.value || undefined, subjectId: undefined })}
        >
          <option value="">
            {loadingCourses ? 'Carico…' : (courses.length ? 'Seleziona corso' : 'Nessun corso disponibile')}
          </option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Materia */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Materia</label>
        <select
          key={value.courseId ?? 'no-course'}           /* forza reset dell’option quando cambia corso */
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25 disabled:bg-neutral-100 disabled:text-neutral-400"
          value={value.subjectId ?? ''}
          disabled={!canPickSubject}
          onChange={(e) => onChange({ ...value, subjectId: e.target.value || undefined })}
        >
          <option value="">{subjectPlaceholder}</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

