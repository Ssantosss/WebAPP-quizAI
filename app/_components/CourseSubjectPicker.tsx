'use client';
import { useEffect, useState } from 'react';

type Course  = { id: string; name: string };
type Subject = { id: string; name: string; course_id: string };

const U = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function sbRest<T>(path: string): Promise<T> {
  const r = await fetch(`${U}/rest/v1/${path}`, {
    headers: { apikey: K, Authorization: `Bearer ${K}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}

export default function CourseSubjectPicker(props: {
  onChange?: (v:{courseId?:string; subjectId?:string})=>void
}) {
  const [courses,setCourses]   = useState<Course[]>([]);
  const [subjects,setSubjects] = useState<Subject[]>([]);
  const [courseId,setCourseId] = useState(''), [subjectId,setSubjectId] = useState('');
  const [lc,setLc] = useState(true), [ls,setLs] = useState(false);
  const [err,setErr] = useState('');

  useEffect(()=>{ let alive=true; (async()=>{
    try { setCourses(await sbRest<Course[]>('courses?select=id,name&order=name')); }
    catch(e:any){ setErr(`Errore corsi: ${e.message??e}`); setCourses([]); }
    finally { if(alive) setLc(false); }
  })(); return ()=>{ alive=false; }; },[]);

  useEffect(()=>{ let alive=true; (async()=>{
    if(!courseId){ setSubjects([]); setSubjectId(''); return; }
    setLs(true);
    try {
      const data = await sbRest<Subject[]>(
        `subjects?select=id,name,course_id&course_id=eq.${courseId}&order=name`
      );
      if(!alive) return;
      setSubjects(data??[]); setSubjectId('');
    } catch(e:any){ setErr(`Errore materie: ${e.message??e}`); setSubjects([]); }
    finally { if(alive) setLs(false); }
  })(); return ()=>{ alive=false; }; },[courseId]);

  useEffect(()=>{ props.onChange?.({courseId,subjectId}); },[courseId,subjectId]);

  return (
    <div className="space-y-4 relative z-20 pointer-events-auto">
      <div>
        <label className="block text-base font-semibold">Corso di Laurea</label>
        <select className="mt-2 w-full rounded-2xl border px-3 py-3"
                value={courseId} onChange={(e)=>setCourseId(e.target.value)} aria-busy={lc}>
          <option value="">
            {lc ? 'Carico…' : (courses.length ? 'Seleziona corso' : 'Nessun corso disponibile')}
          </option>
          {courses.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-base font-semibold">Materia</label>
        <select className="mt-2 w-full rounded-2xl border px-3 py-3"
                value={subjectId} onChange={(e)=>setSubjectId(e.target.value)}
                aria-busy={ls} disabled={!courseId}>
          <option value="">
            {!courseId ? 'Seleziona corso prima'
              : ls ? 'Carico…'
              : (subjects.length ? 'Seleziona materia' : 'Nessuna materia per questo corso')}
          </option>
          {subjects.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {!!err && <p className="text-sm text-red-600">{err}</p>}
    </div>
  );
}
