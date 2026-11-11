import type { CategoryView, ProductView } from "./types";

// Fallback catalog used until a real PostgreSQL database is connected.
// Mirrors prisma/seed.ts so the UI looks identical before and after DB hookup.
// Prices are 0 = "Precio por confirmar": the client loads real prices in Admin.

export const sampleCategories: CategoryView[] = [
  { id: "c-caldos", name: "Caldos de Huesos", slug: "caldos", description: "Original, White y Antiinflamatorio. 48 horas de cocción lenta." },
  { id: "c-cubitos", name: "IceCubes · Cubitos", slug: "cubitos", description: "Caldo en cubitos que se descongelan rápido. Porciones exactas." },
  { id: "c-origen", name: "Origen · Caldo en Polvo", slug: "origen", description: "Caldo en polvo instantáneo. El mismo poder, nueva forma." },
  { id: "c-nutriglow", name: "NutriGlow · Skincare", slug: "nutriglow", description: "Cosmética artesanal a base de tallow de res. 100% natural." },
  { id: "c-extras", name: "Shots y Extras", slug: "extras", description: "Shot antiinflamatorio, tallow de res y complementos." },
];

export const sampleProducts: ProductView[] = [
  {
    id: "p-caldo-original",
    name: "Caldo de Huesos Original",
    slug: "caldo-de-huesos-original",
    description:
      "El clásico que no pasa de moda: puro sabor y nutrientes esenciales sin aditivos. Huesos de res horneados con verduras y 48 horas de cocción lenta. Disponible en frascos de 100 a 1000 ml y en packs semanal (7) o mensual (30).",
    price: 0,
    compareAtPrice: null,
    material: "Frascos 100–1000 ml · packs semanal y mensual",
    specs:
      "Ingredientes: Huesos de res, agua purificada, zanahoria, apio, cebolla, brócoli, vinagre de sidra de manzana con la madre, sal rosada\nCocción: 48 horas a fuego lento\nConservación: Freezer 3 meses · refrigerador 4 días",
    stock: 30,
    images: ["/images/variants.jpg", "/images/hero-mug.jpg", "/images/jars.jpg"],
    featured: true,
    category: { name: "Caldos de Huesos", slug: "caldos" },
  },
  {
    id: "p-caldo-white",
    name: "Caldo de Huesos White",
    slug: "caldo-de-huesos-white",
    description:
      "Sin verduras ni condimentos, la opción más ligera en sabor. Huesos blanqueados y 48 horas de cocción lenta. Ideal para estómagos sensibles. En frascos de 150 y 500 ml y packs semanal o mensual.",
    price: 0,
    compareAtPrice: null,
    material: "Frascos 150–500 ml · packs semanal y mensual",
    specs:
      "Ingredientes: Huesos de res blanqueados, agua purificada, vinagre de sidra de manzana con la madre\nSabor: Súper suave\nConservación: Freezer 3 meses · refrigerador 4 días",
    stock: 30,
    images: ["/images/variants.jpg", "/images/jars.jpg"],
    featured: false,
    category: { name: "Caldos de Huesos", slug: "caldos" },
  },
  {
    id: "p-caldo-anti",
    name: "Caldo de Huesos Antiinflamatorio",
    slug: "caldo-de-huesos-antiinflamatorio",
    description:
      "Original + cúrcuma, jengibre, ajo y pimienta negra. Conservamos la grasa natural porque la curcumina es liposoluble. Pensado para tus articulaciones y defensas. En frascos de 100 a 500 ml y packs semanal o mensual.",
    price: 0,
    compareAtPrice: null,
    material: "Frascos 100–500 ml · packs semanal y mensual",
    specs:
      "Ingredientes: Huesos de res, agua, cúrcuma, jengibre, ajo, pimienta negra, sal\nSabor: Intenso\nConservación: Freezer 3 meses · refrigerador 4 días",
    stock: 30,
    images: ["/images/variants.jpg", "/images/glass-ingredients.webp"],
    featured: true,
    category: { name: "Caldos de Huesos", slug: "caldos" },
  },
  {
    id: "p-tripack-mix",
    name: "Tripack Mix",
    slug: "tripack-mix",
    description:
      "5 frascos Original + 5 White + 5 Antiinflamatorio (150 ml cada uno). La forma más fácil de probar las tres variantes y encontrar tu favorita.",
    price: 0,
    compareAtPrice: null,
    material: "15 frascos de 150 ml (5+5+5)",
    stock: 15,
    images: ["/images/tubs.webp", "/images/variants.jpg"],
    featured: false,
    category: { name: "Caldos de Huesos", slug: "caldos" },
  },
  {
    id: "p-mensual-mix",
    name: "Pack Mensual Mix",
    slug: "pack-mensual-mix",
    description:
      "10 Original + 10 White + 10 Antiinflamatorio (150 ml cada uno). Un mes completo de nutrición real, en una sola entrega.",
    price: 0,
    compareAtPrice: null,
    material: "30 frascos de 150 ml (10+10+10)",
    stock: 10,
    images: ["/images/tubs.webp", "/images/jars.jpg"],
    featured: false,
    category: { name: "Caldos de Huesos", slug: "caldos" },
  },
  {
    id: "p-icecubes",
    name: "IceCubes · Cubitos de Caldo",
    slug: "icecubes-cubitos-de-caldo",
    description:
      "500 ml de caldo en cubitos que se descongelan rápido. Control de porciones para smoothies, sopas, arroz, guisos y comida de bebé. Disponible en Original, White y Antiinflamatorio.",
    price: 0,
    compareAtPrice: null,
    material: "500 ml en cubitos",
    stock: 25,
    images: ["/images/icecubes.jpg"],
    featured: true,
    category: { name: "IceCubes · Cubitos", slug: "cubitos" },
  },
  {
    id: "p-semanal-icecubes",
    name: "Pack Semanal + IceCubes",
    slug: "pack-semanal-icecubes",
    description:
      "Un pack semanal del sabor que elijas (7 frascos de 150 ml) + una bolsa de IceCubes Original. Tu ritual de toda la semana, listo.",
    price: 0,
    compareAtPrice: null,
    material: "7 frascos de 150 ml + IceCubes 500 ml",
    stock: 15,
    images: ["/images/icecubes.jpg", "/images/tubs.webp"],
    featured: false,
    category: { name: "IceCubes · Cubitos", slug: "cubitos" },
  },
  {
    id: "p-origen",
    name: "Origen · Caldo en Polvo Instantáneo",
    slug: "origen-caldo-en-polvo",
    description:
      "El mismo poder, nueva forma: caldo en polvo instantáneo. Solo agrégalo a agua caliente o úsalo como topping en comidas, ensaladas, salsas y batidos. En las tres variantes: Original, White y Antiinflamatorio.",
    price: 0,
    compareAtPrice: null,
    material: "Polvo instantáneo · 3 variantes",
    stock: 20,
    images: ["/images/origen.jpg"],
    featured: false,
    category: { name: "Origen · Caldo en Polvo", slug: "origen" },
  },
  {
    id: "p-nutriglow-crema",
    name: "NutriGlow Crema Hidratante Regeneradora",
    slug: "nutriglow-crema-hidratante",
    description:
      "Crema artesanal a base de tallow de res y aceite esencial de frankincense (1%). 100% natural, sin conservantes ni aditivos, no comedogénica. Para día y noche.",
    price: 0,
    compareAtPrice: null,
    material: "30 ml",
    specs:
      "Ingredientes: Tallow de res, aceite esencial de frankincense (1%)\nTipo: Crema hidratante regeneradora\nUso: Día y noche · no comedogénica",
    stock: 20,
    images: ["/images/nutriglow-crema.webp"],
    featured: true,
    category: { name: "NutriGlow · Skincare", slug: "nutriglow" },
  },
  {
    id: "p-nutriglow-balsamo",
    name: "NutriGlow Bálsamo Nutrihumectante",
    slug: "nutriglow-balsamo-nutrihumectante",
    description:
      "Bálsamo de tallow de res de alta calidad, aceite esencial de geranio y cera de abejas. Nutrición profunda para zonas secas.",
    price: 0,
    compareAtPrice: null,
    material: "Bálsamo",
    stock: 15,
    images: ["/images/nutriglow-crema.webp"],
    featured: false,
    category: { name: "NutriGlow · Skincare", slug: "nutriglow" },
  },
  {
    id: "p-shot",
    name: "Shot Antiinflamatorio",
    slug: "shot-antiinflamatorio",
    description:
      "Caldo de huesos, jengibre, cúrcuma, miel con propóleo, pimienta negra y limón. Un concentrado para sumar a tu ritual.",
    price: 0,
    compareAtPrice: null,
    material: "Shot individual",
    stock: 25,
    images: ["/images/shot.jpg"],
    featured: false,
    category: { name: "Shots y Extras", slug: "extras" },
  },
  {
    id: "p-tallow",
    name: "Tallow de Res",
    slug: "tallow-de-res",
    description:
      "Grasa real renderizada del caldo de huesos. Para cocinar o para tu piel: el mismo ingrediente noble de siempre.",
    price: 0,
    compareAtPrice: null,
    material: "Grasa renderizada",
    stock: 15,
    images: ["/images/jars.jpg", "/images/glass-ingredients.webp"],
    featured: false,
    category: { name: "Shots y Extras", slug: "extras" },
  },
];