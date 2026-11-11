import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/brand/emblem";
import { SplitText } from "@/components/text-reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "Nosotros",
  description: "NutriBone — caldo de huesos artesanal desde 2023, hecho por encargo en Santa Cruz de la Sierra. Nutrición real, 100% natural.",
};

const PILLARS = [
  { title: "Hecho por encargo", body: "Nada se produce en masa: preparamos tu caldo en lotes pequeños cuando confirmas el pedido." },
  { title: "Cocción lenta 48h", body: "Huesos de res y verduras a fuego lento durante 48 horas para extraer colágeno, minerales y aminoácidos." },
  { title: "100% natural", body: "Sin conservantes ni aditivos. Frascos retornables con descuento para cuidar tu ritual y el planeta." },
];

export default function AboutPage() {
  return (
    <div className="bg-cream px-5 py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[var(--line)] bg-panel">
        <div className="px-6 py-16 text-center sm:px-14">
          <Emblem size={52} className="mx-auto text-brand" accent="var(--color-accent)" />
          <span className="eyebrow mt-5 block">Nuestra historia</span>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink text-balance sm:text-5xl">
            <SplitText text="Nutrición real" />{" "}
            <span className="brand-text">desde 2023</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-ink/80">
            NutriBone nació en 2023 en Santa Cruz de la Sierra, fundado por Laura Nicole
            Cuellar con una idea clara: llevar nutrición real, hecha en casa, a la mesa
            de cada familia. El poder de sanar en cada sorbo.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-ink/80">
            Cocinamos caldo de huesos a fuego lento durante 48 horas, en lotes pequeños
            y por encargo. Sin conservantes, sin atajos. No es magia, pero funciona:
            colágeno, minerales y aminoácidos en cada sorbo. Somos un negocio 100%
            digital y entregamos a domicilio, gratis dentro del 4to anillo.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-brand-deep shadow-[0_14px_32px_-16px_rgba(201,138,46,0.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-accent-soft"
          >
            Ver productos
          </Link>
        </div>
      </div>

      <section className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="text-center">
            <h3 className="font-display text-xl font-bold text-ink">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}