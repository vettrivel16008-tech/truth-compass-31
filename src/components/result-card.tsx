import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Info,
  ShieldAlert,
} from "lucide-react";
import { DISCLAIMER, type AnalysisResult } from "@/lib/analysis-types";

function verdictStyle(verdict: AnalysisResult["verdict"]) {
  if (verdict === "Likely Reliable")
    return { cls: "text-reliable", ring: "bg-reliable/10 border-reliable/30", Icon: CheckCircle2 };
  if (verdict === "Needs Verification")
    return { cls: "text-caution", ring: "bg-caution/10 border-caution/30", Icon: HelpCircle };
  return { cls: "text-risk", ring: "bg-risk/10 border-risk/30", Icon: ShieldAlert };
}

const stanceLabel: Record<string, string> = {
  supports: "Supports",
  contradicts: "Contradicts",
  context: "Context",
};

export function ResultCard({ result }: { result: AnalysisResult }) {
  const { cls, ring, Icon } = verdictStyle(result.verdict);

  return (
    <section className="space-y-5" aria-live="polite">
      <div className={`rounded-2xl border p-5 sm:p-6 ${ring}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Icon className={`mt-0.5 size-7 shrink-0 ${cls}`} />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Verdict</p>
              <p className={`text-2xl font-semibold ${cls}`}>{result.verdict}</p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Credibility score
            </p>
            <p className="text-2xl font-semibold">
              {result.score}
              <span className="text-base text-muted-foreground">/100</span>
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${
              result.score >= 80 ? "bg-reliable" : result.score >= 50 ? "bg-caution" : "bg-risk"
            }`}
            style={{ width: `${result.score}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          An AI-assisted credibility indicator, not an exact measurement.
        </p>
      </div>

      <Block title="Why?">
        <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
      </Block>

      <div className="grid gap-4 sm:grid-cols-2">
        {result.factors.map((f) => (
          <div key={f.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</p>
            <p className="mt-1 font-medium">{f.value}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.note}</p>
          </div>
        ))}
      </div>

      {result.claims.length > 0 && (
        <Block title="Claims identified">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {result.claims.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                {c}
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block title="Warning signals">
        {result.warningSignals.length ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {result.warningSignals.map((w, i) => (
              <li key={i} className="flex gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-caution" />
                {w}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No notable language warning signals.</p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Writing style alone is never treated as proof of misinformation.
        </p>
      </Block>

      <Block title="Evidence">
        {result.evidence.length ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {result.evidence.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                {e}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {result.verificationStatus === "unavailable"
              ? "Source verification is not configured for this deployment, so no external evidence was gathered."
              : "No reliable supporting evidence was found in the available sources."}
          </p>
        )}
      </Block>

      <Block title="Sources checked">
        {result.sources.length ? (
          <ul className="space-y-3">
            {result.sources.map((s) => (
              <li key={s.url} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{s.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      s.stance === "supports"
                        ? "bg-reliable/15 text-reliable"
                        : s.stance === "contradicts"
                          ? "bg-risk/15 text-risk"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stanceLabel[s.stance]}
                  </span>
                  {s.date && (
                    <span className="text-xs text-muted-foreground">{s.date}</span>
                  )}
                </div>
                <p className="mt-1 text-sm">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Open source <ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {result.verificationStatus === "unavailable"
              ? "Unable to verify this claim with the available sources — no source-verification provider is configured."
              : "No reliable sources addressing this claim were found."}
          </p>
        )}
      </Block>

      <Block title="Recommendation">
        <p className="text-sm leading-relaxed text-muted-foreground">{result.recommendation}</p>
      </Block>

      <p className="flex gap-2 rounded-xl border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        {DISCLAIMER}
      </p>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}
