import { indicadores, proyectos, promesas, eventos, mef, FECHA_CORTE, DIMENSIONES, gestiones } from '../data'
import { etiquetaCompetencia } from '../components/Chips'
import { fecha } from '../lib/format'

export function Metodologia() {
  const fuentes = new Map<string, number>()
  for (const i of indicadores) for (const f of i.fuentes) { try { const h = new URL(f.url).hostname.replace(/^www\./, ''); fuentes.set(h, (fuentes.get(h) ?? 0) + 1) } catch { /* url inválida */ } }
  const top = Array.from(fuentes.entries()).sort((a, b) => b[1] - a[1])
  const conf = ['alta', 'media', 'baja'].map((c) => [c, indicadores.filter((i) => i.confiabilidad === c).length] as const)
  const comp = Object.keys(etiquetaCompetencia).map((c) => [c, indicadores.filter((i) => i.competencia === c).length] as const)
  return (
    <div className="flex flex-col gap-5 max-w-[90ch]">
      <header className="pt-8">
        <h2 className="m-0">Metodología y transparencia</h2>
        <p className="muted mt-2 mb-0">Fecha de corte: {FECHA_CORTE}. Todo dato del tablero es rastreable hasta su fuente original; los archivos JSON de <code>data/research/</code> conservan URL, fecha de consulta, metodología y observaciones por indicador.</p>
      </header>

      <section className="card p-4">
        <h3 className="m-0">Inventario</h3>
        <div className="grid gap-2 mt-2 text-sm num" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <div><div className="big">{indicadores.length}</div><div className="muted">indicadores</div></div>
          <div><div className="big">{proyectos.length}</div><div className="muted">proyectos / obras</div></div>
          <div><div className="big">{promesas.length}</div><div className="muted">compromisos</div></div>
          <div><div className="big">{eventos.length}</div><div className="muted">eventos</div></div>
          <div><div className="big">{mef.anios.length}</div><div className="muted">años MEF procesados</div></div>
        </div>
      </section>

      <section>
        <h3>Periodos analizados</h3>
        <ul className="text-sm">
          {gestiones.map((g) => <li key={g.id}><strong>{g.alcalde}</strong>: {fecha(g.inicio)} – {g.fin ? fecha(g.fin) : 'en curso'}{g.nota ? <span className="muted"> · {g.nota}</span> : null}</li>)}
        </ul>
        <p className="text-sm muted">2022 no se atribuye íntegramente a Muñoz: la vacancia dio paso a la gestión transitoria de Miguel Romero. Para las comparaciones por gestión se usa 2019→2022 (Muñoz) y 2022→último año cerrado (López Aliaga). 2026 es un año en curso y se marca como parcial en todas las series.</p>
      </section>

      <section>
        <h3>Cómo se calcula cada cosa</h3>
        <ul className="text-sm flex flex-col gap-1">
          <li><strong>Dirección.</strong> Cambio porcentual entre el primer y el último dato cerrado; para indicadores en % se usa la diferencia en puntos. Menor a 3 % = "similar". El sentido deseable (mejor si sube / si baja) está declarado por indicador.</li>
          <li><strong>Índice de cambio.</strong> Por dimensión: promedio del cambio porcentual orientado (positivo = mejor) de sus indicadores, recortado a ±50. Compuesto: promedio ponderado con los pesos que fije el usuario. Mide cambio, no nivel: una ciudad puede mejorar y seguir mal.</li>
          <li><strong>Finanzas.</strong> Suma de todas las filas del pliego MML en los CSV anuales de MEF Datos Abiertos (Gasto Devengado). Ejecución = devengado/PIM. El año en curso se compara solo con el devengado acumulado al mismo mes de los demás años. Cifras nominales.</li>
          <li><strong>Atribución de obras.</strong> Se registran por separado concebido, iniciado, ejecutado, terminado e inaugurado. Una obra inaugurada por una gestión pero iniciada por otra se clasifica como "heredada y terminada".</li>
          <li><strong>Promesas.</strong> Cumplida solo con evidencia de ejecución; parcial si hay avance verificable; no verificable si no hay evidencia pública.</li>
          <li><strong>Proyecciones 2030.</strong> Regresión lineal sobre años cerrados; escenarios ±50 % de pendiente. No son pronósticos.</li>
          <li><strong>Prioridades.</strong> Fórmula explícita (magnitud, tendencia, empeoramiento) ponderada por competencia y confiabilidad; ver sección Diagnóstico.</li>
        </ul>
      </section>

      <section>
        <h3>Competencias: quién responde por qué</h3>
        <p className="text-sm muted">Cada indicador lleva una etiqueta de competencia. Distribución actual:</p>
        <ul className="text-sm num">{comp.map(([c, n]) => <li key={c}>{etiquetaCompetencia[c]}: {n}</li>)}</ul>
        <p className="text-sm muted">Referencias: transporte público (Metropolitano, corredores, taxis, rutas) es competencia de la ATU (gobierno nacional) desde 2019; el Metro es del MTC; la PNP y la política criminal son del Ministerio del Interior; agua y saneamiento son de SEDAPAL; la inflación responde al BCRP y al mercado; limpieza y áreas verdes distritales son de cada municipio distrital, y la MML responde por el Cercado, las vías metropolitanas, los parques zonales (SERPAR), SISOL, EMAPE, INVERMET y la planificación metropolitana.</p>
      </section>

      <section>
        <h3>Calidad de los datos</h3>
        <ul className="text-sm num">{conf.map(([c, n]) => <li key={c}>Confiabilidad {c}: {n} indicadores</li>)}</ul>
        <p className="text-sm muted">Cuando dos fuentes difieren, ambas cifras aparecen en el detalle del indicador ("Discrepancias"). Los valores faltantes se muestran como "sin dato"; no se rellenan con estimaciones. Las series de encuestas (INEI ENAPRES, Lima Cómo Vamos) tienen cambios de muestra y de modo de recolección durante la pandemia que limitan la comparabilidad 2020–2021.</p>
      </section>

      <section>
        <h3>Fuentes por dominio</h3>
        <div className="scroll-x card"><table className="tbl"><thead><tr><th>Dominio</th><th className="r">Citas</th></tr></thead><tbody>
          {top.map(([h, n]) => <tr key={h}><td>{h}</td><td className="r num">{n}</td></tr>)}
        </tbody></table></div>
      </section>

      <section>
        <h3>Limitaciones</h3>
        <ul className="text-sm flex flex-col gap-1">
          <li>Indicadores de resultado (victimización, tráfico, precios) responden a muchos actores; el tablero señala correlación temporal, no causalidad.</li>
          <li>Las encuestas de percepción se citan como percepción, y se contrastan con datos objetivos cuando existen.</li>
          <li>Los montos de obras provienen de distintas etapas (perfil, expediente, contrato, ejecución) y no siempre son comparables.</li>
          <li>Dimensiones: {DIMENSIONES.map((d) => d.nombre).join('; ')}. La población se usa como contexto y no entra al índice.</li>
          <li>Código y datos abiertos en <a href="https://github.com/unimauro/como-esta-lima" target="_blank" rel="noopener noreferrer">github.com/unimauro/como-esta-lima</a>; el proyecto está preparado para actualizar 2026 y añadir el siguiente periodo municipal.</li>
        </ul>
      </section>
    </div>
  )
}
