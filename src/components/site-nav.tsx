import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ScanEye } from "lucide-react";

const links = [
  { label: "Home", to: "/" as const, hash: "" },
  { label: "Check News", to: "/check" as const, hash: "" },
  { label: "How It Works", to: "/" as const, hash: "how-it-works" },
  { label: "Features", to: "/" as const, hash: "features" },
  { label: "History", to: "/history" as const, hash: "" },
  { label: "About", to: "/about" as const, hash: "" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
            <ScanEye className="size-5" />
          </span>
          <span className="text-base font-semibold tracking-tight">Veracity Sight</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                hash={l.hash}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeOptions={{ exact: true, includeHash: false }}
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/check"
          className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
        >
          Check News
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="grid size-9 place-items-center rounded-lg border border-border md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {open && (
        <ul className="border-t border-border/60 px-4 pb-4 md:hidden">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                hash={l.hash}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Veracity Sight</p>
        <p className="max-w-3xl leading-relaxed">
          An AI Immersion educational project. Veracity Sight provides AI-assisted credibility
          analysis. It does not guarantee that a claim is true or false. Always verify important
          information using reliable primary and independent sources.
        </p>
      </div>
    </footer>
  );
}
