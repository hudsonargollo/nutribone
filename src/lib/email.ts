import nodemailer from "nodemailer";
import { formatPrice } from "./format";
import { getStoreSettings } from "./settings";

// Where owner alerts go: Admin → Settings → Notifications, else env.
async function alertAddress(): Promise<string> {
  const fromSettings = (await getStoreSettings()).notifications.orderEmail;
  return fromSettings || process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER || "";
}

// Transactional email. Transport is picked once per send:
//  1. Resend HTTP API when RESEND_API_KEY is set (preferred).
//  2. SMTP (nodemailer) when SMTP_* vars are set (Gmail, Brevo, Mailgun…).
//  3. Otherwise emails are skipped gracefully — checkout still succeeds.
// Sender defaults to NutriBone <pedidos@nutribone.clubemkt.digital>; the
// domain must be verified in Resend before real customer mail can deliver.

export type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  /** Club NutriBone: what this order earned / spent (null when loyalty is off or not linked). */
  club?: { stamps: number; points: number; redeemedProduct: string | null } | null;
  /** One-tap access link emailed to passwordless accounts (24 h). */
  magicUrl?: string | null;
};

const PAYMENT_LABELS: Record<string, string> = {
  COD: "Pago contra entrega",
  TRANSFER: "QR / transferencia (coordinamos por WhatsApp)",
};

function paymentLabel(method: string): string {
  return PAYMENT_LABELS[method] ?? method;
}

function mailFrom(): string {
  if (process.env.MAIL_FROM) return process.env.MAIL_FROM;
  if (process.env.RESEND_API_KEY || !process.env.SMTP_USER) {
    return "NutriBone <pedidos@nutribone.clubemkt.digital>";
  }
  return `NutriBone <${process.env.SMTP_USER}>`;
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY) || Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendViaResend(msg: { to: string; subject: string; html: string; text?: string; replyTo?: string }): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mailFrom(),
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      ...(msg.text ? { text: msg.text } : {}),
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
  }
}

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      // Google shows App Passwords as "abcd efgh ijkl mnop"; the real password has no spaces.
      pass: /gmail|googlemail/i.test(process.env.SMTP_HOST ?? "")
        ? process.env.SMTP_PASS?.replace(/\s+/g, "")
        : process.env.SMTP_PASS,
    },
  });
}

// One send through whichever transport is configured. Never throws here —
// callers wrap and decide whether a failure matters.
async function sendMail(msg: { to: string; subject: string; html: string; text?: string; replyTo?: string }): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    await sendViaResend(msg);
    return;
  }
  await getTransport().sendMail({
    from: mailFrom(),
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
    ...(msg.text ? { text: msg.text } : {}),
    ...(msg.replyTo ? { replyTo: msg.replyTo } : {}),
  });
}

function itemsTable(o: OrderEmailData): string {
  const rows = o.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e8e2d4;color:#2b2b23">
          ${escape(i.name)} <span style="color:#7a7466">× ${i.quantity}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #e8e2d4;text-align:right;color:#2b2b23">
          ${formatPrice(i.price * i.quantity)}
        </td>
      </tr>`
    )
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows}
      <tr><td style="padding:8px 0;color:#7a7466">Subtotal</td><td style="padding:8px 0;text-align:right;color:#2b2b23">${formatPrice(o.subtotal)}</td></tr>
      <tr><td style="padding:8px 0;color:#7a7466">Delivery</td><td style="padding:8px 0;text-align:right;color:#2b2b23">${o.shipping === 0 ? "Gratis" : formatPrice(o.shipping)}</td></tr>
      <tr><td style="padding:12px 0 0;font-weight:700;color:#2b2b23">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:700;color:#2b2b23">${formatPrice(o.total)}</td></tr>
    </table>`;
}

function button(url: string, label: string): string {
  return `<p style="margin:22px 0"><a href="${escape(url)}" style="background:#2e4a2e;color:#f7f3ea;padding:12px 22px;border-radius:999px;text-decoration:none;font-size:14px;display:inline-block">${escape(label)}</a></p>`;
}

function shell(title: string, inner: string): string {
  return `
  <div style="background:#f7f3ea;padding:24px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fbfcfe;border:1px solid #e8e2d4;border-radius:12px;overflow:hidden">
      <div style="background:#2e4a2e;padding:22px;text-align:center">
        <div style="color:#f7f3ea;font-size:24px;letter-spacing:6px;font-weight:700">NUTRIBONE</div>
        <div style="color:#c9b98a;font-size:13px;margin-top:4px">Caldo de huesos · El poder de sanar en cada sorbo</div>
      </div>
      <div style="padding:28px">
        <h1 style="margin:0 0 8px;color:#2b2b23;font-size:22px">${title}</h1>
        ${inner}
      </div>
      <div style="background:#2e4a2e;padding:16px;text-align:center;color:#c9b98a;font-size:12px">
        NutriBone · Santa Cruz, Bolivia
      </div>
    </div>
  </div>`;
}

