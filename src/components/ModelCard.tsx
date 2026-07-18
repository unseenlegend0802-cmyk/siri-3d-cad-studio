import { Link } from "@tanstack/react-router";
import { Box } from "lucide-react";
import type { CultsModel } from "@/lib/cults.functions";

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ModelCard({ model }: { model: CultsModel }) {
  return (
    <Link
      to="/models/$slug"
      params={{ slug: model.slug }}
      className="group relative rounded-lg overflow-hidden bg-card border border-border hover:border-primary/60 shadow-card hover:shadow-ember transition-all duration-500 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-background">
        {model.videos?.[0]?.url ? (
          <video
            src={model.videos[0].url}
            poster={model.videos[0].poster || model.thumbnail || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : model.thumbnail ? (
          <img
            src={model.thumbnail}
            alt={`${model.name} — 3D model on Cults3D`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Box className="h-10 w-10" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur border border-ember text-[10px] tracking-[0.2em] uppercase text-ember">
          <span className="h-1 w-1 rounded-full bg-ember" />
          Cults3D
        </span>
        {model.priceFormatted && (
          <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur border border-border text-[11px] font-medium text-foreground">
            {model.priceFormatted}
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        {model.publishedAt && (
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {formatDate(model.publishedAt)}
          </p>
        )}
        <h3 className="font-display text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {model.name}
        </h3>
        {model.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {model.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>♥ {model.likesCount}</span>
          <span>↓ {model.downloadsCount}</span>
        </div>
      </div>
    </Link>
  );
}

export function ModelCardSkeleton() {
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
