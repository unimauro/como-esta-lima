import { useState } from 'react'
import { promesas, nombreGestion } from '../data'
import { EstadoChip, Fuentes, GestionChip, etiquetaEstado } from '../components/Chips'
import { fecha, soles } from '../lib/format'

const ORDEN = ['cumplido', 'en_ejecucion', 'parcial', 'no_cumplido', 'no_verificable']

export function Promesas() {
  const [g, setG] = useState('todas')
  const [abierta, setAbierta] = useState<number | null>(null)
  const lista = promesas.filter((p) => g === 'todas' || p.gestion === g)
  const resumen = (gest: string) => ORDEN.map((e) => ({ e, n: promesas.filter((p) => p.gestion === gest && p.estado === e).length }))
  return (
    <div className="flex flex-col gap-5">
      <header className="pt-8">
        <h2 className="m-0">Prometido vs. ejecutado</h2>
        <p className="muted mt-2 mb-0 max-w-[85ch]">Compromisos tomados de los planes de gobierno inscritos ante el JNE y de anuncios públicos principales. Una promesa solo cuenta como cumplida con evidencia de ejecución, no por haber sido anunciada varias veces.</p>
      </header>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {['munoz', 'lopez_aliaga'].map((gest) => {
          const r = resumen(gest); const tot = r.reduce((s, x) => s + x.n, 0)
          return (
            <div key={gest} className="card p-4">
              <div className="flex items-center justify-between"><span className="font-semibold">{nombreGestion[gest]}</span><span className="faint text-sm num">{tot} compromisos</span></div>
              <div className="flex h-3 rounded overflow-hidden mt-2 gap-px" aria-hidden>
                {r.map((x) => x.n > 0 && <div key={x.e} style={{ width: `${(x.n / tot) * 100}%`, background: etiquetaEstado[x.e].c }} title={`${etiquetaEstado[x.e].t}: ${x.n}`} />)}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs muted">
                {r.map((x) => <span key={x.e} className="inline-flex items-center gap-1"><span className="chip-dot" style={{ background: etiquetaEstado[x.e].c }} />{etiquetaEstado[x.e].t} {x.n}</span>)}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-1 flex-wrap">
        {[['todas', 'Todas'], ['munoz', 'Muñoz'], ['lopez_aliaga', 'López Aliaga']].map(([k, t]) => <button key={k} className="btn" aria-pressed={g === k} onClick={() => setG(k)}>{t}</button>)}
      </div>
      <div className="scroll-x card">
        <table className="tbl">
          <thead><tr><th>Gestión</th><th>Compromiso</th><th>Fecha</th><th className="r">Presupuesto anunciado</th><th>Estado</th></tr></thead>
          <tbody>
            {lista.map((p, i) => (
              <>
                <tr key={i} onClick={() => setAbierta(abierta === i ? null : i)} style={{ cursor: 'pointer' }}>
                  <td><GestionChip g={p.gestion} /></td>
                  <td className="font-semibold">{p.promesa}</td>
                  <td className="muted text-sm">{fecha(p.fecha)}</td>
                  <td className="r num">{typeof p.presupuesto_anunciado === 'number' ? soles(p.presupuesto_anunciado) : p.presupuesto_anunciado ?? <span className="faint">s/d</span>}</td>
                  <td><EstadoChip e={p.estado} /></td>
                </tr>
                {abierta === i && (
                  <tr key={`${i}-d`}><td colSpan={5} style={{ background: 'var(--bg)' }}>
                    <div className="grid gap-3 py-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                      <p className="text-sm m-0"><span className="font-semibold">Evidencia:</span> <span className="muted">{p.evidencia ?? 's/d'}</span></p>
                      <div><div className="font-semibold text-sm mb-1">Fuentes</div><Fuentes fuentes={p.fuentes} compact /></div>
                    </div>
                  </td></tr>
                )}
              </>
            ))}
            {lista.length === 0 && <tr><td colSpan={5} className="muted">Sin compromisos registrados para este filtro.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
