import { createFileRoute } from "@tanstack/react-router";
import { SiriHeader } from "@/components/SiriHeader";
import { Embers } from "@/components/Embers";
import { Hero } from "@/components/sections/Hero";
import { FeaturedCollection } from "@/components/sections/FeaturedCollection";
import { ModelOfTheWeek } from "@/components/sections/ModelOfTheWeek";
import { LatestModels } from "@/components/sections/LatestModels";
import { Categories } from "@/components/sections/Categories";
import { Commissions } from "@/components/sections/Commissions";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { cultsModelsQuery } from "@/lib/cults-query";

const title = "Siri3DCAD Studio — 3D Models, Dragons, CAD & STL Files";
const description =
  "Siri3DCAD Studio creates premium 3D models — dragons, vehicles, architecture, engineering CAD, miniatures and game assets. Synced live from the official Cults3D archive.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: "3D models, STL files, CAD models, engineering models, dragons, vehicles, miniatures, 3D printing, digital assets, Cults3D" },
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
          description,
          url: "/",
          sameAs: ["https://cults3d.com/en/users/Siri3DCAD/3d-models"],
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(cultsModelsQuery),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <h1 className="font-display text-2xl mb-2">The forge cooled down</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Embers />
      <SiriHeader />
      <main className="relative z-10">
        <Hero />
        <FeaturedCollection />
        <ModelOfTheWeek />
        <LatestModels />
        <Categories />
        <Commissions />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
