import type { Metadata } from "next";
import { Emblem } from "@/components/brand/emblem";

export const metadata: Metadata = {
  alternates: { canonical: "/care" },
  title: "Ingredientes y cuidado",
  description: "Ingredientes, conservación y cómo disfrutar tu caldo de huesos NutriBone en su punto.",
};

const TIPS = [
  {
    title: "Conserva en frío",
    body: "En freezer hasta unos 3 meses o en refrigerador unos 4 días. Descongela en refrigerador y consume pronto; no recongeles lo que ya descongelaste.",
  },
  {
    title: "La prueba de gelatina",
    body: "Un buen caldo de huesos cuaja frío como gelatina: es señal de su colágeno. Al calentarlo vuelve a líquido. Eso es normal y deseable.",
  },
  {
    title: "Ingredientes a la vista",
    body: "Cada producto detalla sus ingredientes. Original lleva verduras; White es sin verduras ni condimentos; Antiinflamatoria suma cúrcuma y jengibre. Si tienes dudas, pregúntanos antes de pedir.",
  },
  {
    title: "Alergias y restricciones",
    body: "Nuestro caldo es de huesos de res y verduras, 100% natural y sin conservantes. NutriGlow es skincare de tallow de uso tópico. Avísanos cualquier alergia o restricción al confirmar tu pedido.",
  },
  {
    title: "Cómo servirlo",
    body: "Calienta a fuego suave, sin hervor fuerte, para cuidar sus nutrientes. Tómalo solo en tu ritual de la mañana o úsalo como base de sopas, arroces y guisos.",
  },
  {
    title: "Frascos retornables",
    body: "Devuelve tus frascos limpios y obtén descuento en tu próximo pedido. Si algo llegó en mal estado, escríbenos por WhatsApp con tu número de pedido y lo resolvemos.",
  },
];

export default function CarePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="text-center">
        <Emblem size={40} className="mx-auto text-brand" accent="var(--color-accent)" />
        <span className="eyebrow mt-3 block">Ayuda</span>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
          Ingredientes y cuidado
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Todo lo que necesitas saber para conservar y disfrutar tu caldo de huesos NutriBone en su punto.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {TIPS.map((t) => (
          <div key={t.title} className="rounded-xl border border-[var(--line)] bg-cream-soft p-6">
            <h2 className="font-display text-xl font-bold text-ink">{t.title}</h2>
            <p className="mt-2 text-sm text-ink/80">{t.body}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted">
        El caldo de huesos aporta colágeno, minerales y aminoácidos como apoyo general al
        bienestar; no es un tratamiento médico. Ante embarazo, lactancia, alergias o
        cualquier condición de salud, consulta a un profesional de la salud.
      </p>
    </div>
  );
}