import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CultsModel = {
  slug: string;
  name: string;
  description: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
  gallery: string[];
  tags: string[];
  priceCents: number;
  priceFormatted: string;
  likesCount: number;
  downloadsCount: number;
};

type RawCreation = {
  slug?: string;
  name?: string;
  description?: string;
  shortContent?: string;
  url?: string;
  publishedAt?: string;
  illustrationImageUrl?: string;
  illustrationImageUrls?: string[];
  tags?: Array<{ name?: string } | string> | null;
  price?: { cents?: number; formatted?: string } | null;
  likesCount?: number;
  downloadsCount?: number;
};

const GRAPHQL = "https://cults3d.com/graphql";

async function loadCreds(): Promise<{ user: string; pass: string } | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("studio_settings")
    .select("cults_username, cults_api_key")
    .eq("id", "singleton")
    .maybeSingle();
  if (!data?.cults_username || !data?.cults_api_key) return null;
  return { user: data.cults_username, pass: data.cults_api_key };
}

function authHeader(user: string, pass: string) {
  const token = Buffer.from(`${user}:${pass}`).toString("base64");
  return `Basic ${token}`;
}

function normalize(r: RawCreation): CultsModel {
  const tags = Array.isArray(r.tags)
    ? r.tags
        .map((t) => (typeof t === "string" ? t : t?.name))
        .filter((t): t is string => !!t)
    : [];
  const gallery = Array.isArray(r.illustrationImageUrls)
    ? r.illustrationImageUrls.filter(Boolean)
    : r.illustrationImageUrl
      ? [r.illustrationImageUrl]
      : [];
  return {
    slug: r.slug ?? "",
    name: r.name ?? "Untitled",
    description: (r.description ?? r.shortContent ?? "").trim(),
    url: r.url ?? "",
    publishedAt: r.publishedAt ?? "",
    thumbnail: r.illustrationImageUrl ?? gallery[0] ?? "",
    gallery,
    tags,
    priceCents: r.price?.cents ?? 0,
    priceFormatted: r.price?.formatted ?? (r.price?.cents === 0 ? "Free" : ""),
    likesCount: r.likesCount ?? 0,
    downloadsCount: r.downloadsCount ?? 0,
  };
}

async function runQuery<T>(query: string): Promise<{ data: T | null; error: string | null }> {
  const creds = await loadCreds();
  if (!creds) {
    return { data: null, error: "Cults3D credentials not configured" };
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10_000);
    const res = await fetch(GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader(creds.user, creds.pass),
      },
      body: JSON.stringify({ query }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      return { data: null, error: `Cults3D HTTP ${res.status}` };
    }
    const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
    if (json.errors?.length) {
      return { data: null, error: json.errors.map((e) => e.message).join("; ") };
    }
    return { data: json.data ?? null, error: null };
  } catch (err) {
    console.error("Cults3D fetch failed", err);
    return { data: null, error: "Cults3D unreachable" };
  }
}

const LIST_FIELDS = `
  slug
  name
  description
  shortContent
  url
  publishedAt
  illustrationImageUrl
  likesCount
  downloadsCount
  tags { name }
  price { cents formatted }
`;

const DETAIL_FIELDS = `
  slug
  name
  description
  url
  publishedAt
  illustrationImageUrl
  illustrationImageUrls
  likesCount
  downloadsCount
  tags { name }
  price { cents formatted }
`;

export const getCultsModels = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({ count: z.number().min(1).max(100).default(50) }).optional(),
  )
  .handler(async ({ data }) => {
    const count = data?.count ?? 50;
    const creds = await loadCreds();
    if (!creds) return { models: [] as CultsModel[], error: "not_configured" as const };
    const username = creds.user;
    const query = `{
      user(nick: "${username}") {
        creations(limit: ${count}, order: PUBLISHED_AT_DESC) {
          ${LIST_FIELDS}
        }
      }
    }`;
    const res = await runQuery<{ user: { creations: RawCreation[] } | null }>(query);
    if (res.error || !res.data?.user) {
      return { models: [] as CultsModel[], error: res.error ?? "no_user" };
    }
    const models = (res.data.user.creations ?? []).map(normalize).filter((m) => m.slug);
    return { models, error: null as string | null };
  });

export const getCultsModelBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(255) }))
  .handler(async ({ data }) => {
    const query = `{
      creation(slug: "${data.slug.replace(/"/g, "")}") {
        ${DETAIL_FIELDS}
      }
    }`;
    const res = await runQuery<{ creation: RawCreation | null }>(query);
    if (res.error || !res.data?.creation) {
      return { model: null, error: res.error ?? "not_found" };
    }
    return { model: normalize(res.data.creation), error: null as string | null };
  });

// Admin-only: read/write studio settings
export const getStudioSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roles) throw new Error("Forbidden: admin only");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("studio_settings")
      .select("cults_username, cults_api_key, updated_at")
      .eq("id", "singleton")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      username: data?.cults_username ?? "",
      hasApiKey: !!data?.cults_api_key,
      updatedAt: data?.updated_at ?? null,
    };
  });

export const updateStudioSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      username: z.string().trim().min(1).max(120),
      apiKey: z.string().trim().min(1).max(512),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roles) throw new Error("Forbidden: admin only");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("studio_settings")
      .upsert({
        id: "singleton",
        cults_username: data.username,
        cults_api_key: data.apiKey,
        updated_at: new Date().toISOString(),
      });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const testCultsConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roles) throw new Error("Forbidden: admin only");
    const res = await runQuery<{ user: { nick: string } | null }>(
      `{ user(nick: "${(await loadCreds())?.user ?? ""}") { nick } }`,
    );
    if (res.error) return { ok: false, error: res.error };
    if (!res.data?.user) return { ok: false, error: "User not found on Cults3D" };
    return { ok: true, nick: res.data.user.nick };
  });
