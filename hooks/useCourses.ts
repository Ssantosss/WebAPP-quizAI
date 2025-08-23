"use client";
import { useEffect, useState } from "react";

export type Course = { id: string; name: string };

export function useCourses() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch("/api/courses", { cache: "no-store" })
      .then(r => r.json())
      .then(j => { if (alive) setData(Array.isArray(j.courses) ? j.courses : []); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return { data, loading };
}
