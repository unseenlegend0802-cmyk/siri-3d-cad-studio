import { useEffect, useRef } from "react";

type Props = React.VideoHTMLAttributes<HTMLVideoElement> & {
  /** When false, the video is paused and reset regardless of visibility. */
  active?: boolean;
};

/**
 * Video that only plays while it is actually visible in the viewport
 * (and while `active` is true). Pauses as soon as it scrolls or is swiped away.
 */
export function AutoPlayVideo({ active = true, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!active) {
      el.pause();
      return;
    }

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          void el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { threshold: [0, 0.25, 0.5] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  return <video ref={ref} muted playsInline {...props} />;
}
