export async function ocr(imageBase64:string){
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents:[{parts:[{inline_data:{mime_type:'image/jpeg',data:imageBase64}}]}],
    generationConfig:{temperature:0}
  };
  const r = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const j = await r.json();
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.replace(/```[\s\S]*?```/g,'').trim();
}
