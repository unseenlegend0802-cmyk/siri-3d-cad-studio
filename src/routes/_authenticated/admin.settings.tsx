import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Box, CheckCircle2, Loader2, LogOut, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Embers } from "@/components/Embers";
import {
  getStudioSettings,
  updateStudioSettings,
  testCultsConnection,
} from "@/lib/cults.functions";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({
    meta: [
      { title: "Admin Settings — Siri3DCAD Studio" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const fetchSettings = useServerFn(getStudioSettings);
  const saveSettings = useServerFn(updateStudioSettings);
  const testConnection = useServerFn(testCultsConnection);

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetchSettings();
        setUsername(s.username);
        setHasKey(s.hasApiKey);
        setUpdatedAt(s.updatedAt);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load";
        if (msg.toLowerCase().includes("forbidden")) setForbidden(true);
        setMessage({ type: "err", text: msg });
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchSettings]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await saveSettings({ data: { username: username.trim(), apiKey: apiKey.trim() } });
      setMessage({ type: "ok", text: "Credentials saved. Catalog will refresh shortly." });
      setHasKey(true);
      setApiKey("");
      setUpdatedAt(new Date().toISOString());
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const onTest = async () => {
    setTesting(true);
    setMessage(null);
    try {
      const r = await testConnection();
      if (r.ok) {
        setMessage({ type: "ok", text: `Connected to Cults3D as ${r.nick}.` });
      } else {
        setMessage({ type: "err", text: r.error ?? "Connection failed" });
      }
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Test failed" });
    } finally {
      setTesting(false);
    }
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Embers />
      <main className="relative z-10 pt-16 pb-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-10 pt-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              <span className="font-display text-lg tracking-widest">
                SIRI<span className="text-primary">3DCAD</span>
              </span>
            </Link>
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Admin</p>
          <h1 className="font-display text-4xl md:text-5xl mb-2">Studio Settings</h1>
          <p className="text-muted-foreground mb-10">
            Manage the Cults3D API connection that powers the live catalog.
          </p>

          <div className="rounded-lg border border-border bg-card/80 backdrop-blur p-8 shadow-card">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading settings…
              </div>
            ) : forbidden ? (
              <p className="text-destructive">
                This account is not an admin. Contact the studio owner.
              </p>
            ) : (
              <form onSubmit={onSave} className="space-y-6">
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground">
                    Cults3D Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Siri3DCAD"
                    className="mt-1 w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The nick visible in your Cults3D profile URL.
                  </p>
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground">
                    Cults3D API Key (password)
                  </label>
                  <input
                    type="password"
                    autoComplete="off"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={hasKey ? "•••••••• (leave empty to keep current)" : "Paste the API key from Cults3D"}
                    className="mt-1 w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Request access via{" "}
                    <a
                      href="https://cults3d.com/en/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-ember"
                    >
                      cults3d.com/en/api
                    </a>
                    . Used server-side only.
                  </p>
                </div>

                {updatedAt && (
                  <p className="text-xs text-muted-foreground">
                    Last updated {new Date(updatedAt).toLocaleString()}
                    {hasKey ? " · API key on file" : " · no API key on file"}
                  </p>
                )}

                {message && (
                  <div
                    className={`flex items-start gap-2 rounded-md p-3 text-sm border ${
                      message.type === "ok"
                        ? "border-ember bg-primary/5 text-ember"
                        : "border-destructive/40 bg-destructive/10 text-destructive"
                    }`}
                  >
                    {message.type === "ok" ? (
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    )}
                    <span>{message.text}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving || !username.trim() || (!apiKey.trim() && !hasKey)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.01] transition-transform disabled:opacity-50"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save credentials
                  </button>
                  <button
                    type="button"
                    onClick={onTest}
                    disabled={testing || !hasKey}
                    title={hasKey ? "" : "Save credentials first"}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-ember bg-background/40 text-foreground hover:bg-primary/10 hover:border-primary transition-all disabled:opacity-50"
                  >
                    {testing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Test connection
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-10 text-sm text-muted-foreground">
            Need to manage the catalog itself? Visit{" "}
            <Link to="/models" className="text-primary hover:text-ember">All Models</Link>.
          </div>
        </div>
      </main>
    </div>
  );
}
