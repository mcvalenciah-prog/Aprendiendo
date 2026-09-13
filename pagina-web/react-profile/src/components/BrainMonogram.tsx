interface BrainMonogramProps {
  size?: number
  className?: string
}

// Brand monogram: a clean stylized brain fed by three multimodal nodes
// (artificial intelligence, psychology, human signal). Inline SVG keeps it
// crisp at every size and free of binary assets.
function BrainMonogram({ size = 56, className }: BrainMonogramProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Monograma cerebro multimodal: inteligencia artificial, psicología y ser humano"
    >
      <defs>
        <linearGradient id="bm-brain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Contenedor circular sutil */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="rgba(255, 255, 255, 0.03)"
        stroke="rgba(139, 92, 246, 0.35)"
      />

      {/* Silueta del cerebro (dos hemisferios + base) */}
      <g
        fill="none"
        stroke="url(#bm-brain)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 15 C 24 12, 14 16, 13 24 C 12 31, 14 37, 19 40 L32 46" />
        <path d="M32 15 C 40 12, 50 16, 51 24 C 52 31, 50 37, 45 40 L32 46" />
        <path d="M32 15 C 30.5 20 33.5 24 32 29 C 30.5 34 33.5 39 32 46" opacity="0.55" />

        {/* Circunvoluciones izquierdas */}
        <path d="M18 19 C 20 22 23 22 25 19" />
        <path d="M16 26 C 19 29 23 29 26 26" />
        <path d="M17 34 C 20 37 25 37 28 34" />

        {/* Circunvoluciones derechas */}
        <path d="M46 19 C 44 22 41 22 39 19" />
        <path d="M48 26 C 45 29 41 29 38 26" />
        <path d="M47 34 C 44 37 39 37 36 34" />

        {/* Tallo hacia el nodo de unión */}
        <path d="M32 46 L32 52" />
      </g>

      {/* Grafo multimodal: tres nodos conectados (IA, psicología, humano) */}
      <g stroke="#38bdf8" strokeWidth="1.6" opacity="0.8">
        <path d="M22 56 L32 52 L42 56" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="22" cy="56" r="2.1" fill="#38bdf8" />
      <circle cx="32" cy="52" r="2.1" fill="#c084fc" />
      <circle cx="42" cy="56" r="2.1" fill="#ec4899" />
    </svg>
  )
}

export default BrainMonogram