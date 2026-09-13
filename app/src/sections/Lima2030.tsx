import { useMemo, useState } from 'react'
import { indicadores, DIMENSIONES } from '../data'
import { tendenciaLineal, ultimo, primero, cambioTotal, colorDireccion } from '../lib/trend'
import { valorConUnidad, signed } from '../lib/format'
import { CompetenciaChip } from '../components/Chips'

const H = 2030

export function Lima2030() {
  const [dim, setDim] = useState('todas')
  const filas = useMemo(() => indicadores
    .filter((i) => i.dimension !== 'demografia' || true)
    .map((i) => ({ i, t: tendenciaLineal(i.serie), u: ultimo(i.serie, true) ?? ultimo(i.serie), p: primero(i.serie), c: cambioTotal(i) }))
    .filter((x) => x.t && x.u && x.p)
    .map((x) => {
      const t = x.t!
      const bueno = x.i.mejor_si === 'baja' ? -1 : 1
      const pend = t.pendiente
      // escenarios ilustrativos: ±50 % de la pendiente observada, en la dirección deseable
      const mejora = pend + 0.5 * Math.abs(pend) * bueno
      const deterioro = pend - 0.5 * Math.abs(pend) * bueno
      const base = x.u!.valor as number, a0 = x.u!.anio
      const proy = (m: number) => base + m * (H - a0)
      const clamp = (v: number) => (x.i.unidad.trim() === '%' ? Math.max(0, Math.min(100, v)) : x.i.mejor_si && /km|n|hab|S\//.test(x.i.unidad) ? Math.max(0, v) : v)
      return { ...x, tend: clamp(proy(pend)), mej: clamp(proy(mejora)), det: clamp(proy(deterioro)), r2: t.r2, dirTend: pend * bueno > 0 ? 'mejora' : pend === 0 ? 'estable' : 'empeora' }
    }), [])
  const lista = filas.filter((f) => dim === 'todas' || f.i.dimension === dim)
  const riesgos = filas.filter((f) => f.dirTend === 'empeora' && f.r2 >= 0.5).sort((a, b) => b.r2 - a.r2)

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-8">
        <h2 className="m-0">¿Hacia dónde va Lima? Escenarios a 2030</h2>
        <p className="muted mt-2 mb-0 max-w-[85ch]">
          Proyección por regresión lineal de cada indicador con al menos tres años cerrados. <strong>No son predicciones</strong>: son la
          prolongación mecánica de la tendencia 2019–hoy (escenario tendencial) y dos variantes ilustrativas con la pendiente 50 % mejor o 50 % peor.
          R² indica qué tan lineal ha sido la serie; por debajo de 0,5 la tendencia es débil y la proyección poco informativa.
        </p>
      </header>

      <section className="card p-4">
        <h3 className="m-0">Si nada cambia: riesgos con tendencia sostenida de deterioro</h3>
        <p className="text-xs faint mt-1 mb-3">Indicadores que empeoran con R² ≥ 0,5. Se muestra quién tiene competencia: varios no dependen de la alcaldía.</p>
        {riesgos.length === 0 && <p className="muted text-sm m-0">Ningún indicador cumple el criterio con los datos cargados.</p>}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {riesgos.map((f) => (
            <div key={f.i.id} className="card p-3" style={{ background: 'var(--bg)' }}>
              <div className="font-semibold text-sm leading-tight">{f.i.nombre}</div>
              <div className="text-xs faint">{DIMENSIONES.find((d) => d.id === f.i.dimension)?.corto}</div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-sm num">
                <span className="muted">Hoy ({f.u!.anio})</span><span className="text-right">{valorConUnidad(f.u!.valor, f.i.unidad)}</span>
                <span className="muted">2030 tendencial</span><span className="text-right font-semibold" style={{ color: colorDireccion.empeora }}>{valorConUnidad(f.tend, f.i.unidad)}</span>
              </div>
              <div className="mt-2"><CompetenciaChip c={f.i.competencia} responsable={f.i.responsable_principal} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1">
          <button className="btn" aria-pressed={dim === 'todas'} onClick={() => setDim('todas')}>Todas</button>
          {DIMENSIONES.map((d) => <button key={d.id} className="btn" aria-pressed={dim === d.id} onClick={() => setDim(d.id)}>{d.corto}</button>)}
        </div>
        <div className="scroll-x card">
          <table className="tbl">
            <thead><tr><th>Indicador</th><th className="r">2019 (o primer dato)</th><th className="r">Último cerrado</th><th className="r">Pendiente/año</th><th className="r">R²</th><th className="r">2030 tendencial</th><th className="r">2030 mejora</th><th className="r">2030 deterioro</th><th>Competencia</th></tr></thead>
            <tbody>
              {lista.map((f) => (
                <tr key={f.i.id}>
                  <td><div className="font-semibold text-sm">{f.i.nombre}</div><div className="text-xs faint">{f.i.mejor_si === 'baja' ? 'mejor si baja' : 'mejor si sube'} · {f.t!.n} años</div></td>
                  <td className="r num">{valorConUnidad(f.p!.valor, f.i.unidad)} <span className="faint">({f.p!.anio})</span></td>
                  <td className="r num">{valorConUnidad(f.u!.valor, f.i.unidad)} <span className="faint">({f.u!.anio})</span></td>
                  <td className="r num" style={{ color: colorDireccion[f.dirTend as 'mejora'] }}>{signed(f.t!.pendiente, '', Math.abs(f.t!.pendiente) < 10 ? 1 : 0)}</td>
                  <td className="r num" style={{ color: f.r2 < 0.5 ? 'var(--ink-3)' : undefined }}>{f.r2.toFixed(2)}{f.r2 < 0.5 ? ' débil' : ''}</td>
                  <td className="r num font-semibold">{valorConUnidad(f.tend, f.i.unidad)}</td>
                  <td className="r num" style={{ color: colorDireccion.mejora }}>{valorConUnidad(f.mej, f.i.unidad)}</td>
                  <td className="r num" style={{ color: colorDireccion.empeora }}>{valorConUnidad(f.det, f.i.unidad)}</td>
                  <td><CompetenciaChip c={f.i.competencia} responsable={f.i.responsable_principal} /></td>
                </tr>
              ))}
              {lista.length === 0 && <tr><td colSpan={9} className="muted">Sin indicadores con al menos tres años cerrados en esta dimensión.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="text-xs faint m-0">Los valores en % se acotan a 0–100 y los conteos a ≥ 0. Las proyecciones no incorporan población, ciclos económicos ni políticas anunciadas: sirven para ordenar prioridades, no para pronosticar.</p>
      </section>
    </div>
  )
}
