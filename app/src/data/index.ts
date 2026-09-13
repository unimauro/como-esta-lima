import indicadoresJson from './indicadores.json'
import mefJson from './mef.json'
import proyectosJson from './proyectos.json'
import promesasJson from './promesas.json'
import timelineJson from './timeline.json'
import gestionesJson from './gestiones.json'
import type { Indicador, MefJson, Proyecto, Promesa, Evento, GestionInfo } from '../types'

export const FECHA_CORTE = '2026-09-12'

export const mef = mefJson as unknown as MefJson
export const proyectos = proyectosJson as unknown as Proyecto[]
export const promesas = promesasJson as unknown as Promesa[]
export const eventos = (timelineJson as unknown as Evento[]).slice().sort((a, b) => a.fecha.localeCompare(b.fecha))
export const resumenes = (indicadoresJson as { resumenes: Record<string, string | undefined> }).resumenes

/** Periodos de gestión (de data/research/institucional.json; con respaldo documentado si falta). */
const gestionesRaw = gestionesJson as unknown as GestionInfo[]
export const gestiones: GestionInfo[] = gestionesRaw.length
  ? gestionesRaw
  : [
      { id: 'munoz', alcalde: 'Jorge Muñoz', inicio: '2019-01-01', fin: '2022-04-04', nota: 'Fecha de fin por verificar (vacancia JNE)' },
      { id: 'romero', alcalde: 'Miguel Romero', inicio: '2022-04-05', fin: '2022-12-31', nota: 'Gestión transitoria' },
      { id: 'lopez_aliaga', alcalde: 'Rafael López Aliaga', inicio: '2023-01-01', fin: null },
    ]

export const nombreGestion: Record<string, string> = {
  munoz: 'Muñoz',
  romero: 'Romero (transitoria)',
  lopez_aliaga: 'López Aliaga',
  reggiardo: 'Reggiardo (encargado)',
  gestion_anterior: 'Gestiones anteriores a 2019',
  otra_entidad: 'Otra entidad',
  mml: 'MML',
}
export const colorGestion: Record<string, string> = {
  munoz: 'var(--s-munoz)',
  romero: 'var(--s-romero)',
  lopez_aliaga: 'var(--s-la)',
  reggiardo: 'var(--s-la)',
  gestion_anterior: 'var(--ink-3)',
  otra_entidad: 'var(--color-arena)',
}

export const DIMENSIONES: { id: string; nombre: string; corto: string; pesoDefault: number; enIndice: boolean }[] = [
  { id: 'movilidad', nombre: 'Movilidad y tráfico', corto: 'Movilidad', pesoDefault: 20, enIndice: true },
  { id: 'seguridad', nombre: 'Seguridad ciudadana', corto: 'Seguridad', pesoDefault: 20, enIndice: true },
  { id: 'costo_vida', nombre: 'Costo de vida, vivienda y empleo', corto: 'Costo de vida', pesoDefault: 20, enIndice: true },
  { id: 'servicios_ambiente', nombre: 'Servicios públicos y ambiente', corto: 'Servicios y ambiente', pesoDefault: 15, enIndice: true },
  { id: 'finanzas', nombre: 'Finanzas municipales (MEF)', corto: 'Finanzas MML', pesoDefault: 10, enIndice: true },
  { id: 'institucional', nombre: 'Gestión institucional y percepción', corto: 'Gestión y percepción', pesoDefault: 15, enIndice: true },
  { id: 'demografia', nombre: 'Población (contexto)', corto: 'Población', pesoDefault: 0, enIndice: false },
]

/** Indicadores derivados del MEF para que Finanzas entre al índice con la misma estructura. */
function indicadoresMef(): Indicador[] {
  if (!mef.anios.length) return []
  const fuente = {
    nombre: 'MEF – Datos Abiertos, Gasto Devengado (pliego MML)',
    url: mef.url_base,
    fecha_consulta: mef.fecha_descarga ?? FECHA_CORTE,
    metodologia: 'Suma de todas las filas del pliego Municipalidad Metropolitana de Lima (todas sus unidades ejecutoras) en el CSV anual.',
    tipo: 'primaria',
  }
  const base = { dimension: 'finanzas', competencia: 'mml', responsable_principal: 'MML', confiabilidad: 'alta', ambito: 'Pliego MML', fuentes: [fuente] }
  const mk = (id: string, nombre: string, unidad: string, mejor_si: 'sube' | 'baja', f: (a: (typeof mef.anios)[number]) => number | null, descripcion: string, nota?: string): Indicador => ({
    id, nombre, unidad, mejor_si, descripcion, nota, ...base,
    serie: mef.anios.map((a) => ({ anio: a.anio, valor: f(a), parcial: a.parcial, nota: a.parcial ? `Año en curso: devengado hasta el mes ${a.mes_corte}` : null })),
  })
  return [
    mk('mef_ejecucion', 'Ejecución presupuestal (devengado / PIM)', '%', 'sube', (a) => a.ejecucion_pct, 'Porcentaje del presupuesto modificado efectivamente devengado en el año.', 'El año en curso no es comparable con años cerrados.'),
    mk('mef_devengado', 'Gasto devengado total', 'S/', 'sube', (a) => a.devengado, 'Monto absoluto ejecutado por el pliego MML.', 'Nominal, no ajustado por inflación.'),
    mk('mef_inversion', 'Inversión pública devengada (proyectos)', 'S/', 'sube', (a) => a.inversiones.dev, 'Devengado en proyectos de inversión (tipo de actividad = proyecto).', 'Nominal.'),
    mk('mef_capital_share', 'Participación del gasto de capital en el devengado', '%', 'sube', (a) => (a.devengado ? (a.capital.dev / a.devengado) * 100 : null), 'Qué parte de lo gastado fue capital (obras y equipamiento) frente a gasto corriente y deuda.'),
    mk('mef_personal_share', 'Gasto de personal sobre el devengado', '%', 'baja', (a) => (a.devengado ? (a.personal.dev / a.devengado) * 100 : null), 'Peso de planillas (genérica personal y obligaciones sociales) en el gasto total.'),
    mk('mef_deuda_share', 'Servicio de la deuda sobre el devengado', '%', 'baja', (a) => (a.devengado ? (a.servicio_deuda.dev / a.devengado) * 100 : null), 'Peso del pago de deuda (categoría servicio de la deuda) en el gasto total.'),
  ]
}

export const indicadores: Indicador[] = [
  ...((indicadoresJson as unknown as { indicadores: Indicador[] }).indicadores ?? []),
  ...indicadoresMef(),
]

export const porDimension = (d: string) => indicadores.filter((i) => i.dimension === d)
