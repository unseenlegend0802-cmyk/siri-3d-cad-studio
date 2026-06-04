import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, ExternalLink, Flame } from "lucide-react";
import { getSketchfabModels, type SketchfabModel } from "@/lib/sketchfab.functions";
import { DragonModal } from "@/components/DragonModal";

export const sketchfabQueryOptions = {
  queryKey: ["sketchfab-models"] as const,
  queryFn: () => getSketchfabModels({ data: { count: 24 } }),
  staleTime: 1000 * 60 * 15,
  refetchOnWindowFocus: false,
};

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DragonCard({
  model,
  onOpen,
}: {
  model: SketchfabModel;
  onOpen: (m: SketchfabModel) => void;
}) {
  return (
    <article className="group relative rounded-lg overflow-hidden bg-card border border-border hover:border-primary/60 shadow-card hover:shadow-ember transition-all duration-500 flex flex-col">
      <button
        onClick={() => onOpen(model)}
        className="relative aspect-square overflow-hidden bg-background text-left"
        aria-label={`Open ${model.name} in 3D viewer`}
      >
        {model.thumbnail ? (
          <img
            src={model.thumbnail}
            alt={`${model.name} – dragon 3D model`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Flame className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur border border-ember text-[10px] tracking-[0.2em] uppercase text-ember">
          <span className="h-1 w-1 rounded-full bg-ember" />
          Sketchfab
        </span>
      </button>
      <div className="p-6 flex-1 flex flex-col">
        {model.publishedAt && (
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {formatDate(model.publishedAt)}
          </p>
        )}
        <h3 className="font-display text-xl mb-2 line-clamp-2">{model.name}</h3>
        {model.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {model.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => onOpen(model)}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-ember transition-colors"
          >
            <Eye className="h-4 w-4" />
            View in 3D
          </button>
          <a
            href={model.viewerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sketchfab
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-card border border-border animate-pulse">
      <div className="aspect-square bg-muted/40" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-24 bg-muted/50 rounded" />
        <div className="h-5 w-3/4 bg-muted/50 rounded" />
        <div className="h-4 w-full bg-muted/40 rounded" />
      </div>
    </div>
  );
}

export function LatestDragons() {
  const { data, isLoading } = useQuery(sketchfabQueryOptions);
  const [active, setActive] = useState<SketchfabModel | null>(null);

  const models = data?.models ?? [];
  const latest = models.slice(0, 6);
  const related = active
    ? models.filter((m) => m.uid !== active.uid).slice(0, 3)
    : [];

  return (
    <section id="latest" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Live from Sketchfab</p>
            <h2 className="font-display text-4xl md:text-5xl">Latest Models</h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Freshly published 3D work — dragons, vehicles, CAD and more — synced
            automatically from the Siri3DCAD Sketchfab archive. New uploads appear
            here without a website update.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : latest.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ember bg-card/40 p-10 text-center">
            <Flame className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-2">The forge is warming up</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              New models will appear here the moment they are published on
              Sketchfab. Visit the profile to follow along.
            </p>
            <a
              href="https://sketchfab.com/unseenlegend0802"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-md border border-ember bg-background/40 text-foreground hover:bg-primary/10 hover:border-primary transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Sketchfab Profile
            </a>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((m) => (
                <DragonCard key={m.uid} model={m} onOpen={setActive} />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                to="/models"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.02] transition-transform"
              >
                View All Models
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </div>

      <DragonModal
        model={active}
        related={related}
        onClose={() => setActive(null)}
        onSelect={setActive}
      />
    </section>
  );
}
