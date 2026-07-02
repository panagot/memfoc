/** Hero — compact layout; FOC hex fully inside viewBox with bottom padding */

export function HeroIllustration() {

  return (

    <svg

      viewBox="0 0 480 372"

      preserveAspectRatio="xMidYMid meet"

      className="block h-auto w-full max-h-[372px]"

      role="img"

      aria-label="MemFOC: LangGraph agent to FilecoinStore to Filecoin Onchain Cloud"

    >

      <defs>

        <linearGradient id="hFilBlue" x1="0" y1="0" x2="1" y2="1">

          <stop offset="0%" stopColor="#4DB8FF" />

          <stop offset="100%" stopColor="#0090FF" />

        </linearGradient>

        <pattern id="hGrid" width="18" height="18" patternUnits="userSpaceOnUse">

          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="rgba(0,144,255,0.06)" strokeWidth="0.5" />

        </pattern>

        <marker id="hArrBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">

          <path d="M0,0 L8,4 L0,8 Z" fill="#0090FF" />

        </marker>

        <marker id="hArrMint" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">

          <path d="M0,0 L8,4 L0,8 Z" fill="#1DE9B6" />

        </marker>

      </defs>



      <rect width="480" height="372" fill="#0B1020" rx="16" />

      <rect width="480" height="372" fill="url(#hGrid)" rx="16" />



      {/* Row 1: Agent + Store + FVM */}

      <g transform="translate(16, 16)">

        <rect width="130" height="84" rx="12" fill="#111827" stroke="rgba(0,144,255,0.35)" strokeWidth="1.2" />

        <text x="65" y="26" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="600">

          LangGraph Agent

        </text>

        <text x="65" y="42" textAnchor="middle" fill="#94A3B8" fontSize="8">

          store.put / get

        </text>

        {[28, 65, 102].map((x) => (

          <circle key={x} cx={x} cy="58" r="5" fill="#111827" stroke="#0090FF" strokeWidth="1" />

        ))}

        <rect x="14" y="66" width="102" height="12" rx="3" fill="#0B1020" />

        <text x="65" y="75" textAnchor="middle" fill="#1DE9B6" fontSize="7" fontFamily="JetBrains Mono, monospace">

          BaseStore

        </text>

      </g>



      <line x1="148" y1="58" x2="168" y2="58" stroke="#0090FF" strokeWidth="1.8" markerEnd="url(#hArrBlue)" />

      <text x="158" y="50" textAnchor="middle" fill="#1DE9B6" fontSize="8" fontFamily="JetBrains Mono, monospace">

        &lt;20ms

      </text>



      <g transform="translate(172, 16)">

        <rect width="156" height="84" rx="12" fill="#111827" stroke="#1DE9B6" strokeWidth="1.3" />

        <text x="78" y="24" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="600">

          FilecoinStore

        </text>

        <rect x="14" y="36" width="58" height="24" rx="6" fill="#0B1020" stroke="rgba(29,233,182,0.35)" />

        <text x="43" y="51" textAnchor="middle" fill="#1DE9B6" fontSize="8" fontWeight="600">

          SQLite

        </text>

        <rect x="84" y="36" width="58" height="24" rx="6" fill="#0B1020" stroke="rgba(0,144,255,0.35)" />

        <text x="113" y="51" textAnchor="middle" fill="#0090FF" fontSize="8" fontWeight="600">

          Worker

        </text>

        <text x="78" y="74" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="JetBrains Mono, monospace">

          abatch · put · get · search

        </text>

      </g>



      {/* Store → FVM (periodic anchor) */}

      <path

        d="M 328 100 C 348 100 360 92 372 88"

        fill="none"

        stroke="#0090FF"

        strokeWidth="1.2"

        strokeDasharray="4 3"

        markerEnd="url(#hArrBlue)"

        opacity="0.75"

      />



      <g transform="translate(344, 24)">

        <rect width="120" height="68" rx="10" fill="#111827" stroke="rgba(0,144,255,0.3)" strokeWidth="1" />

        <text x="60" y="26" textAnchor="middle" fill="#0090FF" fontSize="10" fontWeight="600">

          FVM Manifest

        </text>

        <text x="60" y="42" textAnchor="middle" fill="#94A3B8" fontSize="8">

          periodic anchor

        </text>

        <text x="60" y="56" textAnchor="middle" fill="#64748B" fontSize="7">

          not per-write

        </text>

      </g>



      {/* Store → FOC (async sync, one-way) */}

      <path

        d="M 250 100 C 250 118 240 132 228 148"

        fill="none"

        stroke="#0090FF"

        strokeWidth="1.4"

        strokeDasharray="5 3"

        markerEnd="url(#hArrBlue)"

        opacity="0.7"

      />

      <text x="262" y="128" fill="#64748B" fontSize="8">

        async sync

      </text>



      {/* FOC vault — bottom fully inside frame (y=148 + hex height 176 = 324, +48 padding) */}

      <g transform="translate(72, 148)">

        <path

          d="M168 10 L296 58 L296 138 L168 186 L40 138 L40 58 Z"

          fill="rgba(0,144,255,0.06)"

          stroke="url(#hFilBlue)"

          strokeWidth="1.5"

        />

        <text x="168" y="78" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">

          Filecoin Onchain Cloud

        </text>

        <text x="168" y="98" textAnchor="middle" fill="#94A3B8" fontSize="9">

          Synapse · PDP · USDFC

        </text>

        <text x="168" y="118" textAnchor="middle" fill="#0090FF" fontSize="8" fontFamily="JetBrains Mono, monospace">

          bafkreih…

        </text>

        {[

          [68, 48],

          [268, 58],

          [240, 152],

          [52, 142],

        ].map(([cx, cy], i) => (

          <g key={i}>

            <rect x={cx - 22} y={cy - 8} width="44" height="16" rx="3" fill="#0B1020" stroke="rgba(0,144,255,0.25)" />

            <text x={cx} y={cy + 4} textAnchor="middle" fill="#0090FF" fontSize="6.5" fontFamily="JetBrains Mono, monospace">

              CID-{i + 1}

            </text>

          </g>

        ))}

      </g>

    </svg>

  );

}

