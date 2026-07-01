export function MemoryLifecycle() {
  const steps = [
    { x: 80, label: "put()", sub: "Agent write", color: "#E3B341", ms: "<20ms" },
    { x: 240, label: "SQLite", sub: "pending", color: "#1DE9B6", ms: "indexed" },
    { x: 400, label: "FOC upload", sub: "CID assigned", color: "#7AB8FF", ms: "~120ms" },
    { x: 560, label: "synced", sub: "verified", color: "#1DE9B6", ms: "done" },
    { x: 720, label: "manifest", sub: "anchored", color: "#F0D078", ms: "on demand" },
    { x: 880, label: "recover", sub: "rebuild", color: "#E3B341", ms: "disaster" },
  ];

  return (
    <svg viewBox="0 0 960 220" className="h-auto w-full" aria-label="Memory lifecycle">
      <rect width="960" height="220" rx="20" fill="#080B10" stroke="rgba(255,255,255,0.06)" />
      <line x1="50" y1="100" x2="910" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      {steps.map((s, i) => (
        <g key={s.label}>
          <circle cx={s.x} cy="100" r="32" fill="#0E1219" stroke={s.color} strokeWidth="2" />
          <circle cx={s.x} cy="100" r="24" fill="#141A24" stroke={s.color} strokeWidth="0.5" strokeOpacity="0.4" />
          <text x={s.x} y="105" textAnchor="middle" fill={s.color} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {String(i + 1).padStart(2, "0")}
          </text>
          <text x={s.x} y="158" textAnchor="middle" fill="#E8EDF5" fontSize="13" fontWeight="600" fontFamily="Syne, sans-serif">
            {s.label}
          </text>
          <text x={s.x} y="178" textAnchor="middle" fill="#7A8494" fontSize="10">
            {s.sub}
          </text>
          <text x={s.x} y="198" textAnchor="middle" fill={s.color} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.8">
            {s.ms}
          </text>
          {i < steps.length - 1 && (
            <polygon
              points={`${s.x + 38},100 ${s.x + 52},93 ${s.x + 52},107`}
              fill={s.color}
              opacity="0.5"
            />
          )}
        </g>
      ))}
    </svg>
  );
}
