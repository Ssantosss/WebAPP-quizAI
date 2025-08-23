export type Course  = { id: string; name: string };
export type Subject = { id: string; name: string };

export async function loadCourses(): Promise<Course[]> {
  const res = await fetch("/api/courses", { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Course[];
}

export async function loadSubjects(courseId: string): Promise<Subject[]> {
  const res = await fetch(`/api/subjects?courseId=${encodeURIComponent(courseId)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Subject[];
}
