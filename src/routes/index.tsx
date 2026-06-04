import { createFileRoute } from "@tanstack/react-router";
import { SiriHeader } from "@/components/SiriHeader";
import { Embers } from "@/components/Embers";
import { Hero } from "@/components/sections/Hero";
import { LatestDragons } from "@/components/sections/LatestDragons";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Gallery } from "@/components/sections/Gallery";
import { Stores } from "@/components/sections/Stores";
import { Commissions } from "@/components/sections/Commissions";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

const title = "Siri3DCAD Studio — 3D Models, Dragons, Vehicles, CAD & STL Files";
const description =
  "Siri3DCAD Studio creates premium 3D models — dragons, vehicles, architecture, engineering CAD, miniatures and game assets. Browse the live catalog and commission custom 3D work.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: "3D models, STL files, CAD models, engineering models, dragons, vehicles, miniatures, 3D printing, digital assets, fantasy creatures, game assets" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Siri3DCAD Studio",
          alternateName: "Siri Dragons",
          description,
          url: "/",
          sameAs: [
            "https://sketchfab.com/unseenlegend0802",
            "https://cults3d.com/en/users/Siri3DCAD/3d-models",
            "https://www.cgtrader.com/designers/siri3dcad",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Embers />
      <SiriHeader />
      <main className="relative z-10">
        <Hero />
        <LatestDragons />
        <About />
        <Stats />
        <Gallery />
        <Stores />
        <Commissions />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
