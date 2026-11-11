import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { MenuPromoSlider } from "@/components/shop/menu-promo-slider";
import { MenuSection } from "@/components/shop/menu-section";

export const metadata: Metadata = {
  alternates: { canonical: "/shop" },
  title: "Productos: caldos de huesos, cubitos, polvo y skincare",
  description:
    "Caldo de huesos Original, White y Antiinflamatorio, IceCubes, Origen en polvo y NutriGlow. Pide online con delivery gratis dentro del 4to anillo en Santa Cruz.",
};

export const dynamic = "force-dynamic";

const SECTIONS: {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
}[] = [
  {
    slug: "caldos",
    eyebrow: "El ritual diario",
    title: "Caldos de Huesos",
    description:
      "Original, White y Antiinflamatorio: 48 horas de cocción lenta en vasos, potes y packs semanales o mensuales.",
    linkLabel: "Ver caldos",
  },
  {
    slug: "cubitos",
    eyebrow: "Porciones prácticas",
    title: "IceCubes · Cubitos",
    description:
      "500 ml de caldo en cubitos que se descongelan rápido: para smoothies, sopas, arroz, guisos y comida de bebé.",
    linkLabel: "Ver cubitos",
  },
  {
    slug: "origen",
    eyebrow: "Mismo poder, nueva forma",
    title: "Origen · Caldo en Polvo",
    description:
      "Solo agrégalo a agua caliente o úsalo como topping en comidas, ensaladas, salsas y batidos.",
    linkLabel: "Ver Origen",
  },
  {
    slug: "nutriglow",
    eyebrow: "De adentro hacia afuera",
    title: "NutriGlow · Skincare de Tallow",
    description:
      "Crema y bálsamo artesanales a base de tallow: 100% naturales, sin conservantes ni aditivos.",
    linkLabel: "Ver NutriGlow",
  },
  {
    slug: "extras",
    eyebrow: "Para complementar",
    title: "Shots y Extras",
    description:
      "Shot antiinflamatorio, tallow de res, ebooks y gift cards para regalar nutrición real.",
    linkLabel: "Ver extras",
  },
];

export default async function ShopPage() {
  const products = await getProducts({});

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <span className="eyebrow">La tienda</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
          Nutrición real, de adentro hacia afuera
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base text-muted sm:text-lg">
          Caldo de huesos artesanal en todos sus formatos: vasos y potes, packs
          semanales y mensuales, cubitos, polvo instantáneo y skincare de tallow.
          Elige tu formato y nosotros coordinamos la entrega por WhatsApp.
        </p>
      </header>

      <div className="mt-10">
        <MenuPromoSlider />
      </div>

      <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-16">
        {SECTIONS.map((s) => (
          <MenuSection
            key={s.slug}
            id={s.slug}
            eyebrow={s.eyebrow}
            title={s.title}
            description={s.description}
            href={`/shop/${s.slug}`}
            linkLabel={s.linkLabel}
            products={products.filter((p) => p.category.slug === s.slug)}
          />
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-[var(--line)] bg-surface py-16 text-center">
          <p className="font-display text-xl text-ink">La tienda está tomando forma</p>
          <p className="mt-1 text-sm text-muted">Vuelve en un momento.</p>
        </div>
      ) : null}
    </div>
  );
}