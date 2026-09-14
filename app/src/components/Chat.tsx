import { useEffect, useMemo, useRef, useState } from 'react'
import { indicadores, mef, proyectos, gestiones, FECHA_CORTE } from '../data'
import { cambioTotal } from '../lib/trend'
import { valorConUnidad, soles, signed } from '../lib/format'

// Gateway ai.tunky.net: valida el Origin (unimauro.github.io permitido) y exige X-Client-Token.
// Token público por diseño (cliente), revocable por proyecto.
const GATEWAY = 'https://ai.tunky.net/v1/chat'
const TOKEN = 'lima_c20b85a3f03bba0ea183f1d9a5b82a8b'

/** Resumen compacto de datos reales para anclar al modelo (evita que invente cifras). */
function construirContexto(): string {
  const lineas: string[] = []
  lineas.push(`Fecha de corte: ${FECHA_CORTE}. Gestiones: ` + gestiones.map((g) => `${g.alcalde} (${(g.inicio ?? '?').slice(0, 7)}–${g.fin ? g.fin.slice(0, 7) : 'hoy'})`).join('; ') + '.')
  const fin = mef.anios.at(-1)
  if (fin) lineas.push(`Presupuesto MML ${fin.anio}${fin.parcial ? ' (parcial)' : ''}: PIM ${soles(fin.pim)}, devengado ${soles(fin.devengado)}, ejecución ${fin.ejecucion_pct}%.`)
  for (const i of indicadores) {
    const c = cambioTotal(i)
    const ult = i.serie.filter((p) => p.valor !== null).at(-1)
    if (!ult) continue
    const cambio = c.abs !== null ? ` (${i.unidad.trim() === '%' ? signed(c.abs, ' pp') : signed(c.pct, '%')} desde ${c.desde?.anio})` : ''
    lineas.push(`- ${i.nombre}${i.contexto ? ' [contexto]' : ''}: ${valorConUnidad(ult.valor, i.unidad)} (${ult.anio})${cambio}. Competencia: ${i.competencia}.`)
  }
  lineas.push(`Proyectos/obras en base: ${proyectos.length}.`)
  return lineas.join('\n')
}

const SYSTEM = `Eres el asistente de "¿Cómo está Lima?", un tablero ciudadano y neutral sobre la calidad de vida y la gestión de Lima Metropolitana 2019-2026. Reglas:
1. Responde SOLO con los datos del CONTEXTO que se te entrega abajo. Si un dato no está, dilo claramente ("no está en el tablero") en vez de inventarlo.
2. Sé breve, claro y en español. Cita el año de cada cifra.
3. Neutralidad política: nunca uses "éxito", "fracaso", "el mejor/peor alcalde". Usa "subió", "bajó", "se mantuvo".
4. Recuerda que muchos temas (transporte público, policía, agua, inflación) no dependen de la Municipalidad: menciónalo cuando aplique.
5. En seguridad, aclara la paradoja: la victimización general bajó pero la extorsión, los homicidios y la sensación de inseguridad subieron.`

const SUGERENCIAS = ['¿Está Lima mejor que en 2019?', '¿Qué pasa con la seguridad?', '¿Cuánto gastó la Municipalidad?', '¿Quién hizo la Vía Expresa Sur?']

type Msg = { role: 'user' | 'assistant'; content: string }

function extraer(data: unknown): string | null {
  if (!data) return null
  if (typeof data === 'string') return data
  const d = data as Record<string, unknown>
  const choices = d.choices as Array<{ message?: { content?: string }; text?: string }> | undefined
  return (d.reply as string) || (d.message as string) || (d.answer as string) || (d.response as string) || (d.text as string) || (d.content as string) ||
    (choices?.[0]?.message?.content) || (choices?.[0]?.text) || null
}

export function Chat() {
  const [abierto, setAbierto] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [texto, setTexto] = useState('')
  const [busy, setBusy] = useState(false)
  const contexto = useMemo(construirContexto, [])
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }) }, [msgs, busy])
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f)
  }, [])

  async function enviar(pregunta: string) {
    const q = pregunta.trim()
    if (!q || busy) return
    const nuevos: Msg[] = [...msgs, { role: 'user', content: q }]
    setMsgs(nuevos); setTexto(''); setBusy(true)
    try {
      const res = await fetch(GATEWAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Client-Token': TOKEN },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `${SYSTEM}\n\nCONTEXTO (datos reales del tablero):\n${contexto}` },
            ...nuevos.slice(-10),
          ],
        }),
      })
      const raw = await res.text()
      let data: unknown; try { data = JSON.parse(raw) } catch { data = raw }
      if (!res.ok) throw new Error(String((data as { error?: string })?.error || `HTTP ${res.status}`))
      setMsgs((m) => [...m, { role: 'assistant', content: extraer(data) || 'No pude generar una respuesta.' }])
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'No pude conectar con el asistente en este momento. Puedes explorar las secciones del tablero directamente; cada cifra tiene su fuente.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {!abierto && (
        <button onClick={() => setAbierto(true)} aria-label="Abrir asistente"
          className="fixed z-40 flex items-center gap-2 rounded-full shadow-lg"
          style={{ right: 16, bottom: 16, padding: '12px 18px', background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
          <span aria-hidden style={{ fontSize: 18 }}>💬</span> Pregúntale a los datos
        </button>
      )}
      {abierto && (
        <div className="fixed z-40 card flex flex-col" role="dialog" aria-label="Asistente del tablero"
          style={{ right: 16, bottom: 16, width: 'min(400px, calc(100vw - 32px))', height: 'min(560px, calc(100vh - 32px))', boxShadow: '0 12px 40px rgba(0,0,0,.28)' }}>
          <header className="flex items-center justify-between gap-2 p-3 hair" style={{ borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
            <div>
              <div className="font-semibold text-sm">Asistente de ¿Cómo está Lima?</div>
              <div className="faint text-xs">Responde con los datos del tablero</div>
            </div>
            <button className="btn" onClick={() => setAbierto(false)} aria-label="Cerrar">✕</button>
          </header>

          <div ref={logRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {msgs.length === 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-sm muted">Hola 👋 Pregúntame sobre presupuesto, seguridad, movilidad, obras o cómo cambió Lima. Respondo con las cifras del tablero y su año.</div>
                <div className="flex flex-col gap-1.5 mt-1">
                  {SUGERENCIAS.map((s) => (
                    <button key={s} className="btn text-left" style={{ justifyContent: 'flex-start' }} onClick={() => enviar(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className="text-sm" style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                <div className="rounded-lg px-3 py-2" style={{
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-3)',
                  color: m.role === 'user' ? 'var(--accent-ink)' : 'var(--ink)',
                  whiteSpace: 'pre-wrap',
                }}>{m.content}</div>
              </div>
            ))}
            {busy && <div className="text-sm faint px-3 py-2">Pensando…</div>}
          </div>

          <form className="p-3 hair flex gap-2" style={{ borderTop: '1px solid var(--line)' }}
            onSubmit={(e) => { e.preventDefault(); enviar(texto) }}>
            <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu pregunta…"
              className="card px-3 py-2 text-sm flex-1" aria-label="Tu pregunta" disabled={busy} />
            <button className="btn" type="submit" aria-pressed={false} disabled={busy || !texto.trim()} style={{ background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'var(--accent)' }}>Enviar</button>
          </form>
          <div className="faint text-xs px-3 pb-2" style={{ marginTop: -4 }}>Respuestas generadas con IA a partir del tablero. Verifica en cada sección.</div>
        </div>
      )}
    </>
  )
}
