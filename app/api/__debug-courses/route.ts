import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, reason: "missing env", url, hasKey: !!key },
      { status: 500 }
    );
  }

  const r = await fetch(`${url}/rest/v1/courses?select=id,name&order=name.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  const txt = await r.text();
  return NextResponse.json(
    {
      ok: r.ok,
      status: r.status,
      body: (() => {
        try {
          return JSON.parse(txt);
        } catch {
          return txt;
        }
      })(),
    },
    { status: r.ok ? 200 : 500 }
  );
}
