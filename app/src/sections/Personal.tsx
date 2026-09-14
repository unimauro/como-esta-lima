import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts'
import personal from '../data/personal_mml.json'
import { mef } from '../data'
import { soles, fmt } from '../lib/format'

interface Serie { anio: number; mes: number; n: number; planilla_mensual: number; mediana: number | null }
interface Prov { proveedor: string; ruc: string | null; tipo: string; monto: number; n: number }
const P = personal as unknown as {
  fuente: string; url: string; fecha_consulta: string; periodo_actual: string
  serie: Serie[]; total_actual: number; planilla_mensual_actual: number
  por_regimen: Record<string, number>
  top_dependencias: { dependencia: string; n: number }[]
  por_nivel: { nivel: string; n: number }[]
  sueldos_rangos: { rango: string; n: number }[]
  contratos: { monto_total: number; n: number; top: Prov[] } | null
}

const TT = ({ active, payload, label, unidad }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string | number; unidad?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-sm shadow-sm">
      <div className="muted">{label}</div>
      {payload.map((p) => <div key={p.name} className="num flex justify-between gap-4"><span className="muted">{p.name}</span><span className="font-semibold">{unidad === 'S/' ? soles(p.value) : fmt(p.value, 0)}</span></div>)}
    </div>
  )
}

