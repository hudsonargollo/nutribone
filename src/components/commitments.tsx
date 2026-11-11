import { Emblem } from "./brand/emblem";

const COMMITMENTS = [
  {
    title: "Hecho por encargo",
    body: "Lotes pequeños y 48 horas de cocción lenta. Tu pedido se prepara para ti, no antes.",
    icon: <PotIcon />,
  },
  {
    title: "Delivery gratis",
    body: "Dentro del 4to anillo de Santa Cruz. Pedidos con al menos 24 h de anticipación.",
    icon: <ScooterIcon />,
  },
  {
    title: "Frascos retornables",
    body: "Devuelve tus frascos y recibe un descuento en tu próximo pedido.",
    icon: <JarIcon />,
  },
  {
    title: "Atención directa",
    body: "Hablamos contigo por WhatsApp, de persona a persona, en cada paso.",
    icon: <ChatIcon />,
  },
];

export function Commitments() {
  return (
    <section className="bg-brand py-20 text-light">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Emblem size={40} className="mx-auto text-accent-soft" />
        <span className="eyebrow mt-4 block text-accent-soft">Nuestro compromiso</span>
        <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Nutrición real, bien cuidada
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-light/75">
          NutriBone: caldo de huesos artesanal desde 2023, hecho por encargo en
          Santa Cruz de la Sierra.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 px-5 sm:grid-cols-2">
        {COMMITMENTS.map((c) => (
          <div
            key={c.title}
            className="flex items-start gap-4 rounded-2xl border border-[rgba(201,138,46,0.25)] bg-[rgba(255,255,255,0.05)] p-6 text-left transition hover:border-accent-soft/60 hover:bg-[rgba(255,255,255,0.08)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-soft">
              {c.icon}
            </span>
            <span>
              <span className="block font-display text-lg font-bold">{c.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-light/70">{c.body}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PotIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-3z" />
      <path d="M2.5 11h19" />
      <path d="M9 7c0-1.2 1-1.3 1-2.5M13.5 7c0-1.2 1-1.3 1-2.5" />
    </svg>
  );
}
function ScooterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="18.5" cy="17.5" r="2.5" />
      <path d="M8 17.5h5.5l2-5h3" />
      <path d="M14 12.5 12.8 8H10" />
      <path d="M15.5 8.5h3" />
      <path d="M6 12h3" />
    </svg>
  );
}
function JarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h8v3H8z" />
      <path d="M7 6h10l1 3v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9l1-3z" />
      <path d="M6 12h12" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h16v11H9l-5 4V5z" strokeLinejoin="round" />
      <path d="M8 10h8M8 13h5" strokeLinecap="round" />
    </svg>
  );
}