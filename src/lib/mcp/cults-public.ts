// Public read-only Cults3D fetchers for the MCP server.
// Uses the studio's stored credentials (server-side only) to query the
// GraphQL API and returns the same public catalog data the website shows.

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
  url?: string;
  publishedAt?: string;
  illustrationImageUrl?: string;
  illustrations?: Array<{ imageUrl?: string }> | null;
  tags?: string[] | null;
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

function normalize(r: RawCreation): CultsModel {
  const tags = Array.isArray(r.tags) ? r.tags.filter((t): t is string => !!t) : [];
  const gallery = Array.isArray(r.illustrations)
    ? r.illustrations.map((i) => i?.imageUrl).filter((u): u is string => !!u)
    : r.illustrationImageUrl
      ? [r.illustrationImageUrl]
      : [];
  return {
    slug: r.slug ?? "",
    name: r.name ?? "Untitled",
    description: (r.description ?? "").trim(),
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

async function runQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<{ data: T | null; error: string | null }> {
  const creds = await loadCreds();
  if (!creds) return { data: null, error: "Cults3D credentials not configured" };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10_000);
    const token = Buffer.from(`${creds.user}:${creds.pass}`).toString("base64");
    const res = await fetch(GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify({ query, variables: variables ?? {} }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return { data: null, error: `Cults3D HTTP ${res.status}` };
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
  slug name description url publishedAt illustrationImageUrl
  likesCount downloadsCount tags price { cents formatted }
`;

const DETAIL_FIELDS = `
  slug name description url publishedAt illustrationImageUrl
  illustrations { imageUrl }
  likesCount downloadsCount tags price { cents formatted }
`;

export async function fetchCultsModels(
  limit: number,
): Promise<{ models: CultsModel[]; error: string | null }> {
  const creds = await loadCreds();
  if (!creds) return { models: [], error: "not_configured" };
  const query = `query ListCreations($nick: String!, $limit: Int!) {
    user(nick: $nick) {
      creations(limit: $limit) { ${LIST_FIELDS} }
    }
  }`;
  const res = await runQuery<{ user: { creations: RawCreation[] } | null }>(query, {
    nick: creds.user,
    limit,
  });
  if (res.error || !res.data?.user) {
    return { models: [], error: res.error ?? "no_user" };
  }
  const models = (res.data.user.creations ?? []).map(normalize).filter((m) => m.slug);
  return { models, error: null };
}

const SLUG_RE = /^[a-zA-Z0-9_-]+$/;

export async function fetchCultsModelBySlug(
  slug: string,
): Promise<{ model: CultsModel | null; error: string | null }> {
  if (!SLUG_RE.test(slug) || slug.length > 255) {
    return { model: null, error: "invalid_slug" };
  }
  const query = `query GetCreation($slug: String!) {
    creation(slug: $slug) { ${DETAIL_FIELDS} }
  }`;
  const res = await runQuery<{ creation: RawCreation | null }>(query, { slug });
  if (res.error || !res.data?.creation) {
    return { model: null, error: res.error ?? "not_found" };
  }
  return { model: normalize(res.data.creation), error: null };
}
