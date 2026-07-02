import { useId } from "react";

/** MemFOC logomark — Filecoin hex + graph nodes */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const blueId = `filBlue-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={blueId} x1="6" y1="2" x2="42" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4DB8FF" />
          <stop offset="1" stopColor="#0090FF" />
        </linearGradient>
      </defs>

      <path
        d="M24 3.5 41.8 13.75V34.25 24 44.5 6.2 34.25V13.75L24 3.5Z"
        stroke={`url(#${blueId})`}
        strokeWidth="1.5"
        fill="rgba(0,144,255,0.06)"
      />

      <circle cx="24" cy="14" r="2.5" fill="#0090FF" />
      <circle cx="17" cy="24" r="2" fill="#0090FF" />
      <circle cx="31" cy="24" r="2" fill="#0090FF" />
      <line x1="24" y1="16.5" x2="18.5" y2="22.5" stroke="#0090FF" strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="16.5" x2="29.5" y2="22.5" stroke="#0090FF" strokeWidth="1" opacity="0.6" />

      <rect x="18" y="28" width="12" height="8" rx="2" fill="#18181B" stroke="rgba(0,144,255,0.35)" />
      <line x1="20.5" y1="31" x2="27.5" y2="31" stroke="#22C997" strokeWidth="0.8" opacity="0.7" />
      <line x1="20.5" y1="33.5" x2="25.5" y2="33.5" stroke="#22C997" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}
