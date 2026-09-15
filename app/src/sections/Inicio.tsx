import { useMemo, useState } from 'react'
import { indicadores, indicadoresNucleo, DIMENSIONES, gestiones, FECHA_CORTE, mef } from '../data'
import { scoresPorDimension, indiceCompuesto, PRESETS, type Modo } from '../lib/indice'
import { cambioTotal, colorDireccion, etiquetaDireccion, type Direccion } from '../lib/trend'
import { Sparkline } from '../components/Sparkline'
import { signed, soles } from '../lib/format'
import { LeyendaGestiones } from '../components/SerieChart'
import { LimaSkyline } from '../components/LimaSkyline'
import { EjecucionAvance } from '../components/EjecucionAvance'

function Skyline({ onIr }: { onIr: (id: string) => void }) {
  const dims = DIMENSIONES.filter((d) => d.enIndice)
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
      {dims.map((d) => {
        const inds = indicadoresNucleo.filter((i) => i.dimension === d.id)
        const conteo: Record<Direccion, number> = { mejora: 0, empeora: 0, estable: 0, sin_datos: 0 }
        for (const i of inds) conteo[cambioTotal(i).direccion]++
        const total = conteo.mejora + conteo.empeora + conteo.estable
        const dominante: Direccion = total === 0 ? 'sin_datos' : conteo.empeora > conteo.mejora ? 'empeora' : conteo.mejora > conteo.empeora ? 'mejora' : 'estable'
        // indicador más representativo: el de mayor |cambio| con confiabilidad alta
        const rep = inds
          .map((i) => ({ i, c: cambioTotal(i) }))
          .filter((x) => x.c.pct !== null)
          .sort((a, b) => (b.i.confiabilidad === 'alta' ? 1 : 0) - (a.i.confiabilidad === 'alta' ? 1 : 0) || Math.abs(b.c.pct!) - Math.abs(a.c.pct!))[0]
        return (
          <button key={d.id} onClick={() => onIr(d.id)} className="card p-3 text-left flex flex-col gap-2 hover:border-[var(--accent)]" style={{ cursor: 'pointer' }}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[15px] leading-tight">{d.corto}</span>
              <span className="chip-dot" style={{ background: colorDireccion[dominante], width: 10, height: 10 }} aria-hidden />
            </div>
            {rep ? (
              <>
                <Sparkline serie={rep.i.serie} color={colorDireccion[cambioTotal(rep.i).direccion]} w={130} h={34} />
                <div className="text-xs muted leading-snug">{rep.i.nombre}</div>
                <div className="text-xs faint">{rep.c.desde?.anio}→{rep.c.hasta?.anio}: <span className="num" style={{ color: colorDireccion[rep.c.direccion] }}>{rep.i.unidad.trim() === '%' ? signed(rep.c.abs, ' pp') : signed(rep.c.pct, '%')}</span></div>
              </>
            ) : (
              <div className="text-xs faint">Sin series comparables aún.</div>
            )}
            <div className="text-xs faint num">
              <span style={{ color: colorDireccion.mejora }}>▲ {conteo.mejora}</span> · <span style={{ color: colorDireccion.estable }}>■ {conteo.estable}</span> · <span style={{ color: colorDireccion.empeora }}>▼ {conteo.empeora}</span> · {conteo.sin_datos} s/d
            </div>
          </button>
        )
      })}
    </div>
  )
}

function fraseDiagnostico() {
  const con = indicadoresNucleo.map((i) => ({ i, c: cambioTotal(i) })).filter((x) => x.c.direccion !== 'sin_datos')
  const m = con.filter((x) => x.c.direccion === 'mejora').length
  const e = con.filter((x) => x.c.direccion === 'empeora').length
  const s = con.filter((x) => x.c.direccion === 'estable').length
  if (!con.length) return 'Aún no hay series comparables cargadas.'
  return `De ${con.length} indicadores con serie comparable desde 2019, ${m} mejoraron, ${e} empeoraron y ${s} se mantuvieron similares. El balance depende de qué pese más para cada persona: ajusta los pesos abajo.`
}

