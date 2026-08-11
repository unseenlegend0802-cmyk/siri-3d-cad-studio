import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const submissionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10).max(2000),
});

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  readAt: string | null;
  notifiedAt: string | null;
  createdAt: string;
};

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submissionSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({ name: data.name, email: data.email, message: data.message })
      .select("id, name, email, message, created_at")
      .single();

    if (error || !row) {
      console.error("[contact] Insert failed:", error);
      throw new Error("Could not save your message. Please try again.");
    }

    const { notifyOwner } = await import("./contact.server");
    const notified = await notifyOwner({
      id: row.id,
      name: row.name,
      email: row.email,
      message: row.message,
      createdAt: row.created_at,
    });

    if (notified) {
      await supabaseAdmin
        .from("contact_submissions")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", row.id);
    }

    return { ok: true as const, id: row.id, notified };
  });

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: admin access required");
}

export const listContactSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ContactSubmission[]> => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("contact_submissions")
      .select("id, name, email, message, read_at, notified_at, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      message: r.message,
      readAt: r.read_at,
      notifiedAt: r.notified_at,
      createdAt: r.created_at,
    }));
  });

export const markSubmissionRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), read: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("contact_submissions")
      .update({ read_at: data.read ? new Date().toISOString() : null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
