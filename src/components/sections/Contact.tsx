import { useState } from "react";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitContactMessage } from "@/lib/contact.functions";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export function Contact() {
  const send = useServerFn(submitContactMessage);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const result = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setFailure(null);
    setSending(true);
    try {
      await send({ data: result.data });
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 8000);
    } catch (err) {
      setFailure(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };


  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">— Summon the Forge</p>
          <h2 className="font-display text-4xl md:text-5xl mb-4">Get in Touch</h2>
          <p className="text-muted-foreground">
            Have a beast in mind? Send a message and let's forge something legendary.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="relative p-8 md:p-10 rounded-lg bg-card border border-border shadow-card"
        >
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <Field name="name" label="Name" placeholder="Your name" error={errors.name} />
            <Field name="email" label="Email" placeholder="you@realm.com" type="email" error={errors.email} />
          </div>
          <div className="mb-6">
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows={6}
              placeholder="Tell me about your dragon..."
              className="w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/60 transition-colors resize-none"
            />
            {errors.message && <p className="mt-2 text-xs text-destructive">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={sending}
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            )}
            {sending ? "Sending…" : "Send Message"}
          </button>
          {sent && (
            <p className="mt-4 text-sm text-ember">
              ✦ Your message has been carried to the forge — the studio will reply by email.
            </p>
          )}
          {failure && <p className="mt-4 text-sm text-destructive">{failure}</p>}

        </form>
      </div>
    </section>
  );
}

function Field({
  name, label, placeholder, type = "text", error,
}: { name: string; label: string; placeholder: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/60 transition-colors"
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
