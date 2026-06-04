import { Flame, Hammer, Scroll } from "lucide-react";

const pillars = [
  { icon: Flame, title: "Multi-Discipline Craft", text: "From cinematic dragons to precise CAD parts, vehicles and architecture — one studio, many worlds." },
  { icon: Hammer, title: "Forged for Print", text: "Models are optimized for FDM and resin, with supports, cuts and hollows for clean prints." },
  { icon: Scroll, title: "Production Detail", text: "Hand-crafted geometry, engineering accuracy and editorial presentation across every release." },
];

export function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">— About the Studio</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              A 3D design studio for <span className="text-primary">dragons, machines</span> and everything between.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Siri3DCAD Studio is an independent 3D design and digital creation studio.
              We craft high-detail dragons and fantasy creatures, alongside engineering CAD,
              vehicles, architecture, miniatures and game-ready assets — each release built
              with the same obsessive care.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Dragons remain our signature specialty. Around them we forge a broader portfolio
              of premium 3D models for collectors, makers, tabletop heroes and studios.
            </p>
          </div>
          <div className="grid gap-4">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group p-6 rounded-lg bg-card border border-border hover:border-primary/60 hover:shadow-ember transition-all"
              >
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-md bg-gradient-ember flex items-center justify-center shrink-0 shadow-glow">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
