import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, Trash2 } from "lucide-react";
import { analyzeNews } from "@/lib/analysis.functions";
import type { AnalysisResult } from "@/lib/analysis-types";
import { saveHistory } from "@/lib/history";
import { ResultCard } from "./result-card";

const SAMPLES = [
  {
    label: "Reliable-style claim",
    text: "The World Health Organization published updated global air quality guidelines recommending lower limits for annual PM2.5 exposure.",
  },
  {
    label: "Misleading-style claim",
    text: "SHOCKING: Scientists CONFIRM that drinking hot lemon water every morning completely cures all types of cancer within 14 days. Doctors are furious and the media refuses to report it!",
  },
  {
    label: "Unverified claim",
    text: "A new national rule will reportedly make it compulsory for every household to register their pets online starting next month, according to sources.",
  },
];

const MIN_CHARS = 25;
const TIMEOUT_MS = 90000;

export function CheckPanel() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const analyze = useServerFn(analyzeNews);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  async function handleCheck() {
    const value = text.trim();
    setError(null);
    if (!value) {
      setError("Please enter a headline, claim or article before checking.");
      return;
    }
    if (value.length < MIN_CHARS) {
      setError("Please enter a meaningful headline or article.");
      return;
    }

    setLoading(true);
    setResult(null);
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS),
    );

    try {
      const res = (await Promise.race([
        analyze({ data: { text: value } }),
        timeout,
      ])) as AnalysisResult;
      setResult(res);
      saveHistory(value, res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "timeout") {
        setError("The analysis took too long to respond. Please try again with shorter text.");
      } else if (/fetch|network|Failed to fetch/i.test(msg)) {
        setError("Network problem — please check your connection and try again.");
      } else if (msg && msg.length < 220 && !/\{|\}|stack/i.test(msg)) {
        setError(msg);
      } else {
        setError("Something went wrong during analysis. Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
        <label htmlFor="news-input" className="sr-only">
          News headline, claim or article
        </label>
        <textarea
          id="news-input"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 20000))}
          placeholder="Paste news headline or article here..."
          rows={9}
          className="w-full resize-y rounded-xl border border-border bg-background p-4 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{text.length} / 20000 characters</span>
          <span>Minimum {MIN_CHARS} characters</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loading ? "Analyzing claim..." : "Check News"}
          </button>
          <button
            type="button"
            onClick={() => {
              setText("");
              setResult(null);
              setError(null);
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            Clear
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-risk/40 bg-risk/10 p-3 text-sm text-risk">
            {error}
          </p>
        )}

        {loading && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Analyzing claim — extracting claims, checking language signals and available
              sources...
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-border p-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Try a sample
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Demonstration examples only. Each sample runs through the same analysis pipeline as your
          own input — no results are pre-written.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {SAMPLES.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setText(s.text);
                setResult(null);
                setError(null);
              }}
              className="rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary"
            >
              <p className="text-sm font-medium">{s.label}</p>
              <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{s.text}</p>
            </button>
          ))}
        </div>
      </div>

      <div ref={resultRef} className="scroll-mt-24">
        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}
