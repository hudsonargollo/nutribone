import { PrismaClient, Prisma } from "@prisma/client";

type SeedProduct = {
  name: string;
  slug: string;
  sku?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  material?: string;
  specs?: string;
  brand: string;
  categorySlug: string;
  stock: number;
  images: string[];
  featured?: boolean;
};

const prisma = new PrismaClient();

// NutriBone — caldo de huesos artesanal, tienda 100% digital (sin sucursales).
// Mirrors src/lib/sample-data.ts so the UI is identical before and after the DB
// hookup. Prices are provisional Bs placeholders chosen at the owner's request
// (the real list lives with the client) and stay editable in Admin → Products.
// Re-seeding refreshes catalog copy but never overwrites admin-managed price,
// stock or active state.

const categories: { name: string; slug: string; description: string }[] = [
  { name: "Caldos de Huesos", slug: "caldos", description: "Original, White y Antiinflamatorio. 48 horas de cocción lenta." },
  { name: "IceCubes · Cubitos", slug: "cubitos", description: "Caldo en cubitos que se descongelan rápido. Porciones exactas." },
  { name: "Origen · Caldo en Polvo", slug: "origen", description: "Caldo en polvo instantáneo. El mismo poder, nueva forma." },
  { name: "NutriGlow · Skincare", slug: "nutriglow", description: "Cosmética artesanal a base de tallow de res. 100% natural." },
  { name: "Shots y Extras", slug: "extras", description: "Shot antiinflamatorio, tallow de res y complementos." },
];

