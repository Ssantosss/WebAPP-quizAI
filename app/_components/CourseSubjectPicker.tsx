'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';

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

  // load courses
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingCourses(true);
      const { data, error } = await supabase
        .from('courses')
        .select('id,name')
        .order('name', { ascending: true });

      if (!alive) return;
      if (error) {
        setError(`Errore caricamento corsi: ${error.message}`);
        setCourses([]);
      } else {
        setCourses(data ?? []);
      }
      setLoadingCourses(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // load subjects on course change
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!courseId) {
        setSubjects([]);
        setSubjectId('');
        return;
      }
      setLoadingSubjects(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('id,name,course_id')
        .eq('course_id', courseId)
        .order('name', { ascending: true });

      if (!alive) return;
      if (error) {
        setError(`Errore caricamento materie: ${error.message}`);
        setSubjects([]);
      } else {
        setSubjects(data ?? []);
      }
      setSubjectId('');
      setLoadingSubjects(false);
    })();
    return () => {
      alive = false;
    };
  }, [courseId]);

  // bubble up selection
  useEffect(() => {
    if (!onChange) return;
    const c = courses.find(c => c.id === courseId);
    const s = subjects.find(s => s.id === subjectId);
    onChange({ course: c, subject: s });
  }, [courseId, subjectId, courses, subjects, onChange]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Corso di Laurea</label>
      <select
        className="w-full rounded-xl border px-3 py-3 relative z-20 pointer-events-auto"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        disabled={loadingCourses}
        aria-label="Corso di Laurea"
      >
        <option value="">
          {loadingCourses
            ? 'Carico…'
            : courses.length
            ? 'Seleziona corso'
            : 'Nessun corso disponibile'}
        </option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium">Materia</label>
      <select
        className="w-full rounded-xl border px-3 py-3 relative z-20 pointer-events-auto"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        disabled={!courseId || loadingSubjects}
        aria-label="Materia"
      >
        <option value="">
          {!courseId
            ? 'Seleziona corso prima'
            : loadingSubjects
            ? 'Carico…'
            : subjects.length
            ? 'Seleziona materia'
            : 'Nessuna materia per questo corso'}
        </option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {!!error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
