import { useEffect, useState } from "react";

type Ember = {
  size: number;
  left: number;
  duration: number;
  delay: number;
};

export function Embers() {
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: 30 }, () => ({
        size: 2 + Math.random() * 4,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
      })),
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {embers.map((e, i) => (
        <span
          key={i}
          className="animate-float-ember absolute bottom-0 rounded-full"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            background: "var(--ember)",
            boxShadow: "0 0 8px var(--ember)",
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
