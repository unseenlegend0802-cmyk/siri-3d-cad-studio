import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flame, Menu, X } from "lucide-react";

const links = [
  { href: "/#latest", label: "Latest" },
  { href: "/#about", label: "About" },
  { href: "/#stats", label: "Forge" },
  { href: "/dragons", label: "All Dragons" },
  { href: "/#stores", label: "Stores" },
  { href: "/#commissions", label: "Commissions" },
  { href: "/#contact", label: "Contact" },
];

export function SiriHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <Flame className="h-5 w-5 text-primary group-hover:text-ember transition-colors" />
          <span className="font-display text-lg tracking-widest">
            SIRI <span className="text-primary">DRAGONS</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          aria-label="Menu"
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-foreground hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
