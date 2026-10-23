import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import soundtrack from "@/assets/soundtrack-loop.mp3.asset.json";

const STORAGE_KEY = "siri-studio-music";

/**
 * Floating soundtrack toggle for the studio. Loops a dark-ambient track at a
 * low volume. Browsers block audible autoplay until the visitor interacts,
 * so playback starts on the first click/keypress if the visitor hasn't
 * explicitly muted the music before.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;

    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(STORAGE_KEY) === "off";
    } catch {
      dismissed = false;
    }
    setEnabled(!dismissed);

    if (dismissed) return;

    let cleanupInteraction: (() => void) | null = null;

    const attempt = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay blocked — start on the visitor's first interaction.
          const start = () => {
            audio
              .play()
              .then(() => setPlaying(true))
              .catch(() => undefined);
          };
          window.addEventListener("pointerdown", start, { once: true });
          window.addEventListener("keydown", start, { once: true });
          cleanupInteraction = () => {
            window.removeEventListener("pointerdown", start);
            window.removeEventListener("keydown", start);
          };
        });
    };

    attempt();
    return () => cleanupInteraction?.();
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      setEnabled(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, "off");
      } catch {
        /* ignore */
      }
      return;
    }

    audio
      .play()
      .then(() => {
        setPlaying(true);
        setEnabled(true);
        try {
          window.localStorage.setItem(STORAGE_KEY, "on");
        } catch {
          /* ignore */
        }
      })
      .catch(() => undefined);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={soundtrack.url}
        loop
        preload="none"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute studio soundtrack" : "Play studio soundtrack"}
        title={playing ? "Mute soundtrack" : "Play soundtrack"}
        className="fixed bottom-6 right-6 z-50 flex h-12 items-center gap-2 rounded-full border border-ember bg-background/70 px-4 backdrop-blur text-foreground shadow-ember hover:border-primary transition-colors"
      >
        {playing ? (
          <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="eq-bar w-[3px] rounded-sm bg-ember"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </span>
        ) : (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        )}
        <Music className="h-4 w-4 text-ember" />
      </button>
    </>
  );
}
