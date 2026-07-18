import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Heart, Download as DownloadIcon, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { SiriHeader } from "@/components/SiriHeader";
import { Embers } from "@/components/Embers";
import { Footer } from "@/components/sections/Footer";
import { ModelCard } from "@/components/ModelCard";
import { cultsModelBySlugQuery, cultsModelsQuery } from "@/lib/cults-query";
import { categorize } from "@/lib/model-categories";

function ModelImageGallery({
  name,
  thumbnail,
  gallery,
  videos,
}: {
  name: string;
  thumbnail: string;
  gallery: string[];
  videos: { url: string; poster: string }[];
}) {
  type Slide =
    | { kind: "image"; src: string }
    | { kind: "video"; src: string; poster: string };

  const slides: Slide[] = [
    ...(gallery.length ? gallery : thumbnail ? [thumbnail] : [])
      .filter(Boolean)
      .map((src): Slide => ({ kind: "image", src })),
    ...videos.map((v): Slide => ({ kind: "video", src: v.url, poster: v.poster })),
  ];

  const [index, setIndex] = useState(0);

  if (slides.length === 0) return null;

  const current = slides[index];
  const prev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="relative rounded-lg overflow-hidden bg-card border border-border">
      {current.kind === "image" ? (
        <img
          src={current.src}
          alt={`${name} — image ${index + 1}`}
          className="w-full h-auto"
          loading="eager"
        />
      ) : (
        <video
          key={current.src}
          src={current.src}
          poster={current.poster || thumbnail || undefined}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto"
        />
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous media"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next media"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to ${s.kind} ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-primary" : "bg-white/50 hover:bg-white/80"
                } ${s.kind === "video" ? "ring-1 ring-ember" : ""}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


export const Route = createFileRoute("/models/$slug")({
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.ensureQueryData(
      cultsModelBySlugQuery(params.slug),
    );
    if (!detail?.model) throw notFound();
    // Pre-warm the catalog for related models
    await context.queryClient.ensureQueryData(cultsModelsQuery).catch(() => null);
    return detail;
  },
  head: ({ loaderData }) => {
    const m = loaderData?.model;
    const title = m ? `${m.name} — Siri3DCAD Studio` : "Model — Siri3DCAD Studio";
    const description =
      m?.description?.slice(0, 200) ??
      "A 3D model from the Siri3DCAD Studio Cults3D archive.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        ...(m?.thumbnail ? [{ property: "og:image", content: m.thumbnail }] : []),
        ...(m?.thumbnail ? [{ name: "twitter:image", content: m.thumbnail }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/models/${m?.slug ?? ""}` }],
      scripts: m
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: m.name,
                description: m.description,
                image: m.gallery.length ? m.gallery : m.thumbnail,
                brand: { "@type": "Brand", name: "Siri3DCAD Studio" },
                offers: m.priceCents
                  ? {
                      "@type": "Offer",
                      price: (m.priceCents / 100).toFixed(2),
                      priceCurrency: "EUR",
                      url: m.url,
                      availability: "https://schema.org/InStock",
                    }
                  : undefined,
              }),
            },
          ]
        : [],
    };
  },
  component: ModelDetail,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="font-display text-2xl mb-2">Couldn't load this model</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <Link to="/models" className="text-primary mt-4 inline-block">
          ← Back to catalog
        </Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="font-display text-3xl mb-2">Model not found</h1>
        <p className="text-muted-foreground mb-6">
          This piece may have been retired from the Cults3D archive.
        </p>
        <Link to="/models" className="text-primary">← Browse the catalog</Link>
      </div>
    </div>
  ),
});

function ModelDetail() {
  const { slug } = Route.useParams();
  const { data: detail } = useQuery(cultsModelBySlugQuery(slug));
  const { data: catalog } = useQuery(cultsModelsQuery);

  const m = detail?.model;
  if (!m) return null;

  const cat = categorize(m);
  const related = (catalog?.models ?? [])
    .filter((x) => x.slug !== m.slug && categorize(x) === cat)
    .slice(0, 3);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Embers />
      <SiriHeader />
      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/models"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </Link>

          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <ModelImageGallery name={m.name} thumbnail={m.thumbnail} gallery={m.gallery} />
            </div>

            <aside className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">— {cat}</p>
                  <h1 className="font-display text-3xl md:text-5xl mb-4">{m.name}</h1>
                  {m.priceFormatted && (
                    <p className="text-2xl text-ember font-display mb-4">{m.priceFormatted}</p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {m.likesCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <DownloadIcon className="h-4 w-4" />
                      {m.downloadsCount}
                    </span>
                  </div>
                </div>

                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 w-full px-6 py-4 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.02] transition-transform"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Buy on Cults3D
                </a>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open on Cults3D
                </a>

                {m.tags.length > 0 && (
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {m.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-full border border-border text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {m.description && (
            <div className="mt-16 max-w-3xl">
              <div className="ember-divider mb-8" />
              <h2 className="font-display text-2xl mb-4">About this model</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {m.description}
              </p>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-20">
              <div className="ember-divider mb-8" />
              <h2 className="font-display text-2xl mb-6">Related Models</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <ModelCard key={r.slug} model={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
