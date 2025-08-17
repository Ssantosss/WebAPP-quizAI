'use client';
import { useEffect, useMemo, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase.client';

export type PickerChange = {
  courseId: string;  courseName: string;
  subjectId: string; subjectName: string;
};

type Option = { id: string; name: string };

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
  const [loadErr, setLoadErr] = useState<string | null>(null);

  // Carica corsi: prima provo Supabase client → se fallisce, fallback API
  useEffect(() => {
    (async () => {
      setLoadErr(null);
      const supabase = getBrowserSupabase();
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('courses')
            .select('id,name')
            .order('name', { ascending: true });
          if (error) throw error;
          if (Array.isArray(data) && data.length) { setCourses(data as Option[]); return; }
        }
        // fallback API
        const r = await fetch('/api/courses', { cache: 'no-store' });
        const j = await r.json();
        setCourses(Array.isArray(j) ? j : []);
        if (!Array.isArray(j)) setLoadErr(j?.error ?? 'Errore caricamento corsi');
      } catch (e: any) {
        console.error('courses error', e);
        setLoadErr(String(e?.message || e));
        setCourses([]);
      }
    })();
  }, []);

  // Carica materie quando cambia il corso selezionato
  useEffect(() => {
    (async () => {
      if (!value.courseId) { setSubjects([]); return; }
      setLoadingSubjects(true);
      setLoadErr(null);
      const supabase = getBrowserSupabase();
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('subjects')
            .select('id,name')
            .eq('course_id', value.courseId)
            .order('name', { ascending: true });
          if (error) throw error;
          if (Array.isArray(data)) { setSubjects(data as Option[]); return; }
        }
        // fallback API
        const r = await fetch(`/api/subjects?courseId=${encodeURIComponent(value.courseId)}`, { cache: 'no-store' });
        const j = await r.json();
        setSubjects(Array.isArray(j) ? j : []);
        if (!Array.isArray(j)) setLoadErr(j?.error ?? 'Errore caricamento materie');
      } catch (e: any) {
        console.error('subjects error', e);
        setLoadErr(String(e?.message || e));
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    })();
  }, [value.courseId]);

  const showDebug = useMemo(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('dbg'),
    []
  );

  return (
    <div className="grid gap-3">
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

      {showDebug && loadErr && (
        <p className="text-xs text-red-600">Debug: {loadErr}</p>
      )}
      {showDebug && !loadErr && courses.length === 0 && (
        <p className="text-xs text-amber-600">Debug: nessun corso dal client né dalle API</p>
      )}
    </div>
  );
}
