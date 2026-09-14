import { indicadores, indicadoresNucleo, DIMENSIONES } from '../data'
import { cambioTotal, cambiosPorGestion, tendenciaLineal, colorDireccion, etiquetaDireccion, type Direccion } from '../lib/trend'
import { signed, valorConUnidad } from '../lib/format'
import { CompetenciaChip } from '../components/Chips'

const PESO_COMP: Record<string, number> = { mml: 1, compartida: 0.8, otra_entidad: 0.4, externo: 0.2 }
const PESO_CONF: Record<string, number> = { alta: 1, media: 0.8, baja: 0.5 }

function textoCambio(i: (typeof indicadores)[number]) {
  const c = cambioTotal(i)
  if (c.abs === null || !c.desde || !c.hasta) return 'sin datos comparables'
  const cuerpo = i.unidad.trim() === '%' ? signed(c.abs, ' pp') : signed(c.pct, '%')
  return `${valorConUnidad(c.desde.valor, i.unidad)} (${c.desde.anio}) → ${valorConUnidad(c.hasta.valor, i.unidad)} (${c.hasta.anio}${c.parcial ? ', parcial' : ''}): ${cuerpo}`
}

export function Diagnostico() {
  const grupos: Record<Direccion, typeof indicadores> = { mejora: [], empeora: [], estable: [], sin_datos: [] }
  for (const i of indicadoresNucleo) grupos[cambioTotal(i).direccion].push(i)

  const prioridades = indicadoresNucleo
    .map((i) => {
      const c = cambioTotal(i); const t = tendenciaLineal(i.serie)
      if (c.pct === null) return null
      const orient = i.mejor_si === 'baja' ? c.pct : -c.pct // positivo = empeoró
      const magnitud = Math.max(0, Math.min(50, orient)) / 50 // 0..1
      const tend = t ? (t.pendiente * (i.mejor_si === 'baja' ? 1 : -1) > 0 ? 0.5 + 0.5 * Math.min(1, t.r2) : 0) : 0.25
      const score = (0.5 * magnitud + 0.3 * tend + 0.2 * (c.direccion === 'empeora' ? 1 : 0)) * (PESO_COMP[i.competencia] ?? 0.5) * (PESO_CONF[i.confiabilidad] ?? 0.8)
      return { i, score, c, t }
    })
    .filter((x): x is NonNullable<typeof x> => !!x && x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  const porGestion = (['munoz', 'lopez_aliaga'] as const).map((g) => {
    const cnt: Record<Direccion, number> = { mejora: 0, empeora: 0, estable: 0, sin_datos: 0 }
    for (const i of indicadoresNucleo) cnt[cambiosPorGestion(i)[g].direccion]++
    return { g, cnt }
  })

  const Lista = ({ dir, titulo }: { dir: Direccion; titulo: string }) => (
    <section className="card p-4">
      <h3 className="m-0 flex items-center gap-2"><span className="chip-dot" style={{ background: colorDireccion[dir], width: 12, height: 12 }} />{titulo} <span className="faint num text-sm">({grupos[dir].length})</span></h3>
      <ul className="m-0 mt-2 p-0 list-none flex flex-col gap-2">
        {grupos[dir].map((i) => (
          <li key={i.id} className="text-sm hair pt-2">
            <div className="font-semibold">{i.nombre} <span className="faint">· {DIMENSIONES.find((d) => d.id === i.dimension)?.corto}</span></div>
            <div className="muted num">{dir === 'sin_datos' ? (i.nota ?? 'Sin serie comparable entre periodos.') : textoCambio(i)}</div>
            <div className="mt-1"><CompetenciaChip c={i.competencia} responsable={i.responsable_principal} /></div>
          </li>
        ))}
        {grupos[dir].length === 0 && <li className="faint text-sm">Ninguno.</li>}
      </ul>
    </section>
  )

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-8">
        <h2 className="m-0">Diagnóstico de Lima: ¿qué cambió realmente?</h2>
        <p className="muted mt-2 mb-0 max-w-[85ch]">Conclusiones generadas exclusivamente a partir de las series cargadas (2019 → último dato cerrado). "Mejoró"/"empeoró" sigue el sentido deseable declarado en cada indicador; un cambio menor a 3 % se considera similar.</p>
      </header>

      <section className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {porGestion.map(({ g, cnt }) => (
          <div key={g} className="card p-4">
            <div className="font-semibold">Durante la gestión {g === 'munoz' ? 'Muñoz (2019→2022)' : 'López Aliaga (2022→último cerrado)'}</div>
            <div className="flex gap-4 mt-2 num text-sm">
              {(['mejora', 'estable', 'empeora'] as Direccion[]).map((d) => <span key={d} style={{ color: colorDireccion[d] }}>{cnt[d]} {etiquetaDireccion[d]}</span>)}
              <span className="faint">{cnt.sin_datos} s/d</span>
            </div>
            <p className="text-xs faint mt-2 mb-0">Correlación temporal, no causalidad: muchos indicadores dependen de entidades distintas a la MML.</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <Lista dir="mejora" titulo="Mejoró" />
        <Lista dir="empeora" titulo="Empeoró" />
        <Lista dir="estable" titulo="Se mantuvo" />
        <Lista dir="sin_datos" titulo="Sin evidencia suficiente" />
      </div>

      <section className="card p-4">
        <h3 className="m-0">Las 10 prioridades para la próxima gestión</h3>
        <p className="text-xs faint mt-1 mb-3">
          Orden derivado de una fórmula explícita, no de preferencias: 50 % magnitud del deterioro desde 2019 (recortado a 50 %), 30 % tendencia reciente (pendiente y R²),
          20 % si empeoró; multiplicado por la posibilidad de intervención municipal (MML 1,0 · compartida 0,8 · otra entidad 0,4 · externo 0,2) y la confiabilidad del dato (alta 1,0 · media 0,8 · baja 0,5).
        </p>
        <ol className="m-0 p-0 list-none flex flex-col gap-2">
          {prioridades.map((p, k) => (
            <li key={p.i.id} className="grid gap-3 items-start hair pt-2" style={{ gridTemplateColumns: '32px 1fr auto' }}>
              <div className="display font-semibold text-[22px] num">{k + 1}</div>
              <div>
                <div className="font-semibold">{p.i.nombre} <span className="faint text-sm">· {DIMENSIONES.find((d) => d.id === p.i.dimension)?.corto}</span></div>
                <div className="text-sm muted num">{textoCambio(p.i)}{p.t ? ` · pendiente ${signed(p.t.pendiente, '/año', Math.abs(p.t.pendiente) < 10 ? 1 : 0)} (R² ${p.t.r2.toFixed(2)})` : ''}</div>
                <div className="mt-1"><CompetenciaChip c={p.i.competencia} responsable={p.i.responsable_principal} /></div>
              </div>
              <div className="num text-sm faint">puntaje {p.score.toFixed(2)}</div>
            </li>
          ))}
          {prioridades.length === 0 && <li className="faint text-sm">Sin indicadores suficientes.</li>}
        </ol>
      </section>
    </div>
  )
}
