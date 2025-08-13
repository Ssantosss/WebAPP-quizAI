import { Extracted } from "./types";

export async function geminiExtract(imageBase64:string):Promise<Extracted>{
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents:[{parts:[{inline_data:{mime_type:"image/jpeg", data:imageBase64}}]}],
    generationConfig:{ temperature:0 }
  };
  const r = await fetch(url,{method:"POST", headers:{ "Content-Type":"application/json"}, body:JSON.stringify(body)});
  const j = await r.json();
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  const out = JSON.parse(text) as Extracted;
  if(!out?.prompt || !out.options || out.options.length!==4) throw new Error("bad_extract");
  out.options = out.options.map((o,i)=> ({...o, label: (["A","B","C","D"] as const)[i]}));
  return out;
}
