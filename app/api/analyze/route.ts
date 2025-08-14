import { NextRequest, NextResponse } from "next/server";
import { geminiExtract } from "../../../lib/ocr";
import { deepseekAnswer } from "../../../lib/reason";
import { AnalyzeResult } from "../../../lib/types";
import { searchOfficial } from "../../../lib/retrieve";
import { summarizeSnippets } from "../../../lib/summarize";

const MAX_RETRY = Number(process.env.MAX_RETRY||2);
const MAX_BYTES = Number(process.env.ANALYZE_MAX_BYTES || 3145728);
const CONF_THRESHOLD = Number(process.env.CONF_THRESHOLD || 0.72);

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
  if(Buffer.from(imageBase64,"base64").byteLength > MAX_BYTES){
    return NextResponse.json({error:"too_large"},{status:413});
  }
  const t0 = Date.now();
  const extracted = await retry(()=>geminiExtract(imageBase64));
  const t1 = Date.now();
  let sourcesSummary = "";
  try {
    const snips = await searchOfficial(extracted.prompt);
    sourcesSummary = summarizeSnippets(snips);
  } catch (e) {
    console.error("search_failed", e);
  }
  const ans = await retry(()=>deepseekAnswer(extracted, sourcesSummary));
  const t2 = Date.now();
  if(ans.citations) console.log("citations", ans.citations);
  if(ans.confidence < CONF_THRESHOLD){
    return NextResponse.json({error:"low_confidence"},{status:422});
  }
  const res:AnalyzeResult = { predicted: ans.predicted, latencyMs:{ ocr:t1-t0, reason:t2-t1, total:t2-t0 } };
  return NextResponse.json(res);
}
