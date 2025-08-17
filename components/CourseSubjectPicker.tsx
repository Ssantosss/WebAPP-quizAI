'use client';
import { useEffect, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

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
  value, onChange, onError,
}: {
  value: PickerChange;
  onChange: (v: PickerChange) => void;
  onError?: (msg: string|null) => void;
}) {
  const [courses, setCourses] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const setErr = (msg: string|null) => { setApiError(msg); onError?.(msg); };

  async function loadCourses() {
    setLoadingCourses(true);
    setErr(null);
    try {
      // 1) API con timeout
      const r = await fetchWithTimeout('/api/courses', { cache: 'no-store' }, 6000);
      const j = await r.json().catch(() => []);
      if (Array.isArray(j) && j.length) { setCourses(j); return; }

      // 2) Fallback client → Supabase (richiede CSP connect-src)
      const sb = getBrowserSupabase();
      const { data, error } = await sb.from('courses').select('id,name').order('name', { ascending: true });
      if (error) throw error;
      setCourses(data ?? []);
      if (!data?.length) setErr('Nessun corso disponibile.');
    } catch (e: any) {
      setErr(e?.message || 'Impossibile caricare i corsi.');
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  }

  async function loadSubjects(courseId: string) {
    if (!courseId) { setSubjects([]); return; }
    setLoadingSubjects(true);
    setErr(null);
    try {
      const r = await fetchWithTimeout(`/api/subjects?courseId=${encodeURIComponent(courseId)}`, { cache: 'no-store' }, 6000);
      const j = await r.json().catch(() => []);
      if (Array.isArray(j) && j.length) { setSubjects(j); return; }

      const sb = getBrowserSupabase();
      const { data, error } = await sb
        .from('subjects')
        .select('id,name')
        .eq('course_id', courseId)
        .order('name', { ascending: true });
      if (error) throw error;
      setSubjects(data ?? []);
      if (!data?.length) setErr('Nessuna materia per il corso selezionato.');
    } catch (e: any) {
      setErr(e?.message || 'Impossibile caricare le materie.');
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  }

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { loadSubjects(value.courseId); }, [value.courseId]);

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
          <option value="">{loadingCourses ? 'Carico…' : 'Seleziona corso'}</option>
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

      {apiError && (
        <div className="text-xs text-red-600">
          {apiError}{' '}
          <button type="button" onClick={loadCourses} className="underline">Riprova</button>
          {' · '}<a className="underline" href="/api/health" target="_blank" rel="noreferrer">/api/health</a>
        </div>
      )}
    </div>
  );
}
