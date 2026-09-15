import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { ResultCard } from "@/components/result-card";
import { clearHistory, deleteHistoryItem, loadHistory } from "@/lib/history";
import type { HistoryItem } from "@/lib/analysis-types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Analysis History | Veracity Sight" },
      {
        name: "description",
        content:
          "Review your recent Veracity Sight credibility checks, stored only in this browser.",
      },
      { property: "og:title", content: "Analysis History | Veracity Sight" },
      {
        property: "og:description",
        content: "Recent AI-assisted credibility checks stored locally in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const open = items.find((i) => i.id === openId) ?? null;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Analysis History</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Stored only in this browser. Nothing is uploaded or shared.
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setItems(clearHistory());
                setOpenId(null);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Trash2 className="size-4" />
              Delete history
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No analyses yet.{" "}
            <Link to="/check" className="text-primary hover:underline">
              Check a news story
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium">{item.input}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.result.verdict} · {item.result.score}/100 ·{" "}
                      {new Date(item.result.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === item.id ? null : item.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:bg-accent"
                    >
                      {openId === item.id ? "Hide" : "View"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItems(deleteHistoryItem(item.id));
                        if (openId === item.id) setOpenId(null);
                      }}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:bg-accent"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {open && (
          <div className="mt-8">
            <ResultCard result={open.result} />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
