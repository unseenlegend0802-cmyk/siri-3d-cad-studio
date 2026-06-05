import { queryOptions } from "@tanstack/react-query";
import { getCultsModels, getCultsModelBySlug } from "./cults.functions";

export const cultsModelsQuery = queryOptions({
  queryKey: ["cults", "models"] as const,
  queryFn: () => getCultsModels({ data: { count: 100 } }),
  staleTime: 1000 * 60 * 15,
  refetchOnWindowFocus: false,
});

export const cultsModelBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["cults", "model", slug] as const,
    queryFn: () => getCultsModelBySlug({ data: { slug } }),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

/** ISO week-of-year — used for deterministic Model of the Week rotation. */
export function weekOfYear(date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
