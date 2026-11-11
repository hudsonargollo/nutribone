"use client";

import { useEffect, useState } from "react";

const IMAGES = [
  { src: "/images/founder.jpg", alt: "Laura Nicole Cuellar, fundadora de NutriBone" },
  {
    src: "/images/founder-jars.webp",
    alt: "Laura Nicole Cuellar con un frasco de caldo de huesos NutriBone",
  },
  {
    src: "/images/founder-antiinflamatorio.webp",
    alt: "Laura Nicole Cuellar con un frasco de caldo antiinflamatorio NutriBone",
  },
];

const INTERVAL = 4800;

export function FounderSlideshow() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % IMAGES.length), INTERVAL);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <>
      {IMAGES.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          aria-hidden={i !== index}
          loading={i === 0 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </>
  );
}