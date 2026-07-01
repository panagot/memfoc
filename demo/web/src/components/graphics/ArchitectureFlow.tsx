export function ArchitectureFlow() {
  return (
    <svg
      viewBox="0 0 960 480"
      className="h-auto w-full"
      role="img"
      aria-label="MemFOC architecture diagram"
    >
      <defs>
        <linearGradient id="archBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3B341" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#1DE9B6" stopOpacity="0.03" />
        </linearGradient>
        <marker id="arrGold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#E3B341" />
        </marker>
        <marker id="arrMint" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1DE9B6" />
        </marker>
      </defs>
      <rect width="960" height="480" fill="url(#archBg)" rx="20" />

      {/* Layer labels */}
      <text x="24" y="28" fill="#7A8494" fontSize="10" fontWeight="600" letterSpacing="0.15em">
        HOT PATH
      </text>
      <text x="24" y="240" fill="#7A8494" fontSize="10" fontWeight="600" letterSpacing="0.15em">
        COLD PATH (ASYNC)
      </text>

      {/* LangGraph */}
      <g transform="translate(40, 48)">
        <rect width="200" height="110" rx="14" fill="#0E1219" stroke="#E3B341" strokeWidth="1.5" />
        <text x="100" y="40" textAnchor="middle" fill="#E8EDF5" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">
          LangGraph Agent
        </text>
        <text x="100" y="64" textAnchor="middle" fill="#7A8494" fontSize="11">
          runtime.store.put / get / search
        </text>
        <text x="100" y="88" textAnchor="middle" fill="#E3B341" fontSize="10" fontFamily="JetBrains Mono, monospace">
          BaseStore API
        </text>
      </g>

      <path d="M 250 103 L 310 103" stroke="#E3B341" strokeWidth="2" markerEnd="url(#arrGold)" />
      <text x="280" y="92" textAnchor="middle" fill="#1DE9B6" fontSize="10" fontFamily="JetBrains Mono, monospace">
        &lt;20ms
      </text>

      {/* FilecoinStore */}
      <g transform="translate(320, 38)">
        <rect width="240" height="130" rx="14" fill="#0E1219" stroke="#1DE9B6" strokeWidth="1.5" />
        <text x="120" y="38" textAnchor="middle" fill="#E8EDF5" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">
          FilecoinStore
        </text>
        <text x="120" y="60" textAnchor="middle" fill="#7A8494" fontSize="11">
          abatch · aput · aget · asearch
        </text>
        <rect x="24" y="78" width="88" height="32" rx="8" fill="#141A24" stroke="rgba(29,233,182,0.35)" />
        <text x="68" y="98" textAnchor="middle" fill="#1DE9B6" fontSize="10" fontWeight="600">
          SQLite Index
        </text>
        <rect x="128" y="78" width="88" height="32" rx="8" fill="#141A24" stroke="rgba(227,179,65,0.35)" />
        <text x="172" y="98" textAnchor="middle" fill="#E3B341" fontSize="10" fontWeight="600">
          Sync Worker
        </text>
      </g>

      {/* Async arrow down */}
      <path d="M 440 175 L 440 230" stroke="#1DE9B6" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrMint)" />
      <text x="458" y="208" fill="#7A8494" fontSize="10">
        async · non-blocking
      </text>

      {/* FOC */}
      <g transform="translate(300, 250)">
        <rect width="280" height="100" rx="14" fill="#0E1219" stroke="#7AB8FF" strokeWidth="1.5" />
        <text x="140" y="38" textAnchor="middle" fill="#E8EDF5" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">
          Filecoin Onchain Cloud
        </text>
        <text x="140" y="62" textAnchor="middle" fill="#7A8494" fontSize="11">
          Synapse SDK · PDP proofs · USDFC payments
        </text>
        <text x="140" y="84" textAnchor="middle" fill="#7AB8FF" fontSize="10" fontFamily="JetBrains Mono, monospace">
          content-addressed blobs · bafkreih…
        </text>
      </g>

      {/* FVM Manifest */}
      <g transform="translate(640, 48)">
        <rect width="280" height="110" rx="14" fill="#0E1219" stroke="#F0D078" strokeWidth="1.5" />
        <text x="140" y="40" textAnchor="middle" fill="#E8EDF5" fontSize="14" fontWeight="600" fontFamily="Syne, sans-serif">
          FVM Manifest Contract
        </text>
        <text x="140" y="64" textAnchor="middle" fill="#7A8494" fontSize="11">
          SnapshotCommitted(manifestHash, manifestCID)
        </text>
        <text x="140" y="88" textAnchor="middle" fill="#F0D078" fontSize="10" fontFamily="JetBrains Mono, monospace">
          periodic · one tx per snapshot
        </text>
      </g>

      <path d="M 580 300 L 720 158" stroke="#F0D078" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />

      {/* Comparison strip */}
      <g transform="translate(40, 380)">
        <rect width="880" height="80" rx="14" fill="#080B10" stroke="rgba(255,255,255,0.06)" />
        <text x="24" y="30" fill="#7A8494" fontSize="10" fontWeight="600" letterSpacing="0.12em">
          VS POSTGRESSTORE
        </text>
        <text x="24" y="52" fill="#E8EDF5" fontSize="12">
          Same BaseStore API · immediate local reads · eventual FOC durability · manifest proofs
        </text>
        <text x="24" y="70" fill="#E3B341" fontSize="11">
          + content-addressed CIDs · cross-vendor portability · independent verification
        </text>
      </g>
    </svg>
  );
}
