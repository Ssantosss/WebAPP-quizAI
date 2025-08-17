'use client';

import { useEffect, useMemo, useState } from 'react';
import { supaClient } from '@/lib/supabaseClient';

type Opt = { id: string; name: string };
export type PickerValue = { course?: string; subject?: string };

export default function CourseSubjectPicker({
  value,
  onChange,
}: {
  value: PickerValue;
  onChange: (v: PickerValue) => void;
}) {
  const [courses, setCourses]   = useState<Opt[]>([]);
  const [subjects, setSubjects] = useState<Opt[]>([]);
  const [loadingC, setLoadingC] = useState(false);
  const [loadingS, setLoadingS] = useState(false);

  // Carica corsi all'avvio
  useEffect(() => {
    let off = false;
    (async () => {
      setLoadingC(true);
      const { data, error } = await supaClient
        .from('courses')
        .select('id,name')
        .order('name', { ascending: true });
      if (!off) {
        setCourses(error ? [] : (data ?? []));
        setLoadingC(false);
      }
    })();
    return () => { off = true; };
  }, []);

  // Carica materie quando cambia il corso
  useEffect(() => {
    let off = false;
    (async () => {
      if (!value?.course) { setSubjects([]); return; }
      setLoadingS(true);
      const { data, error } = await supaClient
        .from('subjects')
        .select('id,name')
        .eq('course_id', value.course)     // <-- usa l'ID del corso selezionato
        .order('name', { ascending: true });
      if (!off) {
        setSubjects(error ? [] : (data ?? []));
        setLoadingS(false);
      }
    })();
    return () => { off = true; };
  }, [value?.course]);

  const canPickSubject = !!value?.course && !loadingS && subjects.length > 0;

  const subjectPlaceholder = useMemo(() => {
    if (!value?.course)   return 'Seleziona corso prima';
    if (loadingS)         return 'Carico…';
    if (subjects.length===0) return 'Nessuna materia disponibile';
    return 'Seleziona materia';
  }, [value?.course, loadingS, subjects.length]);

  return (
    <div className="space-y-6">
      {/* Corso di Laurea — stile PR#30 invariato */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Corso di Laurea</label>
        <select
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25"
          value={value.course ?? ''}
          onChange={(e) => {
            const course = e.target.value || undefined;
            onChange({ course, subject: undefined }); // reset materia al cambio corso
          }}
        >
          <option value="">
            {loadingC ? 'Carico…' : (courses.length ? 'Seleziona corso' : 'Nessun corso disponibile')}
          </option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Materia — stile PR#30 invariato */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Materia</label>
        <select
          key={value.course ?? 'no-course'}
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25 disabled:bg-neutral-100 disabled:text-neutral-400"
          disabled={!canPickSubject}
          value={value.subject ?? ''}
          onChange={(e) => onChange({ ...value, subject: e.target.value || undefined })}
        >
          <option value="">{subjectPlaceholder}</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
    </div>
  );
}
