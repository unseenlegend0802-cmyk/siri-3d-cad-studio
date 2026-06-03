import { Eye } from "lucide-react";
import d1 from "@/assets/dragon-1.jpg";
import d2 from "@/assets/dragon-2.jpg";
import d3 from "@/assets/dragon-3.jpg";

const dragons = [
  { name: "Obsidian Wyrm", type: "Dragon Bust", image: d1, sketchfabId: null },
  { name: "Ashen Wyvern", type: "Full Creature", image: d2, sketchfabId: null },
  { name: "Crimson Hydra", type: "Ancient Coil", image: d3, sketchfabId: null },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Bestiary</p>
            <h2 className="font-display text-4xl md:text-5xl">Featured Dragons</h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            A glimpse into the forge. Each card is prepared for live Sketchfab embeds — drop in a
            model ID to bring the dragon to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dragons.map((d) => (
            <article
              key={d.name}
              className="group relative rounded-lg overflow-hidden bg-card border border-border hover:border-primary/60 shadow-card hover:shadow-ember transition-all duration-500"
            >
              {/* Sketchfab embed slot — replace this block with an <iframe> once a model ID is available */}
              <div className="relative aspect-square overflow-hidden bg-background">
                <img
                  src={d.image}
                  alt={`${d.name} - ${d.type} 3D model`}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur border border-ember text-[10px] tracking-[0.2em] uppercase text-ember">
                  <span className="h-1 w-1 rounded-full bg-ember" />
                  Sketchfab Ready
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  {d.type}
                </p>
                <h3 className="font-display text-2xl mb-4">{d.name}</h3>
                <button className="inline-flex items-center gap-2 text-sm text-primary hover:text-ember transition-colors">
                  <Eye className="h-4 w-4" />
                  Preview Model
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
