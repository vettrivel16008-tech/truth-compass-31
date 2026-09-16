import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BrainCircuit,
  Database,
  Eye,
  FileSearch,
  GitCompareArrows,
  Globe,
  Layers,
  ScanEye,
  ServerCog,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { DISCLAIMER } from "@/lib/analysis-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veracity Sight | AI-Assisted News Credibility Analysis" },
      {
        name: "description",
        content:
          "Paste a headline, claim or article and get a transparent, evidence-based AI credibility assessment with sources and warning signals.",
      },
      { property: "og:title", content: "Veracity Sight | AI-Assisted News Credibility Analysis" },
      {
        property: "og:description",
        content:
          "Transparent, evidence-first AI analysis of news claims — verdict, credibility score, warning signals and sources.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const pillars = [
  {
    icon: BrainCircuit,
    title: "AI-Assisted Analysis",
    body: "A language model extracts claims, entities and manipulation signals from the text you submit.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence-Based Verification",
    body: "Where source verification is configured, real search results are compared against the claim.",
  },
  {
    icon: Eye,
    title: "Transparent Results",
    body: "Every score is broken down into the signals that produced it — nothing is hidden or pre-written.",
  },
  {
    icon: UserCheck,
    title: "Human Review Recommended",
    body: "The tool supports your judgement. It never declares a story definitively true or false.",
  },
];

const steps = [
  { n: "01", title: "Submit", body: "Paste a headline, claim, or article." },
  {
    n: "02",
    title: "Analyze",
    body: "AI identifies claims, language signals and important entities.",
  },
  { n: "03", title: "Verify", body: "The system checks available credible sources." },
  {
    n: "04",
    title: "Compare",
    body: "Supporting and contradicting evidence is compared.",
  },
  {
    n: "05",
    title: "Explain",
    body: "The application provides a transparent credibility assessment.",
  },
];

const stack = [
  { icon: Layers, label: "Frontend", body: "React with TanStack Start and Tailwind CSS." },
  { icon: ServerCog, label: "Backend", body: "Secure server-side functions; API keys never reach the browser." },
  { icon: BrainCircuit, label: "AI", body: "LLM-based claim extraction and language analysis with structured JSON output." },
  { icon: Globe, label: "Verification", body: "Trusted-source web verification when a search provider key is configured." },
  { icon: Database, label: "Storage", body: "Browser localStorage for your recent analysis history." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--glow)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <ScanEye className="size-3.5 text-primary" />
              AI Immersion project · Fake news detection
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
              See how credible a news story really is
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Veracity Sight analyses the claims inside a headline or article, looks for supporting
              and contradicting evidence, and explains its reasoning — so you can decide before you
              share.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/check"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Check News
              </Link>
              <Link
                to="/"
                hash="how-it-works"
                className="rounded-xl border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What this project does</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            No performance statistics are claimed. This is an educational tool built around
            transparency.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card/60 p-5">
                <p.icon className="size-6 text-primary" />
                <h3 className="mt-4 font-medium">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-20 border-y border-border/60 bg-card/30 px-4 py-16 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {steps.map((s) => (
                <li key={s.n} className="rounded-2xl border border-border bg-background p-5">
                  <span className="text-xs font-semibold tracking-widest text-primary">
                    {s.n} — {s.title}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Project architecture</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Only the technologies actually used in this project are listed.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stack.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card/60 p-5">
                <div className="flex items-center gap-2">
                  <s.icon className="size-5 text-primary" />
                  <h3 className="font-medium">{s.label}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FileSearch className="mt-1 size-6 shrink-0 text-primary" />
              <div>
                <h2 className="font-medium">Ready to check a story?</h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">{DISCLAIMER}</p>
              </div>
            </div>
            <Link
              to="/check"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <GitCompareArrows className="size-4" />
              Start analysis
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
