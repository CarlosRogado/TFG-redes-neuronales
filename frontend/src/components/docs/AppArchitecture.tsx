export default function AppArchitecture() {
  return (
    <div className="w-full bg-gray-50 rounded-lg border border-gray-200 p-6 my-6">
      <svg viewBox="0 0 520 330" className="w-full max-w-xl mx-auto">
        <defs>
          <marker id="arr" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#64748b" />
          </marker>
        </defs>

        {/* Browser */}
        <rect x="130" y="15" width="260" height="60" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
        <text x="260" y="43" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">Navegador</text>
        <text x="260" y="62" textAnchor="middle" fill="#94a3b8" fontSize="11">React + Vite + p5.js + TensorFlow.js</text>

        {/* Arrow */}
        <line x1="260" y1="75" x2="260" y2="105" stroke="#64748b" strokeWidth="2" markerEnd="url(#arr)" />
        <rect x="200" y="82" width="130" height="20" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        <text x="265" y="96" textAnchor="middle" fill="#64748b" fontSize="10" className="font-mono">HTTP (fetch)</text>

        {/* Express */}
        <rect x="130" y="110" width="260" height="55" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
        <text x="260" y="138" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">API Express</text>
        <text x="260" y="155" textAnchor="middle" fill="#94a3b8" fontSize="11">Puerto 4000</text>

        {/* Arrow */}
        <line x1="260" y1="165" x2="260" y2="195" stroke="#64748b" strokeWidth="2" markerEnd="url(#arr)" />

        {/* Prisma */}
        <rect x="130" y="200" width="260" height="55" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
        <text x="260" y="228" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">Prisma ORM</text>
        <text x="260" y="245" textAnchor="middle" fill="#94a3b8" fontSize="11">Mapeo objeto-relacional</text>

        {/* Arrow */}
        <line x1="260" y1="255" x2="260" y2="285" stroke="#64748b" strokeWidth="2" markerEnd="url(#arr)" />

        {/* PostgreSQL */}
        <rect x="110" y="290" width="300" height="40" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="2" strokeDasharray="6,4" />
        <text x="260" y="316" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">PostgreSQL (Docker)</text>
      </svg>
    </div>
  )
}
