// NutriBone brand marks: a steaming broth bowl (Emblem), rising steam used as a
// faint decorative watermark (SteamMark), and the letterspaced serif wordmark.

type MarkProps = {
  size?: number;
  className?: string;
  color?: string;
  accent?: string;
};

export function Emblem({
  size = 44,
  className = "",
  color = "currentColor",
  accent = "var(--color-accent)",
}: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* steam */}
      <path
        d="M24 10c-3 4 3 7 0 11M32 8c-3 4 3 7 0 11M40 10c-3 4 3 7 0 11"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* bowl */}
      <path d="M10 30h44" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      <path
        d="M13 30c0 13 8.5 22 19 22s19-9 19-22"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M25 56h14" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function SteamMark({
  size = 44,
  className = "",
  color = "currentColor",
  accent = "var(--color-accent)",
}: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 8c-5 7 5 11 0 18s5 11 0 18M32 6c-5 7 5 11 0 18s5 11 0 18M44 8c-5 7 5 11 0 18s5 11 0 18"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M14 54h36"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({
  className = "",
  sub = true,
}: {
  className?: string;
  sub?: boolean;
}) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-display text-xl font-semibold tracking-[0.3em]">NUTRIBONE</span>
      {sub && (
        <span className="mt-1.5 font-sans text-[0.55rem] font-medium uppercase tracking-[0.42em] opacity-70">
          Caldo de huesos
        </span>
      )}
    </span>
  );
}