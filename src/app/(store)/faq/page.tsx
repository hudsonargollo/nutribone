import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/brand/emblem";
import { getStoreSettings } from "@/lib/settings";
import { AccordionItem } from "@/components/ui/accordion-item";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "Preguntas frecuentes",
  description: "Respuestas sobre pedidos, caldos, conservación, delivery y pagos en NutriBone, Santa Cruz de la Sierra, Bolivia.",
};

const faqs = (DELIVERY_TIME: string) => [
  {
    q: "¿Cómo hago un pedido?",
    a: "Arma tu pedido desde la tienda o escríbenos por WhatsApp. Como el caldo se hace por encargo, pide con al menos 24h de anticipación. Puedes pagar con QR, transferencia o contra entrega.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "QR, transferencia o pago contra entrega (en efectivo al recibir). Si hace falta, el equipo te confirma los datos de pago por WhatsApp. Se puede comprar como invitado; crear cuenta es opcional.",
  },
  {
    q: "¿Cuánto tarda el delivery?",
    a: `Entregamos a domicilio en Santa Cruz de la Sierra, gratis dentro del 4to anillo. Entrega estimada: ${DELIVERY_TIME}. El caldo se cocina en lotes de 48h, así que pedimos unos 24h de anticipación dentro de una ventana de unos 10 días. El tiempo puede variar según la preparación, la demanda y la distancia.`,
  },
  {
    q: "¿Tienen local o puedo retirar en tienda?",
    a: "Somos un negocio 100% digital: no tenemos local físico ni sucursales. Todo se coordina por WhatsApp y se entrega a domicilio en Santa Cruz de la Sierra.",
  },
  {
    q: "¿Qué variantes de caldo tienen?",
    a: "Original (con verduras), White (sin verduras ni condimentos, más ligera en sabor) y Antiinflamatoria (con cúrcuma y jengibre). También tenemos cubitos IceCubes, caldo en polvo Origen, skincare de tallow NutriGlow y shots antiinflamatorios.",
  },
  {
    q: "¿Cómo conservo el caldo?",
    a: "En freezer hasta unos 3 meses o en refrigerador unos 4 días. Que cuaje frío (la prueba de gelatina) es señal de buen colágeno. Descongela en refrigerador y consume pronto. Más detalles en Ingredientes y cuidado.",
  },
  {
    q: "¿Hacen pedidos por mayor?",
    a: "Sí, para negocios, eventos y consumo frecuente. Llena el formulario de pedidos por mayor y nuestro equipo te contactará lo antes posible para coordinar disponibilidad, opciones y precio.",
  },
  {
    q: "¿Cuál es la política de devoluciones?",
    a: "Nos importa que disfrutes tu pedido. Si llega incompleto o en mal estado, contáctanos con tu número de pedido y cuéntanos qué pasó. Lo revisamos con cuidado y lo más rápido posible para coordinar contigo la solución más adecuada. Nuestros frascos son retornables y tienen descuento al devolverlos. Consulta Delivery y devoluciones.",
  },
  {
    q: "¿Entregan en mi zona?",
    a: "Entregamos a domicilio en Santa Cruz de la Sierra, gratis dentro del 4to anillo. Si estás fuera del 4to anillo o tienes dudas sobre tu dirección, consúltanos por WhatsApp antes de pedir.",
  },
  {
    q: "¿El caldo de huesos cura enfermedades?",
    a: "No. El caldo aporta colágeno, minerales y aminoácidos como apoyo general al bienestar, pero no es un tratamiento médico. Ante embarazo, lactancia, alergias o cualquier condición de salud, consulta a un profesional de la salud.",
  },
];

export default async function FaqPage() {
  const FAQS = faqs((await getStoreSettings()).shipping.deliveryTime);
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="text-center">
        <Emblem size={40} className="mx-auto text-brand" accent="var(--color-accent)" />
        <span className="eyebrow mt-3 block">Ayuda</span>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
          Preguntas frecuentes
        </h1>
      </div>

      <div className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {FAQS.map((item) => (
          <AccordionItem
            key={item.q}
            title={item.q}
            group="faq"
            className="py-4"
            summaryClassName="font-display text-lg text-ink"
            icon={
              <span
                aria-hidden="true"
                className="shrink-0 text-xl leading-none text-accent-strong transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-45"
              >
                +
              </span>
            }
          >
            <p className="pt-3 text-sm leading-relaxed text-ink/80">{item.a}</p>
          </AccordionItem>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        ¿Sigues con dudas?{" "}
        <Link href="/contact" className="text-accent-strong hover:underline">
          Contáctanos
        </Link>
        .
      </p>
    </div>
  );
}