export function Personal() {
  const gastoPersonalMef = mef.anios.map((a) => ({ anio: a.anio, dev: a.personal.dev, parcial: a.parcial }))
  const seq = ['var(--s-seq-6)', 'var(--s-seq-5)', 'var(--s-seq-4)', 'var(--s-seq-3)', 'var(--s-seq-2)', 'var(--color-arena)']
  const totalReg = Object.values(P.por_regimen).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-8">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="m-0">Personal y economía de la Municipalidad</h2>
          <span className="chip">Portal de Transparencia · {P.periodo_actual}</span>
        </div>
        <p className="muted mt-2 mb-0 max-w-[85ch]">
          Carga laboral de la Municipalidad Metropolitana de Lima según el Portal de Transparencia Estándar (personal publicado, sobre todo régimen CAS),
          más el gasto de personal del MEF y las contrataciones registradas. Es una vista <strong>parcial</strong>: el PTE no publica a todo el personal
          (obreros, algunos nombrados 276/728 y locadores por orden de servicio quedan sub-representados).
        </p>
      </header>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
        {[
          ['Servidores publicados', fmt(P.total_actual, 0), `${P.periodo_actual}, casi todos CAS`],
          ['Planilla mensual', soles(P.planilla_mensual_actual), 'suma de ingresos publicados'],
          ['Gasto de personal (MEF)', soles(mef.anios.at(-1)?.personal.dev ?? 0), `devengado ${mef.anios.at(-1)?.anio}`],
          ['Contrataciones', P.contratos ? soles(P.contratos.monto_total) : 's/d', P.contratos ? `${P.contratos.n} adjudicaciones (muestra OCDS)` : ''],
        ].map(([k, v, s]) => (
          <div key={k} className="card p-3">
            <div className="text-xs faint">{k}</div>
            <div className="big num" style={{ fontSize: 24 }}>{v}</div>
            <div className="text-xs faint mt-0.5">{s}</div>
          </div>
        ))}
      </div>

      {(() => {
        const mefUlt = mef.anios.filter((a) => !a.parcial).at(-1)
        if (!mefUlt) return null
        const planillaAnual = P.planilla_mensual_actual * 12
        const share = (planillaAnual / mefUlt.personal.dev) * 100
        return (
          <aside className="card p-4" style={{ borderColor: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 7%, var(--bg-2))' }}>
            <div className="font-semibold text-sm mb-1">Conciliación: planilla publicada vs. gasto de personal del MEF</div>
            <p className="text-sm muted m-0 max-w-[95ch]">
              La planilla del personal publicado en Transparencia equivale a unos <strong>{soles(planillaAnual)} al año</strong> (S/ {fmt(P.planilla_mensual_actual, 0)} mensuales × 12).
              El gasto de personal devengado por la Municipalidad según el MEF fue <strong>{soles(mefUlt.personal.dev)} en {mefUlt.anio}</strong>.
              Es decir, lo publicado en el Portal cubre solo alrededor del <strong>{share.toFixed(0)}%</strong> del gasto real de personal:
              el resto corresponde a otros regímenes (nombrados 276, obreros), pensiones, obligaciones sociales y cargos directivos que el PTE no lista completos.
              Confirma que estos {fmt(P.total_actual, 0)} servidores son una parte, no el total de la fuerza laboral municipal.
            </p>
          </aside>
        )
      })()}

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        <section className="card p-4">
          <h3 className="m-0 mb-1">Servidores publicados por año</h3>
          <p className="text-xs faint mt-0 mb-2">Personal en el Portal de Transparencia (snapshot de diciembre; 2026 a abril). Faltan 2020 y 2023 por vacíos de publicación. Cuenta de registros, no headcount total.</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={P.serie} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="anio" axisLine={false} tickLine={false} />
                <YAxis width={44} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v, 0)} />
                <Tooltip content={<TT />} cursor={{ fill: 'var(--bg-3)' }} />
                <Bar dataKey="n" name="Servidores" radius={[4, 4, 0, 0]} isAnimationActive={false} label={{ position: 'top', formatter: (v: unknown) => fmt(Number(v), 0), fill: 'var(--ink-2)', fontSize: 11 }}>
                  {P.serie.map((d) => <Cell key={d.anio} fill={d.anio >= 2023 ? 'var(--s-la)' : d.anio >= 2019 && d.anio <= 2021 ? 'var(--s-munoz)' : 'var(--s-romero)'} fillOpacity={d.mes < 12 ? 0.5 : 1} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-4">
          <h3 className="m-0 mb-1">Gasto de personal (MEF) vs. planilla publicada</h3>
          <p className="text-xs faint mt-0 mb-2">Devengado en la genérica "personal y obligaciones sociales" del pliego MML, por año. Es la mirada presupuestal, complementaria al conteo del PTE.</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={gastoPersonalMef} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="anio" axisLine={false} tickLine={false} />
                <YAxis width={64} axisLine={false} tickLine={false} tickFormatter={(v) => soles(v).replace('S/ ', '')} />
                <Tooltip content={<TT unidad="S/" />} />
                <Line dataKey="dev" name="Gasto de personal" stroke="var(--s-munoz)" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-4">
          <h3 className="m-0 mb-1">¿Dónde trabajan? Top dependencias</h3>
          <p className="text-xs faint mt-0 mb-2">La mayoría del personal CAS está en seguridad ciudadana (serenazgo) y servicios a la ciudad (limpieza y ambiente).</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={P.top_dependencias} layout="vertical" margin={{ top: 4, right: 40, left: 4, bottom: 0 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v, 0)} />
                <YAxis type="category" dataKey="dependencia" width={150} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.length > 26 ? v.slice(0, 25) + '…' : v} />
                <Tooltip content={<TT />} cursor={{ fill: 'var(--bg-3)' }} />
                <Bar dataKey="n" name="Servidores" radius={[0, 4, 4, 0]} fill="var(--s-seq-5)" isAnimationActive={false} label={{ position: 'right', formatter: (v: unknown) => fmt(Number(v), 0), fill: 'var(--ink-2)', fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-4">
          <h3 className="m-0 mb-1">¿Cuánto ganan? Distribución de ingresos</h3>
          <p className="text-xs faint mt-0 mb-2">Ingreso mensual total publicado. La gran mayoría gana entre S/ 1 500 y S/ 3 000; muy pocos superan S/ 8 000.</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={P.sueldos_rangos} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="rango" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis width={44} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v, 0)} />
                <Tooltip content={<TT />} cursor={{ fill: 'var(--bg-3)' }} />
                <Bar dataKey="n" name="Servidores" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {P.sueldos_rangos.map((_, i) => <Cell key={i} fill={seq[i % seq.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="card p-4">
        <h3 className="m-0 mb-2">Régimen laboral y tipo de puesto ({P.periodo_actual})</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div>
            <div className="font-semibold text-sm mb-1">Por régimen</div>
            <table className="tbl"><tbody>
              {Object.entries(P.por_regimen).sort((a, b) => b[1] - a[1]).map(([r, n]) => (
                <tr key={r}><td>{r}</td><td className="r num">{fmt(n, 0)}</td><td className="r faint num">{((n / totalReg) * 100).toFixed(1)}%</td></tr>
              ))}
            </tbody></table>
            <p className="text-xs faint mt-2 m-0">Casi todo el personal publicado es CAS. Los cargos directivos (régimen 276/confianza) apenas aparecen en el PTE, por eso solo se ven 2 directores y 1 jefe en los datos.</p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">Por tipo de puesto</div>
            <div className="scroll-x"><table className="tbl"><tbody>
              {P.por_nivel.map((x) => <tr key={x.nivel}><td>{x.nivel}</td><td className="r num">{fmt(x.n, 0)}</td></tr>)}
            </tbody></table></div>
          </div>
        </div>
      </section>

      {P.contratos && (
        <section className="card p-4">
          <h3 className="m-0 mb-1">Contrataciones: principales proveedores</h3>
          <p className="text-xs faint mt-0 mb-2">Adjudicaciones registradas en datos abiertos de contrataciones (OCDS). Muestra parcial: {P.contratos.n} adjudicaciones por S/ {fmt(P.contratos.monto_total, 0)} en total.</p>
          <div className="scroll-x"><table className="tbl">
            <thead><tr><th>Proveedor</th><th>Tipo</th><th className="r">Monto</th></tr></thead>
            <tbody>
              {P.contratos.top.map((p, i) => (
                <tr key={i}><td className="font-semibold">{p.proveedor}</td><td className="muted text-sm">{p.tipo}</td><td className="r num">{soles(p.monto)}</td></tr>
              ))}
            </tbody>
          </table></div>
        </section>
      )}

      <p className="text-xs faint">
        Fuente: {P.fuente} Consulta directa: <a href={P.url} target="_blank" rel="noopener noreferrer">Portal de Transparencia — Personal (MML)</a>. Fecha: {P.fecha_consulta}.
        Limitaciones: el PTE publica principalmente el régimen CAS y no equivale al total de trabajadores municipales; los locadores (orden de servicio) y obreros no están completos. El "gasto de personal" del MEF es la cifra presupuestal oficial y complementaria.
      </p>
    </div>
  )
}
