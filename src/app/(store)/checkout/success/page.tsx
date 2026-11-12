import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { orderLoyalty } from "@/lib/loyalty";
import { getStoreSettings } from "@/lib/settings";
import { getCustomerSession } from "@/lib/customer-auth";
import { emailConfigured } from "@/lib/email";
import { CONTACT } from "@/lib/contact";
import { ClearCart } from "@/components/cart/clear-cart";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type OrderSummary = {
  id: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  status: string;
  customerId: string | null;
  customerPasswordHash: string | null;
  productIds: string[];
};

async function findOrder(orderNumber: string): Promise<OrderSummary | null> {
  try {
    const o = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        paymentMethod: true,
        status: true,
        customerId: true,
        customer: { select: { passwordHash: true } },
        items: { select: { productId: true } },
      },
    });
    return o
      ? {
          ...o,
          total: Number(o.total),
          customerPasswordHash: o.customer?.passwordHash ?? null,
          productIds: o.items.map((i) => i.productId),
        }
      : null;
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const sp = await searchParams;
  const orderNumber = ((Array.isArray(sp.order) ? sp.order[0] : sp.order) ?? "").trim();

  // Everything shown here comes from the database, never from the URL.
  const order = orderNumber ? await findOrder(orderNumber) : null;
  if (!order) redirect("/cart");
  if (order.status === "CANCELLED") redirect("/cart");

  const isTransfer = order.paymentMethod === "TRANSFER";

  // Who is looking: the signed-in owner, a passwordless guest whose order just
  // created/opened an account (access arrives by email), or a guest whose email
  // already had a password account.
  const session = await getCustomerSession();
  const owned = Boolean(session && order.customerId && session.id === order.customerId);
  const passwordless =
    !owned && emailConfigured() && order.customerId !== null && order.customerPasswordHash === null;

  // What the order moved on the loyalty ledger (account orders only).
  const settings = await getStoreSettings();
  const club =
    settings.loyalty.enabled && order.customerId ? await orderLoyalty(order.id) : null;
  const clubLine = club
    ? [
        club.stamps > 0 ? `${club.stamps} sello${club.stamps === 1 ? "" : "s"}` : "",
        club.points > 0 ? `${club.points} puntos para los regalos` : "",
      ]
        .filter(Boolean)
        .join(" y ")
    : "";

  const waText = encodeURIComponent(
    `Hola NutriBone, acabo de hacer el pedido ${order.orderNumber} por ${formatPrice(order.total)} en la tienda en línea. ${isTransfer ? "Quisiera coordinar el pago por QR/transferencia." : "Elegí pago contra entrega."}`
  );
  const waUrl = CONTACT.whatsapp ? `${CONTACT.whatsappUrl}?text=${waText}` : "";

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <ClearCart productIds={order.productIds} />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-accent-soft to-accent">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e4a2e" strokeWidth="2.6">
          <path d="M5 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-8 font-display text-4xl font-semibold text-ink">¡Gracias por tu compra!</h1>
      <p className="mt-3 text-muted">
        Tu pedido fue registrado. Te contactamos por WhatsApp para coordinar el pago y la entrega.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-xl border border-[var(--line)] bg-surface/70 p-6 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Número de pedido</span>
          <span className="font-medium text-ink">{order.orderNumber}</span>
        </div>
        <div className="mt-3 flex justify-between">
          <span className="text-muted">Total</span>
          <span className="font-medium text-ink">{formatPrice(order.total)}</span>
        </div>
        <div className="mt-3 flex justify-between">
          <span className="text-muted">Pago</span>
          <span className="font-medium text-ink">
            {isTransfer ? "QR / transferencia" : "Pago contra entrega"}
          </span>
        </div>
      </div>

      {waUrl && (
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-accent/40 bg-accent/5 p-5 text-sm">
          <p className="font-medium text-ink">Agiliza tu pedido por WhatsApp</p>
          <p className="mt-1 text-muted">
            Envíanos tu número de pedido y coordinamos {isTransfer ? "el pago y " : ""}la entrega contigo.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-brand px-6 py-2 text-xs font-medium uppercase tracking-[0.12em] text-light transition hover:opacity-90"
          >
            Escribir por WhatsApp
          </a>
        </div>
      )}

      {owned && (
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-accent/40 bg-accent/5 p-5 text-sm">
          <p className="font-medium text-ink">Guardado en tu cuenta</p>
          <p className="mt-1 text-muted">Sigue este pedido y revisa todos tus anteriores cuando quieras.</p>
          <Link
            href="/account/orders"
            className="mt-3 inline-block rounded-full border border-[var(--line-strong)] px-6 py-2 text-xs font-medium uppercase tracking-[0.12em] text-ink transition hover:border-accent hover:text-accent-strong"
          >
            Ver mis pedidos
          </Link>
        </div>
      )}

      {passwordless && (
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-accent/40 bg-accent/5 p-5 text-sm">
          <p className="font-medium text-ink">Enlace de acceso por correo</p>
          <p className="mt-1 text-muted">
            Te enviamos un enlace a tu correo para entrar sin contraseña: ahí sigues este pedido y
            ves tus sellos del {settings.loyalty.name}. Vence en 24 h.
          </p>
          <Link
            href="/login"
            className="mt-3 inline-block rounded-full border border-[var(--line-strong)] px-6 py-2 text-xs font-medium uppercase tracking-[0.12em] text-ink transition hover:border-accent hover:text-accent-strong"
          >
            ¿No te llegó? Pedir otro enlace
          </Link>
        </div>
      )}

      {!owned && !passwordless && order.customerId && (
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-accent/40 bg-accent/5 p-5 text-sm">
          <p className="font-medium text-ink">Guardado en tu cuenta</p>
          <p className="mt-1 text-muted">
            Este pedido quedó en la cuenta de tu correo. Inicia sesión para seguirlo.
          </p>
          <Link
            href="/login"
            className="mt-3 inline-block rounded-full border border-[var(--line-strong)] px-6 py-2 text-xs font-medium uppercase tracking-[0.12em] text-ink transition hover:border-accent hover:text-accent-strong"
          >
            Iniciar sesión
          </Link>
        </div>
      )}

      {club && (clubLine || club.redeemed) ? (
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-accent/40 bg-accent/5 p-5 text-sm">
          <p className="font-medium text-ink">{settings.loyalty.name}</p>
          <p className="mt-1 text-muted">
            {clubLine && (
              <>
                Ganaste <span className="text-ink">{clubLine}</span>.
              </>
            )}
            {club!.redeemed && (
              <>
                {clubLine ? " " : ""}
                <span className="text-ink">Tu producto gratis ya va en el pedido</span>.
              </>
            )}
          </p>
          {!owned && (
            <p className="mt-1 text-muted">
              {order.customerPasswordHash === null
                ? "Entra con el enlace de tu correo para ver tu tarjeta."
                : "Inicia sesión para ver tu tarjeta."}
            </p>
          )}
          {owned && (
            <Link
              href="/club"
              className="mt-3 inline-block rounded-full border border-[var(--line-strong)] px-6 py-2 text-xs font-medium uppercase tracking-[0.12em] text-ink transition hover:border-accent hover:text-accent-strong"
            >
              Ver mi tarjeta
            </Link>
          )}
        </div>
      ) : null}

      <p className="mx-auto mt-6 max-w-md text-sm text-muted">
        Guarda tu número de pedido. {isTransfer
          ? "Tu pedido se entrega una vez confirmado el pago."
          : "Si elegiste pago contra entrega, ten el monto listo al recibir."}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="inline-block rounded-full bg-gradient-to-r from-accent-soft to-accent px-8 py-3 text-sm font-medium text-brand transition hover:opacity-90"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}