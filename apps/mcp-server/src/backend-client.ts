const BASE_URL = process.env.DAYSKTOP_API_URL ?? 'http://localhost:3000/api';

export interface AiEntry {
  date: string;
  note: string | null;
  mood: string | null;
  activities: string[];
  isFavorite: boolean;
}

export interface SearchEntriesParams {
  mood?: string;
  activities?: string[];
  keyword?: string;
  from?: string;
  to?: string;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Backend request to ${path} failed: ${response.status} ${response.statusText} — ${body}`);
  }
  return response.json() as Promise<T>;
}

export async function getEntryByDate(date: string): Promise<AiEntry | null> {
  const response = await fetch(`${BASE_URL}/ai/entries/${date}`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Backend request to /ai/entries/${date} failed: ${response.status} ${response.statusText} — ${body}`);
  }
  const body = await response.text();
  return body ? (JSON.parse(body) as AiEntry) : null;
}

export async function getEntries(from: string, to: string): Promise<AiEntry[]> {
  const params = new URLSearchParams({ from, to });
  return getJson<AiEntry[]>(`/ai/entries?${params.toString()}`);
}

export async function searchEntries(params: SearchEntriesParams): Promise<AiEntry[]> {
  const query = new URLSearchParams();
  if (params.mood) query.set('mood', params.mood);
  if (params.activities && params.activities.length > 0) query.set('activities', params.activities.join(','));
  if (params.keyword) query.set('keyword', params.keyword);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  return getJson<AiEntry[]>(`/ai/entries/search?${query.toString()}`);
}
