export default function NetworkFlow() {
  return (
    <div className="w-full bg-gray-50 rounded-lg border border-gray-200 p-6 my-6">
      <svg viewBox="0 0 920 280" className="w-full mx-auto">
        <defs>
          <marker id="arr" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 12 5, 0 10" fill="#64748b" />
          </marker>
        </defs>

        {/* Input box */}
        <rect x="10" y="75" width="210" height="110" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />
        <text x="115" y="108" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold" className="font-mono">[posY, vel, obsX,</text>
        <text x="115" y="125" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold" className="font-mono">centro, top,</text>
        <text x="115" y="142" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold" className="font-mono">bottom]</text>
        <text x="115" y="168" textAnchor="middle" fill="#64748b" fontSize="12">6 entradas</text>

        {/* Arrow 1 */}
        <line x1="220" y1="130" x2="240" y2="130" stroke="#64748b" strokeWidth="2.5" markerEnd="url(#arr)" />

        {/* Hidden layer */}
        <rect x="245" y="75" width="180" height="110" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
        <text x="335" y="115" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">Capa oculta</text>
        <text x="335" y="138" textAnchor="middle" fill="#64748b" fontSize="12">8 neuronas</text>
        <rect x="280" y="150" width="110" height="26" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="335" y="168" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="bold">ReLU</text>

        {/* Arrow 2 */}
        <line x1="425" y1="130" x2="475" y2="130" stroke="#64748b" strokeWidth="2.5" markerEnd="url(#arr)" />

        {/* Output layer */}
        <rect x="480" y="75" width="180" height="110" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
        <text x="570" y="115" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">Capa salida</text>
        <text x="570" y="138" textAnchor="middle" fill="#64748b" fontSize="12">1 neurona</text>
        <rect x="515" y="150" width="110" height="26" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="570" y="168" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="bold">Sigmoide</text>

        {/* Arrow 3 */}
        <line x1="660" y1="130" x2="700" y2="130" stroke="#64748b" strokeWidth="2.5" markerEnd="url(#arr)" />

        {/* Decision diamond */}
        <polygon points="715,130 750,90 785,130 750,170" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
        <text x="750" y="138" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="bold">{'>'}0.5?</text>

        {/* Sí branch - right */}
        <line x1="785" y1="130" x2="830" y2="130" stroke="#16a34a" strokeWidth="2" />
        <polygon points="830,130 823,125 823,135" fill="#16a34a" />
        <text x="840" y="135" fill="#16a34a" fontSize="14" fontWeight="bold">Sí Salta</text>

        {/* No branch - down */}
        <line x1="750" y1="170" x2="750" y2="210" stroke="#dc2626" strokeWidth="2" />
        <polygon points="750,210 745,203 755,203" fill="#dc2626" />
        <text x="725" y="230" fill="#dc2626" fontSize="14" fontWeight="bold">No Salta</text>
      </svg>
    </div>
  )
}
