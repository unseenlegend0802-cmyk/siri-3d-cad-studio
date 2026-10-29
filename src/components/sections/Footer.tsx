import { ExternalLink } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-lg tracking-widest">
            SIRI<span className="text-primary">3DCAD</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Premium 3D models, dragons, CAD, miniatures and digital assets — synced
            live from Cults3D.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-primary mb-3">Studio</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/models" className="hover:text-foreground">All Models</a></li>
            <li><a href="/#featured" className="hover:text-foreground">Featured</a></li>
            <li><a href="/#commissions" className="hover:text-foreground">Commissions</a></li>
            <li><a href="/#contact" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-primary mb-3">Marketplace</p>
          <div className="space-y-3">
            <a
              href="https://cults3d.com/en/users/Siri3DCAD/3d-models"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary"
            >
              Cults3D Profile
              <ExternalLink className="h-3 w-3" />
            </a>
            <ShareButton
              url="/"
              title="Siri3DCAD Studio"
              text="Siri3DCAD Studio — premium 3D models, dragons, CAD, miniatures and digital assets"
              className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
            >
              Share this studio
            </ShareButton>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Siri3DCAD Studio. All rights reserved.</span>
          <span>Forged with passion. Synced from Cults3D.</span>
          <span>
            Soundtrack: “Ossuary 6 — Air” by Kevin MacLeod (
            <a
              href="https://incompetech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              incompetech.com
            </a>
            ), CC BY 4.0
          </span>
        </div>
      </div>
    </footer>
  );
}
