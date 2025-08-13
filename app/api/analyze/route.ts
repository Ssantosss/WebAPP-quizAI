import { NextRequest, NextResponse } from "next/server";
import { geminiExtract } from "../../../lib/ocr";
import { deepseekAnswer } from "../../../lib/reason";
import { AnalyzeResult } from "../../../lib/types";

const MAX_RETRY = Number(process.env.MAX_RETRY||2);

async function retry<T>(fn:()=>Promise<T>, n=MAX_RETRY){
  let last:any;
  for(let i=0;i<=n;i++){
    try{ return await fn(); }
    catch(e){ last=e; await new Promise(r=>setTimeout(r,300*(i+1))); }
  }
  throw last;
}

export async function POST(req:NextRequest){
  const { imageBase64, shots=0 } = await req.json();
  if(Number(shots) >= 35){
    return NextResponse.json({error:"limit_reached"},{status:429});
  }
  const t0 = Date.now();
  const extracted = await retry(()=>geminiExtract(imageBase64));
  const t1 = Date.now();
  const ans = await retry(()=>deepseekAnswer(extracted));
  const t2 = Date.now();
  const res:AnalyzeResult = { predicted: ans.predicted, latencyMs:{ ocr:t1-t0, reason:t2-t1, total:t2-t0 } };
  return NextResponse.json(res);
}
