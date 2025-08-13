import { DeepAnswer, Extracted } from "./types";

export async function deepseekAnswer(e:Extracted):Promise<DeepAnswer>{
  const sys = `Sei un risolutore di quiz. Scegli tra A-D. Restituisci SOLO JSON {predicted, confidence, explanation, sources, checks}`;
  const user = JSON.stringify(e);
  const r = await fetch("https://api.deepseek.com/v1/chat/completions",{
    method:"POST",
    headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${process.env.DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL,
      temperature: 0,
      response_format: { type:"json_object" },
      messages: [{role:"system", content:sys},{role:"user", content:user}],
      max_tokens: 300
    })
  });
  const j = await r.json();
  const txt = j.choices?.[0]?.message?.content ?? "{}";
  const ans = JSON.parse(txt) as DeepAnswer;
  if(!ans?.predicted) throw new Error("bad_answer");
  return ans;
}
