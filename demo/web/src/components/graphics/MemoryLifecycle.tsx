const STEPS = [

  { x: 80, label: "put()", sub: "Agent write", color: "#0090FF", ms: "<20ms" },

  { x: 240, label: "SQLite", sub: "pending", color: "#1DE9B6", ms: "indexed" },

  { x: 400, label: "FOC upload", sub: "CID assigned", color: "#4DB8FF", ms: "~120ms" },

  { x: 560, label: "synced", sub: "verified", color: "#1DE9B6", ms: "done" },

  { x: 720, label: "manifest", sub: "anchored", color: "#0090FF", ms: "on demand" },

  { x: 880, label: "recover", sub: "rebuild", color: "#4DB8FF", ms: "disaster" },

] as const;



const R = 32;



export function MemoryLifecycle() {

  return (

    <svg

      viewBox="0 0 960 248"

      preserveAspectRatio="xMidYMid meet"

      className="block h-auto w-full min-h-[200px]"

      aria-label="Memory lifecycle: put through SQLite, FOC sync, manifest anchor, and recovery"

    >

      <defs>

        <linearGradient id="lifeBg" x1="0%" y1="0%" x2="100%" y2="0%">

          <stop offset="0%" stopColor="#0090FF" stopOpacity="0.04" />

          <stop offset="50%" stopColor="#1DE9B6" stopOpacity="0.03" />

          <stop offset="100%" stopColor="#4DB8FF" stopOpacity="0.04" />

        </linearGradient>

        <marker id="lifeArrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">

          <path d="M0,0 L10,5 L0,10 Z" fill="#94A3B8" />

        </marker>

      </defs>



      <rect width="960" height="248" rx="20" fill="#0B1020" stroke="rgba(255,255,255,0.06)" />

      <rect width="960" height="248" rx="20" fill="url(#lifeBg)" />



      {/* Baseline track */}

      <line x1="48" y1="104" x2="912" y2="104" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />



      {/* Connectors — left → right */}

      {STEPS.slice(0, -1).map((step, i) => {

        const next = STEPS[i + 1];

        return (

          <line

            key={`${step.label}-line`}

            x1={step.x + R + 4}

            y1={104}

            x2={next.x - R - 10}

            y2={104}

            stroke="#94A3B8"

            strokeWidth="2"

            strokeOpacity="0.45"

            markerEnd="url(#lifeArrow)"

          />

        );

      })}



      {/* Nodes */}

      {STEPS.map((s, i) => (

        <g key={s.label}>

          <circle cx={s.x} cy={104} r={R + 4} fill="none" stroke={s.color} strokeWidth="1" strokeOpacity="0.2" />

          <circle cx={s.x} cy={104} r={R} fill="#111827" stroke={s.color} strokeWidth="2" />

          <circle cx={s.x} cy={104} r={R - 8} fill="#151D2E" stroke={s.color} strokeWidth="0.5" strokeOpacity="0.35" />

          <text

            x={s.x}

            y={109}

            textAnchor="middle"

            fill={s.color}

            fontSize="12"

            fontWeight="700"

            fontFamily="JetBrains Mono, monospace"

          >

            {String(i + 1).padStart(2, "0")}

          </text>

          <text

            x={s.x}

            y={168}

            textAnchor="middle"

            fill="#F1F5F9"

            fontSize="13"

            fontWeight="600"

            fontFamily="Syne, sans-serif"

          >

            {s.label}

          </text>

          <text x={s.x} y={188} textAnchor="middle" fill="#94A3B8" fontSize="10">

            {s.sub}

          </text>

          <text

            x={s.x}

            y={210}

            textAnchor="middle"

            fill={s.color}

            fontSize="9"

            fontFamily="JetBrains Mono, monospace"

            opacity="0.85"

          >

            {s.ms}

          </text>

        </g>

      ))}



      <text x="480" y="236" textAnchor="middle" fill="#94A3B8" fontSize="9" letterSpacing="0.08em">

        WRITE PATH → ASYNC DURABILITY → PERIODIC ANCHOR → DISASTER RECOVERY

      </text>

    </svg>

  );

}

