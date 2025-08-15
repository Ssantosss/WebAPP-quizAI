export type Option = { label: string; text: string };
export type Extracted = { prompt: string; options: Option[] };

export function parseGemini(text: string): Extracted {
  const obj = JSON.parse(text);
  const options: Option[] = (obj.options || []).map((o: string, i: number) => ({
    label: String.fromCharCode(65 + i),
    text: o,
  }));
  return { prompt: obj.prompt || '', options };
}

export function buildReasonPrompt(ex: Extracted): string {
  const opts = ex.options.map((o) => `${o.label}. ${o.text}`).join('\n');
  return `${ex.prompt}\n${opts}\nRispondi con la lettera corretta.`;
}
