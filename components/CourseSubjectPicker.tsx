'use client';
import { useEffect, useMemo, useState } from 'react';

export type PickerChange = { courseId?: string; subjectId?: string };
type Opt = { id: string; name: string };

export default function CourseSubjectPicker({
  value,
  onChange,
}: { value: PickerChange; onChange: (v: PickerChange) => void }) {
  const [courses, setCourses] = useState<Opt[]>([]);
  const [subjects, setSubjects] = useState<Opt[]>([]);
  const [loadingC, setLoadingC] = useState(false);
  const [loadingS, setLoadingS] = useState(false);

  useEffect(() => {
    let off = false;
    setLoadingC(true);
    fetch('/api/courses', { cache: 'no-store' })
      .then(r => r.json()).then((d: Opt[]) => { if (!off) setCourses(d ?? []); })
      .catch(() => { if (!off) setCourses([]); })
      .finally(() => { if (!off) setLoadingC(false); });
    return () => { off = true; };
  }, []);

  useEffect(() => {
    if (!value?.courseId) { setSubjects([]); return; }
    let off = false;
    setLoadingS(true);
    fetch(`/api/subjects?courseId=${encodeURIComponent(value.courseId)}`, { cache: 'no-store' })
      .then(r => r.json()).then((d: Opt[]) => { if (!off) setSubjects(d ?? []); })
      .catch(() => { if (!off) setSubjects([]); })
      .finally(() => { if (!off) setLoadingS(false); });
    return () => { off = true; };
  }, [value?.courseId]);

  const subjectPlaceholder = useMemo(() => {
    if (!value?.courseId) return 'Seleziona corso prima';
    if (loadingS) return 'Carico…';
    if (subjects.length === 0) return 'Nessuna materia disponibile';
    return 'Seleziona materia';
  }, [value?.courseId, loadingS, subjects.length]);

  const canPickSubject = !!value?.courseId && !loadingS && subjects.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Corso di Laurea</label>
        <select
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25"
          value={value.courseId ?? ''}
          onChange={(e) => onChange({ courseId: e.target.value || undefined, subjectId: undefined })}
        >
          <option value="">
            {loadingC ? 'Carico…' : (courses.length ? 'Seleziona corso' : 'Nessun corso disponibile')}
          </option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Materia</label>
        <select
          key={value.courseId ?? 'no-course'}
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25 disabled:bg-neutral-100 disabled:text-neutral-400"
          disabled={!canPickSubject}
          value={value.subjectId ?? ''}
          onChange={(e) => onChange({ ...value, subjectId: e.target.value || undefined })}
        >
          <option value="">{subjectPlaceholder}</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
    </div>
  );
}
