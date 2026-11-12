import type { Metadata } from "next";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { emailConfigured } from "@/lib/email";
import { CheckoutForm, type CheckoutDefaults } from "@/components/checkout-form";
import { getProductBySlug } from "@/lib/catalog";
import { getStoreSettings } from "@/lib/settings";
import type { CartItem } from "@/components/cart/cart-provider";
import { toCartLine } from "@/lib/cart";

export const metadata: Metadata = {
  title: "Pago",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const sp = await searchParams;
  const buySlug = Array.isArray(sp.buy) ? sp.buy[0] : sp.buy;
  const qtyParam = Array.isArray(sp.qty) ? sp.qty[0] : sp.qty;

  // Guest checkout is allowed; signed-in customers get their details prefilled
  // and the order attached to their account.
  const session = await getCustomerSession();

  const [product, phone, settings] = await Promise.all([
    buySlug ? getProductBySlug(buySlug) : null,
    session
      ? prisma.customer
          .findUnique({ where: { id: session.id }, select: { phone: true } })
          .then((c) => c?.phone ?? undefined)
          .catch(() => undefined) // phone is optional — ignore lookup failures
      : Promise.resolve(undefined),
    getStoreSettings(),
  ]);

  // "Buy it now": check out a single product instead of the whole cart.
  let buyNow: CartItem | null = null;
  if (product && product.stock > 0 && product.price > 0) {
    const qtyRaw = Number(qtyParam);
    buyNow = {
      ...toCartLine(product),
      quantity: Math.min(product.stock, Math.max(1, Number.isFinite(qtyRaw) ? Math.floor(qtyRaw) : 1)),
    };
  }

  const defaults: CheckoutDefaults = session
    ? { name: session.name, email: session.email, phone }
    : {};

  return (
    <CheckoutForm
      defaults={defaults}
      buyNow={buyNow}
      shippingRules={settings.shipping}
      // Only promise the emailed access link when mail can actually go out.
      guestNote={emailConfigured() && settings.loyalty.enabled ? settings.loyalty.name : null}
    />
  );
}