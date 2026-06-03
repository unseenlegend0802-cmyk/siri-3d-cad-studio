import { useState } from "react";
import { z } from "zod";
import { Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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
    setSent(true);
    e.currentTarget.reset();
    setTimeout(() => setSent(false), 5000);
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
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-md bg-gradient-ember text-primary-foreground font-medium shadow-ember hover:scale-[1.02] transition-transform"
          >
            <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            Send Message
          </button>
          {sent && (
            <p className="mt-4 text-sm text-ember">
              ✦ Your message has been carried to the forge.
            </p>
          )}
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
