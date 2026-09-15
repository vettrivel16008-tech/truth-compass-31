import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { CheckPanel } from "@/components/check-panel";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "Check a News Story | Veracity Sight" },
      {
        name: "description",
        content:
          "Paste a headline, claim or article and get an AI-assisted credibility assessment with evidence and sources.",
      },
      { property: "og:title", content: "Check a News Story | Veracity Sight" },
      {
        property: "og:description",
        content:
          "AI-assisted credibility analysis of news headlines, claims and articles, with transparent scoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckPage,
});

function CheckPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Check a News Story</h1>
        <p className="mt-2 text-muted-foreground">
          Paste a headline, claim, or article text to evaluate its credibility.
        </p>
        <div className="mt-8">
          <CheckPanel />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