const products: SeedProduct[] = [
  // Caldos de Huesos
  {
    name: "Caldo de Huesos Original", slug: "caldo-de-huesos-original", brand: "NutriBone", categorySlug: "caldos", price: 45, stock: 30, featured: true,
    description: "El clásico que no pasa de moda: puro sabor y nutrientes esenciales sin aditivos. Huesos de res horneados con verduras y 48 horas de cocción lenta. Disponible en frascos de 100 a 1000 ml y en packs semanal (7) o mensual (30).",
    material: "Frascos 100–1000 ml · packs semanal y mensual",
    specs: "Ingredientes: Huesos de res, agua purificada, zanahoria, apio, cebolla, brócoli, vinagre de sidra de manzana con la madre, sal rosada\nCocción: 48 horas a fuego lento\nConservación: Freezer 3 meses · refrigerador 4 días",
    images: ["/images/variants.jpg", "/images/hero-mug.jpg", "/images/jars.jpg"],
  },
  {
    name: "Caldo de Huesos White", slug: "caldo-de-huesos-white", brand: "NutriBone", categorySlug: "caldos", price: 45, stock: 30,
    description: "Sin verduras ni condimentos, la opción más ligera en sabor. Huesos blanqueados y 48 horas de cocción lenta. Ideal para estómagos sensibles. En frascos de 150 y 500 ml y packs semanal o mensual.",
    material: "Frascos 150–500 ml · packs semanal y mensual",
    specs: "Ingredientes: Huesos de res blanqueados, agua purificada, vinagre de sidra de manzana con la madre\nSabor: Súper suave\nConservación: Freezer 3 meses · refrigerador 4 días",
    images: ["/images/variants.jpg", "/images/jars.jpg"],
  },
  {
    name: "Caldo de Huesos Antiinflamatorio", slug: "caldo-de-huesos-antiinflamatorio", brand: "NutriBone", categorySlug: "caldos", price: 50, stock: 30, featured: true,
    description: "Original + cúrcuma, jengibre, ajo y pimienta negra. Conservamos la grasa natural porque la curcumina es liposoluble. Pensado para tus articulaciones y defensas. En frascos de 100 a 500 ml y packs semanal o mensual.",
    material: "Frascos 100–500 ml · packs semanal y mensual",
    specs: "Ingredientes: Huesos de res, agua, cúrcuma, jengibre, ajo, pimienta negra, sal\nSabor: Intenso\nConservación: Freezer 3 meses · refrigerador 4 días",
    images: ["/images/variants.jpg", "/images/glass-ingredients.webp"],
  },
  {
    name: "Tripack Mix", slug: "tripack-mix", brand: "NutriBone", categorySlug: "caldos", price: 600, stock: 15,
    description: "5 frascos Original + 5 White + 5 Antiinflamatorio (150 ml cada uno). La forma más fácil de probar las tres variantes y encontrar tu favorita.",
    material: "15 frascos de 150 ml (5+5+5)",
    images: ["/images/tubs.webp", "/images/variants.jpg"],
  },
  {
    name: "Pack Mensual Mix", slug: "pack-mensual-mix", brand: "NutriBone", categorySlug: "caldos", price: 1100, stock: 10,
    description: "10 Original + 10 White + 10 Antiinflamatorio (150 ml cada uno). Un mes completo de nutrición real, en una sola entrega.",
    material: "30 frascos de 150 ml (10+10+10)",
    images: ["/images/tubs.webp", "/images/jars.jpg"],
  },
  // IceCubes · Cubitos
  {
    name: "IceCubes · Cubitos de Caldo", slug: "icecubes-cubitos-de-caldo", brand: "NutriBone", categorySlug: "cubitos", price: 60, stock: 25, featured: true,
    description: "500 ml de caldo en cubitos que se descongelan rápido. Control de porciones para smoothies, sopas, arroz, guisos y comida de bebé. Disponible en Original, White y Antiinflamatorio.",
    material: "500 ml en cubitos",
    images: ["/images/icecubes.jpg"],
  },
  {
    name: "Pack Semanal + IceCubes", slug: "pack-semanal-icecubes", brand: "NutriBone", categorySlug: "cubitos", price: 320, stock: 15,
    description: "Un pack semanal del sabor que elijas (7 frascos de 150 ml) + una bolsa de IceCubes Original. Tu ritual de toda la semana, listo.",
    material: "7 frascos de 150 ml + IceCubes 500 ml",
    images: ["/images/icecubes.jpg", "/images/tubs.webp"],
  },
  // Origen · Caldo en Polvo
  {
    name: "Origen · Caldo en Polvo Instantáneo", slug: "origen-caldo-en-polvo", brand: "NutriBone", categorySlug: "origen", price: 85, stock: 20,
    description: "El mismo poder, nueva forma: caldo en polvo instantáneo. Solo agrégalo a agua caliente o úsalo como topping en comidas, ensaladas, salsas y batidos. En las tres variantes: Original, White y Antiinflamatorio.",
    material: "Polvo instantáneo · 3 variantes",
    images: ["/images/origen.jpg"],
  },
  // NutriGlow · Skincare
  {
    name: "NutriGlow Crema Hidratante Regeneradora", slug: "nutriglow-crema-hidratante", brand: "NutriGlow", categorySlug: "nutriglow", price: 140, stock: 20, featured: true,
    description: "Crema artesanal a base de tallow de res y aceite esencial de frankincense (1%). 100% natural, sin conservantes ni aditivos, no comedogénica. Para día y noche.",
    material: "30 ml",
    specs: "Ingredientes: Tallow de res, aceite esencial de frankincense (1%)\nTipo: Crema hidratante regeneradora\nUso: Día y noche · no comedogénica",
    images: ["/images/nutriglow-crema.webp"],
  },
  {
    name: "NutriGlow Bálsamo Nutrihumectante", slug: "nutriglow-balsamo-nutrihumectante", brand: "NutriGlow", categorySlug: "nutriglow", price: 95, stock: 15,
    description: "Bálsamo de tallow de res de alta calidad, aceite esencial de geranio y cera de abejas. Nutrición profunda para zonas secas.",
    material: "Bálsamo",
    images: ["/images/nutriglow-crema.webp"],
  },
  // Shots y Extras
  {
    name: "Shot Antiinflamatorio", slug: "shot-antiinflamatorio", brand: "NutriBone", categorySlug: "extras", price: 25, stock: 25,
    description: "Caldo de huesos, jengibre, cúrcuma, miel con propóleo, pimienta negra y limón. Un concentrado para sumar a tu ritual.",
    material: "Shot individual",
    images: ["/images/shot.jpg"],
  },
  {
    name: "Tallow de Res", slug: "tallow-de-res", brand: "NutriBone", categorySlug: "extras", price: 70, stock: 15,
    description: "Grasa real renderizada del caldo de huesos. Para cocinar o para tu piel: el mismo ingrediente noble de siempre.",
    material: "Grasa renderizada",
    images: ["/images/jars.jpg", "/images/glass-ingredients.webp"],
  },
];

