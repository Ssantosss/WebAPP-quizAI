// app/api/subjects/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId") ?? "";

    if (!isUuid(courseId)) {
      return NextResponse.json({ subjects: [] }, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await sb
      .from("subjects")
      .select("id,name,course_id")
      .eq("course_id", courseId)
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ subjects: data ?? [] }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
