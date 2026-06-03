import { Skull, Bird, Swords, Box, Gamepad2 } from "lucide-react";

const items = [
  { icon: Skull, name: "Dragon Busts", desc: "Display-grade busts with cinematic detail." },
  { icon: Bird, name: "Wyverns", desc: "Winged predators built for dynamic poses." },
  { icon: Swords, name: "RPG Creatures", desc: "Tabletop monsters scaled for play." },
  { icon: Box, name: "Printable STL Models", desc: "Resin & FDM ready with supports." },
  { icon: Gamepad2, name: "Game Assets", desc: "Low-poly + PBR for real-time engines." },
];

export function Commissions() {
  return (
    <section id="commissions" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-forge)" }} />
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Hire the Forge</p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">Custom Commissions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bring your beast to life. From single hero pieces to full creature lineups for games
            and tabletop campaigns.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {items.map(({ icon: Icon, name, desc }) => (
            <div
              key={name}
              className="group p-6 rounded-lg bg-card border border-border hover:border-primary/60 hover:-translate-y-1 transition-all duration-300"
            >
              <Icon className="h-7 w-7 text-primary mb-4 group-hover:text-ember transition-colors" />
              <h3 className="font-display text-lg mb-2">{name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.02] transition-transform"
          >
            Request a Commission
          </a>
        </div>
      </div>
    </section>
  );
}
