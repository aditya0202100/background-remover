import { Link } from "@tanstack/react-router";
import { Scissors } from "lucide-react";

const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
];

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur-md"
      data-ocid="navbar"
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center transition-smooth group-hover:bg-primary/25">
            <Scissors className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            Clear<span className="text-primary">Cut</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/80 transition-smooth"
              activeProps={{ className: "text-primary bg-primary/10" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
