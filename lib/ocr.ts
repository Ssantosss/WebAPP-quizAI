import { parseGemini, buildReasonPrompt } from './parsing';

export async function geminiOCR(imageBase64: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }] }],
    generationConfig: { temperature: 0 },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
}

export async function deepseekReason(prompt: string): Promise<string> {
  const url = 'https://api.deepseek.com/v1/chat/completions';
  const body = {
    model: process.env.DEEPSEEK_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() || '';
}

export async function analyzeImage(imageBase64: string): Promise<string> {
  const text = await geminiOCR(imageBase64);
  const extracted = parseGemini(text);
  const prompt = buildReasonPrompt(extracted);
  const answer = await deepseekReason(prompt);
  return answer.trim().charAt(0).toUpperCase();
}
