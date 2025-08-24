'use client';
import { useEffect, useState } from 'react';

type Course = { id: string; name: string };
type Subject = { id: string; name: string; course_id: string };

export default function CourseSubjectPicker({
  onChange,
}: {
  onChange?: (p: { course?: Course; subject?: Subject }) => void;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courseId, setCourseId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setError('');
      try {
        const res = await fetch('/api/courses', { cache: 'no-store' });
        if (!alive) return;
        if (!res.ok) throw new Error(await res.text());
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (e: any) {
        if (!alive) return;
        setError(`Errore corsi: ${e?.message ?? e}`);
        setCourses([]);
      } finally {
        if (alive) setLoadingCourses(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!courseId) { setSubjects([]); setSubjectId(''); return; }
      setError('');
      setLoadingSubjects(true);
      try {
        const res = await fetch(`/api/subjects?course=${courseId}`, { cache: 'no-store' });
        if (!alive) return;
        if (!res.ok) throw new Error(await res.text());
        const data: Subject[] = await res.json();
        setSubjects(data);
        setSubjectId('');
      } catch (e: any) {
        if (!alive) return;
        setError(`Errore materie: ${e?.message ?? e}`);
        setSubjects([]);
      } finally {
        if (alive) setLoadingSubjects(false);
      }
    })();
    return () => { alive = false; };
  }, [courseId]);

  useEffect(() => {
    if (!onChange) return;
    const c = courses.find(c => c.id === courseId);
    const s = subjects.find(s => s.id === subjectId);
    onChange({ course: c, subject: s });
  }, [courseId, subjectId, courses, subjects, onChange]);

  return (
    <div className="space-y-3 relative z-20 pointer-events-auto">
      <label className="block text-sm font-medium">Corso di Laurea</label>
      <select
        className="w-full rounded-xl border px-3 py-3 relative z-20 pointer-events-auto"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        aria-busy={loadingCourses}
      >
        <option value="">
          {loadingCourses ? 'Carico…' : (courses.length ? 'Seleziona corso' : 'Nessun corso disponibile')}
        </option>
        {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <label className="block text-sm font-medium">Materia</label>
      <select
        className="w-full rounded-xl border px-3 py-3 relative z-20 pointer-events-auto"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        aria-busy={loadingSubjects}
      >
        <option value="">
          {!courseId
            ? 'Seleziona corso prima'
            : loadingSubjects
            ? 'Carico…'
            : (subjects.length ? 'Seleziona materia' : 'Nessuna materia per questo corso')}
        </option>
        {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      {!!error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
