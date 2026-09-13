import { useState } from 'react'
import { porDimension, resumenes, DIMENSIONES } from '../data'
import { IndicadorCard } from '../components/IndicadorCard'
import { etiquetaCompetencia } from '../components/Chips'
import { cambioTotal } from '../lib/trend'

export function Dimension({ id }: { id: string }) {
  const d = DIMENSIONES.find((x) => x.id === id)
  const inds = porDimension(id)
  const [comp, setComp] = useState<string>('todas')
  const [dir, setDir] = useState<string>('todas')
  const comps = Array.from(new Set(inds.map((i) => i.competencia)))
  const lista = inds.filter((i) => (comp === 'todas' || i.competencia === comp) && (dir === 'todas' || cambioTotal(i).direccion === dir))
  return (
    <div className="flex flex-col gap-5">
      <header className="pt-8">
        <h2 className="m-0">{d?.nombre ?? id}</h2>
        {resumenes[id] && <p className="muted mt-2 mb-0 max-w-[85ch]">{resumenes[id]}</p>}
      </header>
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
