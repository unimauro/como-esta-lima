import type { Indicador, Punto } from '../types'

export type Direccion = 'mejora' | 'empeora' | 'estable' | 'sin_datos'

export interface Cambio {
  desde: Punto | null
  hasta: Punto | null
  abs: number | null
  pct: number | null
  direccion: Direccion
  /** true si el punto final es parcial (p. ej. 2026 en curso) */
  parcial: boolean
}

const UMBRAL_ESTABLE = 3 // % de variación por debajo del cual se considera "similar"

export function puntosValidos(serie: Punto[]): Punto[] {
  return serie.filter((p) => p.valor !== null && p.valor !== undefined && !Number.isNaN(p.valor))
}

export function puntoEn(serie: Punto[], anio: number): Punto | null {
  return puntosValidos(serie).find((p) => p.anio === anio) ?? null
}

/** Último punto con dato; si `soloCompletos`, ignora los marcados como parciales. */
export function ultimo(serie: Punto[], soloCompletos = false): Punto | null {
  const v = puntosValidos(serie).filter((p) => !soloCompletos || !p.parcial)
  return v.length ? v[v.length - 1] : null
}
export function primero(serie: Punto[]): Punto | null {
  const v = puntosValidos(serie)
  return v.length ? v[0] : null
}

export function direccion(pctCambio: number | null, mejorSi: string): Direccion {
  if (pctCambio === null || Number.isNaN(pctCambio)) return 'sin_datos'
  if (Math.abs(pctCambio) < UMBRAL_ESTABLE) return 'estable'
  const sube = pctCambio > 0
  if (mejorSi === 'sube') return sube ? 'mejora' : 'empeora'
  if (mejorSi === 'baja') return sube ? 'empeora' : 'mejora'
  return 'estable'
}

export function cambioEntre(ind: Indicador, desdeAnio: number, hastaAnio: number, tolerancia = 1): Cambio {
  const v = puntosValidos(ind.serie)
  // toma el punto más cercano dentro de la tolerancia (p. ej. si no hay 2019 pero sí 2020)
  const pick = (a: number, dir: 1 | -1) => {
    for (let k = 0; k <= tolerancia; k++) {
      const p = v.find((q) => q.anio === a + dir * k)
      if (p) return p
    }
    return null
  }
  const desde = pick(desdeAnio, 1)
  const hasta = pick(hastaAnio, -1)
  if (!desde || !hasta || desde.anio >= hasta.anio) {
    return { desde, hasta, abs: null, pct: null, direccion: 'sin_datos', parcial: !!hasta?.parcial }
  }
  const abs = (hasta.valor as number) - (desde.valor as number)
  const base = desde.valor as number
  const pctv = base === 0 ? null : (abs / Math.abs(base)) * 100
  // Para indicadores en % (puntos porcentuales) usamos el cambio absoluto como "pct" orientador
  const esPorc = ind.unidad.trim() === '%' || /puntos/.test(ind.unidad)
  const orient = esPorc ? abs : pctv
  return { desde, hasta, abs, pct: pctv, direccion: direccion(orient, ind.mejor_si), parcial: !!hasta.parcial }
}

/** 2019 → último dato completo (o parcial si no hay otro). Respeta comparable_desde
 *  (año a partir del cual la serie es comparable tras un cambio de ámbito/metodología). */
export function cambioTotal(ind: Indicador): Cambio {
  const fin = ultimo(ind.serie, true) ?? ultimo(ind.serie)
  const base = ind.comparable_desde
    ? puntosValidos(ind.serie).find((p) => p.anio >= (ind.comparable_desde as number)) ?? primero(ind.serie)
    : primero(ind.serie)
  if (!fin || !base) return { desde: base, hasta: fin, abs: null, pct: null, direccion: 'sin_datos', parcial: false }
  return cambioEntre(ind, base.anio, fin.anio, 0)
}

/** Cambio durante la gestión Muñoz (2019→2022) y López Aliaga (2022→último completo). */
export function cambiosPorGestion(ind: Indicador) {
  const fin = ultimo(ind.serie, true) ?? ultimo(ind.serie)
  return {
    munoz: cambioEntre(ind, 2019, 2022, 1),
    lopez_aliaga: fin && fin.anio > 2022 ? cambioEntre(ind, 2022, fin.anio, 1) : cambioEntre(ind, 2022, 2025, 1),
  }
}

/** Regresión lineal simple sobre los puntos completos; devuelve pendiente/año y proyección. */
export function tendenciaLineal(serie: Punto[]) {
  const v = puntosValidos(serie).filter((p) => !p.parcial)
  if (v.length < 3) return null
  const n = v.length
  const mx = v.reduce((s, p) => s + p.anio, 0) / n
  const my = v.reduce((s, p) => s + (p.valor as number), 0) / n
  let sxy = 0
  let sxx = 0
  for (const p of v) {
    sxy += (p.anio - mx) * ((p.valor as number) - my)
    sxx += (p.anio - mx) ** 2
  }
  if (sxx === 0) return null
  const b = sxy / sxx
  const a = my - b * mx
  const ss_tot = v.reduce((s, p) => s + ((p.valor as number) - my) ** 2, 0)
  const ss_res = v.reduce((s, p) => s + ((p.valor as number) - (a + b * p.anio)) ** 2, 0)
  const r2 = ss_tot === 0 ? 1 : 1 - ss_res / ss_tot
  return {
    pendiente: b,
    intercepto: a,
    r2,
    n,
    desde: v[0].anio,
    hasta: v[n - 1].anio,
    proyectar: (anio: number) => a + b * anio,
  }
}

export const etiquetaDireccion: Record<Direccion, string> = {
  mejora: 'mejoró',
  empeora: 'empeoró',
  estable: 'similar',
  sin_datos: 'sin datos suficientes',
}

export const colorDireccion: Record<Direccion, string> = {
  mejora: 'var(--color-bueno)',
  empeora: 'var(--color-critico)',
  estable: 'var(--color-alerta)',
  sin_datos: 'var(--ink-3)',
}
