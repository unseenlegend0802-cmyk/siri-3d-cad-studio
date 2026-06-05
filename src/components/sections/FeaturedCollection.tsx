import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { cultsModelsQuery } from "@/lib/cults-query";
import { ModelCard, ModelCardSkeleton } from "@/components/ModelCard";

export function FeaturedCollection() {
  const { data, isLoading } = useQuery(cultsModelsQuery);
  const models = data?.models ?? [];
  // Auto: top 3 by likes
  const featured = [...models].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3);

  if (!isLoading && featured.length === 0) return null;

  return (
    <section id="featured" className="relative py-32 px-6 bg-gradient-dark">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-primary mb-3">
            <Star className="h-3 w-3" />
            Featured Collection
          </p>
          <h2 className="font-display text-4xl md:text-5xl">Studio Favourites</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            The most-loved pieces from the Siri3DCAD Cults3D archive — automatically
            highlighted from community engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <ModelCardSkeleton key={i} />)
            : featured.map((m) => <ModelCard key={m.slug} model={m} />)}
        </div>
      </div>
    </section>
  );
}
