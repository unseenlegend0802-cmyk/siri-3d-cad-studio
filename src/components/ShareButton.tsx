import { useCallback, useState } from "react";
import { Check, Share2 } from "lucide-react";

export function toAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  try {
    return new URL(path, window.location.origin).toString();
  } catch {
    return path;
  }
}

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

export async function shareLink(opts: {
  url: string;
  title: string;
  text?: string;
}): Promise<ShareResult> {
  const url = toAbsoluteUrl(opts.url);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: opts.title, text: opts.text, url });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
      // Native sheet unavailable/blocked — fall through to clipboard.
    }
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return "copied";
    }
    throw new Error("clipboard unavailable");
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok ? "copied" : "failed";
    } catch {
      return "failed";
    }
  }
}

export function ShareButton({
  url,
  title,
  text,
  className = "",
  children,
  ariaLabel,
}: {
  url: string;
  title: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
}) {
  const [state, setState] = useState<"idle" | "shared" | "copied" | "failed">("idle");

  const handle = useCallback(
    async (e: React.MouseEvent) => {
      // Never trigger a parent link/card navigation.
      e.preventDefault();
      e.stopPropagation();
      const result = await shareLink({ url, title, text });
      if (result === "cancelled") return;
      setState(result);
      window.setTimeout(() => setState("idle"), 2000);
    },
    [url, title, text],
  );

  const done = state === "shared" || state === "copied";
  const label =
    ariaLabel ?? (done ? "Link copied" : `Share ${title} — Siri3DCAD Studio`);

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={label}
      title={done ? "Link copied" : "Share"}
      className={className}
    >
      {done ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {children ? (
        <span className="min-w-0 truncate">
          {state === "copied" ? "Link copied!" : state === "failed" ? "Couldn't copy" : children}
        </span>
      ) : null}
    </button>
  );
}
