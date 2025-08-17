'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { getBrowserSupabase } from '@/lib/supabase';
import { useSessionStore } from '@/store/useSessionStore';

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
  initialCourses,
}: { initialCourses: Option[] }) {
  const router = useRouter();
  const startSession = useSessionStore(s => s.startSession);

  const [courses, setCourses] = useState<Option[]>(initialCourses || []);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjectName, setSubjectName] = useState('');

  const [loadingCourses, setLoadingCourses] = useState(!initialCourses?.length);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);

  const ready = Boolean(courseId && subjectId);

  // Se SSR non ha portato corsi, ricarica client-side (API → fallback Supabase)
  useEffect(() => {
    if (initialCourses?.length) return;
    (async () => {
      setLoadingCourses(true); setMsg(null);
      try {
        const r = await fetchWithTimeout('/api/courses', { cache: 'no-store' }, 6000);
        const j = await r.json().catch(() => []);
        if (Array.isArray(j) && j.length) { setCourses(j); return; }
        const sb = getBrowserSupabase();
        const { data, error } = await sb.from('courses').select('id,name').order('name', { ascending: true });
        if (error) throw error;
        setCourses(data ?? []);
        if (!data?.length) setMsg('Nessun corso disponibile.');
      } catch (e: any) {
        setMsg(e?.message || 'Impossibile caricare i corsi.');
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, [initialCourses]);

  // Carica materie quando cambia il corso
  useEffect(() => {
    setSubjectId(''); setSubjectName('');
    if (!courseId) { setSubjects([]); return; }

    (async () => {
      setLoadingSubjects(true); setMsg(null);
      try {
        // 1) API con id + name (il server risolve anche se id mancante)
        const url = `/api/subjects?courseId=${encodeURIComponent(courseId)}&courseName=${encodeURIComponent(courseName)}`;
        const r = await fetchWithTimeout(url, { cache: 'no-store' }, 6000);
        let j: any = [];
        try { j = await r.json(); } catch {}
        if (Array.isArray(j) && j.length) { setSubjects(j); return; }

        // 2) Fallback Supabase (prima per id, poi per nome con join)
        const sb = getBrowserSupabase();

        // per id
        const byId = await sb.from('subjects').select('id,name').eq('course_id', courseId).order('name', { ascending: true });
        if (byId.data?.length) { setSubjects(byId.data); return; }

        // join per nome corso (in casi rarissimi di mismatch id)
        const byName = await sb
          .from('subjects')
          .select('id,name,courses!inner(name)')
          .eq('courses.name', courseName)
          .order('name', { ascending: true });

        if (byName.error) throw byName.error;
        setSubjects((byName.data as any[] || []).map(({ id, name }) => ({ id, name })));

        if (!(byName.data?.length)) setMsg(`Nessuna materia per “${courseName}”.`);
      } catch (e: any) {
        setMsg(e?.message || 'Impossibile caricare le materie.');
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    })();
  }, [courseId, courseName]);

  function go() {
    if (!ready) return;
    startSession(courseName || courseId, subjectName || subjectId);
    router.push('/quiz');
  }

  return (
    <div className="grid gap-3">
      {/* Corso */}
      <label className="block">
        <span className="text-sm text-neutral-600">Corso di Laurea</span>
        <select
          value={courseId}
          onChange={(e) => {
            const id = normalizeId(e.target.value);
            const name = courses.find(c => c.id === id)?.name || '';
            setCourseId(id);
            setCourseName(name);
            setSubjectId('');
            setSubjectName('');
          }}
          className="mt-1 w-full h-12 rounded-2xl border border-neutral-200 bg-white px-3"
        >
          <option value="">{loadingCourses ? 'Carico…' : 'Seleziona corso'}</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>

      {/* Materia */}
      <label className="block">
        <span className="text-sm text-neutral-600">Materia</span>
        <select
          value={subjectId}
          disabled={!courseId || loadingSubjects}
          onChange={(e) => {
            const id = normalizeId(e.target.value);
            const name = subjects.find(s => s.id === id)?.name || '';
            setSubjectId(id);
            setSubjectName(name);
          }}
          className="mt-1 w-full h-12 rounded-2xl border border-neutral-200 bg-white px-3 disabled:bg-neutral-100"
        >
          <option value="">
            {loadingSubjects ? 'Carico…' : (subjects.length ? 'Seleziona materia' : 'Nessuna materia disponibile')}
          </option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>

      {/* CTA */}
      <button
        type="button"
        onClick={go}
        disabled={!ready}
        className="btn-hero w-full disabled:opacity-50 disabled:pointer-events-none"
      >
        Inizia subito
      </button>

      {msg && <div className="text-xs text-amber-700">{msg}</div>}
    </div>
  );
}
