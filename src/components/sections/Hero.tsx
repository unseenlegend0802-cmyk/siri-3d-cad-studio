import heroDragon from "@/assets/hero-dragon.jpg";
import { ArrowRight, Store } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <img
          src={heroDragon}
          alt="Molten red dragon emerging from black smoke and embers"
          width={1920}
          height={1280}
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full">
        <div className="max-w-3xl animate-rise">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ember bg-background/60 backdrop-blur text-xs tracking-[0.2em] uppercase text-ember mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-glow" />
            3D Design & CAD Studio
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] mb-6">
            <span className="block text-foreground">SIRI</span>
            <span className="block text-primary animate-ember-pulse text-glow">3DCAD</span>
            <span className="block text-foreground text-3xl sm:text-4xl md:text-5xl mt-3 tracking-[0.2em]">STUDIO</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Creating <span className="text-foreground">Dragons</span>, engineering
            <span className="text-foreground"> models</span>, miniatures, vehicles,
            architecture and <span className="text-foreground">premium 3D assets</span>
            — for collectors, makers, tabletop heroes and studios.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/models"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.02] transition-transform"
            >
              Explore Models
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#stores"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-md border border-ember bg-background/40 backdrop-blur text-foreground font-medium hover:bg-primary/10 hover:border-primary transition-all"
            >
              <Store className="h-4 w-4" />
              Buy 3D Assets
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
