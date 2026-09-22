# Institucional — notas de investigación

Fecha de corte del proyecto: 2026-09-12. Última actualización: 2026-09-22.

## Indicadores llenos (no modificados en esta ronda)
- **Aprobación del alcalde (Ipsos)**: López Aliaga ~39% (2023) → 24% (dic-2024, mínimo); Reggiardo 38-42% (2025-2026). Fuente: Ipsos Bus Express.
- **Deuda MML (SDT)**: S/ 1,788 mill. (2019) → S/ 3,454 mill. (2024, ratio 275.5%). Fuente: Consejo Fiscal RT 03-2025 y 01-2024.
- **Bonos titulizados MML**: tres emisiones 2023-2025 por S/ 3,755 mill. acumulados.
- **Personal MML (PTE/CAS)**: vista parcial (solo CAS); de ~6,000 (2019) a 2,009 (abr-2026).

## Huecos trabajados en esta ronda

### lcv_lima_mejora — queda null (confirmado)
La encuesta Lima Cómo Vamos no incluye la pregunta "¿la ciudad mejoró?". Los informes 2021 y 2024 preguntan por la situación económica del hogar, no por la ciudad. Se mantiene null para no inventar. Proxy disponible: `lcv_satisfaccion_vivir_lima` (satisfacción con Lima como lugar para vivir: 37.5% en 2019 → 29.0% en 2025). Nota metodológica: 2019 solo Lima (IOP-PUCP); 2021-2025 Lima+Callao (DATUM); sin encuesta en 2020.

### contraloria_informes_mml — queda null (no scrapeable)
No se pudo construir la serie anual del número de informes de control de la Contraloría sobre la MML. El Buscador de Informes de Control (`buscadorinformes.contraloria.gob.pe`) e INFOBRAS son aplicaciones web dinámicas (SPA) que devuelven solo un shell HTML (~1.2 KB) por curl, sin listado descargable por entidad/año. Se deja la serie en null.

Observaciones puntuales de control difundidas en prensa (citadas de forma neutral, como observaciones y no como acusaciones):
- La Contraloría observó a la MML falta de información sustentatoria de obras por ~S/ 46 millones (jun-2025, La República).

## Promesas (promesas.json) — estados verificados 22-set-2026
Verificación con prensa peruana vía Google News (titulares y fechas confirmados). Enlaces al dominio del medio (los del agregador son redirecciones).

| Gestión | Promesa | Estado |
|---|---|---|
| Muñoz | Vía Expresa Sur | parcial (tramos abiertos set-2025, obras pendientes 2026) |
| Muñoz | Ampliar ciclovías | parcial (ampliación real; km final no verificable) |
| Muñoz | Recuperar Centro Histórico | parcial (plan 2019, peatonalización 41 cuadras, Plaza Francia) |
| Muñoz | Ampliación Metropolitano Norte | parcial (infra construida; ~10-12 estaciones cerradas por falta de buses) |
| López Aliaga | Anular peajes Rutas de Lima | parcial (cese de cobros de facto nov-dic 2025 vía litigio/arbitraje en curso) |
| López Aliaga | Vía Expresa Grau | en_ejecucion (buena pro oct-2024; avance ~90%, marcha blanca anunciada) |
| López Aliaga | Tren Lima-Chosica | en_ejecucion (coches trasladados; sin servicio; adenda en negociación) |
| López Aliaga | Hambre Cero | en_ejecucion (asistencia a ollas comunes; con observaciones de prensa 2025) |

Neutralidad: las observaciones de la Contraloría y de medios de investigación se citan como "observó X", no como acusaciones o condenas.
