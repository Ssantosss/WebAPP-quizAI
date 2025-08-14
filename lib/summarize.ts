import { SearchResult } from './retrieve';

/**
 * Produce a bullet list with numbered citations limited to ~2000 characters.
 */
export function summarizeSnippets(snips: SearchResult[]): string {
  let total = 0;
  const lines: string[] = [];
  snips.forEach((s, i) => {
    const line = `- ${s.snippet} [${i + 1}] ${s.url}`;
    if (total + line.length + 1 <= 2000) {
      lines.push(line);
      total += line.length + 1;
    }
  });
  return lines.join('\n');
}
