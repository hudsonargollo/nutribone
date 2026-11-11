import type { Metadata } from "next";
import { NotifyForm } from "@/components/notify-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProducts, getShopFacets } from "@/lib/catalog";
import { parseProductFilters } from "@/lib/filters";
import { ShopBrowser } from "@/components/shop/shop-browser";
import { Emblem } from "@/components/brand/emblem";

// Storefront copy overrides where the category name alone doesn't sell the product.
const CATEGORY_COPY: Record<string, { title: string; description: string }> = {
  caldos: {
    title: "Caldos de Huesos",
    description:
      "Original, White y Antiinflamatorio. Huesos horneados y 48 horas de cocción lenta para extraer colágeno, minerales y aminoácidos. En frascos de 100 a 1000 ml y packs semanales o mensuales.",
  },
  cubitos: {
    title: "IceCubes · Cubitos de Caldo",
    description:
      "500 ml de caldo en cubitos que se descongelan rápido. Control de porciones para smoothies, sopas, arroz, guisos y comida de bebé.",
  },
  origen: {
    title: "Origen · Caldo en Polvo",
    description:
      "El mismo poder, nueva forma: caldo en polvo instantáneo. Solo agrégalo a agua caliente o úsalo como topping en comidas, ensaladas, salsas y batidos.",
  },
  nutriglow: {
    title: "NutriGlow · Skincare de Tallow",
    description:
      "Cosmética artesanal a base de tallow de res: crema hidratante regeneradora con frankincense y bálsamo nutrihumectante. 100% natural, sin conservantes.",
  },
  extras: {
    title: "Shots y Extras",
    description:
      "Shot antiinflamatorio, tallow de res y más complementos para tu ritual NutriBone.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "No encontrado" };
  const copy = CATEGORY_COPY[cat.slug];
  return {
    title: copy?.title ?? cat.name,
    description:
      copy?.description ?? cat.description ?? `Pide ${cat.name.toLowerCase()} en NutriBone.`,
    alternates: { canonical: `/shop/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/shop/[category]">) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const sp = await searchParams;
  const parsed = parseProductFilters(sp);
  const filters = { ...parsed, categorySlug: cat.slug };
  const [products, facets] = await Promise.all([
    getProducts(filters),
    getShopFacets(cat.slug),
  ]);

  const hasFilters = Boolean(
    parsed.q || parsed.material || parsed.minPrice || parsed.maxPrice || parsed.onSale || parsed.inStock
  );

  // Category with no products yet → friendly "coming soon" card.
  if (products.length === 0 && !hasFilters) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <Emblem size={48} className="mx-auto text-brand" accent="var(--color-accent)" />
        <span className="eyebrow mt-4 block">{cat.name}</span>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Próximamente
        </h1>
        <p className="relative mx-auto mt-2 max-w-md text-muted">
          Estamos preparando nuestra selección de {cat.name.toLowerCase()}. Déjanos tu correo y te
          avisamos en cuanto llegue.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-brand-deep shadow-[0_14px_32px_-16px_rgba(201,138,46,0.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-accent-soft"
          >
            Ver productos
          </Link>
        </div>
        <div className="mt-8">
          <p className="mb-3 text-sm text-muted">Avísame cuando lleguen:</p>
          <NotifyForm slug={cat.slug} label={cat.name} />
        </div>
      </div>
    );
  }

  return (
    <ShopBrowser
      eyebrow="La tienda"
      title={CATEGORY_COPY[cat.slug]?.title ?? cat.name}
      description={CATEGORY_COPY[cat.slug]?.description ?? cat.description}
      products={products}
      facets={facets}
    />
  );
}