function clubHtml(o: OrderEmailData): string {
  if (!o.club) return "";
  const parts: string[] = [];
  if (o.club.stamps > 0)
    parts.push(`<span style="color:#2b2b23;font-weight:700">${o.club.stamps} sello${o.club.stamps === 1 ? "" : "s"}</span>`);
  if (o.club.points > 0)
    parts.push(`<span style="color:#2b2b23;font-weight:700">${o.club.points} puntos</span>`);
  if (o.club.redeemedProduct)
    parts.push(`tu <span style="color:#2b2b23;font-weight:700">${escape(o.club.redeemedProduct)}</span> gratis ya va en el pedido`);
  if (parts.length === 0) return "";
  return `
    <p style="margin:18px 0 0;padding:14px 16px;background:#f7f3ea;border:1px solid #c98a2e;border-radius:10px;font-size:14px;color:#2b2b23">
      Club NutriBone: ganaste ${parts.join(" y ")}.<br/>
      <span style="color:#7a7466;font-size:13px">Suma sellos y puntos con cada pedido y canjéalos por regalos.</span>
    </p>`;
}

function customerHtml(o: OrderEmailData): string {
  return shell(
    "¡Gracias por tu pedido!",
    `<p style="color:#2b2b23;font-size:14px">Hola ${escape(o.customerName)}, recibimos tu pedido y nuestro equipo se pondrá en contacto contigo por WhatsApp para coordinar el pago y la entrega.</p>
     <p style="color:#2b2b23;font-size:14px">Número de pedido: <strong>${escape(o.orderNumber)}</strong><br/>
     Pago: <strong>${escape(paymentLabel(o.paymentMethod))}</strong></p>
     <div style="margin:18px 0">${itemsTable(o)}</div>
     ${clubHtml(o)}
     ${o.magicUrl ? button(o.magicUrl, "Ver mi pedido y mi Club") : ""}
     ${o.magicUrl ? `<p style="color:#7a7466;font-size:13px">Este enlace abre tu cuenta sin contraseña (vence en 24 h). Desde ahí sigues este pedido, ves tus sellos y puntos del Club NutriBone, y puedes crear una contraseña cuando quieras.</p>` : ""}
     <p style="color:#7a7466;font-size:13px">Entrega en: ${escape(o.address)}, ${escape(o.city)}<br/>Teléfono: ${escape(o.phone)}</p>
     ${o.paymentMethod === "COD" ? `<p style="color:#7a7466;font-size:13px">Si elegiste pago contra entrega, ten el monto listo al recibir tu pedido.</p>` : ""}`
  );
}

