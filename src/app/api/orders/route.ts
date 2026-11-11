import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit, TOO_MANY } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(`order:${await clientIp()}`, 10, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: TOO_MANY }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input = body as any;

  // Guest checkout is allowed. When a customer is signed in, the order is
  // attached to their account and the email goes to the account's address.
  // A cookie for a deleted account doesn't count.
  const session = await getCustomerSession();
  const customer = session
    ? await prisma.customer
        .findUnique({ where: { id: session.id }, select: { id: true, email: true } })
        .catch(() => null)
    : null;

  const result = await createOrder(
    customer ? { ...input, email: customer.email } : input,
    customer?.id ?? null
  );

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}