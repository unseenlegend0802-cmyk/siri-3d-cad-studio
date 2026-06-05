import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Crown } from "lucide-react";
import { cultsModelsQuery, weekOfYear } from "@/lib/cults-query";

export function ModelOfTheWeek() {
  const { data, isLoading } = useQuery(cultsModelsQuery);
  const models = data?.models ?? [];
  if (isLoading || models.length === 0) return null;

  const pick = models[weekOfYear() % models.length];
  if (!pick) return null;

  return (
    <section id="model-of-the-week" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-primary mb-3">
            <Crown className="h-3 w-3" />
            Model of the Week
          </p>
          <h2 className="font-display text-4xl md:text-5xl">This Week's Forge</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center rounded-lg border border-ember bg-card/60 backdrop-blur p-6 md:p-10 shadow-ember overflow-hidden">
          <div className="relative aspect-square rounded-md overflow-hidden bg-background">
            {pick.thumbnail && (
              <img
                src={pick.thumbnail}
                alt={`${pick.name} — model of the week`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
          <div>
            {pick.priceFormatted && (
              <span className="inline-block px-3 py-1 rounded-full border border-ember bg-background/40 text-xs tracking-[0.2em] uppercase text-ember mb-4">
                {pick.priceFormatted}
              </span>
            )}
            <h3 className="font-display text-3xl md:text-5xl mb-4">{pick.name}</h3>
            {pick.description && (
              <p className="text-muted-foreground mb-6 line-clamp-5 leading-relaxed">
                {pick.description}
              </p>
            )}
            {pick.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {pick.tags.slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-full border border-border text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/models/$slug"
                params={{ slug: pick.slug }}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.02] transition-transform"
              >
                View Details
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={pick.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-ember bg-background/40 text-foreground hover:bg-primary/10 hover:border-primary transition-all"
              >
                Buy on Cults3D
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
