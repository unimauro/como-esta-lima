import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Punto } from '../types'
import { gestiones } from '../data'
import { valorConUnidad } from '../lib/format'

function anioDecimal(iso: string | null | undefined, fallback: number) {
  if (!iso) return fallback
  const [y, m = '1', d = '1'] = iso.split('-')
  return Number(y) + (Number(m) - 1) / 12 + (Number(d) - 1) / 365
}

/** Bandas de gestión compartidas por todos los gráficos de serie anual. */
export function BandasGestion({ desde = 2019, hasta = 2026.75 }: { desde?: number; hasta?: number }) {
  const col: Record<string, string> = { munoz: 'var(--band-munoz)', romero: 'var(--band-romero)', lopez_aliaga: 'var(--band-la)', reggiardo: 'var(--band-la)' }
  return (
    <>
      {gestiones.map((g) => {
        const x1 = Math.max(desde, anioDecimal(g.inicio, desde))
        const x2 = Math.min(hasta, anioDecimal(g.fin, hasta))
        if (x2 <= x1) return null
        return <ReferenceArea key={g.id} x1={x1} x2={x2} fill={col[g.id] ?? 'var(--band-romero)'} fillOpacity={1} stroke="none" ifOverflow="hidden" />
      })}
    </>
  )
}

export function LeyendaGestiones() {
  const col: Record<string, string> = { munoz: 'var(--s-munoz)', romero: 'var(--s-romero)', lopez_aliaga: 'var(--s-la)', reggiardo: 'var(--s-la)' }
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs muted">
      {gestiones.filter((g) => g.inicio || g.fin).map((g) => (
        <span key={g.id} className="inline-flex items-center gap-1.5">
          <span style={{ width: 14, height: 8, background: col[g.id], opacity: 0.35, borderRadius: 2, display: 'inline-block' }} />
          {g.alcalde} · {g.inicio ? g.inicio.slice(0, 7) : '¿?'}–{g.fin ? g.fin.slice(0, 7) : 'hoy'}
        </span>
      ))}
    </div>
  )
}

export function SerieChart({ serie, unidad, color = 'var(--s-city)', alto = 220, nombre }: {
  serie: Punto[]; unidad: string; color?: string; alto?: number; nombre: string
}) {
  const datos = serie
    .filter((p) => p.valor !== null)
    .map((p) => ({ anio: p.anio, x: p.anio + 0.5, valor: p.valor as number, parcial: !!p.parcial, nota: p.nota }))
  if (datos.length < 2) return <p className="faint text-sm">Serie insuficiente para graficar.</p>
  const completos = datos.filter((d) => !d.parcial)
  const parciales = datos.filter((d) => d.parcial)
  const enlace = completos.length && parciales.length ? [completos[completos.length - 1], ...parciales] : []
  const ys = datos.map((d) => d.valor)
  const min = Math.min(...ys), max = Math.max(...ys)
  const pad = (max - min || Math.abs(max) || 1) * 0.15
  const dom: [number, number] = [min >= 0 && min - pad < 0 ? 0 : min - pad, max + pad]
  return (
    <div style={{ width: '100%', height: alto }}>
      <ResponsiveContainer>
        <LineChart margin={{ top: 8, right: 16, bottom: 4, left: 4 }} data={datos}>
          <CartesianGrid vertical={false} strokeDasharray="0" />
          <BandasGestion />
          <XAxis type="number" dataKey="x" domain={[2019, 2027]} ticks={[2019.5, 2020.5, 2021.5, 2022.5, 2023.5, 2024.5, 2025.5, 2026.5]} tickFormatter={(v) => String(Math.floor(v))} axisLine={false} tickLine={false} />
          <YAxis domain={dom} width={64} axisLine={false} tickLine={false} tickFormatter={(v) => valorConUnidad(v, unidad).replace(/^S\/ /, '')} />
          <Tooltip
            cursor={{ stroke: 'var(--ink-3)', strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload as (typeof datos)[number]
              return (
                <div className="card px-3 py-2 text-sm shadow-sm" style={{ maxWidth: 260 }}>
                  <div className="muted">{d.anio}{d.parcial ? ' (parcial)' : ''}</div>
                  <div className="font-semibold num">{valorConUnidad(d.valor, unidad)}</div>
                  {d.nota && <div className="faint text-xs mt-1">{d.nota}</div>}
                </div>
              )
            }}
          />
          <Line name={nombre} data={completos} type="linear" dataKey="valor" stroke={color} strokeWidth={2} dot={{ r: 3.5, fill: color, strokeWidth: 0 }} activeDot={{ r: 5 }} isAnimationActive={false} />
          {enlace.length > 1 && (
            <Line name={`${nombre} (parcial)`} data={enlace} type="linear" dataKey="valor" stroke={color} strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3.5, fill: 'var(--bg-2)', stroke: color, strokeWidth: 2 }} activeDot={{ r: 5 }} isAnimationActive={false} legendType="none" />
          )}
          {completos.length === 0 && <ReferenceLine y={dom[0]} stroke="none" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
