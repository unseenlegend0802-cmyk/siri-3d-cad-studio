import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Facebook,
  Instagram,
  Link2,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Twitter,
  X as XIcon,
  type LucideIcon,
} from "lucide-react";

export function toAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  try {
    return new URL(path, window.location.origin).toString();
  } catch {
    return path;
  }
}

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

/**
 * Like Flipkart/Amazon: phones/tablets get the OS share sheet
 * (WhatsApp, Instagram, Messages, ...). Desktop browsers get the
 * in-page app menu instead, even when navigator.share exists
 * (desktop Chrome/Edge expose it but it is not the e-commerce
 * experience users expect).
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const coarsePointer = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  return coarsePointer || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

/** Native OS share sheet (mobile only), with clipboard fallback. */
export async function shareLink(opts: {
  url: string;
  title: string;
  text?: string;
}): Promise<ShareResult> {
  const url = toAbsoluteUrl(opts.url);

  if (isMobileDevice() && typeof navigator.share === "function") {
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
    if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
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

type AppShare = {
  id: string;
  label: string;
  icon: LucideIcon;
  build: (url: string, title: string, text: string) => string;
  /** Copies the link first, then opens the app so the user can paste (apps with no web share URL, e.g. Instagram). */
  copyFirst?: boolean;
};

const APP_SHARES: AppShare[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    build: (url, _title, text) =>
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    copyFirst: true,
    build: () => "https://www.instagram.com/",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    build: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "x",
    label: "X",
    icon: Twitter,
    build: (url, title, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || title)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: Send,
    build: (url, _title, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    build: (url, title, text) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
];

function openShareTarget(href: string) {
  if (href.startsWith("mailto:")) {
    window.location.href = href;
    return;
  }
  window.open(href, "_blank", "noopener,noreferrer,width=640,height=640");
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetCopied, setSheetCopied] = useState(false);

  const done = state === "shared" || state === "copied";

  const openAppSheet = useCallback(() => {
    setSheetCopied(false);
    setSheetOpen(true);
  }, []);

  const handle = useCallback(
    async (e: React.MouseEvent) => {
      // Never trigger a parent link/card navigation.
      e.preventDefault();
      e.stopPropagation();
      const abs = toAbsoluteUrl(url);
      // Like Flipkart/Amazon: on phones/tablets open the OS share sheet
      // (WhatsApp, Instagram, Messages, ...). Desktop always gets the
      // in-page app menu, even if navigator.share exists.
      if (isMobileDevice() && typeof navigator.share === "function") {
        const result = await shareLink({ url: abs, title, text });
        if (result === "cancelled") return;
        if (result === "failed") {
          openAppSheet();
          return;
        }
        setState(result);
        window.setTimeout(() => setState("idle"), 2000);
        return;
      }
      // Desktop browsers: in-page app share menu.
      openAppSheet();
    },
    [url, title, text, openAppSheet],
  );

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const abs = toAbsoluteUrl(url);
  const shareText = text || title;

  const copyFromSheet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(abs);
      setSheetCopied(true);
    } catch {
      setSheetCopied(false);
    }
  }, [abs]);

  return (
    <>
      <button
        type="button"
        onClick={handle}
        aria-label={ariaLabel ?? (done ? "Link copied" : `Share ${title} — Siri3DCAD Studio`)}
        title={done ? "Shared" : "Share"}
        className={className}
      >
        {done ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {children ? (
          <span className="min-w-0 truncate">{children}</span>
        ) : null}
      </button>

      {sheetOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Share ${title}`}
          onClick={() => setSheetOpen(false)}
        >
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-lg border border-border bg-card shadow-ember p-6 animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-display text-lg text-foreground">Share this</p>
              <button
                type="button"
                aria-label="Close share menu"
                onClick={() => setSheetOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground truncate mb-5">{title}</p>

            <div className="grid grid-cols-3 gap-3">
              {APP_SHARES.map(({ id, label, icon: Icon, build }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    openShareTarget(build(abs, title, shareText));
                    setSheetOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 px-2 py-3 rounded-md border border-border bg-background/60 hover:border-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon className="h-5 w-5 text-ember" />
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                copyFromSheet();
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-border bg-background/60 text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {sheetCopied ? (
                <>
                  <Check className="h-4 w-4 text-ember" />
                  Link copied!
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  Copy link
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
