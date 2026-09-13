import type { Fuente } from '../types'
import { colorGestion, nombreGestion } from '../data'

export const etiquetaCompetencia: Record<string, string> = {
  mml: 'Competencia directa MML',
  compartida: 'Competencia compartida',
  otra_entidad: 'Competencia de otra entidad',
  externo: 'Factor externo',
}
const colorCompetencia: Record<string, string> = {
  mml: 'var(--color-bueno)',
  compartida: 'var(--color-alerta)',
  otra_entidad: 'var(--s-munoz)',
  externo: 'var(--ink-3)',
}

export function CompetenciaChip({ c, responsable }: { c: string; responsable?: string }) {
  return (
    <span className="chip" title={responsable ? `Responsable principal: ${responsable}` : undefined}>
      <span className="chip-dot" style={{ background: colorCompetencia[c] ?? 'var(--ink-3)' }} />
      {etiquetaCompetencia[c] ?? c}
    </span>
  )
}

export function ConfiabilidadChip({ c }: { c: string }) {
  const label = c === 'alta' ? 'Confiabilidad alta' : c === 'media' ? 'Confiabilidad media' : 'Confiabilidad baja'
  const glyph = c === 'alta' ? '●●●' : c === 'media' ? '●●○' : '●○○'
  return (
    <span className="chip" title="Calidad de la fuente y comparabilidad de la serie">
      <span aria-hidden style={{ letterSpacing: 1, fontSize: 9 }}>{glyph}</span> {label}
    </span>
  )
}

export function GestionChip({ g }: { g: string | null | undefined }) {
  if (!g) return <span className="faint">—</span>
  return (
    <span className="chip">
      <span className="chip-dot" style={{ background: colorGestion[g] ?? 'var(--ink-3)' }} />
      {nombreGestion[g] ?? g}
    </span>
  )
}

export const etiquetaEstado: Record<string, { t: string; c: string }> = {
  terminado: { t: 'Terminado', c: 'var(--color-bueno)' },
  en_ejecucion: { t: 'En ejecución', c: 'var(--s-munoz)' },
  planificacion: { t: 'En planificación', c: 'var(--color-alerta)' },
  paralizado: { t: 'Paralizado', c: 'var(--color-serio)' },
  cancelado: { t: 'Cancelado', c: 'var(--color-critico)' },
  anunciado: { t: 'Anunciado / sin ejecución verificable', c: 'var(--ink-3)' },
  cumplido: { t: 'Cumplido', c: 'var(--color-bueno)' },
  parcial: { t: 'Parcial', c: 'var(--color-alerta)' },
  no_cumplido: { t: 'No cumplido', c: 'var(--color-critico)' },
  no_verificable: { t: 'No verificable', c: 'var(--ink-3)' },
}

export function EstadoChip({ e }: { e: string }) {
  const k = etiquetaEstado[e] ?? { t: e, c: 'var(--ink-3)' }
  return (
    <span className="chip">
      <span className="chip-dot" style={{ background: k.c }} /> {k.t}
    </span>
  )
}

export function Fuentes({ fuentes, compact = false }: { fuentes: Fuente[]; compact?: boolean }) {
  if (!fuentes?.length) return <p className="faint text-sm">Sin fuente registrada.</p>
  return (
    <ul className={`m-0 p-0 list-none ${compact ? 'text-xs' : 'text-sm'} space-y-1`}>
      {fuentes.map((f, i) => (
        <li key={i} className="muted">
          <a href={f.url} target="_blank" rel="noopener noreferrer">{f.nombre}</a>
          {f.tipo && <span className="faint"> · {f.tipo}</span>}
          {f.fecha_consulta && <span className="faint"> · consultado {f.fecha_consulta}</span>}
          {!compact && f.metodologia && <div className="faint">Metodología: {f.metodologia}</div>}
          {!compact && f.observaciones && <div className="faint">Obs.: {f.observaciones}</div>}
        </li>
      ))}
    </ul>
  )
}
