export type SearchResult = { title: string; url: string; snippet: string };

/**
 * Search trusted sources using Serper.dev (or Bing)
 * Restricts search to official domains and returns up to 3 results.
 */
export async function searchOfficial(query: string): Promise<SearchResult[]> {
  const serperKey = process.env.SERPER_API_KEY;
  const bingKey = process.env.BING_API_KEY;
  const domainFilter =
    'site:wikipedia.org OR site:edu OR site:gov OR site:pubmed.ncbi.nlm.nih.gov OR site:jstor.org';
  const fullQuery = `${query} ${domainFilter}`;

  if (serperKey) {
    const r = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': serperKey,
      },
      body: JSON.stringify({ q: fullQuery }),
    });
    if (!r.ok) throw new Error('search_failed');
    const j = await r.json();
    const org = Array.isArray(j.organic) ? j.organic : [];
    return org.slice(0, 3).map((it: any) => ({
      title: it.title,
      url: it.link,
      snippet: it.snippet,
    }));
  }

  if (bingKey) {
    const url =
      'https://api.bing.microsoft.com/v7.0/search?q=' +
      encodeURIComponent(fullQuery) +
      '&count=3';
    const r = await fetch(url, {
      headers: { 'Ocp-Apim-Subscription-Key': bingKey },
    });
    if (!r.ok) throw new Error('search_failed');
    const j = await r.json();
    const vals = j.webPages?.value ?? [];
    return vals.slice(0, 3).map((it: any) => ({
      title: it.name,
      url: it.url,
      snippet: it.snippet,
    }));
  }

  throw new Error('missing_api_key');
}

