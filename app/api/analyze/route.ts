import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '../../../lib/ocr';
import { maxQuizzes } from '../../../lib/quotas';
import type { Plan } from '../../../lib/store';

const RATE_LIMIT = Number(process.env.ANALYZE_MAX_PER_MIN || 30);
const MAX_BYTES = Number(process.env.ANALYZE_MAX_BYTES || 3145728);

const rateMap = new Map<string, { ts: number; count: number }>();
const quotaMap = new Map<string, { date: string; count: number }>();

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anon';
  const now = Date.now();
  const rl = rateMap.get(ip);
  if (!rl || now - rl.ts > 60000) {
    rateMap.set(ip, { ts: now, count: 1 });
  } else {
    rl.count++;
    if (rl.count > RATE_LIMIT) {
      return NextResponse.json({ error: 'rate' }, { status: 429, headers: { 'Cache-Control': 'no-store' } });
    }
    rateMap.set(ip, rl);
  }

  const plan = (req.headers.get('x-plan') as Plan) || 'free';
  const today = new Date().toISOString().slice(0, 10);
  const q = quotaMap.get(ip) || { date: today, count: 0 };
  if (q.date !== today) {
    q.date = today;
    q.count = 0;
  }
  q.count++;
  quotaMap.set(ip, q);
  if (q.count > maxQuizzes(plan)) {
    return NextResponse.json({ error: 'quota' }, { status: 429, headers: { 'Cache-Control': 'no-store' } });
  }

  const { imageBase64 } = await req.json();
  const size = Math.ceil((imageBase64.length * 3) / 4);
  if (size > MAX_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
  }

  const predicted = await analyzeImage(imageBase64);
  return NextResponse.json({ predicted }, { headers: { 'Cache-Control': 'no-store' } });
}
