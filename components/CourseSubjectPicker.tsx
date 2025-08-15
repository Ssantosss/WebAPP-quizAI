'use client';

import { useEffect, useState } from 'react';

export type PickerChange = { course: string; subject: string };

export default function CourseSubjectPicker({
  defaultCourse,
  defaultSubject,
  onChange,
}: {
  defaultCourse?: string;
  defaultSubject?: string;
  onChange?: (v: PickerChange) => void;
}) {
  const [course, setCourse] = useState(defaultCourse ?? '');
  const [subject, setSubject] = useState(defaultSubject ?? '');

  useEffect(() => {
    onChange?.({ course, subject });
  }, [course, subject, onChange]);

  const courses = ['Informatica', 'Ingegneria', 'Economia'];
  const subjects = ['Algoritmi', 'Reti', 'Diritto', 'Statistica'];

  return (
    <div className="card" style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>
          <span>Corso di Laurea</span>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="input"
          >
            <option value="">Seleziona</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Materia</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
          >
            <option value="">Seleziona</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
