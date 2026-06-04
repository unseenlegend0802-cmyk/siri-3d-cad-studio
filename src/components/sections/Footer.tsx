import { Box } from "lucide-react";

const social = [
  { name: "Sketchfab", href: "https://sketchfab.com/unseenlegend0802" },
  { name: "Cults3D", href: "https://cults3d.com/en/users/Siri3DCAD/3d-models" },
  { name: "CGTrader", href: "https://www.cgtrader.com/designers/siri3dcad" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-gradient-dark">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <Box className="h-5 w-5 text-primary" />
              <span className="font-display text-lg tracking-widest">
                SIRI<span className="text-primary">3DCAD</span> STUDIO
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium 3D models — dragons, vehicles, architecture, miniatures and CAD —
              crafted for collectors, makers and studios.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-primary mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/models" className="text-muted-foreground hover:text-foreground">Models</a></li>
                <li><a href="/#commissions" className="text-muted-foreground hover:text-foreground">Commissions</a></li>
                <li><a href="/#contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-primary mb-4">Stores</h4>
              <ul className="space-y-2 text-sm">
                {social.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="ember-divider mb-6" />
        <p className="text-center text-xs tracking-[0.2em] uppercase text-muted-foreground">
          © {new Date().getFullYear()} Siri3DCAD Studio — Forged in fire & precision
        </p>
      </div>
    </footer>
  );
}