function adminHtml(o: OrderEmailData): string {
  return shell(
    "Nuevo pedido",
    `<p style="color:#2b2b23;font-size:14px">Pedido <strong>${escape(o.orderNumber)}</strong> — ${formatPrice(o.total)} (${escape(paymentLabel(o.paymentMethod))})</p>
     <p style="color:#2b2b23;font-size:14px"><strong>${escape(o.customerName)}</strong><br/>
     ${escape(o.email)} · ${escape(o.phone)}<br/>
     ${escape(o.address)}, ${escape(o.city)}</p>
     <div style="margin:18px 0">${itemsTable(o)}</div>`
  );
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Sends confirmation to the customer + notification to the store owner.
// Never throws — email failures must not break checkout.
export async function sendOrderEmails(o: OrderEmailData): Promise<void> {
  if (!emailConfigured()) {
    console.warn("[email] No RESEND_API_KEY / SMTP configured — skipping order emails.");
    return;
  }

  const adminTo = await alertAddress();
  try {
    await Promise.all([
      sendMail({
        to: o.email,
        subject: `Tu pedido en NutriBone ${o.orderNumber}`,
        html: customerHtml(o),
      }),
      ...(adminTo
        ? [
            sendMail({
              to: adminTo,
              subject: `Nuevo pedido ${o.orderNumber} — ${formatPrice(o.total)}`,
              html: adminHtml(o),
            }),
          ]
        : []),
    ]);
  } catch (err) {
    console.error("[email] Failed to send order emails:", err);
  }
}

// Magic sign-in link (passwordless access from the order email or the login
// page). Never throws.
export async function sendMagicLinkEmail(p: { to: string; name: string; url: string }): Promise<void> {
  if (!emailConfigured()) {
    console.warn("[email] No RESEND_API_KEY / SMTP configured — magic link email not sent.");
    return;
  }
  try {
    await sendMail({
      to: p.to,
      subject: "Entra a tu cuenta NutriBone (enlace de acceso)",
      text: `Hola ${p.name}: entra a tu cuenta de NutriBone con este enlace: ${p.url} — vence en 24 horas y es personal. Si no lo pediste, puedes ignorar este correo.`,
      html: shell(
        "Entra a tu cuenta",
        `<p style="color:#2b2b23;font-size:14px">Hola ${escape(p.name)}, toca el botón para entrar a tu cuenta de NutriBone: ahí verás tus pedidos y tus sellos y puntos del Club NutriBone.</p>
         ${button(p.url, "Entrar a mi cuenta")}
         <p style="color:#7a7466;font-size:13px">El enlace vence en <strong>24 horas</strong> y es solo para ti. Si no lo pediste, puedes ignorar este correo — tu cuenta sigue segura.</p>
         <p style="color:#7a7466;font-size:13px">¿Prefieres una contraseña? Una vez dentro puedes crearla desde tu cuenta.</p>`
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send magic link email:", err);
  }
}

// Password-reset link for a storefront customer. Never throws.
export async function sendPasswordResetEmail(p: { to: string; name: string; url: string }): Promise<void> {
  if (!emailConfigured()) {
    console.warn("[email] No RESEND_API_KEY / SMTP configured — password reset email not sent.");
    return;
  }
  try {
    await sendMail({
      to: p.to,
      subject: "Restablece tu contraseña de NutriBone",
      html: shell(
        "Restablece tu contraseña",
        `<p style="color:#2b2b23;font-size:14px">Hola ${escape(p.name)}, recibimos una solicitud para restablecer tu contraseña.</p>
         ${button(p.url, "Elegir nueva contraseña")}
         <p style="color:#7a7466;font-size:13px">Este enlace vence en 1 hora y se puede usar una sola vez. Si no lo solicitaste, puedes ignorar este correo.</p>`
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send password reset email:", err);
  }
}

// Alerts the store owner about a contact-form message. Never throws.
export async function sendContactNotification(m: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  topic?: string;
}): Promise<void> {
  if (!emailConfigured()) return; // message is still saved in the admin "Messages" page
  const to = await alertAddress();
  if (!to) return;
  try {
    await sendMail({
      to,
      replyTo: m.email,
      subject: `Nuevo mensaje: ${m.subject || m.topic || "Formulario de contacto"} — ${m.name}`,
      html: shell(
        "Nuevo mensaje de contacto",
        `<p style="color:#2b2b23;font-size:14px"><strong>${escape(m.name)}</strong> · ${escape(m.email)}${
          m.phone ? ` · ${escape(m.phone)}` : ""
        }</p>
         ${m.subject ? `<p style="color:#2b2b23;font-size:14px"><strong>${escape(m.subject)}</strong></p>` : ""}
         <p style="color:#2b2b23;font-size:14px;white-space:pre-wrap">${escape(m.message)}</p>`
      ),
    });
  } catch (err) {
    console.error("[email] Failed to contact notification:", err);
  }
}

// One-time verification code (sign-up / email verification).
// Without a transport: in development the code is printed to the server console
// so the flow can be tested; in production sending fails (sign-up can't be verified).
export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: "register" | "verify"
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!emailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`\n[email] No transport configured — DEV ONLY verification code for ${to}: ${code}\n`);
      return { ok: true };
    }
    console.error("[email] No transport configured — cannot send verification code");
    return { ok: false, error: "No podemos enviar correos de verificación ahora. Intenta más tarde o contáctanos." };
  }
  const spaced = code.split("").join(" ");
  const title = purpose === "register" ? "Confirma tu correo" : "Verifica tu correo";
  try {
    await sendMail({
      to,
      subject: `${code} es tu código de verificación de NutriBone`,
      text: `Tu código de verificación de NutriBone es ${code}. Vence en 10 minutos. Si no lo solicitaste, puedes ignorar este correo.`,
      html: shell(
        title,
        `<p style="color:#2b2b23;font-size:14px">Usa este código para ${
          purpose === "register" ? "terminar de crear tu cuenta de NutriBone" : "verificar tu correo electrónico"
        }:</p>
         <p style="margin:22px 0;text-align:center">
           <span style="display:inline-block;background:#f7f3ea;border:1px solid #c98a2e;border-radius:10px;padding:14px 22px;font-size:30px;font-weight:700;letter-spacing:8px;color:#2e4a2e;font-family:'Courier New',monospace">${escape(spaced)}</span>
         </p>
         <p style="color:#7a7466;font-size:13px">Este código vence en <strong>10 minutos</strong>. No lo compartas con nadie — NutriBone nunca te lo pedirá por teléfono ni WhatsApp.</p>
         <p style="color:#7a7466;font-size:13px">Si no intentaste registrarte, puedes ignorar este correo.</p>`
      ),
    });
    return { ok: true };
  } catch (err) {
    console.error("[email] Failed to send verification code:", err);
    // Only a rejected recipient is the shopper's to fix; login / connection
    // failures (e.g. a revoked Gmail App Password) are ours.
    const e = err as { code?: string; responseCode?: number; rejected?: string[]; message?: string };
    const badRecipient =
      e.code === "EENVELOPE" || Boolean(e.rejected?.length) || (e.responseCode ?? 0) === 550 || /Resend 422/.test(e.message ?? "");
    return {
      ok: false,
      error: badRecipient
        ? "No pudimos enviar el código a esa dirección. Revisa tu correo e inténtalo de nuevo."
        : "No podemos enviar correos de verificación ahora. Intenta en un momento o contáctanos.",
    };
  }
}
