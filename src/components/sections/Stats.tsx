const stats = [
  { value: "120+", label: "Dragons Forged" },
  { value: "40+", label: "Wyverns & Drakes" },
  { value: "15K", label: "STL Downloads" },
  { value: "3", label: "Marketplaces" },
];

export function Stats() {
  return (
    <section id="stats" className="relative py-24 px-6">
      <div className="ember-divider mb-20 max-w-5xl mx-auto" />
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— The Forge</p>
          <h2 className="font-display text-4xl md:text-5xl">Dragon Forge Statistics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative p-8 rounded-lg bg-card border border-border text-center overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative font-display text-4xl md:text-5xl text-primary text-glow mb-2">
                {s.value}
              </div>
              <div className="relative text-xs tracking-[0.2em] uppercase text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
