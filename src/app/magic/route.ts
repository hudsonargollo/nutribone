import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { startCustomerSession } from "@/lib/customer-auth";
import { magicNext, readMagicToken } from "@/lib/magic-link";
import { siteUrl } from "@/lib/site";

// One-tap sign-in from the emailed magic link. Opening a valid link also
// verifies the mailbox, so checkout-created passwordless accounts become
// verified the first time they use it.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const next = magicNext(request.nextUrl.searchParams.get("next"));
  const loginUrl = new URL("/login?magic=expired", siteUrl || request.url);

  const data = token ? readMagicToken(token) : null;
  if (!data) return NextResponse.redirect(loginUrl);

  const customer = await prisma.customer
    .findUnique({ where: { id: data.id }, select: { id: true, email: true, name: true, emailVerifiedAt: true } })
    .catch(() => null);
  if (!customer) return NextResponse.redirect(loginUrl);

  if (!customer.emailVerifiedAt) {
    await prisma.customer
      .update({ where: { id: customer.id }, data: { emailVerifiedAt: new Date() } })
      .catch(() => {});
  }

  await startCustomerSession({ id: customer.id, email: customer.email, name: customer.name });
  return NextResponse.redirect(new URL(next, siteUrl || request.url));
}
