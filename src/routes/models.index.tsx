import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowLeft, Box, Search } from "lucide-react";
import { SiriHeader } from "@/components/SiriHeader";
import { Embers } from "@/components/Embers";
import { Footer } from "@/components/sections/Footer";
import { ModelCard, ModelCardSkeleton } from "@/components/ModelCard";
import { cultsModelsQuery } from "@/lib/cults-query";
import { CATEGORIES, categorize, type Category } from "@/lib/model-categories";

const title = "All Models — Siri3DCAD Studio Catalog";
const description =
  "Browse the complete Siri3DCAD Studio catalog: dragons, vehicles, architecture, engineering CAD, miniatures and more — synced live from Cults3D.";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  page: z.number().optional(),
});

export const Route = createFileRoute("/models/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/models" },
    ],
    links: [{ rel: "canonical", href: "/models" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(cultsModelsQuery),
  component: ModelsPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
});

const PAGE_SIZE = 12;

function ModelsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading } = useQuery(cultsModelsQuery);

  const [query, setQuery] = useState<string>(search.q ?? "");
  const [category, setCategory] = useState<Category>(search.category ?? "All");
  const [page, setPage] = useState<number>(search.page ?? 1);

  // Sync URL search params (one-way: state → URL)
  useEffect(() => {
    navigate({
      search: {
        q: query || undefined,
        category: category === "All" ? undefined : category,
        page: page > 1 ? page : undefined,
      },
      replace: true,
    });
  }, [query, category, page, navigate]);

  const models = data?.models ?? [];

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: models.length };
    for (const m of models) {
      const c = categorize(m);
      map[c] = (map[c] ?? 0) + 1;
    }
    return map;
  }, [models]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models.filter((m) => {
      if (category !== "All" && categorize(m) !== category) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [models, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Embers />
      <SiriHeader />
      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the studio
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Complete Catalog</p>
              <h1 className="font-display text-4xl md:text-6xl">All Models</h1>
              <p className="text-muted-foreground mt-4 max-w-2xl">
                Every 3D model in the Siri3DCAD Studio archive — synced live from Cults3D.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search models, tags, descriptions…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-card border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((c) => {
              const count = counts[c] ?? 0;
              const isActive = c === category;
              const disabled = c !== "All" && count === 0;
              return (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    setPage(1);
                  }}
                  disabled={disabled}
                  className={`px-4 py-2 rounded-full border text-xs tracking-[0.15em] uppercase transition-all ${
                    isActive
                      ? "border-primary bg-primary/15 text-primary shadow-glow"
                      : disabled
                        ? "border-border bg-card text-muted-foreground/40 cursor-not-allowed"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/60"
                  }`}
                >
                  {c}
                  <span className="ml-2 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="ember-divider mb-10" />

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ModelCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-ember bg-card/40 p-12 text-center">
              <Box className="h-8 w-8 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl mb-2">
                {query || category !== "All"
                  ? "No models match those filters"
                  : data?.error === "not_configured"
                    ? "Catalog not configured"
                    : "The forge is warming up"}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {query || category !== "All"
                  ? "Try a different category or keyword."
                  : data?.error === "not_configured"
                    ? "Connect the Cults3D API from the admin settings to populate the catalog."
                    : "New models will appear here automatically as they are published on Cults3D."}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filtered.length} model{filtered.length === 1 ? "" : "s"} · page {currentPage} of {totalPages}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visible.map((m) => (
                  <ModelCard key={m.slug} model={m} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border border-border bg-card text-sm hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    const isActive = n === currentPage;
                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`min-w-10 h-10 rounded-md border text-sm transition-colors ${
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/60"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md border border-border bg-card text-sm hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
