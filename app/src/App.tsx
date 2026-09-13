import { useEffect, useState } from 'react'
import { Nav, SECCIONES } from './components/Nav'
import { Inicio } from './sections/Inicio'
import { Finanzas } from './sections/Finanzas'
import { Dimension } from './sections/Dimension'
import { Obras } from './sections/Obras'
import { Promesas } from './sections/Promesas'
import { Timeline } from './sections/Timeline'
import { Lima2030 } from './sections/Lima2030'
import { Diagnostico } from './sections/Diagnostico'
import { Metodologia } from './sections/Metodologia'
import { FECHA_CORTE } from './data'

function leerHash() {
  const h = window.location.hash.replace('#', '')
  return SECCIONES.some((s) => s.id === h) ? h : 'inicio'
}

function temaInicial(): 'light' | 'dark' {
  try {
    const t = localStorage.getItem('tema')
    if (t === 'dark' || t === 'light') return t
  } catch { /* sin almacenamiento */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [sec, setSec] = useState(leerHash)
  const [tema, setTema] = useState<'light' | 'dark'>(temaInicial)

  useEffect(() => {
    const f = () => setSec(leerHash())
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = tema
    try { localStorage.setItem('tema', tema) } catch { /* sin almacenamiento */ }
  }, [tema])

  const ir = (id: string) => { window.location.hash = id; setSec(id); window.scrollTo({ top: 0 }) }

  return (
    <>
      <Nav actual={sec} onIr={ir} tema={tema} onTema={() => setTema(tema === 'dark' ? 'light' : 'dark')} />
      <main className="wrap pb-16">
        {sec === 'inicio' && <Inicio onIr={ir} />}
        {sec === 'finanzas' && <Finanzas />}
        {['movilidad', 'seguridad', 'costo_vida', 'servicios_ambiente', 'institucional'].includes(sec) && <Dimension id={sec} />}
        {sec === 'obras' && <Obras />}
        {sec === 'promesas' && <Promesas />}
        {sec === 'timeline' && <Timeline />}
        {sec === 'lima2030' && <Lima2030 />}
        {sec === 'diagnostico' && <Diagnostico />}
        {sec === 'metodologia' && <Metodologia />}
      </main>
      <footer className="hair">
        <div className="wrap py-6 text-xs faint flex flex-wrap gap-x-6 gap-y-1">
          <span>¿Cómo está Lima? · corte {FECHA_CORTE}</span>
          <span>Datos: MEF, INEI, ATU, MTC, MML, Contraloría, Lima Cómo Vamos y otras fuentes citadas en cada indicador.</span>
          <a href="https://github.com/unimauro/como-esta-lima" target="_blank" rel="noopener noreferrer">Código y datos abiertos</a>
        </div>
      </footer>
    </>
  )
}
