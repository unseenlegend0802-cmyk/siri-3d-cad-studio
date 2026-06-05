import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Box, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/" as const, label: "Home", hash: undefined },
  { to: "/" as const, label: "Featured", hash: "featured" },
  { to: "/" as const, label: "Latest", hash: "latest" },
  { to: "/" as const, label: "Categories", hash: "categories" },
  { to: "/models" as const, label: "All Models", hash: undefined },
  { to: "/" as const, label: "Commissions", hash: "commissions" },
  { to: "/" as const, label: "Contact", hash: "contact" },
];

export function SiriHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session),
    );
    return () => sub.subscription.unsubscribe();
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
        <Link to="/" className="flex items-center gap-2 group">
          <Box className="h-5 w-5 text-primary group-hover:text-ember transition-colors" />
          <span className="font-display text-lg tracking-widest">
            SIRI<span className="text-primary">3DCAD</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={`${l.to}-${l.label}`}
              to={l.to}
              hash={l.hash}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all"
            >
              {l.label}
            </Link>
          ))}
          {signedIn && (
            <Link
              to="/admin"
              className="text-sm text-primary hover:text-ember transition-colors"
            >
              Admin
            </Link>
          )}
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
              <Link
                key={`${l.to}-${l.label}-m`}
                to={l.to}
                hash={l.hash}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-foreground hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            {signedIn && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-primary hover:bg-secondary"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
