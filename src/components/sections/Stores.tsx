import { ExternalLink } from "lucide-react";

const stores = [
  {
    name: "Sketchfab",
    desc: "Interactive 3D previews of the full bestiary.",
    href: "https://sketchfab.com/unseenlegend0802",
    handle: "@unseenlegend0802",
  },
  {
    name: "Cults3D",
    desc: "Print-ready STL files for resin and FDM.",
    href: "https://cults3d.com/en/users/Siri3DCAD/3d-models",
    handle: "Siri3DCAD",
  },
  {
    name: "CGTrader",
    desc: "Premium game-ready creatures for studios.",
    href: "https://www.cgtrader.com/designers/siri3dcad",
    handle: "siri3dcad",
  },
];

export function Stores() {
  return (
    <section id="stores" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Marketplaces</p>
          <h2 className="font-display text-4xl md:text-5xl">Stores & Portfolio</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stores.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-8 rounded-lg bg-card border border-border hover:border-primary/60 hover:shadow-ember transition-all overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-display text-2xl">{s.name}</h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-muted-foreground mb-8 leading-relaxed">{s.desc}</p>
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    {s.handle}
                  </span>
                  <span className="text-xs text-primary group-hover:text-ember transition-colors">
                    Visit →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
