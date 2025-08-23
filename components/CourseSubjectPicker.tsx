"use client";

import { useEffect, useState } from "react";
import { fetchCourses, fetchSubjects, type Course, type Subject } from "@/lib/supaRest";

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

  // Carica corsi
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingC(true);
        const data = await fetchCourses();
        if (alive) setCourses(data ?? []);
      } catch (e) {
        console.error("Errore caricamento corsi:", e);
        if (alive) setCourses([]);
      } finally {
        if (alive) setLoadingC(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Carica materie al cambio corso
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!value.courseId) {
        setSubjects([]);
        return;
      }
      try {
        setLoadingS(true);
        const data = await fetchSubjects(value.courseId);
        if (alive) setSubjects(data ?? []);
      } catch (e) {
        console.error("Errore caricamento materie:", e);
        if (alive) setSubjects([]);
      } finally {
        if (alive) setLoadingS(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [value.courseId]);

  const noCourses = !loadingC && courses.length === 0;
  const noSubjects = !!value.courseId && !loadingS && subjects.length === 0;

  return (
    <div className="space-y-6">
      {/* Corso di Laurea */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Corso di Laurea</label>
        <select
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25"
          value={value.courseId ?? ""}
          onChange={(e) => onChange({ courseId: e.target.value || undefined, subjectId: undefined })}
        >
          <option value="">
            {loadingC ? "Carico…" : noCourses ? "Nessun corso disponibile" : "Seleziona corso"}
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Materia */}
      <div>
        <label className="block mb-2 text-neutral-700 text-[15px]">Materia</label>
        <select
          key={value.courseId ?? "no-course"}
          className="w-full h-14 rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#176d46]/25 disabled:bg-neutral-100 disabled:text-neutral-400"
          value={value.subjectId ?? ""}
          disabled={!value.courseId || loadingS || noSubjects}
          onChange={(e) => onChange({ ...value, subjectId: e.target.value || undefined })}
        >
          <option value="">
            {!value.courseId
              ? "Seleziona corso prima"
              : loadingS
              ? "Carico…"
              : noSubjects
              ? "Nessuna materia disponibile"
              : "Seleziona materia"}
          </option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
