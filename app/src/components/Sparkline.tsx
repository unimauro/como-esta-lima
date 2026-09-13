import type { Punto } from '../types'

/** Sparkline SVG 2019–2026 sobre eje fijo, con punto parcial hueco. */
export function Sparkline({ serie, color = 'var(--s-city)', w = 120, h = 36, desde = 2019, hasta = 2026 }: {
  serie: Punto[]; color?: string; w?: number; h?: number; desde?: number; hasta?: number
}) {
  const v = serie.filter((p) => p.valor !== null && p.valor !== undefined)
  if (v.length < 2) return <svg width={w} height={h} aria-hidden><line x1={4} x2={w - 4} y1={h / 2} y2={h / 2} stroke="var(--line)" strokeDasharray="2 3" /></svg>
  const ys = v.map((p) => p.valor as number)
  const min = Math.min(...ys), max = Math.max(...ys)
  const x = (a: number) => 4 + ((a - desde) / (hasta - desde)) * (w - 8)
  const y = (val: number) => (max === min ? h / 2 : h - 4 - ((val - min) / (max - min)) * (h - 8))
  const completos = v.filter((p) => !p.parcial)
  const d = completos.map((p, i) => `${i ? 'L' : 'M'}${x(p.anio).toFixed(1)},${y(p.valor as number).toFixed(1)}`).join(' ')
  const ult = completos[completos.length - 1]
  const parciales = v.filter((p) => p.parcial)
  return (
    <svg width={w} height={h} aria-hidden style={{ overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {parciales.map((p) => ult && (
        <g key={p.anio}>
          <line x1={x(ult.anio)} y1={y(ult.valor as number)} x2={x(p.anio)} y2={y(p.valor as number)} stroke={color} strokeWidth={2} strokeDasharray="3 3" />
          <circle cx={x(p.anio)} cy={y(p.valor as number)} r={3.5} fill="var(--bg-2)" stroke={color} strokeWidth={2} />
        </g>
      ))}
      {ult && <circle cx={x(ult.anio)} cy={y(ult.valor as number)} r={3.5} fill={color} />}
    </svg>
  )
}
