"use client";
import { useEffect, useState } from "react";

export type Subject = { id: string; name: string; course_id: string };

export function useSubjects(courseId?: string) {
  const [data, setData] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!courseId) { setData([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/subjects?courseId=${encodeURIComponent(courseId)}`, { cache: "no-store" })
      .then(r => r.json())
      .then(j => { if (alive) setData(Array.isArray(j.subjects) ? j.subjects : []); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [courseId]);

  return { data, loading };
}
