import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Flame } from "lucide-react";
import { cultsModelsQuery } from "@/lib/cults-query";
import { ModelCard, ModelCardSkeleton } from "@/components/ModelCard";

export function LatestModels() {
  const { data, isLoading } = useQuery(cultsModelsQuery);
  const models = data?.models ?? [];
  const latest = [...models]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 6);

  return (
    <section id="latest" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Live from Cults3D</p>
            <h2 className="font-display text-4xl md:text-5xl">Latest Models</h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Freshly published 3D work — dragons, vehicles, CAD and more — synced
            automatically from the Siri3DCAD Cults3D archive.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ModelCardSkeleton key={i} />
            ))}
          </div>
        ) : latest.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ember bg-card/40 p-10 text-center">
            <Flame className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-2">The forge is warming up</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {data?.error === "not_configured"
                ? "Cults3D API credentials are not configured yet. Visit the admin settings to connect."
                : "New models will appear here the moment they are published on Cults3D."}
            </p>
            <a
              href="https://cults3d.com/en/users/Siri3DCAD/3d-models"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-md border border-ember bg-background/40 text-foreground hover:bg-primary/10 hover:border-primary transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Cults3D Profile
            </a>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((m) => (
            <ModelCard key={m.slug} model={m} />
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
    </section>
  );
}
