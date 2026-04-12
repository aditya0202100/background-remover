import { Link } from "@tanstack/react-router";
import { Scissors } from "lucide-react";

const FOOTER_LINKS = [
  { to: "/about", label: "About" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Scissors className="w-3 h-3 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground/80">
            Clear<span className="text-primary">Cut</span>
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 hover:underline transition-smooth"
            >
              caffeine.ai
            </a>
          </span>
        </div>

        {/* Footer links */}
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          {FOOTER_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-4 border-t border-border/40 pt-4">
        <p className="text-xs text-muted-foreground/60 text-center">
          All image processing happens locally in your browser — your images
          never leave your device.
        </p>
      </div>
    </footer>
  );
}
