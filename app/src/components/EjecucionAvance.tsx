import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { mef } from '../data'
import { soles, pct, MESES } from '../lib/format'

/** Avance de ejecución del presupuesto del año en curso (2026), comparado con el
 *  mismo mes de corte de los años anteriores para que la comparación sea justa. */
export function EjecucionAvance({ compacto = false }: { compacto?: boolean }) {
  const corte = mef.mes_corte_2026
  const enCurso = mef.anios.find((a) => a.parcial)
  if (!enCurso) return null
  const filas = mef.anios.map((a) => {
    const dev8 = a.dev_mensual.slice(0, corte).reduce((s, v) => s + v, 0)
    return { anio: a.anio, pim: a.pim, dev8, pctAvance: a.pim ? (dev8 / a.pim) * 100 : 0, enCurso: a.parcial }
  })
  const actual = filas.find((f) => f.enCurso)!
  const cerrados = filas.filter((f) => !f.enCurso)
  const promPrevio = cerrados.slice(-2).reduce((s, f) => s + f.pctAvance, 0) / Math.min(2, cerrados.length)
  const diff = actual.pctAvance - promPrevio
  const rezago = diff < -2
  const color = rezago ? 'var(--color-critico)' : diff > 2 ? 'var(--color-bueno)' : 'var(--color-alerta)'
  const mesNombre = MESES[corte - 1]

  return (
    <section className="card p-5" aria-labelledby="ejec-t">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h3 id="ejec-t" className="m-0">Avance de ejecución del presupuesto {actual.anio}</h3>
        <span className="chip">Devengado a {mesNombre} · pliego MML</span>
      </div>
      <p className="text-sm faint mt-1 mb-4 max-w-[90ch]">
        Cuánto del presupuesto modificado ha gastado la Municipalidad en lo que va del año. Para comparar con años anteriores se mide el
        devengado acumulado <strong>al mismo mes ({mesNombre})</strong>, no el total del año.
      </p>

      <div className="grid gap-5 items-center" style={{ gridTemplateColumns: compacto ? '1fr' : 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' }}>
        <div>
          <div className="text-sm muted">Ejecutado a {mesNombre} de {actual.anio}</div>
          <div className="display num" style={{ fontSize: 52, fontWeight: 600, lineHeight: 1, color }}>{pct(actual.pctAvance, 0)}</div>
          <div className="text-sm muted num mt-1">{soles(actual.dev8)} de {soles(actual.pim)} (PIM)</div>
          <div className="h-3 rounded mt-3 relative" style={{ background: 'var(--bg-3)' }} aria-hidden>
            <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${Math.min(100, actual.pctAvance)}%`, background: color }} />
            <div className="absolute inset-y-0" style={{ left: `${Math.min(100, promPrevio)}%`, width: 2, background: 'var(--ink)' }} title="Promedio de los 2 años previos" />
          </div>
          <div className="text-sm mt-3 num" style={{ color }}>
            {rezago ? '▼ Va rezagado' : diff > 2 ? '▲ Va adelantado' : '■ Al ritmo habitual'}: {diff >= 0 ? '+' : '−'}{Math.abs(diff).toFixed(1)} pp
            <span className="faint"> vs. el promedio de {cerrados.slice(-2).map((f) => f.anio).join(' y ')} a {mesNombre} ({pct(promPrevio, 0)})</span>
          </div>
        </div>

        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={filas} margin={{ top: 16, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="anio" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} width={40} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip cursor={{ fill: 'var(--bg-3)' }} content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload as (typeof filas)[number]
                return <div className="card px-3 py-2 text-sm shadow-sm"><div className="muted">{d.anio}{d.enCurso ? ' (en curso)' : ''}</div><div className="font-semibold num">{pct(d.pctAvance, 1)} a {mesNombre}</div><div className="faint num text-xs">{soles(d.dev8)} de {soles(d.pim)}</div></div>
              }} />
              <ReferenceLine y={promPrevio} stroke="var(--ink-3)" strokeDasharray="4 3" />
              <Bar dataKey="pctAvance" name="Avance" radius={[4, 4, 0, 0]} isAnimationActive={false} label={{ position: 'top', formatter: (v: unknown) => pct(Number(v), 0), fill: 'var(--ink-2)', fontSize: 11 }}>
                {filas.map((f) => <Cell key={f.anio} fill={f.enCurso ? color : 'var(--s-seq-3)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs faint mt-1">Porcentaje del PIM devengado a {mesNombre} de cada año. La barra de color es {actual.anio}; la línea punteada, el ritmo previo.</div>
        </div>
      </div>
    </section>
  )
}
