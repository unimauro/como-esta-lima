import type { Indicador } from '../types'
import { cambioTotal, cambiosPorGestion, type Cambio } from './trend'
import { DIMENSIONES } from '../data'

export type Modo = 'total' | 'munoz' | 'lopez_aliaga'
const TOPE = 50

/** Cambio orientado (positivo = mejor), en % relativo, recortado a ±50. Null si no hay dato. */
export function scoreIndicador(ind: Indicador, c: Cambio): number | null {
  if (c.pct === null || !c.desde || !c.hasta) return null
  let s = c.pct
  if (ind.mejor_si === 'baja') s = -s
  return Math.max(-TOPE, Math.min(TOPE, s))
}

export function cambioSegunModo(ind: Indicador, modo: Modo): Cambio {
  if (modo === 'total') return cambioTotal(ind)
  const g = cambiosPorGestion(ind)
  return modo === 'munoz' ? g.munoz : g.lopez_aliaga
}

export interface ScoreDimension {
  id: string
  nombre: string
  score: number | null
  n: number
  detalle: { ind: Indicador; score: number | null; cambio: Cambio }[]
}

export function scoresPorDimension(indicadores: Indicador[], modo: Modo): ScoreDimension[] {
  return DIMENSIONES.filter((d) => d.enIndice).map((d) => {
    const inds = indicadores.filter((i) => i.dimension === d.id && !i.contexto)
    const detalle = inds.map((ind) => {
      const cambio = cambioSegunModo(ind, modo)
      return { ind, cambio, score: scoreIndicador(ind, cambio) }
    })
    const con = detalle.filter((x) => x.score !== null)
    const score = con.length ? con.reduce((s, x) => s + (x.score as number), 0) / con.length : null
    return { id: d.id, nombre: d.nombre, score, n: con.length, detalle }
  })
}

export function indiceCompuesto(scores: ScoreDimension[], pesos: Record<string, number>): number | null {
  let num = 0, den = 0
  for (const s of scores) {
    const w = pesos[s.id] ?? 0
    if (s.score === null || w <= 0) continue
    num += w * s.score; den += w
  }
  return den ? num / den : null
}

export const PRESETS: Record<string, { nombre: string; pesos: Record<string, number> }> = {
  base: { nombre: 'Equilibrado', pesos: Object.fromEntries(DIMENSIONES.map((d) => [d.id, d.pesoDefault])) },
  seguridad: { nombre: 'Priorizar seguridad', pesos: { movilidad: 15, seguridad: 40, costo_vida: 15, servicios_ambiente: 10, finanzas: 5, institucional: 15 } },
  trafico: { nombre: 'Priorizar tráfico', pesos: { movilidad: 40, seguridad: 15, costo_vida: 15, servicios_ambiente: 10, finanzas: 5, institucional: 15 } },
  bolsillo: { nombre: 'Priorizar costo de vida', pesos: { movilidad: 15, seguridad: 15, costo_vida: 40, servicios_ambiente: 10, finanzas: 5, institucional: 15 } },
  gestion: { nombre: 'Priorizar eficiencia municipal', pesos: { movilidad: 10, seguridad: 10, costo_vida: 10, servicios_ambiente: 15, finanzas: 35, institucional: 20 } },
}
