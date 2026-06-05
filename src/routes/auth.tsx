import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Box, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Embers } from "@/components/Embers";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Siri3DCAD Studio" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setInfo("Account created. You can sign in now.");
        setMode("signin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <Embers />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <Box className="h-5 w-5 text-primary" />
          <span className="font-display text-lg tracking-widest">
            SIRI<span className="text-primary">3DCAD</span>
          </span>
        </Link>

        <div className="rounded-lg border border-ember bg-card/80 backdrop-blur-md p-8 shadow-ember">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">— Studio Access</p>
          <h1 className="font-display text-3xl mb-2">
            {mode === "signin" ? "Sign in" : "Create admin account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signin"
              ? "Studio admins only. Sign in to manage Cults3D credentials."
              : "First account created becomes the studio admin."}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
                {error}
              </p>
            )}
            {info && (
              <p className="text-sm text-ember bg-primary/5 border border-ember rounded-md p-3">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.01] transition-transform disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setInfo(null);
            }}
            className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors w-full text-center"
          >
            {mode === "signin"
              ? "First time? Create the admin account →"
              : "← Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
