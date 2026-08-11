import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Box, Loader2, Mail, MailOpen } from "lucide-react";
import { Embers } from "@/components/Embers";
import {
  listContactSubmissions,
  markSubmissionRead,
  type ContactSubmission,
} from "@/lib/contact.functions";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Siri3DCAD Studio Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const fetchAll = useServerFn(listContactSubmissions);
  const toggleRead = useServerFn(markSubmissionRead);

  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setItems(await fetchAll());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load messages");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchAll]);

  const onToggle = async (item: ContactSubmission) => {
    const read = !item.readAt;
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, readAt: read ? new Date().toISOString() : null } : i,
      ),
    );
    try {
      await toggleRead({ data: { id: item.id, read } });
    } catch {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    }
  };

  const unread = items.filter((i) => !i.readAt).length;

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
            <Link
              to="/admin/settings"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Studio settings
            </Link>
          </div>

          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Admin</p>
          <h1 className="font-display text-4xl md:text-5xl mb-2">Messages</h1>
          <p className="text-muted-foreground mb-10">
            Commission enquiries sent from the contact form
            {unread > 0 ? ` · ${unread} unread` : ""}.
          </p>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading messages…
            </div>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No messages yet.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-lg border p-6 shadow-card transition-colors ${
                    item.readAt ? "border-border bg-card/50" : "border-ember bg-card/80"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-display text-lg">{item.name}</p>
                      <a
                        href={`mailto:${item.email}`}
                        className="text-sm text-primary hover:text-ember break-all"
                      >
                        {item.email}
                      </a>
                    </div>
                    <button
                      onClick={() => onToggle(item)}
                      className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.readAt ? (
                        <>
                          <MailOpen className="h-4 w-4" /> Mark unread
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" /> Mark read
                        </>
                      )}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-foreground/90">{item.message}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString("en-GB")}
                    {item.notifiedAt ? " · owner notified by email" : " · email not sent"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
