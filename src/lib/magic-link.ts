import { siteUrl } from "./site";
import { createToken, readToken } from "./session-token";

// Magic sign-in links: a signed, stateless token emailed to the customer.
// Opening it proves the person controls the mailbox, so the /magic route also
// marks the account email-verified. No DB row needed — a stale token simply
// fails signature or expiry validation.

export const MAGIC_TTL_SECONDS = 60 * 60 * 24; // 24 h

type MagicToken = { id: string; exp: number };

export function createMagicToken(customerId: string): string {
  return createToken<MagicToken>("magic", {
    id: customerId,
    exp: Math.floor(Date.now() / 1000) + MAGIC_TTL_SECONDS,
  });
}

export function readMagicToken(token: string): MagicToken | null {
  return readToken<MagicToken>("magic", token);
}

// Only same-site relative destinations after the magic jump (no open redirects).
export function magicNext(value: unknown): string {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\")) return "/account";
  if (v.startsWith("/magic") || v.startsWith("/login") || v.startsWith("/register")) return "/account";
  return v;
}

export function magicUrlFor(token: string, next?: string): string {
  const n = magicNext(next);
  return `${siteUrl}/magic?token=${encodeURIComponent(token)}&next=${encodeURIComponent(n)}`;
}
