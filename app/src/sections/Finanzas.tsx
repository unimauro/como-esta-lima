import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, LineChart, Line } from 'recharts'
import { mef } from '../data'
import { soles, pct, MESES } from '../lib/format'
import { IndicadorCard } from '../components/IndicadorCard'
import { porDimension } from '../data'
import { LeyendaGestiones } from '../components/SerieChart'

const TT = ({ active, payload, label, fmt = soles }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; label?: string | number; fmt?: (n: number) => string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-sm shadow-sm">
      <div className="muted">{label}</div>
      {payload.map((p) => <div key={p.name} className="num flex justify-between gap-4"><span className="muted">{p.name}</span><span className="font-semibold">{fmt(p.value)}</span></div>)}
    </div>
  )
}

const colorAnio = (a: number) => (a <= 2021 ? 'var(--s-munoz)' : a === 2022 ? 'var(--s-romero)' : 'var(--s-la)')

export function Finanzas() {
  const anios = mef.anios
  const [vista, setVista] = useState<'funcion' | 'generica' | 'fuente' | 'ejecutora'>('funcion')
  if (!anios.length) return <div className="pt-8"><h2>Finanzas municipales</h2><p className="muted">Los datos del MEF aún no se han procesado.</p></div>
  const corte = mef.mes_corte_2026
  const datos = anios.map((a) => ({ anio: a.anio, PIA: a.pia, PIM: a.pim, Devengado: a.devengado, Girado: a.girado, ejec: a.ejecucion_pct, parcial: a.parcial, corte: a.dev_hasta_mes_corte, corriente: a.corriente.dev, capital: a.capital.dev, deuda: a.servicio_deuda.dev }))
  const completos = datos.filter((d) => !d.parcial)
  const claves = Array.from(new Set(anios.flatMap((a) => (a[`por_${vista}` as 'por_funcion'] ?? []).slice(0, 8).map((x) => x.nombre))))
  const comp = anios.map((a) => {
    const row: Record<string, number | string> = { anio: a.anio }
    for (const k of claves) row[k] = (a[`por_${vista}` as 'por_funcion'] ?? []).find((x) => x.nombre === k)?.dev ?? 0
    return row
  })
  const seq = ['var(--s-seq-7)', 'var(--s-seq-6)', 'var(--s-seq-5)', 'var(--s-seq-4)', 'var(--s-seq-3)', 'var(--s-seq-2)', 'var(--s-seq-1)', 'var(--color-arena)']
  const mensual = MESES.map((m, i) => { const r: Record<string, number | string> = { mes: m }; for (const a of anios) r[String(a.anio)] = a.dev_mensual.slice(0, i + 1).reduce((s, v) => s + v, 0); return r })

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-8">
        <h2 className="m-0">¿Cómo administró Lima su presupuesto?</h2>
        <p className="muted mt-2 mb-0 max-w-[85ch]">
          Pliego Municipalidad Metropolitana de Lima, todas sus unidades ejecutoras, según los CSV anuales de MEF Datos Abiertos
          (descarga {mef.fecha_descarga ?? 's/f'}). Cifras nominales en soles. 2026 está en curso: su devengado llega al mes {corte}
          y solo debe compararse con el devengado acumulado al mismo mes de los otros años.
        </p>
      </header>

      <div className="scroll-x card p-4">
        <table className="tbl">
          <thead><tr><th>Año</th><th className="r">PIA</th><th className="r">PIM</th><th className="r">Devengado</th><th className="r">Girado</th><th className="r">Ejecución (dev/PIM)</th><th className="r">Devengado a {MESES[corte - 1]}</th><th className="r">Gasto de capital</th><th className="r">Servicio de deuda</th></tr></thead>
          <tbody>
            {anios.map((a) => (
              <tr key={a.anio} className={a.parcial ? 'striped' : ''}>
                <td className="font-semibold">{a.anio}{a.parcial ? ' (en curso)' : ''}</td>
                <td className="r num">{soles(a.pia)}</td><td className="r num">{soles(a.pim)}</td>
                <td className="r num">{soles(a.devengado)}</td><td className="r num">{soles(a.girado)}</td>
                <td className="r num">{pct(a.ejecucion_pct)}</td>
                <td className="r num">{soles(a.dev_hasta_mes_corte)}</td>
                <td className="r num">{soles(a.capital.dev)} <span className="faint">({pct(a.devengado ? (a.capital.dev / a.devengado) * 100 : null, 0)})</span></td>
                <td className="r num">{soles(a.servicio_deuda.dev)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        <section className="card p-4">
          <h3 className="m-0 mb-1">Presupuesto y ejecución por año</h3>
          <p className="text-xs faint mt-0 mb-2">¿Creció el presupuesto y cuánto de él se gastó? Barras: PIM (modificado) y devengado. 2026 rayado = parcial.</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={datos} margin={{ top: 8, right: 8, left: 4, bottom: 0 }} barGap={2}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="anio" axisLine={false} tickLine={false} />
                <YAxis width={70} axisLine={false} tickLine={false} tickFormatter={(v) => soles(v).replace('S/ ', '')} />
                <Tooltip content={<TT />} cursor={{ fill: 'var(--bg-3)' }} />
                <Legend />
                <Bar dataKey="PIM" fill="var(--s-seq-2)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="Devengado" fill="var(--s-seq-5)" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {datos.map((d) => <Cell key={d.anio} fillOpacity={d.parcial ? 0.45 : 1} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-4">
          <h3 className="m-0 mb-1">Porcentaje de ejecución (años cerrados)</h3>
          <p className="text-xs faint mt-0 mb-2">Devengado / PIM. Se excluye el año en curso para no comparar un año parcial con años completos.</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={completos} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="anio" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} width={40} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<TT fmt={(n) => pct(n)} />} cursor={{ fill: 'var(--bg-3)' }} />
                <Bar dataKey="ejec" name="Ejecución" radius={[4, 4, 0, 0]} isAnimationActive={false} label={{ position: 'top', formatter: (v: unknown) => pct(Number(v), 0), fill: 'var(--ink-2)', fontSize: 12 }}>
                  {completos.map((d) => <Cell key={d.anio} fill={colorAnio(d.anio)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <LeyendaGestiones />
        </section>

        <section className="card p-4">
          <h3 className="m-0 mb-1">Devengado acumulado mes a mes</h3>
          <p className="text-xs faint mt-0 mb-2">Permite comparar 2026 con los demás años al mismo mes. Línea gruesa: 2026.</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={mensual} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} />
                <YAxis width={70} axisLine={false} tickLine={false} tickFormatter={(v) => soles(v).replace('S/ ', '')} />
                <Tooltip content={<TT />} />
                <Legend />
                {anios.map((a, i) => (
                  <Line key={a.anio} dataKey={String(a.anio)} stroke={a.parcial ? 'var(--s-la)' : seq[Math.min(i, seq.length - 1)]} strokeWidth={a.parcial ? 3 : 1.5} dot={false} isAnimationActive={false}
                    strokeDasharray={a.parcial ? undefined : undefined} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-4">
          <h3 className="m-0 mb-1">Composición del gasto devengado</h3>
          <p className="text-xs faint mt-0 mb-2">Gasto corriente, gasto de capital (obras y equipamiento) y servicio de la deuda. Un presupuesto grande no implica más inversión.</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={datos} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="anio" axisLine={false} tickLine={false} />
                <YAxis width={70} axisLine={false} tickLine={false} tickFormatter={(v) => soles(v).replace('S/ ', '')} />
                <Tooltip content={<TT />} cursor={{ fill: 'var(--bg-3)' }} />
                <Legend />
                <Bar dataKey="corriente" name="Gasto corriente" stackId="a" fill="var(--s-seq-2)" stroke="var(--bg-2)" strokeWidth={2} isAnimationActive={false} />
                <Bar dataKey="capital" name="Gasto de capital" stackId="a" fill="var(--s-seq-5)" stroke="var(--bg-2)" strokeWidth={2} isAnimationActive={false} />
                <Bar dataKey="deuda" name="Servicio de deuda" stackId="a" fill="var(--color-arena)" stroke="var(--bg-2)" strokeWidth={2} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="m-0">¿En qué se gastó? Devengado por {vista === 'funcion' ? 'función' : vista === 'generica' ? 'genérica de gasto' : vista === 'fuente' ? 'fuente de financiamiento' : 'unidad ejecutora'}</h3>
          <div className="flex gap-1">
            {(['funcion', 'generica', 'fuente', 'ejecutora'] as const).map((k) => <button key={k} className="btn" aria-pressed={vista === k} onClick={() => setVista(k)}>{k === 'funcion' ? 'Función' : k === 'generica' ? 'Genérica' : k === 'fuente' ? 'Fuente' : 'Ejecutora'}</button>)}
          </div>
        </div>
        <div style={{ height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={comp} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="anio" axisLine={false} tickLine={false} />
              <YAxis width={70} axisLine={false} tickLine={false} tickFormatter={(v) => soles(v).replace('S/ ', '')} />
              <Tooltip content={<TT />} cursor={{ fill: 'var(--bg-3)' }} />
              <Legend />
              {claves.map((k, i) => <Bar key={k} dataKey={k} stackId="a" fill={seq[i % seq.length]} stroke="var(--bg-2)" strokeWidth={2} isAnimationActive={false} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs faint mt-2 mb-0">Se muestran las 8 mayores categorías por PIM de cada año; los nombres son los del clasificador MEF.</p>
      </section>

      <section>
        <h3>Indicadores financieros derivados</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {porDimension('finanzas').map((i) => <IndicadorCard key={i.id} ind={i} />)}
        </div>
      </section>

      <p className="text-xs faint">
        Fuente: {mef.fuente}. URL base: <a href={mef.url_base} target="_blank" rel="noopener noreferrer">{mef.url_base}</a>. Descarga: {mef.fecha_descarga ?? 's/f'}.
        Método: filtro de las filas con pliego "Municipalidad Metropolitana de Lima" (nivel de gobierno M) y suma de PIA, PIM, devengado y girado. Los CSV anuales pesan ~2,8 GB cada uno y se procesan en streaming (scripts/mef_descarga.py).
      </p>
    </div>
  )
}
