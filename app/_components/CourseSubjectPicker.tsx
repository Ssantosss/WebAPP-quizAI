'use client';
import { useEffect, useState } from 'react';

type Course  = { id: string; name: string };
type Subject = { id: string; name: string; course_id: string };

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

async function sbRest<T>(path: string): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Supabase ENV mancanti (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`REST ${path} -> ${res.status} ${txt}`);
  }
  return res.json();
}

export default function CourseSubjectPicker() {
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
      try {
        setError('');
        const data = await sbRest<Course[]>(`courses?select=id,name&order=name`);
        if (!alive) return;
        setCourses(data ?? []);
      } catch (e: any) {
        if (!alive) return;
        console.error('Caricamento corsi fallito:', e);
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
      try {
        setError('');
        setLoadingSubjects(true);
        const data = await sbRest<Subject[]>(
          `subjects?select=id,name,course_id&course_id=eq.${courseId}&order=name`
        );
        if (!alive) return;
        setSubjects(data ?? []); setSubjectId('');
      } catch (e: any) {
        if (!alive) return;
        console.error('Caricamento materie fallito:', e);
        setError(`Errore materie: ${e?.message ?? e}`);
        setSubjects([]);
      } finally {
        if (alive) setLoadingSubjects(false);
      }
    })();
    return () => { alive = false; };
  }, [courseId]);

  return (
    <div className="space-y-4 relative z-20">
      <div>
        <label className="block text-base font-semibold text-gray-900">Corso di Laurea</label>
        <select
          className="mt-2 w-full rounded-xl border px-3 py-3"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          aria-busy={loadingCourses}
        >
          <option value="">
            {loadingCourses ? 'Carico…' : (courses.length ? 'Seleziona corso' : 'Nessun corso disponibile')}
          </option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-900">Materia</label>
        <select
          className="mt-2 w-full rounded-xl border px-3 py-3"
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
      </div>

      {!!error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

