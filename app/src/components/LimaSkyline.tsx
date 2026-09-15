/** Ilustración original de la costa de Lima: garúa, Costa Verde, Morro Solar y el
 *  perfil de la ciudad. Sin fotos con derechos; colores del tema (mar/arena/garúa). */
export function LimaSkyline({ alto = 200 }: { alto?: number }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--line)' }} role="img" aria-label="Ilustración de la costa de Lima: garúa, Costa Verde, Morro Solar y el perfil de la ciudad">
      <svg viewBox="0 0 1200 220" width="100%" height={alto} preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="garua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--sky-1)" />
            <stop offset="1" stopColor="var(--sky-2)" />
          </linearGradient>
          <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--sea-1)" />
            <stop offset="1" stopColor="var(--sea-2)" />
          </linearGradient>
        </defs>
        <style>{`
          .lima-svg-scope{--sky-1:#e7ebee;--sky-2:#f3f5f6;--sea-1:#2b7f8c;--sea-2:#0f5f6b;--hill:#b9a888;--hill2:#a8967a;--city:#c3cad0;--city2:#aeb7bf;--sun:#eda100;}
        `}</style>
        <g className="lima-svg-scope">
          {/* cielo garúa */}
          <rect width="1200" height="220" fill="url(#garua)" />
          {/* sol tenue */}
          <circle cx="980" cy="60" r="34" fill="var(--sun)" opacity="0.12" />
          {/* skyline lejano de la ciudad */}
          <g fill="var(--city)" opacity="0.55">
            <rect x="60" y="96" width="26" height="70" />
            <rect x="92" y="80" width="18" height="86" />
            <rect x="118" y="104" width="30" height="62" />
            <rect x="156" y="88" width="16" height="78" />
            <rect x="180" y="110" width="34" height="56" />
            <rect x="222" y="92" width="20" height="74" />
            <rect x="250" y="100" width="26" height="66" />
            <rect x="286" y="84" width="14" height="82" />
            <rect x="308" y="112" width="30" height="54" />
            <rect x="640" y="98" width="22" height="68" />
            <rect x="668" y="86" width="16" height="80" />
            <rect x="690" y="106" width="30" height="60" />
            <rect x="728" y="94" width="18" height="72" />
            <rect x="754" y="112" width="28" height="54" />
          </g>
          {/* Morro Solar con el Cristo del Pacífico (silueta) */}
          <path d="M360 166 Q470 60 610 166 Z" fill="var(--hill2)" />
          <path d="M360 166 Q450 84 540 166 Z" fill="var(--hill)" />
          <g stroke="var(--hill2)" strokeWidth="3" opacity="0.9">
            <line x1="486" y1="96" x2="486" y2="118" />
            <line x1="476" y1="104" x2="496" y2="104" />
          </g>
          {/* acantilado Costa Verde */}
          <path d="M0 166 L360 166 L360 186 Q180 174 0 200 Z" fill="var(--hill)" />
          <path d="M610 166 L1200 166 L1200 200 Q900 178 610 186 Z" fill="var(--hill)" />
          {/* franja de mar */}
          <rect x="0" y="180" width="1200" height="40" fill="url(#mar)" />
          {/* olas */}
          <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" fill="none">
            <path d="M40 196 q20 -6 40 0 t40 0 t40 0" />
            <path d="M320 204 q20 -6 40 0 t40 0 t40 0" />
            <path d="M700 198 q20 -6 40 0 t40 0 t40 0" />
            <path d="M980 205 q20 -6 40 0 t40 0 t40 0" />
          </g>
        </g>
      </svg>
    </div>
  )
}
