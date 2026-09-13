import { useState } from 'react'
import { eventos, colorGestion, nombreGestion, gestiones } from '../data'
import { Fuentes } from '../components/Chips'
import { fecha } from '../lib/format'

const CATS: Record<string, string> = { obra: 'Obras', presupuesto: 'Presupuesto', institucional: 'Institucional', transporte: 'Transporte', seguridad: 'Seguridad', politico: 'Político' }

export function Timeline() {
  const [cat, setCat] = useState('todas')
  const lista = eventos.filter((e) => cat === 'todas' || e.categoria === cat)
  const anios = Array.from(new Set(lista.map((e) => e.fecha.slice(0, 4))))
  return (
    <div className="flex flex-col gap-5">
      <header className="pt-8">
        <h2 className="m-0">Línea de tiempo 2019–2026</h2>
        <p className="muted mt-2 mb-0 max-w-[85ch]">Acontecimientos con fecha y fuente. La franja izquierda indica qué administración estaba a cargo.</p>
        <div className="flex flex-wrap gap-3 mt-3 text-sm">
          {gestiones.map((g) => <span key={g.id} className="inline-flex items-center gap-1.5"><span className="chip-dot" style={{ background: colorGestion[g.id] ?? 'var(--ink-3)', width: 10, height: 10 }} />{g.alcalde}: {fecha(g.inicio)} – {g.fin ? fecha(g.fin) : 'en curso'}{g.nota ? <span className="faint"> ({g.nota})</span> : null}</span>)}
        </div>
      </header>
      <div className="flex gap-1 flex-wrap">
        <button className="btn" aria-pressed={cat === 'todas'} onClick={() => setCat('todas')}>Todos</button>
        {Object.entries(CATS).map(([k, v]) => <button key={k} className="btn" aria-pressed={cat === k} onClick={() => setCat(k)}>{v}</button>)}
      </div>
      {lista.length === 0 && <p className="muted">Sin eventos registrados.</p>}
      <ol className="m-0 p-0 list-none flex flex-col gap-6">
        {anios.map((a) => (
          <li key={a}>
            <div className="display font-semibold text-[28px] mb-2">{a}</div>
            <ul className="m-0 p-0 list-none flex flex-col gap-2">
              {lista.filter((e) => e.fecha.startsWith(a)).map((e, i) => (
                <li key={i} className="card p-3 grid gap-3" style={{ gridTemplateColumns: '6px 110px 1fr', borderLeft: 'none' }}>
                  <div style={{ background: colorGestion[e.gestion] ?? 'var(--ink-3)', borderRadius: 3 }} title={nombreGestion[e.gestion] ?? e.gestion} />
                  <div className="text-sm muted num">{fecha(e.fecha)}<div className="text-xs faint">{CATS[e.categoria] ?? e.categoria}</div></div>
                  <div>
                    <div className="font-semibold">{e.titulo}</div>
                    {e.descripcion && <div className="text-sm muted mt-0.5">{e.descripcion}</div>}
                    <div className="mt-1"><Fuentes fuentes={e.fuentes} compact /></div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
