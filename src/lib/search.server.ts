/**
 * Optional real web/source verification.
 * Enabled only when TAVILY_API_KEY is configured. No key => no invented sources.
 */

export interface SearchHit {
  title: string;
  url: string;
  snippet: string;
  date: string | null;
  domain: string;
}

const PREFERRED = [
  ".gov",
  ".gov.in",
  ".edu",
  ".ac.uk",
  ".int",
  "who.int",
  "un.org",
  "nature.com",
  "science.org",
  "reuters.com",
  "apnews.com",
  "bbc.co.uk",
  "bbc.com",
  "pib.gov.in",
  "thehindu.com",
  "nytimes.com",
  "theguardian.com",
  "afp.com",
  "factcheck.org",
  "snopes.com",
  "politifact.com",
];

export function isSearchConfigured(): boolean {
  return Boolean(process.env["TAVILY_API_KEY"]);
}

export async function searchSources(query: string): Promise<SearchHit[] | null> {
  const key = process.env["TAVILY_API_KEY"];
  if (!key) return null;

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "advanced",
      max_results: 8,
      include_answer: false,
    }),
  });

  if (!res.ok) {
    console.error("Search provider error", res.status);
    throw new Error("search_failed");
  }

  const data = (await res.json()) as {
    results?: Array<{
      title?: string;
      url?: string;
      content?: string;
      published_date?: string;
    }>;
  };

  const hits: SearchHit[] = (data.results ?? [])
    .filter((r) => r.url && r.title)
    .map((r) => {
      let domain = "";
      try {
        domain = new URL(r.url!).hostname.replace(/^www\./, "");
      } catch {
        domain = "";
      }
      return {
        title: r.title!,
        url: r.url!,
        snippet: (r.content ?? "").slice(0, 700),
        date: r.published_date ?? null,
        domain,
      };
    });

  hits.sort((a, b) => Number(isPreferred(b.domain)) - Number(isPreferred(a.domain)));
  return hits;
}

export function isPreferred(domain: string): boolean {
  return PREFERRED.some((d) => domain === d || domain.endsWith(d));
}
