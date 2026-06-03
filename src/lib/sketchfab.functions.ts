import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SKETCHFAB_USERNAME = "unseenlegend0802";
const API = "https://api.sketchfab.com/v3/models";

export type SketchfabModel = {
  uid: string;
  name: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  viewerUrl: string;
  embedUrl: string;
};

type SketchfabApiModel = {
  uid: string;
  name?: string;
  description?: string;
  publishedAt?: string;
  viewerUrl?: string;
  embedUrl?: string;
  thumbnails?: { images?: Array<{ url: string; width: number; height: number }> };
};

function pickThumb(images?: Array<{ url: string; width: number }>): string {
  if (!images?.length) return "";
  const sorted = [...images].sort((a, b) => b.width - a.width);
  const target = sorted.find((i) => i.width <= 1024) ?? sorted[sorted.length - 1];
  return target?.url ?? "";
}

function normalize(m: SketchfabApiModel): SketchfabModel {
  return {
    uid: m.uid,
    name: m.name ?? "Untitled Dragon",
    description: (m.description ?? "").replace(/\s+/g, " ").trim(),
    publishedAt: m.publishedAt ?? "",
    thumbnail: pickThumb(m.thumbnails?.images),
    viewerUrl: m.viewerUrl ?? `https://sketchfab.com/3d-models/${m.uid}`,
    embedUrl: m.embedUrl ?? `https://sketchfab.com/models/${m.uid}/embed`,
  };
}

export const getSketchfabModels = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({ count: z.number().min(1).max(48).default(24) }).optional(),
  )
  .handler(async ({ data }) => {
    const count = data?.count ?? 24;
    const url = `${API}?user=${SKETCHFAB_USERNAME}&sort_by=-publishedAt&count=${count}`;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!res.ok) {
        return { models: [] as SketchfabModel[], error: `Sketchfab ${res.status}` };
      }
      const json = (await res.json()) as { results?: SketchfabApiModel[] };
      const models = (json.results ?? []).map(normalize);
      return { models, error: null as string | null };
    } catch (err) {
      console.error("Sketchfab fetch failed", err);
      return { models: [] as SketchfabModel[], error: "Sketchfab unreachable" };
    }
  });
