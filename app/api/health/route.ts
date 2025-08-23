// app/api/health/route.ts
import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { count: coursesCount } = await supabase
      .from("courses")
      .select("id", { count: "exact", head: true });

    const { count: subjectsCount } = await supabase
      .from("subjects")
      .select("id", { count: "exact", head: true });

    return NextResponse.json({
      ok: true,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      counts: { courses: coursesCount ?? 0, subjects: subjectsCount ?? 0 },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
