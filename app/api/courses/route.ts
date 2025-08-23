// app/api/courses/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, reason: "missing env", hasUrl: !!url, hasKey: !!key },
      { status: 500 }
    );
  }

  const r = await fetch(`${url}/rest/v1/courses?select=id,name&order=name.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
    next: { revalidate: 0 },
  });

  const text = await r.text();
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: r.ok ? 200 : 500 });
  } catch {
    return NextResponse.json({ ok: r.ok, raw: text }, { status: r.ok ? 200 : 500 });
  }
}
