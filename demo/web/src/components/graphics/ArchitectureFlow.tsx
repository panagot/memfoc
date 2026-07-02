export function ArchitectureFlow() {

  return (

    <svg

      viewBox="0 0 960 500"

      preserveAspectRatio="xMidYMid meet"

      className="block h-auto w-full min-h-[280px]"

      role="img"

      aria-label="MemFOC architecture diagram"

    >

      <defs>

        <linearGradient id="archBg" x1="0%" y1="0%" x2="100%" y2="100%">

          <stop offset="0%" stopColor="#0090FF" stopOpacity="0.06" />

          <stop offset="100%" stopColor="#1DE9B6" stopOpacity="0.03" />

        </linearGradient>

        <marker id="arrBlue" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">

          <path d="M0,0 L10,5 L0,10 Z" fill="#0090FF" />

        </marker>

        <marker id="arrMint" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">

          <path d="M0,0 L10,5 L0,10 Z" fill="#1DE9B6" />

        </marker>

        <marker id="arrBlueLight" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">

          <path d="M0,0 L10,5 L0,10 Z" fill="#4DB8FF" />

        </marker>

      </defs>



      <rect width="960" height="500" fill="#0B1020" rx="20" stroke="rgba(255,255,255,0.06)" />

      <rect width="960" height="500" fill="url(#archBg)" rx="20" />



      {/* Zone labels */}

      <rect x="24" y="20" width="120" height="22" rx="6" fill="rgba(0,144,255,0.08)" stroke="rgba(0,144,255,0.2)" />

      <text x="84" y="35" textAnchor="middle" fill="#0090FF" fontSize="9" fontWeight="600" letterSpacing="0.12em">

        HOT PATH

      </text>

      <rect x="24" y="248" width="140" height="22" rx="6" fill="rgba(29,233,182,0.08)" stroke="rgba(29,233,182,0.2)" />

      <text x="94" y="263" textAnchor="middle" fill="#1DE9B6" fontSize="9" fontWeight="600" letterSpacing="0.12em">

        COLD PATH · ASYNC

      </text>



      {/* LangGraph */}

      <g transform="translate(40, 56)">

        <rect width="200" height="110" rx="14" fill="#111827" stroke="#0090FF" strokeWidth="1.5" />

        <text x="100" y="40" textAnchor="middle" fill="#F1F5F9" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">

          LangGraph Agent

        </text>

        <text x="100" y="64" textAnchor="middle" fill="#94A3B8" fontSize="11">

          runtime.store.put / get / search

        </text>

        <text x="100" y="88" textAnchor="middle" fill="#0090FF" fontSize="10" fontFamily="JetBrains Mono, monospace">

          BaseStore API

        </text>

      </g>



      <line x1="242" y1="111" x2="308" y2="111" stroke="#0090FF" strokeWidth="2" markerEnd="url(#arrBlue)" />

      <text x="275" y="100" textAnchor="middle" fill="#1DE9B6" fontSize="10" fontFamily="JetBrains Mono, monospace">

        &lt;20ms

      </text>



      {/* FilecoinStore */}

      <g transform="translate(318, 46)">

        <rect width="240" height="130" rx="14" fill="#111827" stroke="#1DE9B6" strokeWidth="1.5" />

        <text x="120" y="38" textAnchor="middle" fill="#F1F5F9" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">

          FilecoinStore

        </text>

        <text x="120" y="60" textAnchor="middle" fill="#94A3B8" fontSize="11">

          abatch · aput · aget · asearch

        </text>

        <rect x="24" y="78" width="88" height="32" rx="8" fill="#151D2E" stroke="rgba(29,233,182,0.35)" />

        <text x="68" y="98" textAnchor="middle" fill="#1DE9B6" fontSize="10" fontWeight="600">

          SQLite Index

        </text>

        <rect x="128" y="78" width="88" height="32" rx="8" fill="#151D2E" stroke="rgba(0,144,255,0.35)" />

        <text x="172" y="98" textAnchor="middle" fill="#0090FF" fontSize="10" fontWeight="600">

          Sync Worker

        </text>

      </g>



      {/* Down to FOC */}

      <path d="M 438 178 L 438 268" stroke="#1DE9B6" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrMint)" />

      <text x="452" y="228" fill="#94A3B8" fontSize="10">

        async · non-blocking

      </text>



      {/* FOC */}

      <g transform="translate(298, 278)">

        <rect width="280" height="100" rx="14" fill="#111827" stroke="#4DB8FF" strokeWidth="1.5" />

        <text x="140" y="38" textAnchor="middle" fill="#F1F5F9" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">

          Filecoin Onchain Cloud

        </text>

        <text x="140" y="62" textAnchor="middle" fill="#94A3B8" fontSize="11">

          Synapse SDK · PDP proofs · USDFC payments

        </text>

        <text x="140" y="84" textAnchor="middle" fill="#4DB8FF" fontSize="10" fontFamily="JetBrains Mono, monospace">

          content-addressed blobs · bafkreih…

        </text>

      </g>



      {/* FVM Manifest */}

      <g transform="translate(640, 56)">

        <rect width="280" height="110" rx="14" fill="#111827" stroke="#0090FF" strokeWidth="1.5" />

        <text x="140" y="40" textAnchor="middle" fill="#F1F5F9" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">

          FVM Manifest Contract

        </text>

        <text x="140" y="64" textAnchor="middle" fill="#94A3B8" fontSize="11">

          SnapshotCommitted(manifestHash, manifestCID)

        </text>

        <text x="140" y="88" textAnchor="middle" fill="#4DB8FF" fontSize="10" fontFamily="JetBrains Mono, monospace">

          periodic · one tx per snapshot

        </text>

      </g>



      {/* FOC → FVM flush */}

      <path

        d="M 578 328 C 640 280 680 220 720 168"

        fill="none"

        stroke="#0090FF"

        strokeWidth="1.5"

        strokeDasharray="5 4"

        markerEnd="url(#arrBlue)"

        opacity="0.7"

      />

      <text x="668" y="248" fill="#4DB8FF" fontSize="9" opacity="0.85">

        flush_manifest()

      </text>



      {/* Comparison strip */}

      <g transform="translate(40, 408)">

        <rect width="880" height="72" rx="14" fill="#111827" stroke="rgba(255,255,255,0.08)" />

        <text x="24" y="28" fill="#94A3B8" fontSize="10" fontWeight="600" letterSpacing="0.12em">

          VS POSTGRESSTORE

        </text>

        <text x="24" y="48" fill="#F1F5F9" fontSize="12">

          Same BaseStore API · immediate local reads · eventual FOC durability · manifest proofs

        </text>

        <text x="24" y="64" fill="#0090FF" fontSize="11">

          + content-addressed CIDs · cross-vendor portability · independent verification

        </text>

      </g>

    </svg>

  );

}

