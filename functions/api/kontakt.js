// Cloudflare Pages Function: POST /api/kontakt
// Sends the enquiry to the doctor by e-mail through Resend.
// Environment variables (Cloudflare Pages -> Settings -> Variables and Secrets):
//   RESEND_API_KEY (Secret), MAIL_TO, MAIL_FROM

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const clip = (s, n) => String(s ?? "").trim().slice(0, n);

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY || !env.MAIL_TO || !env.MAIL_FROM) {
    return json({ ok: false, error: "not configured" }, 500);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "bad request" }, 400);
  }

  // Honeypot: bots fill the hidden field. Pretend success and send nothing.
  if (clip(data.website, 200)) return json({ ok: true });

  const name = clip(data.name, 120);
  const email = clip(data.email, 160);
  const country = clip(data.country, 80);
  const phone = clip(data.phone, 40);
  const message = clip(data.message, 4000);
  const page = clip(data.page, 300);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !data.consent) {
    return json({ ok: false, error: "invalid" }, 400);
  }

  // Header injection guard for the subject line
  const subject = `English page enquiry: ${name}${country ? " (" + country + ")" : ""}`.replace(/[\r\n]+/g, " ");

  const text = [
    `Name: ${name}`,
    `E-mail: ${email}`,
    `Country: ${country || "-"}`,
    `Telephone: ${phone || "-"}`,
    `Page: ${page || "-"}`,
    "",
    message,
  ].join("\n");

  const html = `<p><b>Name:</b> ${esc(name)}<br><b>E-mail:</b> ${esc(email)}<br><b>Country:</b> ${esc(country || "-")}<br><b>Telephone:</b> ${esc(phone || "-")}<br><b>Page:</b> ${esc(page || "-")}</p><p style="white-space:pre-wrap">${esc(message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [env.MAIL_TO],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.log("Resend error", res.status, await res.text());
    return json({ ok: false, error: "send failed" }, 502);
  }
  return json({ ok: true });
}

// Anything other than POST
export async function onRequest() {
  return json({ ok: false, error: "method not allowed" }, 405);
}
