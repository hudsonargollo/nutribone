import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/brand/emblem";
import { formatPrice } from "@/lib/format";
import { getStoreSettings } from "@/lib/settings";

export const metadata: Metadata = {
  alternates: { canonical: "/shipping" },
  title: "Delivery y devoluciones",
  description: "Delivery a domicilio en Santa Cruz de la Sierra: gratis dentro del 4to anillo, tiempos, pedidos por encargo y política de devoluciones de NutriBone.",
};

export default async function ShippingPage() {
  const { flatFee: FLAT_SHIPPING, freeThreshold: FREE_SHIPPING_THRESHOLD, deliveryTime: DELIVERY_TIME } = (
    await getStoreSettings()
  ).shipping;
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="text-center">
        <Emblem size={40} className="mx-auto text-brand" accent="var(--color-accent)" />
        <span className="eyebrow mt-3 block">Ayuda</span>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
          Delivery y devoluciones
        </h1>
      </div>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="font-display text-2xl font-bold text-ink">Delivery a domicilio</h2>
          <ul className="mt-4 space-y-3 text-ink/80">
            <li>• Somos un negocio 100% digital: entregamos a domicilio en Santa Cruz de la Sierra. Entrega estimada: {DELIVERY_TIME}. El tiempo puede variar según la preparación, la demanda y la distancia.</li>
            <li>
              • Costo de delivery: <strong>{FLAT_SHIPPING > 0 ? formatPrice(FLAT_SHIPPING) : "gratis"}</strong>
              {FREE_SHIPPING_THRESHOLD > 0 ? (
                <> — <strong>gratis</strong> en pedidos desde {formatPrice(FREE_SHIPPING_THRESHOLD)}.</>
              ) : (
                <> dentro del <strong>4to anillo</strong>, sin mínimo de compra.</>
              )}
            </li>
            <li>• El caldo se hace por encargo en lotes de cocción lenta (48h). Pide con al menos 24h de anticipación dentro de una ventana de unos 10 días.</li>
            <li>• Para fuera del 4to anillo o envíos especiales, coordina con el equipo por WhatsApp. No tenemos local físico ni retiro en tienda.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-ink">Cambios y devoluciones</h2>
          <ul className="mt-4 space-y-3 text-ink/80">
            <li>• Si tu pedido llega incompleto o en mal estado, contáctanos con tu número de pedido y cuéntanos qué pasó.</li>
            <li>• Nos importa que disfrutes tu pedido. Revisamos lo ocurrido con cuidado y lo más rápido posible.</li>
            <li>• Adjunta una foto del pedido si puedes: nos ayuda a revisar lo ocurrido.</li>
            <li>• Coordinamos contigo la solución más adecuada para tu pedido.</li>
            <li>• Nuestros frascos son retornables: devuélvelos y obtén descuento en tu próximo pedido.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-[var(--line)] bg-cream-soft p-6 text-sm text-muted">
          ¿Necesitas ayuda con un pedido? Escríbenos desde la{" "}
          <Link href="/contact" className="text-accent-strong hover:underline">
            página de contacto
          </Link>{" "}
          con tu número de orden.
        </section>
      </div>
    </div>
  );
}