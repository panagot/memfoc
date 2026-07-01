/** MemFOC logomark — hex storage cell + LangGraph memory nodes */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
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
        <linearGradient id="memGold" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0D078" />
          <stop offset="0.5" stopColor="#E3B341" />
          <stop offset="1" stopColor="#B8922A" />
        </linearGradient>
        <linearGradient id="memMint" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1DE9B6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#12B894" stopOpacity="0.5" />
        </linearGradient>
        <filter id="markGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer hex — storage vault */}
      <path
        d="M24 4L41.32 14v20L24 44 6.68 34V14L24 4z"
        stroke="url(#memGold)"
        strokeWidth="1.5"
        fill="rgba(227,179,65,0.06)"
      />

      {/* Memory graph edges */}
      <path
        d="M24 16 L16 28 L32 28 Z"
        stroke="url(#memMint)"
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <line x1="24" y1="16" x2="24" y2="30" stroke="url(#memMint)" strokeWidth="1" strokeOpacity="0.5" />

      {/* Graph nodes */}
      <circle cx="24" cy="16" r="3.5" fill="#1DE9B6" filter="url(#markGlow)" />
      <circle cx="16" cy="28" r="2.5" fill="#E3B341" opacity="0.9" />
      <circle cx="32" cy="28" r="2.5" fill="#E3B341" opacity="0.9" />

      {/* Central vault core */}
      <circle cx="24" cy="30" r="4" fill="url(#memGold)" opacity="0.85" />
      <circle cx="24" cy="30" r="1.5" fill="#020306" />
    </svg>
  );
}
