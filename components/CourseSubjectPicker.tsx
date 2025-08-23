"use client";
import { useEffect, useState } from "react";
import { loadCourses, loadSubjects, type Course, type Subject } from "@/lib/fetchers";

export default function CourseSubjectPicker(props: {
  onChange?: (v: { courseId?: string; subjectId?: string }) => void;
}) {
  const [courses, setCourses]   = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingC, setLoadingC] = useState(true);
  const [loadingS, setLoadingS] = useState(false);
  const [courseId, setCourseId] = useState<string>();
  const [subjectId, setSubjectId] = useState<string>();

  useEffect(() => {
    let cancel = false;

    (async () => {
      setLoadingC(true);
      try {
        const data = await loadCourses();
        if (!cancel) setCourses(data ?? []);
      } catch (err) {
        console.error("[loadCourses]", err);
        if (!cancel) setCourses([]);
      } finally {
        if (!cancel) setLoadingC(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!courseId) { setSubjects([]); setSubjectId(undefined); return; }
      setLoadingS(true);
      try {
        const data = await loadSubjects(courseId);
        if (!cancel) setSubjects(data);
      } catch (e) {
        console.error(e);
        if (!cancel) setSubjects([]);
      } finally {
        if (!cancel) setLoadingS(false);
      }
    })();
    return () => { cancel = true; };
  }, [courseId]);

  useEffect(() => {
    props.onChange?.({ courseId, subjectId });
  }, [courseId, subjectId]);

  return (
    <div className="space-y-5">
      {/* Corso di laurea */}
      <div className="relative">
        <label className="block mb-2 text-neutral-700 text-[15px]">Corso di Laurea</label>

        <select
          className="relative z-10 w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25 cursor-pointer"
          value={courseId ?? ""}
          onChange={(e) => {
            const v = e.target.value || undefined;
            setCourseId(v);
            setSubjectId(undefined);
          }}
          // IMPORTANTE: NON disabilitare il select durante il loading
          aria-busy={loadingC ? 'true' : 'false'}
        >
          <option value="">
            {loadingC ? "Carico…" : (courses.length ? "Seleziona corso" : "Nessun corso disponibile")}
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Se c'è un'icona/chevron assoluta a destra, deve avere pointer-events-none
            per non bloccare i tap sul select (specie su Safari iOS). Esempio: */}
        {/* <ChevronDown className="pointer-events-none absolute right-4 top-[52px]" /> */}
      </div>

      {/* Materia */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Materia</label>
        <select
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25 disabled:bg-neutral-100"
          value={subjectId ?? ""}
          onChange={(e) => setSubjectId(e.target.value || undefined)}
          disabled={!courseId || loadingS}
        >
          <option value="">
            {!courseId ? "Seleziona corso prima" :
              loadingS ? "Carico…" :
              (subjects.length ? "Seleziona materia" : "Nessuna materia disponibile")}
          </option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
    </div>
  );
}
