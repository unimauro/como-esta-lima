import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet'
import type { FeatureCollection, Feature } from 'geojson'
import type { Layer, PathOptions } from 'leaflet'
import { proyectos, mef, indicadores, nombreGestion } from '../data'
import { EstadoChip, GestionChip, Fuentes, etiquetaEstado } from '../components/Chips'
import { soles, fecha, fmt } from '../lib/format'

const TIPOS: Record<string, string> = { vias: 'Vías', puentes: 'Puentes', transporte: 'Transporte', intercambios: 'Intercambios', ciclovias: 'Ciclovías', parques: 'Parques', infra_social: 'Infraestructura social', salud: 'Salud', seguridad: 'Seguridad', espacio_publico: 'Espacio público' }
const ATRIB: Record<string, { t: string; c: string }> = {
  propio_completo: { t: 'Iniciado y terminado por la misma gestión', c: 'var(--color-bueno)' },
  heredado_terminado: { t: 'Iniciado por una gestión anterior y terminado por la siguiente', c: 'var(--s-munoz)' },
  propio_en_curso: { t: 'Iniciado por la gestión actual, aún no terminado', c: 'var(--color-alerta)' },
  anunciado: { t: 'Anunciado, sin ejecución verificable', c: 'var(--ink-3)' },
  paralizado: { t: 'Paralizado o cancelado', c: 'var(--color-critico)' },
}
const marca = (g: string | null | undefined) => (g ? (nombreGestion[g] ?? g) : '—')

