import { Flame, Hammer, Scroll } from "lucide-react";

const pillars = [
  { icon: Flame, title: "Born of Fire", text: "Every dragon is sculpted with cinematic anatomy, menacing silhouettes and print-ready geometry." },
  { icon: Hammer, title: "Forged for Print", text: "Models are optimized for FDM and resin, with supports, cuts and hollows for clean prints." },
  { icon: Scroll, title: "Legendary Detail", text: "Hand-sculpted scales, lore-driven designs and editorial presentation across every release." },
];

export function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">— About the Forge</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              A studio dedicated to the art of <span className="text-primary">dragons</span>.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Siri Dragons is an independent 3D art studio crafting high-detail dragons, wyverns
              and fantasy creatures. Each piece begins as a hand-sculpted concept and is refined
              into a premium STL model ready for collectors and creators.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From kingdom-shaking ancients to nimble drakes, every release is built to feel
              alive — anatomy, attitude, and the heat of myth pressed into every scale.
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
