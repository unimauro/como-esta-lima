import { useEffect, useState } from 'react'

export const SECCIONES: { id: string; nombre: string }[] = [
  { id: 'inicio', nombre: '¿Cómo está Lima?' },
  { id: 'finanzas', nombre: 'Finanzas MML' },
  { id: 'movilidad', nombre: 'Movilidad' },
  { id: 'seguridad', nombre: 'Seguridad' },
  { id: 'costo_vida', nombre: 'Costo de vida' },
  { id: 'servicios_ambiente', nombre: 'Servicios y ambiente' },
  { id: 'institucional', nombre: 'Gestión y percepción' },
  { id: 'obras', nombre: 'Obras: ¿quién hizo qué?' },
  { id: 'promesas', nombre: 'Prometido vs. ejecutado' },
  { id: 'timeline', nombre: 'Línea de tiempo' },
  { id: 'lima2030', nombre: 'Lima 2030' },
  { id: 'diagnostico', nombre: 'Diagnóstico' },
  { id: 'metodologia', nombre: 'Metodología' },
]

export function Nav({ actual, onIr, tema, onTema }: { actual: string; onIr: (id: string) => void; tema: 'light' | 'dark'; onTema: () => void }) {
  const [abierto, setAbierto] = useState(false)
  useEffect(() => { setAbierto(false) }, [actual])
  const actualNombre = SECCIONES.find((s) => s.id === actual)?.nombre ?? ''

  return (
    <nav className="sticky top-0 z-30" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }} aria-label="Secciones">
      <div className="wrap flex items-center gap-2 py-2">
        <a href="#inicio" onClick={(e) => { e.preventDefault(); onIr('inicio') }} className="display font-semibold text-[17px] shrink-0" style={{ color: 'var(--ink)' }}>
          ¿Cómo está Lima?
        </a>

        {/* Desktop: fila con scroll horizontal */}
        <div className="nav-desk-only gap-0.5 overflow-x-auto flex-1 py-1" style={{ scrollbarWidth: 'none' }}>
          {SECCIONES.slice(1).map((s) => (
            <a key={s.id} href={`#${s.id}`} className="nav-link" aria-current={actual === s.id ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); onIr(s.id) }}>
              {s.nombre}
            </a>
          ))}
        </div>

        {/* Móvil: sección actual + botón de menú */}
        <span className="nav-mob-only flex-1 text-sm font-semibold truncate" style={{ color: 'var(--ink-2)' }}>{actual !== 'inicio' ? actualNombre : ''}</span>
        <button className="btn nav-mob-only shrink-0" aria-expanded={abierto} aria-controls="menu-movil" aria-label="Abrir menú de secciones" onClick={() => setAbierto((v) => !v)}>
          {abierto ? 'Cerrar' : 'Menú ☰'}
        </button>

        <button className="btn shrink-0" onClick={onTema} aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'} title="Tema">
          {tema === 'dark' ? '☀' : '☾'}
        </button>
      </div>

      {/* Panel móvil desplegable */}
      <div id="menu-movil" className="nav-mob-only" hidden={!abierto} style={{ borderTop: '1px solid var(--line)', background: 'var(--bg-2)', maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="wrap py-2 grid grid-cols-2 gap-1">
          {SECCIONES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="nav-link" style={{ display: 'block' }} aria-current={actual === s.id ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); onIr(s.id) }}>
              {s.nombre}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
