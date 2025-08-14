export async function reason(prompt:string){
  const sys = 'Rispondi in JSON {"predicted":"A|B|C|D","confidence":0-1}';
  const r = await fetch('https://api.deepseek.com/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.DEEPSEEK_API_KEY}`},
    body:JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-reasoner',
      temperature:0,
      response_format:{type:'json_object'},
      messages:[{role:'system',content:sys},{role:'user',content:prompt}],
      max_tokens:200
    })
  });
  const j = await r.json();
  const txt = j.choices?.[0]?.message?.content || '{}';
  const ans = JSON.parse(txt);
  if(!ans.predicted) throw new Error('bad_answer');
  return ans;
}
