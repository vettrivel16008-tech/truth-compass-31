import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { DISCLAIMER } from "@/lib/analysis-types";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project | Veracity Sight" },
      {
        name: "description",
        content:
          "Veracity Sight is an AI Immersion educational project exploring AI-assisted credibility analysis of news claims.",
      },
      { property: "og:title", content: "About the Project | Veracity Sight" },
      {
        property: "og:description",
        content:
          "An educational AI Immersion project on AI-assisted news credibility analysis and evidence checking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const sections = [
  {
    title: "Problem",
    body: "False and misleading information spreads rapidly online, often faster than corrections can reach the people who saw it.",
  },
  {
    title: "Solution",
    body: "Veracity Sight provides AI-assisted analysis of news claims and helps users identify credibility signals and supporting evidence.",
  },
  {
    title: "Objective",
    body: "Help users pause, verify and understand information before sharing it. The project does not claim to eliminate fake news.",
  },
  {
    title: "Educational scope",
    body: "This is an AI Immersion coursework project. Its purpose is to demonstrate a transparent, evidence-first analysis pipeline rather than to act as an authoritative fact-checking authority.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Veracity Sight</h1>
        <div className="mt-8 space-y-4">
          {sections.map((s) => (
            <section key={s.title} className="rounded-2xl border border-border bg-card/60 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
          <p className="rounded-2xl border border-border bg-muted/40 p-5 text-xs leading-relaxed text-muted-foreground">
            {DISCLAIMER}
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
