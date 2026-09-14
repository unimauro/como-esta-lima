export type Competencia = 'mml' | 'compartida' | 'otra_entidad' | 'externo'
export type Confiabilidad = 'alta' | 'media' | 'baja'
export type Gestion = 'munoz' | 'romero' | 'lopez_aliaga' | 'reggiardo' | 'gestion_anterior' | 'otra_entidad'

export interface Fuente {
  nombre: string
  url: string
  fecha_consulta?: string
  metodologia?: string | null
  observaciones?: string | null
  tipo?: 'primaria' | 'secundaria' | string
}

export interface Punto {
  anio: number
  valor: number | null
  parcial?: boolean
  nota?: string | null
}

export interface Indicador {
  id: string
  dimension: string
  nombre: string
  descripcion?: string
  unidad: string
  mejor_si: 'baja' | 'sube' | string
  competencia: Competencia | string
  responsable_principal?: string
  confiabilidad: Confiabilidad | string
  ambito?: string
  serie: Punto[]
  fuentes: Fuente[]
  discrepancias?: string | null
  nota?: string | null
  contexto?: boolean
  comparable_desde?: number
  por_distrito?: { ubigeo?: string; distrito: string; anio?: number; poblacion?: number; valor?: number }[]
}

export interface DimensionJson {
  dimension: string
  fecha_corte: string
  resumen_hallazgos?: string
  indicadores: Indicador[]
}

export interface Proyecto {
  id: string
  nombre: string
  cui_invierte?: string | null
  tipo: string
  distritos?: string[]
  lat?: number | null
  lon?: number | null
  monto_soles?: number | null
  monto_fuente?: string | null
  concebido_por?: string | null
  iniciado_por?: string | null
  ejecutado_por?: string[] | string | null
  terminado_por?: string | null
  inaugurado_por?: string | null
  financiado_por?: string | null
  fecha_inicio?: string | null
  fecha_termino?: string | null
  estado: string
  atribucion?: string
  beneficiarios?: number | string | null
  fuentes: Fuente[]
  observaciones?: string | null
}

export interface Promesa {
  gestion: string
  promesa: string
  fecha?: string | null
  presupuesto_anunciado?: number | string | null
  estado: string
  evidencia?: string
  fuentes: Fuente[]
}

export interface Evento {
  fecha: string
  titulo: string
  descripcion?: string
  gestion: string
  categoria: string
  fuentes: Fuente[]
}

export interface MefAnio {
  anio: number
  parcial: boolean
  mes_corte: number
  pia: number
  pim: number
  certificado: number
  devengado: number
  girado: number
  ejecucion_pct: number | null
  dev_mensual: number[]
  dev_hasta_mes_corte: number
  corriente: { pim: number; dev: number }
  capital: { pim: number; dev: number }
  servicio_deuda: { pim: number; dev: number }
  personal: { pim: number; dev: number }
  inversiones: { pim: number; dev: number }
  por_funcion: { nombre: string; pim: number; dev: number }[]
  por_generica: { nombre: string; pim: number; dev: number }[]
  por_ejecutora: { nombre: string; pim: number; dev: number }[]
  por_fuente: { nombre: string; pim: number; dev: number }[]
}

export interface MefDistrito {
  anio: number
  ubigeo: string
  distrito: string
  pia: number
  pim: number
  dev: number
  dev_seguridad: number
  dev_transporte: number
  dev_ambiente: number
}

export interface MefJson {
  fuente: string
  url_base: string
  fecha_descarga: string
  mes_corte_2026: number
  anios: MefAnio[]
  distritos: MefDistrito[]
  log: Record<string, unknown>
}

export interface GestionInfo {
  id: string
  alcalde: string
  inicio: string
  fin: string | null
  nota?: string
  fuentes?: Fuente[]
}
