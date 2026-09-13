const nf0 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 })
const nf1 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })
const nf2 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 })

export function fmt(n: number | null | undefined, decimals = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return 's/d'
  if (decimals === 0) return nf0.format(n)
  if (decimals === 2) return nf2.format(n)
  if (Math.abs(n) >= 1000) return nf0.format(n)
  return nf1.format(n)
}

/** Soles en millones: S/ 1 252,9 M */
export function soles(n: number | null | undefined): string {
  if (n === null || n === undefined) return 's/d'
  const m = n / 1e6
  if (Math.abs(m) >= 1000) return `S/ ${nf1.format(m / 1000)} mil M`
  return `S/ ${nf1.format(m)} M`
}

export function pct(n: number | null | undefined, decimals = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return 's/d'
  return `${nf1.format(n).replace(/,0$/, decimals === 0 ? '' : ',0')}%`
}

export function signed(n: number | null | undefined, unit = '', decimals = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return 's/d'
  const s = n > 0 ? '+' : n < 0 ? '−' : ''
  const v = decimals === 0 ? nf0.format(Math.abs(n)) : nf1.format(Math.abs(n))
  return `${s}${v}${unit}`
}

export function valorConUnidad(v: number | null | undefined, unidad: string): string {
  if (v === null || v === undefined) return 'sin dato'
  const u = unidad.trim()
  if (u === '%') return `${fmt(v)}%`
  if (/^S\/|soles/i.test(u) && Math.abs(v) >= 1e6) return soles(v)
  if (/^S\//.test(u)) return `S/ ${fmt(v, Math.abs(v) >= 100 ? 0 : 2)}`
  if (/US\$|USD/.test(u)) return `US$ ${fmt(v, 0)}`
  if (Math.abs(v) >= 1e6) return `${nf2.format(v / 1e6)} M ${u}`
  return `${fmt(v, Number.isInteger(v) ? 0 : 1)} ${u}`
}

export function fecha(iso: string | null | undefined): string {
  if (!iso) return 's/f'
  const [y, m, d] = iso.split('-').map(Number)
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic']
  if (!m) return String(y)
  if (!d) return `${meses[m - 1]} ${y}`
  return `${d} ${meses[m - 1]} ${y}`
}

export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']
