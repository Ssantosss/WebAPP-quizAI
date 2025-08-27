import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const t0 = Date.now();
  try {
    const { base64, contentType } = await req.json() as { base64: string; contentType: string };
    if (!base64 || !contentType) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

    // TODO: integrare Gemini OCR + DeepSeek Reasoning
    const predicted: 'A'|'B'|'C'|'D' = 'B';
    const confidence = 0.88;

    return NextResponse.json({ predicted, confidence, latencyMs: Date.now() - t0 },
      { headers: { 'Cache-Control': 'no-store' } });
  } catch (e:any) {
    return NextResponse.json({ error: e.message ?? String(e) }, { status: 500 });
  }
}
