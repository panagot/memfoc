/** Hero scene — isometric memory graph flowing into Filecoin vault */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 420"
      className="h-full w-full"
      role="img"
      aria-label="MemFOC: agent memory flowing to Filecoin storage"
    >
      <defs>
        <linearGradient id="hGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D078" />
          <stop offset="100%" stopColor="#E3B341" />
        </linearGradient>
        <linearGradient id="hMint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1DE9B6" />
          <stop offset="100%" stopColor="#12B894" stopOpacity="0.4" />
        </linearGradient>
        <filter id="hGlow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="hGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="520" height="420" fill="#080B10" rx="24" />
      <rect width="520" height="420" fill="url(#hGrid)" rx="24" />

      {/* LangGraph panel */}
      <g transform="translate(32, 48)">
        <rect width="180" height="130" rx="16" fill="#0E1219" stroke="rgba(227,179,65,0.35)" strokeWidth="1.2" />
        <text x="90" y="32" textAnchor="middle" fill="#E8EDF5" fontSize="13" fontWeight="600" fontFamily="Syne, sans-serif">
          LangGraph Agent
        </text>
        <text x="90" y="52" textAnchor="middle" fill="#7A8494" fontSize="10">
          runtime.store.put / get
        </text>
        {/* Mini graph nodes */}
        {[40, 90, 140].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={88} r="8" fill="#141A24" stroke="#E3B341" strokeWidth="1" opacity={0.7 + i * 0.1} />
            <circle cx={x} cy={88} r="3" fill="#E3B341" />
          </g>
        ))}
        <line x1="48" y1="88" x2="132" y2="88" stroke="#E3B341" strokeWidth="0.8" opacity="0.4" />
        <rect x="20" y="108" width="140" height="14" rx="4" fill="#141A24" />
        <text x="90" y="118" textAnchor="middle" fill="#1DE9B6" fontSize="8" fontFamily="JetBrains Mono, monospace">
          BaseStore API
        </text>
      </g>

      {/* Flow arrows */}
      <path
        d="M 220 115 Q 280 115 300 180"
        fill="none"
        stroke="url(#hMint)"
        strokeWidth="2"
        strokeDasharray="6 4"
        className="animate-flow-dash"
        opacity="0.7"
      />
      <text x="248" y="108" fill="#1DE9B6" fontSize="9" fontFamily="JetBrains Mono, monospace">
        &lt;20ms
      </text>

      {/* FilecoinStore core */}
      <g transform="translate(280, 140)" filter="url(#hGlow)">
        <rect width="200" height="150" rx="18" fill="#0E1219" stroke="#1DE9B6" strokeWidth="1.5" />
        <text x="100" y="36" textAnchor="middle" fill="#E8EDF5" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">
          FilecoinStore
        </text>
        <rect x="20" y="52" width="75" height="36" rx="8" fill="#141A24" stroke="rgba(29,233,182,0.3)" />
        <text x="57" y="74" textAnchor="middle" fill="#1DE9B6" fontSize="10" fontWeight="600">
          SQLite
        </text>
        <rect x="105" y="52" width="75" height="36" rx="8" fill="#141A24" stroke="rgba(227,179,65,0.3)" />
        <text x="142" y="74" textAnchor="middle" fill="#E3B341" fontSize="10" fontWeight="600">
          Worker
        </text>
        <rect x="20" y="100" width="160" height="32" rx="6" fill="#141A24" />
        <text x="100" y="120" textAnchor="middle" fill="#7A8494" fontSize="9" fontFamily="JetBrains Mono, monospace">
          abatch · aput · aget · asearch
        </text>
      </g>

      {/* FOC vault */}
      <g transform="translate(120, 260)">
        <path
          d="M160 20 L280 80 L280 180 L160 240 L40 180 L40 80 Z"
          fill="rgba(227,179,65,0.05)"
          stroke="url(#hGold)"
          strokeWidth="1.5"
        />
        <text x="160" y="110" textAnchor="middle" fill="#E8EDF5" fontSize="13" fontWeight="600" fontFamily="Syne, sans-serif">
          Filecoin Onchain Cloud
        </text>
        <text x="160" y="132" textAnchor="middle" fill="#7A8494" fontSize="10">
          Synapse · PDP · USDFC
        </text>
        <text x="160" y="158" textAnchor="middle" fill="#E3B341" fontSize="9" fontFamily="JetBrains Mono, monospace">
          bafkreih…
        </text>
        {/* Floating CIDs */}
        {[
          [80, 70],
          [240, 90],
          [200, 200],
          [60, 190],
        ].map(([cx, cy], i) => (
          <g key={i} className="animate-float-slow" style={{ animationDelay: `${i * 0.5}s` }}>
            <rect x={cx - 28} y={cy - 10} width="56" height="20" rx="4" fill="#141A24" stroke="rgba(227,179,65,0.25)" />
            <text x={cx} y={cy + 4} textAnchor="middle" fill="#E3B341" fontSize="7" fontFamily="JetBrains Mono, monospace">
              CID-{i + 1}
            </text>
          </g>
        ))}
      </g>

      {/* FVM badge */}
      <g transform="translate(380, 48)">
        <rect width="108" height="72" rx="12" fill="#0E1219" stroke="rgba(240,208,120,0.4)" strokeWidth="1" />
        <text x="54" y="28" textAnchor="middle" fill="#F0D078" fontSize="11" fontWeight="600">
          FVM Manifest
        </text>
        <text x="54" y="48" textAnchor="middle" fill="#7A8494" fontSize="9">
          periodic anchor
        </text>
        <text x="54" y="62" textAnchor="middle" fill="#F0D078" fontSize="8" fontFamily="JetBrains Mono, monospace">
          not per-write
        </text>
      </g>

      <path d="M 380 200 L 420 120" stroke="#F0D078" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
    </svg>
  );
}
