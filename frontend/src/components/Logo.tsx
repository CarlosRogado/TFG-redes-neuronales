export default function LogoRedNeuronal({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        
        {/* CORRECCIÓN: Usamos <filter> en lugar de <glow> */}
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g stroke="#475569" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round">
        <line x1="20" y1="20" x2="50" y2="15" />
        <line x1="20" y1="20" x2="50" y2="50" />
        <line x1="20" y1="50" x2="50" y2="15" />
        <line x1="20" y1="50" x2="50" y2="50" />
        <line x1="20" y1="50" x2="50" y2="85" />
        <line x1="20" y1="80" x2="50" y2="50" />
        <line x1="20" y1="80" x2="50" y2="85" />
        
        <line x1="50" y1="15" x2="80" y2="35" stroke="url(#gradBlue)" strokeWidth="2.5" />
        <line x1="50" y1="50" x2="80" y2="35" stroke="url(#gradBlue)" strokeWidth="2.5" />
        <line x1="50" y1="50" x2="80" y2="65" stroke="url(#gradBlue)" strokeWidth="2.5" opacity="0.4" />
        <line x1="50" y1="85" x2="80" y2="65" stroke="url(#gradBlue)" strokeWidth="2.5" opacity="0.4" />
      </g>

      <circle cx="20" cy="20" r="6" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
      <circle cx="20" cy="50" r="6" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
      <circle cx="20" cy="80" r="6" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />

      {/* CORRECCIÓN: Llamamos al filtro correcto */}
      <circle cx="50" cy="15" r="7" fill="url(#gradBlue)" style={{ filter: 'url(#neonGlow)' }} />
      <circle cx="50" cy="50" r="7" fill="url(#gradEmerald)" style={{ filter: 'url(#neonGlow)' }} />
      <circle cx="50" cy="85" r="7" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />

      <circle cx="80" cy="35" r="8" fill="url(#gradBlue)" stroke="#FFFFFF" strokeWidth="2" style={{ filter: 'url(#neonGlow)' }} />
      <circle cx="80" cy="65" r="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
      
      <circle cx="35" cy="17.5" r="2" fill="#FFFFFF" />
      <circle cx="65" cy="42.5" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}
