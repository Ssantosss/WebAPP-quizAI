import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ocr } from '../../../lib/ocr';
import { reason } from '../../../lib/reason';

export const runtime = 'nodejs';
const rate = new Map<string,{count:number,time:number}>();
const MAX_PER_MIN = Number(process.env.ANALYZE_MAX_PER_MIN || 30);
const MAX_BYTES = Number(process.env.ANALYZE_MAX_BYTES || 3145728);
const schema = z.object({ imageBase64: z.string() });

export async function POST(req:NextRequest){
  const ip = req.ip || '0';
  const now = Date.now();
  const entry = rate.get(ip) || {count:0,time:now};
  if(now - entry.time > 60000){ entry.count=0; entry.time=now; }
  entry.count++; rate.set(ip,entry);
  if(entry.count > MAX_PER_MIN) return new NextResponse('rate limit',{status:429,headers:{'Cache-Control':'no-store'}});

  const { imageBase64 } = schema.parse(await req.json());
  const buf = Buffer.from(imageBase64,'base64');
  if(buf.length > MAX_BYTES) return NextResponse.json({error:'too_large'},{status:400,headers:{'Cache-Control':'no-store'}});
  const isPng = buf[0]===0x89 && buf[1]===0x50;
  const isJpg = buf[0]===0xff && buf[1]===0xd8;
  if(!isPng && !isJpg) return NextResponse.json({error:'format'},{status:400,headers:{'Cache-Control':'no-store'}});

  const t0=Date.now();
  const text = await ocr(imageBase64);
  const t1=Date.now();
  const ans = await reason(text);
  const t2=Date.now();
  return NextResponse.json({predicted:ans.predicted,latencyMs:{ocr:t1-t0,reason:t2-t1,total:t2-t0}},{headers:{'Cache-Control':'no-store'}});
}
