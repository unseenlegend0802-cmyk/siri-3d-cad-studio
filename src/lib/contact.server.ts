// Server-only helper: notifies the studio owner about a new contact submission.

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

export type SubmissionPayload = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends the owner notification email. Returns true when an email was sent.
 * Never throws — a failed notification must not lose the stored submission.
 */
export async function notifyOwner(submission: SubmissionPayload): Promise<boolean> {
  const to = process.env["CONTACT_NOTIFY_EMAIL"] ?? "unseenlegend0802@gmail.com";
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  const from = process.env["CONTACT_FROM_EMAIL"] ?? "Siri3DCAD Studio <onboarding@resend.dev>";

  if (!lovableKey || !resendKey) {
    console.warn("[contact] Email not configured — submission stored without notification.");
    return false;
  }

  const html = `
    <h2>New commission enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Received:</strong> ${escapeHtml(submission.createdAt)}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(submission.message)}</p>
  `;

  try {
    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: submission.email,
        subject: `New enquiry from ${submission.name}`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[contact] Email send failed [${res.status}]: ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] Email send threw:", err);
    return false;
  }
}
