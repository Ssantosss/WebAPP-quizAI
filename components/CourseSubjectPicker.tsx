'use client';
import { useEffect, useState } from 'react';

type Option = { id: string; name: string };

export type PickerChange = {
  courseId?: string;
  subjectId?: string;
};

export default function CourseSubjectPicker({
  value,
  onChange,
}: {
  value?: PickerChange;
  onChange: (v: PickerChange) => void;
}) {
  const [courses, setCourses] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Carica corsi
  useEffect(() => {
    let aborted = false;
    fetch('/api/courses', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Option[]) => { if (!aborted) setCourses(data); })
      .catch(() => { if (!aborted) setCourses([]); });
    return () => { aborted = true; };
  }, []);

  // Quando cambia il corso, carica le materie
  useEffect(() => {
    if (!value?.courseId) { setSubjects([]); onChange({ courseId: value?.courseId, subjectId: undefined }); return; }
    setLoadingSubjects(true);
    let aborted = false;
    fetch(`/api/subjects?courseId=${encodeURIComponent(value.courseId)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Option[]) => { if (!aborted) setSubjects(data ?? []); })
      .catch(() => { if (!aborted) setSubjects([]); })
      .finally(() => { if (!aborted) setLoadingSubjects(false); });
    return () => { aborted = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.courseId]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Corso di Laurea</label>
        <select
          className="select"
          value={value?.courseId ?? ''}
          onChange={(e) => onChange({ courseId: e.target.value || undefined, subjectId: undefined })}
        >
          <option value="">{courses.length ? 'Seleziona corso' : 'Carico...'}</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Materia</label>
        <select
          className="select"
          value={value?.subjectId ?? ''}
          disabled={!value?.courseId || loadingSubjects || subjects.length === 0}
          onChange={(e) => onChange({ ...value, subjectId: e.target.value || undefined })}
        >
          <option value="">
            {!value?.courseId ? 'Seleziona corso prima' :
             loadingSubjects ? 'Carico…' :
             subjects.length ? 'Seleziona materia' : 'Nessuna materia disponibile'}
          </option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
    </div>
  );
}
