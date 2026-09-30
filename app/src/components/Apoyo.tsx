import { useState } from 'react'

/* ─────────────────────────────────────────────────────────────
   Datos de apoyo. Edita SOLO este bloque para cambiar destinos.
   Si un campo queda vacío (''), su tarjeta no se muestra.
   ───────────────────────────────────────────────────────────── */
export const APOYO = {
  yape: '940584307',                 // número Yape/Plin
  yapeNombre: 'Carlos Cárdenas',  // Yape y Plin usan el mismo número
  paypal: 'https://www.paypal.com/paypalme/unimauro',
  cafe: 'https://buymeacoffee.com/unimauro',
  github: 'https://github.com/unimauro/como-esta-lima',
}

function Copiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false)
  return (
    <button
      className="btn"
      onClick={async () => {
        try { await navigator.clipboard.writeText(texto); setCopiado(true); setTimeout(() => setCopiado(false), 1800) } catch { /* sin portapapeles */ }
      }}
      aria-label={`Copiar ${texto}`}
    >
      {copiado ? 'Copiado' : 'Copiar'}
    </button>
  )
}

export function Apoyo() {
  const hay = APOYO.yape || APOYO.paypal || APOYO.cafe
  if (!hay) return null
  return (
    <section className="card p-5" aria-labelledby="apoyo-t" id="apoyo">
      <h3 id="apoyo-t" className="m-0">Apoya este observatorio</h3>
      <p className="text-sm muted mt-2 mb-4 max-w-[80ch]">
        Este tablero es independiente y de código abierto. No recibe dinero de ninguna gestión municipal ni partido.
        Lo que aportes cubre el tiempo de recolectar y verificar los datos, y el alojamiento. Si te sirvió, invítame un café.
      </p>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        {APOYO.yape && (
          <div className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg)' }}>
            <div className="flex items-center gap-2">
              <span aria-hidden style={{ fontSize: 20 }}>📱</span>
              <span className="font-semibold">Yape o Plin</span>
            </div>
            <div className="big num" style={{ fontSize: 24 }}>{APOYO.yape}</div>
            <div className="text-xs faint">a nombre de {APOYO.yapeNombre}</div>
            <div className="mt-1"><Copiar texto={APOYO.yape} /></div>
          </div>
        )}

        {APOYO.cafe && (
          <a className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg)', textDecoration: 'none', color: 'var(--ink)' }}
            href={APOYO.cafe} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-2"><span aria-hidden style={{ fontSize: 20 }}>☕</span><span className="font-semibold">Invítame un café</span></div>
            <div className="text-sm muted">Aporte único desde el extranjero, con tarjeta.</div>
            <div className="mt-1"><span className="btn" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'var(--accent)' }}>Abrir</span></div>
          </a>
        )}

        {APOYO.paypal && (
          <a className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg)', textDecoration: 'none', color: 'var(--ink)' }}
            href={APOYO.paypal} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-2"><span aria-hidden style={{ fontSize: 20 }}>💳</span><span className="font-semibold">PayPal</span></div>
            <div className="text-sm muted">Para aportes en dólares.</div>
            <div className="mt-1"><span className="btn" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'var(--accent)' }}>Abrir</span></div>
          </a>
        )}

        <div className="card p-4 flex flex-col gap-2" style={{ background: 'var(--bg)' }}>
          <div className="flex items-center gap-2"><span aria-hidden style={{ fontSize: 20 }}>⭐</span><span className="font-semibold">Gratis también ayuda</span></div>
          <div className="text-sm muted">Comparte el tablero, reporta un dato equivocado o aporta una fuente en GitHub.</div>
          <div className="mt-1">
            <a className="btn" href={APOYO.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>Ver el repositorio</a>
          </div>
        </div>
      </div>

      <p className="text-xs faint mt-4 mb-0">
        Los aportes no condicionan el contenido. La metodología, las fuentes y el código son públicos y cualquiera puede auditarlos.
      </p>
    </section>
  )
}
