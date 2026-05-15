export default function SimulationFlow() {
  return (
    <div className="w-full bg-gray-50 rounded-lg border border-gray-200 p-6 my-6">
      <svg viewBox="0 0 380 420" className="w-full max-w-sm mx-auto">
        <defs>
          <marker id="arr" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#94a3b8" />
          </marker>
        </defs>

        {[
          { num: '1', label: 'Ajustar parámetros', desc: 'Población, mutación, elitismo', y: 15 },
          { num: '2', label: 'Crear cohetes', desc: 'Redes neuronales con TF.js', y: 85 },
          { num: '3', label: 'Bucle de simulación', desc: 'Física → Pensar → Decidir (60 fps)', y: 155 },
          { num: '4', label: 'Detectar colisiones', desc: 'Obstáculo, suelo, techo', y: 225 },
          { num: '5', label: 'Algoritmo genético', desc: 'Selección, clonación, mutación', y: 295 },
          { num: '6', label: 'Guardar resultados', desc: 'Datos → API → PostgreSQL', y: 365 },
        ].map((s, i) => (
          <g key={s.num}>
            {/* Arrow connector */}
            {i > 0 && (
              <line x1="40" y1={s.y - 10} x2="40" y2={s.y - 15} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arr)" />
            )}

            {/* Number circle */}
            <circle cx="40" cy={s.y + 18} r="16" fill="#fff" stroke="#64748b" strokeWidth="2" />
            <text x="40" y={s.y + 24} textAnchor="middle" fill="#475569" fontSize="14" fontWeight="bold">{s.num}</text>

            {/* Content box */}
            <rect x="68" y={s.y} width="300" height="46" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="80" y={s.y + 20} fill="#1e293b" fontSize="13" fontWeight="bold">{s.label}</text>
            <text x="80" y={s.y + 37} fill="#64748b" fontSize="11">{s.desc}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
