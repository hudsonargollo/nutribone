"use client";

import { preload } from "react-dom";
import Link from "next/link";
import { RotatingWord, SplitText } from "./text-reveal";
import { Wordmark } from "./brand/emblem";

const HERO = "/images/hero-mug.jpg";

export function HeroSlider({ whatsappUrl }: { whatsappUrl: string | null }) {
  // The hero photo is the biggest thing above the fold — fetch it straight away.
  preload(HERO, { as: "image", fetchPriority: "high" });

  return (
    <section className="relative overflow-hidden bg-brand-deep text-light">
      {/* Slide */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO})` }}
      />
      {/* Readability overlay: deep forest on the left, clearing toward the mug */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(31,51,32,0.95) 0%, rgba(31,51,32,0.8) 40%, rgba(31,51,32,0.35) 68%, rgba(31,51,32,0.12) 100%)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-brand-deep/55 lg:hidden" />

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <Wordmark className="text-light" />
          <span className="mt-6 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" aria-hidden="true" />
            Santa Cruz de la Sierra · Desde 2023
          </span>
          <h1 className="mt-3 max-w-[19ch] font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[4rem]">
            <SplitText text="El poder de sanar" delay={80} />{" "}
            <RotatingWord
              words={["en cada sorbo", "desde adentro", "con nutrición real"]}
              className="text-accent-soft"
            />
          </h1>
          <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-light/85">
            Caldo de huesos artesanal con 48 horas de cocción lenta: colágeno,
            minerales y aminoácidos para tu digestión, tus articulaciones y tu piel.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/shop"
              className="inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-brand-deep shadow-[0_18px_40px_-16px_rgba(201,138,46,0.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-accent-soft"
            >
              Ver productos
            </Link>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-light/50 px-8 py-3.5 text-sm font-semibold text-light transition hover:border-accent-soft hover:bg-light/5 hover:text-accent-soft"
              >
                Pedir por WhatsApp
              </a>
            )}
          </div>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-light/60">
            Delivery gratis dentro del 4to anillo · Pedidos con 24 h de anticipación
          </p>
        </div>
      </div>
    </section>
  );
}