import { useState } from 'react'
import type { Indicador } from '../types'
import { cambioTotal, cambiosPorGestion, ultimo, etiquetaDireccion, colorDireccion, type Cambio } from '../lib/trend'
import { valorConUnidad, signed } from '../lib/format'
import { Sparkline } from './Sparkline'
import { SerieChart } from './SerieChart'
import { CompetenciaChip, ConfiabilidadChip, Fuentes } from './Chips'

function textoCambio(c: Cambio, unidad: string) {
  if (c.abs === null || !c.desde || !c.hasta) return 'sin datos comparables'
  const esPorc = unidad.trim() === '%'
  const cuerpo = esPorc ? `${signed(c.abs, ' pp')}` : c.pct !== null ? `${signed(c.pct, '%')}` : signed(c.abs)
  return `${cuerpo} (${c.desde.anio}→${c.hasta.anio}${c.parcial ? ', parcial' : ''})`
}

export function IndicadorCard({ ind, abierto = false }: { ind: Indicador; abierto?: boolean }) {
  const [open, setOpen] = useState(abierto)
  const ult = ultimo(ind.serie)
  const total = cambioTotal(ind)
  const g = cambiosPorGestion(ind)
  const sinDatos = !ult
  return (
    <article className="card p-4 flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[17px] leading-tight">{ind.nombre}</h3>
          {ind.ambito && <div className="faint text-xs mt-0.5">{ind.ambito}</div>}
        </div>
        <Sparkline serie={ind.serie} color={colorDireccion[total.direccion]} />
      </header>

      {sinDatos ? (
        <p className="muted text-sm m-0">Sin datos comparables encontrados. {ind.nota}</p>
      ) : (
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-baseline">
          <div className="big num">{valorConUnidad(ult.valor, ind.unidad)}</div>
          <div className="text-sm muted">
            {ult.anio}{ult.parcial ? ' · parcial' : ''}
            <span className="ml-2 font-semibold" style={{ color: colorDireccion[total.direccion] }}>{etiquetaDireccion[total.direccion]}</span>
          </div>
          <div className="text-xs faint col-span-2">
            Desde 2019: <span className="num text-[var(--ink)]">{textoCambio(total, ind.unidad)}</span>
          </div>
          <div className="text-xs faint col-span-2 flex flex-wrap gap-x-4">
            <span>Gestión Muñoz: <span className="num" style={{ color: colorDireccion[g.munoz.direccion] }}>{textoCambio(g.munoz, ind.unidad)}</span></span>
            <span>Gestión López Aliaga: <span className="num" style={{ color: colorDireccion[g.lopez_aliaga.direccion] }}>{textoCambio(g.lopez_aliaga, ind.unidad)}</span></span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        <CompetenciaChip c={ind.competencia} responsable={ind.responsable_principal} />
        <ConfiabilidadChip c={ind.confiabilidad} />
        <span className="chip">{ind.mejor_si === 'baja' ? 'Mejor si baja' : 'Mejor si sube'}</span>
      </div>

      <button className="btn self-start" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Ocultar detalle' : 'Ver serie, fuentes y notas'}
      </button>

      {open && (
        <div className="flex flex-col gap-3 hair pt-3">
          {ind.descripcion && <p className="text-sm muted m-0">{ind.descripcion}</p>}
          <SerieChart serie={ind.serie} unidad={ind.unidad} nombre={ind.nombre} />
          <div className="scroll-x">
            <table className="tbl">
              <thead><tr><th>Año</th><th className="r">Valor</th><th>Nota</th></tr></thead>
              <tbody>
                {ind.serie.map((p) => (
                  <tr key={p.anio}>
                    <td>{p.anio}{p.parcial ? ' (parcial)' : ''}</td>
                    <td className="r num">{p.valor === null ? <span className="faint">sin dato</span> : valorConUnidad(p.valor, ind.unidad)}</td>
                    <td className="faint">{p.nota ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ind.discrepancias && <p className="text-sm m-0"><span className="font-semibold">Discrepancias entre fuentes:</span> <span className="muted">{ind.discrepancias}</span></p>}
          {ind.nota && <p className="text-sm m-0"><span className="font-semibold">Nota:</span> <span className="muted">{ind.nota}</span></p>}
          {ind.responsable_principal && <p className="text-sm m-0"><span className="font-semibold">Responsable principal:</span> <span className="muted">{ind.responsable_principal}</span></p>}
          <div><div className="font-semibold text-sm mb-1">Fuentes</div><Fuentes fuentes={ind.fuentes} /></div>
        </div>
      )}
    </article>
  )
}
