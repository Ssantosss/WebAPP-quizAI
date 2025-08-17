'use client';
import { useEffect, useState } from 'react';

export type PickerChange = {
  courseId: string;  courseName: string;
  subjectId: string; subjectName: string;
};

type Option = { id: string; name: string };

// Rete di sicurezza: se per errore arriva una stringa JSON, estrai .id
function normalizeId(v: string) {
  try {
    const dec = decodeURIComponent(v);
    if (/^[0-9a-fA-F-]{36}$/.test(dec)) return dec;
    const obj = JSON.parse(dec);
    if (Array.isArray(obj) && obj[0]?.id) return String(obj[0].id);
    if (obj && typeof obj === 'object' && 'id' in obj) return String((obj as any).id);
  } catch {}
  return v;
}

export default function CourseSubjectPicker({
  value, onChange,
}: { value: PickerChange; onChange: (v: PickerChange) => void; }) {
  const [courses, setCourses] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Corsi
  useEffect(() => {
    fetch('/api/courses', { cache: 'no-store' })
      .then(r => r.json())
      .then((rows: Option[]) => setCourses(Array.isArray(rows) ? rows : []))
      .catch((err) => { console.error('courses error', err); setCourses([]); });
  }, []);

  // Materie al cambio corso
  useEffect(() => {
    if (!value.courseId) { setSubjects([]); return; }
    setLoadingSubjects(true);
    fetch(`/api/subjects?courseId=${encodeURIComponent(value.courseId)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((rows: Option[]) => setSubjects(Array.isArray(rows) ? rows : []))
      .catch((err) => { console.error('subjects error', err); setSubjects([]); })
      .finally(() => setLoadingSubjects(false));
  }, [value.courseId]);

  return (
    <div className="grid gap-3">
      {/* CORSO */}
      <label className="block">
        <span className="text-sm text-neutral-600">Corso di Laurea</span>
        <select
          value={value.courseId}
          onChange={(e) => {
            const id = normalizeId(e.target.value);
            const name = courses.find(c => c.id === id)?.name || '';
            onChange({ courseId: id, courseName: name, subjectId: '', subjectName: '' });
          }}
          className="mt-1 w-full h-12 rounded-2xl border border-neutral-200 bg-white px-3"
        >
          <option value="">Seleziona corso</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>

      {/* MATERIA */}
      <label className="block">
        <span className="text-sm text-neutral-600">Materia</span>
        <select
          value={value.subjectId}
          disabled={!value.courseId || loadingSubjects}
          onChange={(e) => {
            const id = normalizeId(e.target.value);
            const name = subjects.find(s => s.id === id)?.name || '';
            onChange({ ...value, subjectId: id, subjectName: name });
          }}
          className="mt-1 w-full h-12 rounded-2xl border border-neutral-200 bg-white px-3 disabled:bg-neutral-100"
        >
          <option value="">{loadingSubjects ? 'Carico…' : 'Seleziona materia'}</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>
    </div>
  );
}