export function Indice() {
  const [modo, setModo] = useState<Modo>('total')
  const [pesos, setPesos] = useState<Record<string, number>>(PRESETS.base.pesos)
  const scores = useMemo(() => scoresPorDimension(indicadores, modo), [modo])
  const total = indiceCompuesto(scores, pesos)
  const sum = Object.values(pesos).reduce((a, b) => a + b, 0)
  return (
    <section className="card p-5 flex flex-col gap-4" aria-labelledby="indice-t">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="indice-t">Índice de cambio de Lima</h2>
          <p className="muted m-0 text-sm max-w-[70ch]">
            Mide el <strong>cambio</strong> (no el nivel) de cada dimensión: promedio del cambio porcentual de sus indicadores,
            orientado para que positivo = mejor y recortado a ±50. Los pesos son subjetivos: muévelos.
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {([['total', '2019 → hoy'], ['munoz', 'Gestión Muñoz'], ['lopez_aliaga', 'Gestión López Aliaga']] as [Modo, string][]).map(([k, t]) => (
            <button key={k} className="btn" aria-pressed={modo === k} onClick={() => setModo(k)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 items-start indice-cols">
        <div className="card p-4 flex flex-col items-start gap-1" style={{ background: 'var(--bg)' }}>
          <div className="text-sm muted">Índice ponderado</div>
          <div className="display num" style={{ fontSize: 56, fontWeight: 600, lineHeight: 1, color: total === null ? 'var(--ink-3)' : total > 3 ? colorDireccion.mejora : total < -3 ? colorDireccion.empeora : colorDireccion.estable }}>
            {total === null ? 's/d' : signed(total, '', 1)}
          </div>
          <div className="text-xs faint">escala −50 (empeoró) a +50 (mejoró); 0 = sin cambio neto</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(PRESETS).map(([k, p]) => (
              <button key={k} className="btn" style={{ fontSize: 12, padding: '4px 8px' }} aria-pressed={JSON.stringify(pesos) === JSON.stringify(p.pesos)} onClick={() => setPesos(p.pesos)}>{p.nombre}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {scores.map((s) => (
            <div key={s.id} className="grid items-center gap-3" style={{ gridTemplateColumns: 'minmax(0, 1fr) 90px 56px' }}>
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm">{s.nombre}</span>
                  <span className="text-xs faint num">{s.n} indic. · peso {pesos[s.id] ?? 0} ({sum ? Math.round(((pesos[s.id] ?? 0) / sum) * 100) : 0}%)</span>
                </div>
                <input type="range" min={0} max={50} value={pesos[s.id] ?? 0} aria-label={`Peso de ${s.nombre}`}
                  onChange={(e) => setPesos({ ...pesos, [s.id]: Number(e.target.value) })} />
              </div>
              <div className="h-2 rounded relative" style={{ background: 'var(--bg-3)' }} aria-hidden>
                <div className="absolute top-0 bottom-0" style={{ left: '50%', width: 1, background: 'var(--ink-3)' }} />
                {s.score !== null && (
                  <div className="absolute top-0 bottom-0 rounded" style={{
                    left: s.score >= 0 ? '50%' : `${50 + s.score}%`, width: `${Math.abs(s.score)}%`,
                    background: s.score > 3 ? colorDireccion.mejora : s.score < -3 ? colorDireccion.empeora : colorDireccion.estable,
                  }} />
                )}
              </div>
              <div className="num text-sm text-right" style={{ color: s.score === null ? 'var(--ink-3)' : undefined }}>{s.score === null ? 's/d' : signed(s.score, '', 1)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Inicio({ onIr }: { onIr: (id: string) => void }) {
  const ultimoMef = mef.anios.filter((a) => !a.parcial).at(-1)
  const pobl = indicadores.find((i) => i.id === 'poblacion_lima_metropolitana')?.serie.filter((p) => p.valor).at(-1)
  const nDatos = indicadoresNucleo.filter((i) => i.serie.some((p) => p.valor !== null)).length
  const stats: [string, string, string][] = [
    ['Población de Lima', pobl ? `${(pobl.valor as number / 1e6).toFixed(2).replace('.', ',')} M` : 's/d', pobl ? `provincia de Lima, ${pobl.anio}` : ''],
    ['Presupuesto municipal', ultimoMef ? soles(ultimoMef.pim) : 's/d', ultimoMef ? `PIM ${ultimoMef.anio}, ejecución ${ultimoMef.ejecucion_pct}%` : ''],
    ['Indicadores con serie', String(nDatos), 'de 7 dimensiones, con fuente'],
    ['Corte de datos', FECHA_CORTE.split('-').reverse().join('/'), '43 distritos'],
  ]
  return (
    <div className="flex flex-col gap-8">
      <header className="pt-6 pb-2">
        <div className="mb-5"><LimaSkyline alto={180} /></div>
        <div className="masthead mb-4">
          <span>Observatorio ciudadano de Lima Metropolitana</span>
          <span className="faint">Datos oficiales de 2019 a 2026, con corte al 12 de septiembre de 2026</span>
        </div>
        <h1 className="m-0">¿Está Lima mejor que en 2019?</h1>
        <p className="text-[18px] muted max-w-[72ch] mt-3 mb-5">{fraseDiagnostico()}</p>
        <div className="grid gap-px rounded-lg overflow-hidden" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', background: 'var(--line)' }}>
          {stats.map(([k, v, s]) => (
            <div key={k} className="p-3" style={{ background: 'var(--bg-2)' }}>
              <div className="text-xs faint">{k}</div>
              <div className="big num" style={{ fontSize: 'clamp(20px, 5.2vw, 26px)', overflowWrap: 'anywhere' }}>{v}</div>
              <div className="text-xs faint mt-0.5">{s}</div>
            </div>
          ))}
        </div>
        <p className="text-sm faint max-w-[80ch] mt-4 mb-0">
          Fotografía de la ciudad al cierre de cada gestión municipal y hacia dónde va, con datos oficiales rastreables.
          Cada indicador señala quién tiene competencia sobre él: la ciudad no depende solo del alcalde.
        </p>
      </header>

      <section aria-labelledby="skyline-t" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 id="skyline-t" className="m-0">Cómo cambió cada dimensión desde 2019</h2>
          <span className="text-xs faint">Cada tarjeta muestra el indicador de mayor cambio y el conteo de indicadores que mejoraron ▲, se mantuvieron ■ o empeoraron ▼.</span>
        </div>
        <Skyline onIr={onIr} />
        <div className="hair pt-3 flex flex-wrap gap-3 justify-between">
          <LeyendaGestiones />
          <span className="text-xs faint">{gestiones.length} periodos de gestión en el eje de tiempo de todos los gráficos.</span>
        </div>
      </section>

      <Indice />

      <EjecucionAvance />

      <section className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {[
          ['obras', 'Obras: ¿quién hizo qué?', 'Concebida, iniciada, ejecutada, terminada e inaugurada por gestiones distintas: sin atribuir la obra a quien cortó la cinta.'],
          ['finanzas', 'Finanzas municipales', 'PIA, PIM, devengado y girado 2019–2026 del pliego MML según el MEF, con corte mensual equivalente para el año en curso.'],
          ['lima2030', 'Lima 2030', 'Si las tendencias siguen: escenarios tendencial, mejora y deterioro para cada indicador con serie suficiente.'],
          ['diagnostico', 'Diagnóstico y prioridades', 'Qué mejoró, qué empeoró y las diez prioridades derivadas de magnitud, tendencia y competencia.'],
        ].map(([id, t, d]) => (
          <button key={id} className="card p-4 text-left hover:border-[var(--accent)]" style={{ cursor: 'pointer' }} onClick={() => onIr(id)}>
            <div className="font-semibold text-[16px]">{t}</div>
            <div className="text-sm muted mt-1">{d}</div>
          </button>
        ))}
      </section>
      <p className="text-xs faint m-0">Vocabulario del tablero: subió, bajó, se mantuvo, sin datos. La dirección "{etiquetaDireccion.mejora}"/"{etiquetaDireccion.empeora}" se deriva del sentido deseable declarado en cada indicador, no de una valoración política.</p>
    </div>
  )
}
