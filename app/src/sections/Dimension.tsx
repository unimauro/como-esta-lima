import { useState } from 'react'
import { porDimension, resumenes, advertencias, DIMENSIONES } from '../data'
import { IndicadorCard } from '../components/IndicadorCard'
import { etiquetaCompetencia } from '../components/Chips'
import { cambioTotal } from '../lib/trend'

export function Dimension({ id }: { id: string }) {
  const d = DIMENSIONES.find((x) => x.id === id)
  const inds = porDimension(id)
  const [comp, setComp] = useState<string>('todas')
  const [dir, setDir] = useState<string>('todas')
  const [verResumen, setVerResumen] = useState(false)
  const comps = Array.from(new Set(inds.map((i) => i.competencia)))
  const lista = inds.filter((i) => (comp === 'todas' || i.competencia === comp) && (dir === 'todas' || cambioTotal(i).direccion === dir))
  const conDato = inds.filter((i) => !i.contexto && i.serie.some((p) => p.valor !== null)).length
  const resumen = resumenes[id]
  const resumenLargo = resumen && resumen.length > 320
  return (
    <div className="flex flex-col gap-5">
      <header className="pt-8">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="m-0">{d?.nombre ?? id}</h2>
          <span className="chip">{inds.length} indicadores · {conDato} con serie</span>
        </div>
        {resumen && (
          <div className="mt-2 max-w-[85ch]">
            <p className="muted m-0">{resumenLargo && !verResumen ? resumen.slice(0, 300).replace(/\s\S*$/, '') + '…' : resumen}</p>
            {resumenLargo && <button className="btn mt-2" style={{ fontSize: 12, padding: '3px 8px' }} onClick={() => setVerResumen((v) => !v)}>{verResumen ? 'Ver menos' : 'Ver metodología completa'}</button>}
          </div>
        )}
      </header>
      {advertencias[id] && (
        <aside className="card p-4" style={{ borderColor: 'var(--color-serio)', background: 'color-mix(in srgb, var(--color-serio) 8%, var(--bg-2))' }} role="note">
          <div className="flex items-start gap-2">
            <span aria-hidden style={{ fontSize: 18, lineHeight: 1.2 }}>⚠️</span>
            <div>
              <div className="font-semibold text-sm mb-0.5">Cómo leer estos datos</div>
              <p className="text-sm muted m-0 max-w-[90ch]">{advertencias[id]}</p>
            </div>
          </div>
        </aside>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm muted">Competencia:</span>
        <button className="btn" aria-pressed={comp === 'todas'} onClick={() => setComp('todas')}>Todas</button>
        {comps.map((c) => <button key={c} className="btn" aria-pressed={comp === c} onClick={() => setComp(c)}>{etiquetaCompetencia[c] ?? c}</button>)}
        <span className="text-sm muted ml-3">Tendencia:</span>
        {[['todas', 'Todas'], ['mejora', 'Mejoró'], ['estable', 'Similar'], ['empeora', 'Empeoró'], ['sin_datos', 'Sin datos']].map(([k, t]) => (
          <button key={k} className="btn" aria-pressed={dir === k} onClick={() => setDir(k)}>{t}</button>
        ))}
      </div>
      {lista.length === 0 && <p className="muted">Ningún indicador cumple el filtro{inds.length === 0 ? ': esta dimensión aún no tiene datos cargados' : ''}.</p>}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {lista.map((i) => <IndicadorCard key={i.id} ind={i} />)}
      </div>
    </div>
  )
}
