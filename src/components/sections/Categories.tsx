import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Box, Cog, Castle, Car, Crown, Rocket, Sword, Sparkles } from "lucide-react";
import { cultsModelsQuery } from "@/lib/cults-query";
import { categorize, CATEGORIES, type Category } from "@/lib/model-categories";

const ICONS: Record<Exclude<Category, "All">, typeof Box> = {
  Dragons: Sparkles,
  Vehicles: Car,
  Architecture: Castle,
  Engineering: Cog,
  Miniatures: Sword,
  Characters: Crown,
  "Sci-Fi": Rocket,
  Other: Box,
};

export function Categories() {
  const { data } = useQuery(cultsModelsQuery);
  const models = data?.models ?? [];

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of models) {
      const c = categorize(m);
      map[c] = (map[c] ?? 0) + 1;
    }
    return map;
  }, [models]);

  const cats = CATEGORIES.filter((c): c is Exclude<Category, "All"> => c !== "All");

  return (
    <section id="categories" className="relative py-32 px-6 bg-gradient-dark">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Browse by Type</p>
          <h2 className="font-display text-4xl md:text-5xl">Categories</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map((c) => {
            const Icon = ICONS[c];
            const count = counts[c] ?? 0;
            return (
              <Link
                key={c}
                to="/models"
                search={{ category: c }}
                className="group relative p-6 rounded-lg bg-card border border-border hover:border-primary/60 hover:shadow-ember transition-all overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/15 transition-colors" />
                <Icon className="relative h-8 w-8 text-primary mb-4 group-hover:text-ember transition-colors" />
                <h3 className="relative font-display text-xl mb-1">{c}</h3>
                <p className="relative text-xs text-muted-foreground tracking-widest uppercase">
                  {count} model{count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
