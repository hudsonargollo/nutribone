"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CONTACT } from "@/lib/contact";

const PROMO_IMAGE = "/images/hero-mug.jpg";

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export function PromoOverlay() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.12 }}
      className="relative overflow-hidden bg-brand text-light"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Bold animated text block */}
          <motion.div variants={slideUp} className="text-center md:text-left">
            <motion.span
              variants={slideUp}
              className="inline-block rounded-full border border-[rgba(201,138,46,0.6)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent-soft"
            >
              El poder de sanar en cada sorbo
            </motion.span>

            <motion.h2
              variants={slideUp}
              className="mt-5 font-display text-4xl font-black leading-tight tracking-tight sm:text-6xl"
            >
              NO ES MAGIA,
              <br />
              <span className="bg-gradient-to-r from-accent-soft to-accent bg-clip-text text-transparent">
                PERO FUNCIONA
              </span>
            </motion.h2>

            <motion.p variants={slideUp} className="mt-4 text-lg text-light/80">
              Caldo de huesos artesanal con 48 horas de cocción lenta: colágeno,
              minerales y aminoácidos para tu digestión, tus articulaciones y tu piel.
              <br className="hidden sm:block" />
              100% natural · Sin conservantes · Hecho por encargo.
            </motion.p>

            <motion.div variants={slideUp} className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/shop"
                className="inline-block rounded-full bg-accent px-9 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-brand-deep shadow-[0_14px_34px_-14px_rgba(201,138,46,0.8)] transition hover:bg-accent-soft"
              >
                Ver productos
              </Link>
              <a
                href={CONTACT.whatsappUrl || "/contact"}
                {...(CONTACT.whatsappUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-block rounded-full border border-[rgba(201,138,46,0.55)] px-9 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-light transition hover:border-accent hover:text-accent-soft"
              >
                WhatsApp
              </a>
            </motion.div>
          </motion.div>

          {/* Product image with Framer Motion pulse */}
          <motion.div variants={slideUp} className="flex justify-center">
            <motion.img
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              src={PROMO_IMAGE}
              alt="Taza de caldo de huesos NutriBone — el poder de sanar en cada sorbo"
              className="max-h-[340px] w-auto rounded-2xl shadow-[0_28px_50px_-18px_rgba(0,0,0,0.65)]"
            />
          </motion.div>
        </div>
      </div>

      {/* thin accent hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,138,46,0.6)] to-transparent"
        aria-hidden="true"
      />
    </motion.section>
  );
}