export function Obras() {
  const [estado, setEstado] = useState('todos')
  const [tipo, setTipo] = useState('todos')
  const [gestion, setGestion] = useState('todas')
  const [q, setQ] = useState('')
  const [abierto, setAbierto] = useState<string | null>(null)
  const [geo, setGeo] = useState<FeatureCollection | null>(null)
  const [capa, setCapa] = useState<'dev' | 'devpc' | 'seg'>('dev')

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}geo/lima_distritos.geojson`).then((r) => (r.ok ? r.json() : null)).then(setGeo).catch(() => setGeo(null))
  }, [])

  const lista = proyectos.filter((p) =>
    (estado === 'todos' || p.estado === estado) && (tipo === 'todos' || p.tipo === tipo) &&
    (gestion === 'todas' || p.iniciado_por === gestion || p.terminado_por === gestion || p.inaugurado_por === gestion || p.concebido_por === gestion) &&
    (!q || p.nombre.toLowerCase().includes(q.toLowerCase()) || (p.distritos ?? []).join(' ').toLowerCase().includes(q.toLowerCase())))

  const conteo = (k: keyof typeof ATRIB extends never ? string : string) => proyectos.filter((p) => p.atribucion === k).length

  // Choropleth: último año completo del MEF por distrito + población por distrito (demografía)
  const anioMef = useMemo(() => Math.max(...mef.distritos.filter((d) => d.anio < 2026).map((d) => d.anio), 0), [])
  const pobl = useMemo(() => {
    // Solo el indicador de población por distrito (entradas con ubigeo + poblacion).
    const ind = indicadores.find((i) => i.por_distrito?.some((d) => d.ubigeo && d.poblacion))
    const m = new Map<string, number>()
    const entradas = (ind?.por_distrito ?? []).filter((d) => d.ubigeo && d.poblacion && d.anio)
    const mx = entradas.length ? Math.max(...entradas.map((d) => d.anio as number)) : 0
    for (const d of entradas) if (d.anio === mx) m.set(d.ubigeo as string, d.poblacion as number)
    return { m, anio: mx }
  }, [])
  const porDist = useMemo(() => {
    const m = new Map<string, { dev: number; seg: number; nombre: string; pobl?: number }>()
    for (const d of mef.distritos) if (d.anio === anioMef) m.set(d.ubigeo, { dev: d.dev, seg: d.dev_seguridad, nombre: d.distrito, pobl: pobl.m.get(d.ubigeo) })
    return m
  }, [anioMef, pobl])
  const valor = (ub: string) => {
    const d = porDist.get(ub); if (!d) return null
    if (capa === 'dev') return d.dev
    if (capa === 'seg') return d.seg
    return d.pobl ? d.dev / d.pobl : null
  }
  const vals = Array.from(porDist.keys()).map(valor).filter((v): v is number => v !== null).sort((a, b) => a - b)
  const escala = (v: number | null): string => {
    if (v === null || !vals.length) return 'var(--bg-3)'
    const q = vals.findIndex((x) => x >= v) / vals.length
    const steps = ['var(--s-seq-1)', 'var(--s-seq-2)', 'var(--s-seq-3)', 'var(--s-seq-4)', 'var(--s-seq-5)', 'var(--s-seq-6)', 'var(--s-seq-7)']
    return steps[Math.min(steps.length - 1, Math.floor(q * steps.length))]
  }
  const estilo = (f?: Feature): PathOptions => ({ fillColor: escala(valor(String(f?.properties?.ubigeo ?? ''))), fillOpacity: 0.75, color: 'var(--bg-2)', weight: 1 })
  const onEach = (f: Feature, l: Layer) => {
    const ub = String(f.properties?.ubigeo ?? ''); const d = porDist.get(ub); const v = valor(ub)
    l.bindTooltip(`<strong>${f.properties?.nombre ?? d?.nombre ?? ub}</strong><br/>${capa === 'devpc' ? `Devengado per cápita ${anioMef}: ${v === null ? 's/d' : 'S/ ' + fmt(v, 0)}` : capa === 'dev' ? `Devengado ${anioMef}: ${soles(v)}` : `Devengado en orden público y seguridad ${anioMef}: ${soles(v)}`}${d?.pobl ? `<br/>Población ${pobl.anio}: ${fmt(d.pobl, 0)}` : ''}`, { sticky: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-8">
        <h2 className="m-0">Obras y proyectos: ¿quién hizo qué?</h2>
        <p className="muted mt-2 mb-0 max-w-[85ch]">
          Una obra pasa por concepción, inicio, ejecución, término e inauguración, a menudo bajo gestiones distintas. Esta base registra cada etapa
          por separado con su fuente, para no atribuir la obra completa a la gestión que la inauguró.
        </p>
      </header>

      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {Object.entries(ATRIB).map(([k, v]) => (
          <button key={k} className="card p-3 text-left" style={{ cursor: 'pointer', borderColor: abierto === `a:${k}` ? 'var(--accent)' : undefined }} onClick={() => { setEstado('todos'); setAbierto(abierto === `a:${k}` ? null : `a:${k}`) }}>
            <div className="flex items-center gap-2"><span className="chip-dot" style={{ background: v.c, width: 10, height: 10 }} /><span className="big num">{conteo(k)}</span></div>
            <div className="text-xs muted mt-1 leading-snug">{v.t}</div>
          </button>
        ))}
      </div>

      <section className="card p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="m-0">Mapa de Lima Metropolitana</h3>
          <div className="flex gap-1 flex-wrap">
            <button className="btn" aria-pressed={capa === 'devpc'} onClick={() => setCapa('devpc')}>Gasto municipal per cápita</button>
            <button className="btn" aria-pressed={capa === 'dev'} onClick={() => setCapa('dev')}>Gasto municipal total</button>
            <button className="btn" aria-pressed={capa === 'seg'} onClick={() => setCapa('seg')}>Gasto en seguridad</button>
          </div>
        </div>
        <p className="text-xs faint m-0">Coropleta: devengado {anioMef || 's/d'} de cada municipalidad distrital según el MEF (la MML se muestra como Lima Cercado). Puntos: proyectos filtrados, coloreados por estado. Azul más oscuro = mayor valor (cuantiles).</p>
        <div style={{ height: 520 }}>
          <MapContainer center={[-12.05, -77.0]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
            {geo && <GeoJSON key={capa + anioMef} data={geo} style={estilo} onEachFeature={onEach} />}
            {lista.filter((p) => p.lat && p.lon).map((p) => (
              <CircleMarker key={p.id} center={[p.lat as number, p.lon as number]} radius={7} pathOptions={{ color: 'var(--bg-2)', weight: 1.5, fillColor: (etiquetaEstado[p.estado]?.c ?? 'var(--ink-3)'), fillOpacity: 0.95 }}>
                <Popup>
                  <div className="text-sm" style={{ minWidth: 200 }}>
                    <div className="font-semibold">{p.nombre}</div>
                    <div className="muted">{TIPOS[p.tipo] ?? p.tipo} · {(p.distritos ?? []).join(', ')}</div>
                    <div className="mt-1"><EstadoChip e={p.estado} /></div>
                    <div className="text-xs mt-1">Inició: {marca(p.iniciado_por)} · Terminó: {marca(p.terminado_por)}</div>
                    {p.monto_soles ? <div className="text-xs">Monto: {soles(p.monto_soles)}</div> : null}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        {!geo && <p className="text-xs faint m-0">Límites distritales no disponibles en esta compilación.</p>}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 items-center">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar obra o distrito" className="card px-3 py-1.5 text-sm" style={{ minWidth: 220 }} aria-label="Buscar obra" />
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="btn" aria-label="Estado">
            <option value="todos">Todos los estados</option>
            {['terminado', 'en_ejecucion', 'planificacion', 'paralizado', 'cancelado', 'anunciado'].map((e) => <option key={e} value={e}>{etiquetaEstado[e].t}</option>)}
          </select>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="btn" aria-label="Tipo">
            <option value="todos">Todos los tipos</option>
            {Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={gestion} onChange={(e) => setGestion(e.target.value)} className="btn" aria-label="Gestión">
            <option value="todas">Todas las gestiones</option>
            {['gestion_anterior', 'munoz', 'romero', 'lopez_aliaga', 'reggiardo', 'otra_entidad'].map((g) => <option key={g} value={g}>{nombreGestion[g]}</option>)}
          </select>
          <span className="text-sm faint">{lista.length} de {proyectos.length} proyectos</span>
        </div>

        <div className="scroll-x card">
          <table className="tbl">
            <thead>
              <tr><th>Proyecto</th><th>Tipo · distrito</th><th>Concebido</th><th>Iniciado</th><th>Ejecutado</th><th>Terminado</th><th>Inaugurado</th><th className="r">Monto</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {lista.filter((p) => !abierto?.startsWith('a:') || p.atribucion === abierto.slice(2)).map((p) => (
                <>
                  <tr key={p.id} onClick={() => setAbierto(abierto === p.id ? null : p.id)} style={{ cursor: 'pointer' }}>
                    <td className="font-semibold">{p.nombre}{p.cui_invierte ? <div className="text-xs faint num">CUI {p.cui_invierte}</div> : null}</td>
                    <td className="muted text-sm">{TIPOS[p.tipo] ?? p.tipo}<div className="faint text-xs">{(p.distritos ?? []).join(', ')}</div></td>
                    <td><GestionChip g={p.concebido_por} /></td>
                    <td><GestionChip g={p.iniciado_por} />{p.fecha_inicio && <div className="faint text-xs">{fecha(p.fecha_inicio)}</div>}</td>
                    <td className="text-sm">{Array.isArray(p.ejecutado_por) ? p.ejecutado_por.map((g) => <GestionChip key={g} g={g} />) : <GestionChip g={p.ejecutado_por} />}</td>
                    <td><GestionChip g={p.terminado_por} />{p.fecha_termino && <div className="faint text-xs">{fecha(p.fecha_termino)}</div>}</td>
                    <td><GestionChip g={p.inaugurado_por} /></td>
                    <td className="r num">{p.monto_soles ? soles(p.monto_soles) : <span className="faint">s/d</span>}</td>
                    <td><EstadoChip e={p.estado} /></td>
                  </tr>
                  {abierto === p.id && (
                    <tr key={`${p.id}-d`}>
                      <td colSpan={9} style={{ background: 'var(--bg)' }}>
                        <div className="grid gap-3 py-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                          <div className="text-sm">
                            <div><span className="font-semibold">Atribución:</span> <span className="muted">{ATRIB[p.atribucion ?? '']?.t ?? p.atribucion ?? 's/d'}</span></div>
                            {p.financiado_por && <div><span className="font-semibold">Financiamiento:</span> <span className="muted">{p.financiado_por}</span></div>}
                            {p.monto_fuente && <div><span className="font-semibold">Fuente del monto:</span> <span className="muted">{p.monto_fuente}</span></div>}
                            {p.beneficiarios && <div><span className="font-semibold">Beneficiarios:</span> <span className="muted">{typeof p.beneficiarios === 'number' ? fmt(p.beneficiarios, 0) : p.beneficiarios}</span></div>}
                            {p.observaciones && <p className="muted mt-1 mb-0">{p.observaciones}</p>}
                          </div>
                          <div><div className="font-semibold text-sm mb-1">Fuentes</div><Fuentes fuentes={p.fuentes} compact /></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {lista.length === 0 && <tr><td colSpan={9} className="muted">Ningún proyecto cumple el filtro{proyectos.length === 0 ? ': la base de proyectos aún está vacía' : ''}.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="text-xs faint m-0">Haz clic en una fila para ver atribución, observaciones y fuentes. Los montos son los publicados por la fuente citada y pueden corresponder a distintas etapas (perfil, expediente, contrato).</p>
      </section>
    </div>
  )
}
