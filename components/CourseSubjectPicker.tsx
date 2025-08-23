"use client";

import { useEffect, useState } from "react";

type Course = { id: string; name: string };
type Subject = { id: string; name: string; course_id: string };

export type PickerValue = { courseId?: string; subjectId?: string };

export default function CourseSubjectPicker({
  value,
  onChange,
}: {
  value: PickerValue;
  onChange: (v: PickerValue) => void;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingC, setLoadingC] = useState(true);
  const [loadingS, setLoadingS] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoadingC(true);
    fetch("/api/courses", { cache: "no-store" })
      .then(r => r.json())
      .then(j => { if (alive) setCourses(Array.isArray(j.courses) ? j.courses : []); })
      .catch(() => setCourses([]))
      .finally(() => alive && setLoadingC(false));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    if (!value.courseId) { setSubjects([]); return; }
    setLoadingS(true);
    fetch(`/api/subjects?courseId=${encodeURIComponent(value.courseId)}`, { cache: "no-store" })
      .then(r => r.json())
      .then(j => { if (alive) setSubjects(Array.isArray(j.subjects) ? j.subjects : []); })
      .catch(() => setSubjects([]))
      .finally(() => alive && setLoadingS(false));
    return () => { alive = false; };
  }, [value.courseId]);

  const noCourses = !loadingC && courses.length === 0;
  const noSubjects = !!value.courseId && !loadingS && subjects.length === 0;

  return (
    <div className="space-y-6">
      {/* Corso di Laurea — mantieni le tue classi */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Corso di Laurea</label>
        <select
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25"
          value={value.courseId ?? ""}
          onChange={(e) => onChange({ courseId: e.target.value || undefined, subjectId: undefined })}
        >
          <option value="" disabled hidden>
            {loadingC ? "Carico…" : (noCourses ? "Nessun corso disponibile" : "Seleziona corso")}
          </option>
          {!value.courseId && (
            <option value="">
              {loadingC ? "Carico…" : (noCourses ? "Nessun corso disponibile" : "Seleziona corso")}
            </option>
          )}
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Materia — mantieni le tue classi */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Materia</label>
        <select
          key={value.courseId ?? "no-course"}
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25 disabled:bg-neutral-100 disabled:text-neutral-400"
          value={value.subjectId ?? ""}
          disabled={!value.courseId || loadingS || noSubjects}
          onChange={(e) => onChange({ ...value, subjectId: e.target.value || undefined })}
        >
          <option value="" disabled hidden>
            {!value.courseId
              ? "Seleziona corso prima"
              : loadingS
              ? "Carico…"
              : noSubjects
              ? "Nessuna materia disponibile"
              : "Seleziona materia"}
          </option>
          {(!value.courseId || noSubjects) && (
            <option value="">{!value.courseId ? "Seleziona corso prima" : "Nessuna materia disponibile"}</option>
          )}
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
    </div>
  );
}
