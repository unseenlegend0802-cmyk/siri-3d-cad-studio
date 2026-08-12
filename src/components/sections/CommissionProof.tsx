import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Heart, Layers, ShieldCheck } from "lucide-react";
import { cultsModelsQuery } from "@/lib/cults-query";
import { categorizeModel } from "@/lib/model-categories";

export function CommissionProof() {
  const { data, isLoading } = useQuery(cultsModelsQuery);
  const models = data?.models ?? [];

  const showcase = [...models]
    .filter((m) => m.thumbnailUrl)
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 6);

  const totalLikes = models.reduce((sum, m) => sum + (m.likesCount ?? 0), 0);
  const categories = new Set(models.map((m) => categorizeModel(m))).size;

  if (!isLoading && showcase.length === 0) return null;

  const stats = [
    { icon: Layers, value: `${models.length}+`, label: "Models delivered & published" },
    { icon: Heart, value: `${totalLikes}`, label: "Community likes on released work" },
    { icon: ShieldCheck, value: `${categories}`, label: "Disciplines covered end-to-end" },
  ];

  return (
    <section id="commission-proof" className="relative py-28 px-6 bg-gradient-dark">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Proven Work</p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">Delivered by the Studio</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every piece below is a real model built and released by Siri3DCAD — the same
            pipeline used for private commissions.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="p-6 rounded-lg bg-card border border-border text-center"
            >
              <Icon className="h-5 w-5 text-primary mx-auto mb-3" />
              <div className="font-display text-3xl mb-1">{isLoading ? "—" : value}</div>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-4/3 rounded-lg bg-muted animate-pulse" />
              ))
            : showcase.map((m) => (
                <Link
                  key={m.slug}
                  to="/models/$slug"
                  params={{ slug: m.slug }}
                  className="group relative block aspect-4/3 overflow-hidden rounded-lg border border-border hover:border-primary/60 transition-colors"
                >
                  <img
                    src={m.thumbnailUrl!}
                    alt={`Commissioned-style 3D model: ${m.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background to-transparent">
                    <p className="text-sm font-medium line-clamp-1">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{categorizeModel(m)}</p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
