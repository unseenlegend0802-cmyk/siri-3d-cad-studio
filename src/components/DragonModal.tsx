import { useEffect } from "react";
import { X, ExternalLink, ShoppingBag } from "lucide-react";
import type { SketchfabModel } from "@/lib/sketchfab.functions";

interface Props {
  model: SketchfabModel | null;
  related: SketchfabModel[];
  onClose: () => void;
  onSelect: (m: SketchfabModel) => void;
}

export function DragonModal({ model, related, onClose, onSelect }: Props) {
  useEffect(() => {
    if (!model) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [model, onClose]);

  if (!model) return null;

  const date = model.publishedAt
    ? new Date(model.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center p-4 md:p-8">
        <div
          className="relative w-full max-w-5xl bg-card border border-ember rounded-lg shadow-ember overflow-hidden animate-rise"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur border border-border hover:border-primary text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="aspect-video bg-background">
            <iframe
              title={model.name}
              src={`${model.embedUrl}?autostart=1&ui_theme=dark&ui_infos=0&ui_controls=1`}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="p-6 md:p-8">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">— Sketchfab Model</p>
            <h2 className="font-display text-3xl md:text-4xl mb-3">{model.name}</h2>
            {date && (
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                Uploaded {date}
              </p>
            )}
            {model.description && (
              <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
                {model.description}
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <a
                href="https://cults3d.com/en/users/Siri3DCAD/3d-models"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.02] transition-transform"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy on Cults3D
              </a>
              <a
                href="https://www.cgtrader.com/designers/siri3dcad"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-md border border-ember bg-background/40 text-foreground font-medium hover:bg-primary/10 hover:border-primary transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy on CGTrader
              </a>
            </div>

            <a
              href={model.viewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-ember transition-colors mb-10"
            >
              <ExternalLink className="h-4 w-4" />
              Open on Sketchfab
            </a>

            {related.length > 0 && (
              <div>
                <div className="ember-divider mb-6" />
                <h3 className="font-display text-xl mb-4">Related Models</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <button
                      key={r.uid}
                      onClick={() => onSelect(r)}
                      className="group text-left rounded-md overflow-hidden border border-border hover:border-primary transition-colors"
                    >
                      <div className="aspect-square overflow-hidden bg-background">
                        {r.thumbnail ? (
                          <img
                            src={r.thumbnail}
                            alt={r.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : null}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium truncate">{r.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
