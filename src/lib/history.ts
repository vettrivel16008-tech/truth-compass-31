import type { AnalysisResult, HistoryItem } from "./analysis-types";

const KEY = "veracity-sight:history";
const MAX = 25;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(input: string, result: AnalysisResult): HistoryItem[] {
  const item: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    input: input.slice(0, 300),
    result,
  };
  const next = [item, ...loadHistory()].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or unavailable */
  }
  return next;
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  const next = loadHistory().filter((h) => h.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearHistory(): HistoryItem[] {
  window.localStorage.removeItem(KEY);
  return [];
}
