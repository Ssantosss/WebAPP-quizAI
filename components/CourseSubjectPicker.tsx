"use client";
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
}: { initialCourses: { id: string; name: string }[] }) {
  const router = useRouter();
  const startSession = useSessionStore(s => s.startSession);

  const [courses, setCourses] = useState<Option[]>(initialCourses || []);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');

  const [loadingCourses, setLoadingCourses] = useState(!initialCourses?.length);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const ready = Boolean(courseId && subjectId);

  // In caso l’SSR fosse vuoto, prova a caricare anche lato client
  useEffect(() => {
    if (initialCourses?.length) return;
    (async () => {
      setLoadingCourses(true);
      try {
        const r = await fetchWithTimeout('/api/courses', { cache: 'no-store' }, 6000);
        const j = await r.json().catch(() => []);
        if (Array.isArray(j) && j.length) { setCourses(j); return; }
        // fallback diretto Supabase
        const sb = getBrowserSupabase();
        const { data } = await sb.from('courses').select('id,name').order('name', { ascending: true });
        setCourses(data ?? []);
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, [initialCourses]);

  // Materie ogni volta che cambia corso
  useEffect(() => {
    if (!courseId) { setSubjects([]); setSubjectId(''); setSubjectName(''); return; }
    (async () => {
      setLoadingSubjects(true);
      try {
        const r = await fetchWithTimeout(`/api/subjects?courseId=${encodeURIComponent(courseId)}`, { cache: 'no-store' }, 6000);
        const j = await r.json().catch(() => []);
        if (Array.isArray(j) && j.length) { setSubjects(j); return; }
        // fallback
        const sb = getBrowserSupabase();
        const { data } = await sb
          .from('subjects').select('id,name').eq('course_id', courseId).order('name', { ascending: true });
        setSubjects(data ?? []);
      } finally {
        setLoadingSubjects(false);
      }
    })();
  }, [courseId]);

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
          <option value="">{loadingSubjects ? 'Carico…' : 'Seleziona materia'}</option>
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
    </div>
  );
}