async function main() {
  console.log("Seeding NutriBone database...");

  // Categories
  const categoryIdBySlug = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categoryIdBySlug.set(c.slug, cat.id);
  }
  console.log(`  - ${categories.length} categories`);

  // Products — single online store, one stock count per product (no branches).
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { slug: p.slug },
      // Refresh catalog copy only; price/stock/active are admin-managed and
      // must survive a re-seed (the client sets real prices in the panel).
      update: {
        name: p.name,
        description: p.description,
        material: p.material,
        specs: p.specs,
        brand: p.brand,
        categoryId,
        images: p.images,
        featured: p.featured ?? false,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: new Prisma.Decimal(p.price),
        compareAtPrice: p.compareAtPrice ? new Prisma.Decimal(p.compareAtPrice) : null,
        material: p.material,
        specs: p.specs,
        brand: p.brand,
        categoryId,
        images: p.images,
        featured: p.featured ?? false,
        stock: p.stock,
        active: true,
        sku: p.sku,
      },
    });
  }
  console.log(`  - ${products.length} products (placeholder prices)`);

  // Store settings — NutriBone, 100% digital, delivery-only inside the 4th ring.
  const settings = {
    contact: {
      email: "",
      phone: "+591 77313568",
      whatsapp: "59177313568",
      city: "Santa Cruz de la Sierra",
      hours: "Atención por WhatsApp · hecho por encargo",
    },
    social: {
      instagram: "https://www.instagram.com/nutribone.scz",
      facebook: "",
      tiktok: "https://www.tiktok.com/@nutribone",
    },
    shipping: {
      flatFee: 0,
      freeThreshold: 0,
      deliveryTime: "Pedidos con al menos 24 h de anticipación · delivery gratis dentro del 4to anillo",
    },
    announcements: [
      "El poder de sanar en cada sorbo",
      "Delivery gratis dentro del 4to anillo · Santa Cruz",
      "Pedidos con al menos 24 h de anticipación",
      "100% natural · sin conservantes ni aditivos",
      "Frascos retornables: devuélvelos y obtén descuento",
    ],
    inventory: { lowStockThreshold: 5 },
    loyalty: {
      enabled: true,
      name: "Club NutriBone",
      stampsToFree: 10,
      eligible: "all",
      eligibleSlugs: [],
      pointsPer: 1,
      pointsAmount: 10,
      pointsOnShipping: false,
      expiryDays: 0,
    },
    notifications: { orderEmail: "" },
  };

  // Create-only: never overwrite settings the store already edited in Admin.
  await prisma.setting.upsert({
    where: { key: "store" },
    update: {},
    create: { key: "store", value: settings },
  });
  console.log("  - store settings");

  // Starting rewards shop (Club NutriBone is disabled by default). Upserted by
  // slug so the owner's edits survive a re-seed; stock is create-only.
  const rewards = [
    { slug: "shot-antiinflamatorio", name: "Shot Antiinflamatorio", description: "Caldo, jengibre, cúrcuma, miel con propóleo, pimienta negra y limón.", costPoints: 150, stock: 25, order: 1 },
    { slug: "frasco-caldo-150", name: "Frasco de Caldo 150 ml", description: "Un frasco de caldo de huesos de la variante que elijas.", costPoints: 200, stock: 40, order: 2 },
    { slug: "icecubes-500", name: "IceCubes 500 ml", description: "Una bolsa de cubitos de caldo Original.", costPoints: 250, stock: 25, order: 3 },
    { slug: "nutriglow-crema", name: "NutriGlow Crema Hidratante", description: "Crema artesanal de tallow de res y frankincense (30 ml).", costPoints: 400, stock: 20, order: 4 },
  ];
  for (const r of rewards) {
    await prisma.reward.upsert({
      where: { slug: r.slug },
      update: { name: r.name, description: r.description, costPoints: r.costPoints, order: r.order },
      create: r,
    });
  }
  console.log(`  - ${rewards.length} Club NutriBone rewards`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });