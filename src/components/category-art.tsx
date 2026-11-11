/** Line icons for shop category tiles. */

type Props = { className?: string };

function Bowl({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      {/* bowl */}
      <path d="M28 64h64c0 16-12 28-32 28S28 80 28 64z" strokeLinejoin="round" />
      <path d="M24 64h72" strokeLinecap="round" />
      {/* steam */}
      <path d="M48 48c0-5 4-5 4-10M60 48c0-5 4-5 4-10M72 48c0-5 4-5 4-10" strokeLinecap="round" opacity="0.6" />
      {/* base */}
      <path d="M48 96h24" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function Cubes({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      {/* three ice cubes */}
      <rect x="26" y="56" width="28" height="28" rx="5" strokeLinejoin="round" />
      <rect x="62" y="56" width="28" height="28" rx="5" strokeLinejoin="round" />
      <rect x="44" y="26" width="28" height="28" rx="5" strokeLinejoin="round" />
      {/* glints */}
      <path d="M33 64l6 6M69 64l6 6M51 34l6 6" strokeLinecap="round" opacity="0.6" />
      {/* melt drops */}
      <path d="M40 92v6M76 92v6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function Pouch({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      {/* stand-up pouch */}
      <path d="M40 30h40l6 62a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6l6-62z" strokeLinejoin="round" />
      {/* seal */}
      <path d="M38 30l-2-8h48l-2 8" strokeLinejoin="round" />
      <path d="M37 42h46" strokeWidth="1.5" opacity="0.55" />
      {/* steam rising from the pouch */}
      <path d="M54 60c0-4 3-4 3-8M66 62c0-4 3-4 3-8" strokeLinecap="round" opacity="0.6" />
      {/* label */}
      <path d="M46 74h28M50 82h20" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function CreamJar({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      {/* lid */}
      <rect x="34" y="34" width="52" height="14" rx="5" strokeLinejoin="round" />
      {/* jar body */}
      <path d="M38 48h44v38a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8V48z" strokeLinejoin="round" />
      {/* label */}
      <path d="M46 62h28M50 70h20" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      {/* leaf accent */}
      <path d="M88 26c0-8 6-13 14-14-1 8-6 13-14 14z" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

function Shot({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      {/* shot glass */}
      <path d="M42 40h36l-4 48a6 6 0 0 1-6 5H52a6 6 0 0 1-6-5l-4-48z" strokeLinejoin="round" />
      {/* liquid line */}
      <path d="M44 56h32" strokeWidth="1.5" opacity="0.55" />
      {/* citrus slice */}
      <circle cx="80" cy="34" r="10" />
      <path d="M80 26v16M72 34h16" strokeWidth="1.2" opacity="0.6" />
      {/* sparkle */}
      <path d="M36 26v8M32 30h8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function Fallback({ className = "" }: Props) {
  return <Bowl className={className} />;
}

const MAP: Record<string, (p: Props) => React.ReactElement> = {
  caldos: Bowl,
  cubitos: Cubes,
  origen: Pouch,
  nutriglow: CreamJar,
  extras: Shot,
};

export function CategoryArt({ slug, className }: { slug: string; className?: string }) {
  const Art = MAP[slug] ?? Fallback;
  return <Art className={className} />;
}